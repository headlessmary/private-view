const STORAGE_KEY = "eventSettings";

export const DEFAULT_EVENT_SETTINGS = {
  eventName: "The Private View",
  venue: "Asaba, Delta State",
  eventTime: "20:00",
  ticketPrices: {
    VIP: 70000,
    REGULAR: 55000,
  },
  maxCapacity: 60,
  logo: "",
  flyer: "",
};

function mergeSettings(rawSettings = {}) {
  return {
    ...DEFAULT_EVENT_SETTINGS,
    ...rawSettings,
    ticketPrices: {
      ...DEFAULT_EVENT_SETTINGS.ticketPrices,
      ...(rawSettings?.ticketPrices || {}),
    },
  };
}

export function getEventSettings() {
  if (typeof window === "undefined") {
    return DEFAULT_EVENT_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_EVENT_SETTINGS;
    }

    return mergeSettings(JSON.parse(raw));
  } catch (error) {
    console.error("Unable to read event settings", error);
    return DEFAULT_EVENT_SETTINGS;
  }
}

export function saveEventSettings(nextSettings) {
  const current = getEventSettings();
  const merged = mergeSettings({ ...current, ...nextSettings });

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(
      new CustomEvent("event-settings-updated", { detail: merged })
    );
  }

  return merged;
}

export function formatEventTime(value) {
  if (!value) {
    return "8:00 PM";
  }

  const [hours = "20", minutes = "00"] = value.split(":");
  const parsedHours = Number(hours);
  const parsedMinutes = Number(minutes);
  const meridiem = parsedHours >= 12 ? "PM" : "AM";
  const hour12 = parsedHours % 12 || 12;

  return `${hour12}:${String(parsedMinutes).padStart(2, "0")} ${meridiem}`;
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}
