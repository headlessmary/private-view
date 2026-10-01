const prisma = require("../database/prisma");

const formatWATDateTime = (value) => {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value: part }) => [type, part]));

  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
};

const parseWATDateTime = (value) => {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value);
  if (!match) return null;

  const [, yearValue, monthValue, dayValue, hourValue, minuteValue, secondValue = "0"] = match;
  const [year, month, day, hour, minute, second] = [
    yearValue,
    monthValue,
    dayValue,
    hourValue,
    minuteValue,
    secondValue,
  ].map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

  if (
    year < 1000 ||
    utcDate.getUTCFullYear() !== year ||
    utcDate.getUTCMonth() !== month - 1 ||
    utcDate.getUTCDate() !== day ||
    hour > 23 ||
    minute > 59 ||
    second > 59
  ) {
    return null;
  }

  return new Date(utcDate.getTime() - 60 * 60 * 1000);
};

const toEventResponse = (event, now = new Date()) => {
  const isCurrent =
    Boolean(event.published) &&
    event.startDateTime instanceof Date &&
    event.startDateTime <= now &&
    event.endDateTime instanceof Date &&
    event.endDateTime > now;
  const status = isCurrent
    ? "LIVE"
    : event.isHistorical ||
        (event.endDateTime instanceof Date && event.endDateTime <= now)
      ? "ENDED"
      : event.published
        ? "UPCOMING"
        : "DRAFT";

  return {
    ...event,
    eventDateTime: formatWATDateTime(event.startDateTime),
    eventEndDateTime: formatWATDateTime(event.endDateTime),
    isCurrent,
    status,
  };
};

const findCurrentEvent = async (now = new Date()) =>
  prisma.event.findFirst({
    where: {
      published: true,
      endDateTime: { gt: now },
    },
    orderBy: [
      { startDateTime: "desc" },
      { createdAt: "desc" },
    ],
  });

const getAdminEvents = async () => {
  const now = new Date();
  const events = await prisma.event.findMany({
    orderBy: [{ createdAt: "desc" }, { eventName: "asc" }],
  });

  return events.map((event) => toEventResponse(event, now));
};

const getPublicEvents = async () => {
  const now = new Date();
  const events = await prisma.event.findMany({
    where: {
      published: true,
      OR: [
        { isHistorical: true },
        { endDateTime: { lte: now } },
      ],
    },
    orderBy: [{ endDateTime: "desc" }, { createdAt: "desc" }],
  });

  return events.map((event) => toEventResponse(event, now));
};

const normalizeSlug = (name) =>
  name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const eventDataFromInput = (input) => {
  const eventName = typeof input.eventName === "string" ? input.eventName.trim() : "";
  const venue = typeof input.venue === "string" ? input.venue.trim() : "";
  const startDateTime = parseWATDateTime(input.eventDateTime);
  const endDateTime = parseWATDateTime(input.eventEndDateTime);
  const maxCapacity = Number(input.maxCapacity);
  const earlyBirdPrice = Number(input.earlyBirdPrice);
  const saintsRebelsPrice = Number(input.saintsRebelsPrice);
  const fiveFriendsPrice = Number(input.fiveFriendsPrice);

  if (
    !eventName ||
    !venue ||
    !startDateTime ||
    !endDateTime ||
    endDateTime <= startDateTime ||
    !Number.isInteger(maxCapacity) ||
    maxCapacity < 1 ||
    ![earlyBirdPrice, saintsRebelsPrice, fiveFriendsPrice].every(
      (price) => Number.isInteger(price) && price > 0,
    )
  ) {
    const error = new Error(
      "Provide a name, venue, valid WAT start and end times, capacity, and positive ticket prices.",
    );
    error.statusCode = 400;
    throw error;
  }

  return {
    eventName,
    venue,
    startDateTime,
    endDateTime,
    imageUrl: typeof input.imageUrl === "string" && input.imageUrl.trim()
      ? input.imageUrl.trim()
      : null,
    maxCapacity,
    earlyBirdPrice,
    saintsRebelsPrice,
    fiveFriendsPrice,
  };
};

const createEvent = async (input) => {
  const values = eventDataFromInput(input);
  const requestedSlug =
    typeof input.slug === "string" && input.slug.trim()
      ? input.slug.trim()
      : values.eventName;
  const slug = normalizeSlug(requestedSlug);

  if (!slug) {
    const error = new Error("Event name must produce a valid slug.");
    error.statusCode = 400;
    throw error;
  }

  return prisma.event.create({
    data: {
      ...values,
      slug,
      published: false,
    },
  });
};

const updateEvent = async (id, input) => {
  const values = eventDataFromInput(input);
  const current = await prisma.event.findUnique({ where: { id } });

  if (!current) {
    const error = new Error("Event not found.");
    error.statusCode = 404;
    throw error;
  }

  if (current.published && values.endDateTime > new Date()) {
    const otherActiveEvent = await prisma.event.findFirst({
      where: {
        published: true,
        endDateTime: { gt: new Date() },
        id: { not: id },
      },
    });

    if (otherActiveEvent) {
      const error = new Error(
        `${otherActiveEvent.eventName} is still active. Update this event after it ends.`,
      );
      error.statusCode = 409;
      throw error;
    }
  }

  return prisma.event.update({
    where: { id },
    data: values,
  });
};

const publishEvent = async (id) => {
  const now = new Date();
  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    const error = new Error("Event not found.");
    error.statusCode = 404;
    throw error;
  }

  if (!event.endDateTime || event.endDateTime <= now) {
    const error = new Error("An event must have an end time in the future before it can be published.");
    error.statusCode = 400;
    throw error;
  }

  const existingCurrentEvent = await prisma.event.findFirst({
    where: {
      published: true,
      endDateTime: { gt: now },
      id: { not: id },
    },
  });

  if (existingCurrentEvent) {
    const error = new Error(
      `${existingCurrentEvent.eventName} is still active. Wait for it to end before publishing another event.`,
    );
    error.statusCode = 409;
    throw error;
  }

  return prisma.event.update({
    where: { id },
    data: { published: true },
  });
};

const getEvent = async (id) => prisma.event.findUnique({ where: { id } });

module.exports = {
  createEvent,
  findCurrentEvent,
  formatWATDateTime,
  getAdminEvents,
  getEvent,
  getPublicEvents,
  normalizeSlug,
  parseWATDateTime,
  publishEvent,
  toEventResponse,
  updateEvent,
};
