import assert from "node:assert/strict";
import { after, test } from "node:test";
import ReactGA from "react-ga4";
import {
  setAnalyticsConsent,
  trackPageView,
} from "./analytics.js";
import { ANALYTICS_CONSENT_KEY } from "./analyticsConsentStore.js";

const storage = new Map();
const eventListeners = new Map();

globalThis.Event = class {
  constructor(type) {
    this.type = type;
  }
};

globalThis.window = {
  localStorage: {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  },
  dispatchEvent: (event) => {
    eventListeners.get(event.type)?.forEach((listener) => listener(event));
  },
  addEventListener: (type, listener) => {
    const listeners = eventListeners.get(type) || new Set();
    listeners.add(listener);
    eventListeners.set(type, listeners);
  },
  removeEventListener: (type, listener) => {
    eventListeners.get(type)?.delete(listener);
  },
};

const originalInitialize = ReactGA.initialize;
const originalSend = ReactGA.send;
const originalGtag = ReactGA.gtag;

after(() => {
  ReactGA.initialize = originalInitialize;
  ReactGA.send = originalSend;
  ReactGA.gtag = originalGtag;
  delete globalThis.window;
  delete globalThis.Event;
});

test("Google Analytics initializes and tracks only after opt-in", () => {
  const initialized = [];
  const pageViews = [];
  const consentUpdates = [];
  ReactGA.initialize = (...args) => initialized.push(args);
  ReactGA.send = (event) => pageViews.push(event);
  ReactGA.gtag = (...args) => consentUpdates.push(args);

  setAnalyticsConsent("denied");
  trackPageView("/privacy-policy", "https://example.test/privacy-policy");
  assert.equal(initialized.length, 0);
  assert.equal(pageViews.length, 0);

  setAnalyticsConsent("granted");
  trackPageView("/privacy-policy", "https://example.test/privacy-policy");
  trackPageView("/privacy-policy", "https://example.test/privacy-policy");

  assert.equal(storage.get(ANALYTICS_CONSENT_KEY), "granted");
  assert.equal(initialized.length, 1);
  assert.equal(initialized[0][1].gtagOptions.send_page_view, false);
  assert.equal(initialized[0][1].gtagOptions.allow_google_signals, false);
  assert.equal(pageViews.length, 1);
  assert.equal(pageViews[0].page, "/privacy-policy");

  setAnalyticsConsent("denied");
  trackPageView("/buy-ticket", "https://example.test/buy-ticket");

  assert.equal(storage.get(ANALYTICS_CONSENT_KEY), "denied");
  assert.equal(pageViews.length, 1);
  assert.equal(window["ga-disable-G-PGBD53H7Y5"], true);

  setAnalyticsConsent("granted");
  trackPageView("/buy-ticket", "https://example.test/buy-ticket");

  assert.equal(initialized.length, 1);
  assert.equal(pageViews.length, 2);
  assert.equal(window["ga-disable-G-PGBD53H7Y5"], false);
  assert.ok(consentUpdates.some(([, , consent]) =>
    consent.analytics_storage === "denied",
  ));
});
