const prisma = require("../database/prisma");
const {
  DEFAULT_EVENT_CONFIG,
  getEventConfig,
} = require("../services/eventConfigService");

const isValidLocalEventDateTime = (value) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value);

  if (!match) return false;

  const [year, month, day, hour, minute, second = "0"] = match
    .slice(1)
    .map((part) => Number(part ?? "0"));
  if (year < 1000) return false;
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day &&
    hour <= 23 &&
    minute <= 59 &&
    second <= 59
  );
};

const getPublicEventConfig = async (_req, res) => {
  try {
    const eventConfig = await getEventConfig();
    return res.json({ success: true, event: eventConfig });
  } catch (error) {
    console.error("GET EVENT CONFIG ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load event details.",
    });
  }
};

const updateEventConfig = async (req, res) => {
  try {
    const { eventName, venue, eventDateTime } = req.body;
    const maxCapacity = Number(req.body.maxCapacity);
    const earlyBirdPrice = Number(req.body.earlyBirdPrice);
    const saintsRebelsPrice = Number(req.body.saintsRebelsPrice);
    const fiveFriendsPrice = Number(req.body.fiveFriendsPrice);

    if (
      typeof eventName !== "string" ||
      !eventName.trim() ||
      typeof venue !== "string" ||
      !venue.trim() ||
      typeof eventDateTime !== "string" ||
      !isValidLocalEventDateTime(eventDateTime) ||
      !Number.isInteger(maxCapacity) ||
      maxCapacity < 1 ||
      ![earlyBirdPrice, saintsRebelsPrice, fiveFriendsPrice].every(
        (price) => Number.isInteger(price) && price > 0
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide valid event details, capacity, and positive ticket prices.",
      });
    }

    const event = await prisma.eventConfig.upsert({
      where: { id: DEFAULT_EVENT_CONFIG.id },
      create: {
        ...DEFAULT_EVENT_CONFIG,
        eventName: eventName.trim(),
        venue: venue.trim(),
        eventDateTime,
        maxCapacity,
        earlyBirdPrice,
        saintsRebelsPrice,
        fiveFriendsPrice,
      },
      update: {
        eventName: eventName.trim(),
        venue: venue.trim(),
        eventDateTime,
        maxCapacity,
        earlyBirdPrice,
        saintsRebelsPrice,
        fiveFriendsPrice,
      },
    });

    return res.json({ success: true, event });
  } catch (error) {
    console.error("UPDATE EVENT CONFIG ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to save event details.",
    });
  }
};

module.exports = { getPublicEventConfig, updateEventConfig };
