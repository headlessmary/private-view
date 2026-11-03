export const ANALYTICS_CONSENT_KEY = "headlessmary-analytics-consent";
const CONSENT_CHANGE_EVENT = "headlessmary-analytics-consent-change";
export const PRIVACY_POLICY_SEEN_KEY = "headlessmary-privacy-policy-seen-v1";
const ANALYTICS_PREFERENCES_EVENT = "headlessmary-analytics-preferences";
let sessionConsent = null;

const isValidConsent = (consent) =>
  consent === "granted" || consent === "denied";

export function getAnalyticsConsent() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const consent = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    return isValidConsent(consent) ? consent : sessionConsent;
  } catch (error) {
    console.error("Unable to read analytics consent:", error);
    return sessionConsent;
  }
}

export function saveAnalyticsConsent(consent) {
  if (!isValidConsent(consent)) {
    throw new Error("Analytics consent must be granted or denied.");
  }

  if (typeof window === "undefined") {
    return;
  }

  sessionConsent = consent;
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, consent);
  } catch (error) {
    console.error("Unable to save analytics consent:", error);
  }

  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}

export function subscribeToAnalyticsConsent(callback) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(CONSENT_CHANGE_EVENT, callback);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, callback);
}

export function hasSeenPrivacyPolicy() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.localStorage.getItem(PRIVACY_POLICY_SEEN_KEY) === "true";
  } catch (error) {
    console.error("Unable to read privacy policy display state:", error);
    return false;
  }
}

export function markPrivacyPolicySeen() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(PRIVACY_POLICY_SEEN_KEY, "true");
  } catch (error) {
    console.error("Unable to save privacy policy display state:", error);
  }
}

export function requestAnalyticsPreferences() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(ANALYTICS_PREFERENCES_EVENT));
  }
}

export function subscribeToAnalyticsPreferences(callback) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(ANALYTICS_PREFERENCES_EVENT, callback);
  return () => window.removeEventListener(ANALYTICS_PREFERENCES_EVENT, callback);
}
