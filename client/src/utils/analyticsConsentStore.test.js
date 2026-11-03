import assert from "node:assert/strict";
import { after, test } from "node:test";
import {
  hasSeenPrivacyPolicy,
  markPrivacyPolicySeen,
  PRIVACY_POLICY_SEEN_KEY,
  requestAnalyticsPreferences,
  subscribeToAnalyticsPreferences,
} from "./analyticsConsentStore.js";

const storage = new Map();
const listeners = new Map();

globalThis.window = {
  localStorage: {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  },
  dispatchEvent: (event) => {
    listeners.get(event.type)?.forEach((listener) => listener(event));
  },
  addEventListener: (type, listener) => {
    const eventListeners = listeners.get(type) || new Set();
    eventListeners.add(listener);
    listeners.set(type, eventListeners);
  },
  removeEventListener: (type, listener) => {
    listeners.get(type)?.delete(listener);
  },
};

after(() => {
  delete globalThis.window;
});

test("privacy policy is marked seen persistently", () => {
  assert.equal(hasSeenPrivacyPolicy(), false);
  markPrivacyPolicySeen();
  assert.equal(storage.get(PRIVACY_POLICY_SEEN_KEY), "true");
  assert.equal(hasSeenPrivacyPolicy(), true);
});

test("analytics preferences can be reopened without a persistent banner", () => {
  let opened = false;
  const unsubscribe = subscribeToAnalyticsPreferences(() => {
    opened = true;
  });

  requestAnalyticsPreferences();
  assert.equal(opened, true);
  unsubscribe();
});
