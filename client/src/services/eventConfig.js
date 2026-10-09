import API_URL from "../config/api";

export const DEFAULT_SOCIETY_EVENT = {
  eventName: "Headless Society",
  venue: "Five Friends, Asaba",
  eventDateTime: "2026-10-29T21:00",
  eventEndDateTime: "2026-10-30T12:00",
  imageUrl: "",
  maxCapacity: 60,
  earlyBirdPrice: 15000,
  saintsRebelsPrice: 20000,
  fiveFriendsPrice: 40000,
};

/**
 * @typedef {typeof DEFAULT_SOCIETY_EVENT & {
 *   id?: string,
 *   slug?: string,
 *   published?: boolean,
 *   status?: string
 * }} SocietyEvent
 */

/**
 * @param {Response} response
 * @param {string} fallbackMessage
 */
async function readApiResponse(response, fallbackMessage) {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      `The event API returned ${
        contentType || "an unexpected response"
      } instead of JSON. Check VITE_API_URL and ensure the backend is running.`,
    );
  }

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || fallbackMessage);
  }

  return data;
}

/**
 * Get the event that should currently be displayed on the public website.
 *
 * Backend response should eventually look like:
 *
 * {
 *   success: true,
 *   active: true,
 *   event: {...}
 * }
 *
 * OR:
 *
 * {
 *   success: true,
 *   active: false,
 *   event: null
 * }
 */
/**
 * @returns {Promise<SocietyEvent | null>}
 */
export async function fetchCurrentEvent() {
  const response = await fetch(`${API_URL}/api/current-event`);

  const data = await readApiResponse(
    response,
    "Unable to determine the current event.",
  );

  if (!data.active || !data.event) {
    return null;
  }

  return data.event;
}

/**
 * Legacy/current event endpoint.
 *
 * Keep this temporarily because the admin/event-settings
 * functionality may still use it.
 */
/**
 * @returns {Promise<SocietyEvent>}
 */
export async function fetchSocietyEvent() {
  const response = await fetch(`${API_URL}/api/event-settings`);

  const data = await readApiResponse(
    response,
    "Unable to load event details.",
  );

  if (!data.event) {
    throw new Error(
      "The event API response did not include event details.",
    );
  }

  return data.event;
}

/**
 * Admin event history.
 *
 * @param {string} token
 * @returns {Promise<SocietyEvent[]>}
 */
export async function fetchEventHistory(token) {
  const response = await fetch(`${API_URL}/api/admin/events`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await readApiResponse(
    response,
    "Unable to load event history.",
  );

  if (!Array.isArray(data.events)) {
    throw new Error(
      "The event API response did not include event history.",
    );
  }

  return data.events;
}

/**
 * Public event archive.
 *
 * Used by the HEADLESSMARY homepage
 * to display past events such as Private View.
 *
 * @returns {Promise<SocietyEvent[]>}
 */
export async function fetchPublicEvents() {
  const response = await fetch(`${API_URL}/api/events`);

  const data = await readApiResponse(
    response,
    "Unable to load event archive.",
  );

  if (!Array.isArray(data.events)) {
    throw new Error(
      "The event API response did not include the event archive.",
    );
  }

  return data.events;
}

/**
 * Get tickets for a specific event.
 *
 * @param {SocietyEvent} [event]
 */
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

/**
 * Format an event date/time in WAT.
 *
 * @param {string} value
 * @returns {string}
 */
export function formatEventDateTime(value) {
  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(value);

  const hasSeconds =
    /T\d{2}:\d{2}:\d{2}(?:\.\d+)?$/.test(value);

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
