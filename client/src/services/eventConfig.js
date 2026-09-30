import API_URL from "../config/api";

export const DEFAULT_SOCIETY_EVENT = {
  eventName: "Headless Society",
  venue: "Five Friends, Asaba",
  eventDateTime: "2026-10-29T21:00",
  eventEndDateTime: "",
  imageUrl: "",
  maxCapacity: 60,
  earlyBirdPrice: 10000,
  saintsRebelsPrice: 15000,
  fiveFriendsPrice: 40000,
};

export async function fetchSocietyEvent() {
  const response = await fetch(`${API_URL}/api/event-settings`);
  const data = await response.json();

  if (!response.ok || !data.success || !data.event) {
    throw new Error(data.message || "Unable to load event details.");
  }

  return data.event;
}

export async function fetchEventHistory(token) {
  const response = await fetch(`${API_URL}/api/admin/events`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();

  if (!response.ok || !data.success || !Array.isArray(data.events)) {
    throw new Error(data.message || "Unable to load event history.");
  }

  return data.events;
}

export async function fetchPublicEvents() {
  const response = await fetch(`${API_URL}/api/events`);
  const data = await response.json();

  if (!response.ok || !data.success || !Array.isArray(data.events)) {
    throw new Error(data.message || "Unable to load event archive.");
  }

  return data.events;
}

export function getSocietyTickets(event = DEFAULT_SOCIETY_EVENT) {
  return [
    {
      value: "EARLY_BIRD",
      name: "Early Bird",
      description: "Ticket for one",
      amount: event.earlyBirdPrice,
    },
    {
      value: "SAINTS_REBELS",
      name: "Saints & Rebels",
      description: "Ticket for two",
      amount: event.saintsRebelsPrice,
    },
    {
      value: "FIVE_FRIENDS",
      name: "Five Friends",
      description: "Ticket for four",
      amount: event.fiveFriendsPrice,
    },
  ];
}

export function formatEventDateTime(value) {
  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(value);
  const hasSeconds = /T\d{2}:\d{2}:\d{2}(?:\.\d+)?$/.test(value);
  const normalizedValue = hasTimezone
    ? value
    : `${value}${hasSeconds ? "" : ":00"}+01:00`;
  const date = new Date(normalizedValue);

  if (!Number.isFinite(date.getTime())) {
    return value;
  }

  const day = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Lagos",
  }).format(date);
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Africa/Lagos",
  })
    .format(date)
    .replace(" ", "");

  return `${day} · ${time} WAT`;
}
