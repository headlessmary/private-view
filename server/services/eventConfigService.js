const prisma = require("../database/prisma");

const EVENT_CONFIG_ID = "active";

const DEFAULT_EVENT_CONFIG = Object.freeze({
  id: EVENT_CONFIG_ID,
  eventName: "Headless Society",
  venue: "Five Friends, Asaba",
  eventDateTime: "2026-10-29T21:00",
  maxCapacity: 60,
  earlyBirdPrice: 10000,
  saintsRebelsPrice: 15000,
  fiveFriendsPrice: 40000,
});

const getEventConfig = () =>
  prisma.eventConfig.upsert({
    where: { id: EVENT_CONFIG_ID },
    create: DEFAULT_EVENT_CONFIG,
    update: {},
  });

const toTicketPrices = (eventConfig) => ({
  EARLY_BIRD: eventConfig.earlyBirdPrice,
  SAINTS_REBELS: eventConfig.saintsRebelsPrice,
  FIVE_FRIENDS: eventConfig.fiveFriendsPrice,
});

const formatEventDateTime = (value) => {
  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(value);
  const hasSeconds = /T\d{2}:\d{2}:\d{2}(?:\.\d+)?$/.test(value);
  const normalizedValue = hasTimezone
    ? value
    : `${value}${hasSeconds ? "" : ":00"}+01:00`;
  const date = new Date(normalizedValue);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Africa/Lagos",
  }).format(date);
};

module.exports = {
  DEFAULT_EVENT_CONFIG,
  formatEventDateTime,
  getEventConfig,
  toTicketPrices,
};
