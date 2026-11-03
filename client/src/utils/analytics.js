import ReactGA from "react-ga4";
import {
  getAnalyticsConsent,
  saveAnalyticsConsent,
} from "./analyticsConsentStore.js";

const MEASUREMENT_ID = "G-PGBD53H7Y5";
const CONSENT_MODE = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

let isInitialized = false;
let lastTrackedPage = null;

export const initGA = () => {
  if (getAnalyticsConsent() !== "granted" || isInitialized) {
    return;
  }

  window[`ga-disable-${MEASUREMENT_ID}`] = false;
  ReactGA.initialize(MEASUREMENT_ID, {
    gtagOptions: {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    },
  });
  ReactGA.gtag("consent", "update", {
    ...CONSENT_MODE,
    analytics_storage: "granted",
  });
  isInitialized = true;
};

export const setAnalyticsConsent = (consent) => {
  saveAnalyticsConsent(consent);

  if (consent === "granted") {
    if (isInitialized) {
      window[`ga-disable-${MEASUREMENT_ID}`] = false;
      ReactGA.gtag("consent", "update", {
        ...CONSENT_MODE,
        analytics_storage: "granted",
      });
    } else {
      initGA();
    }
    return;
  }

  lastTrackedPage = null;
  if (isInitialized) {
    window[`ga-disable-${MEASUREMENT_ID}`] = true;
    ReactGA.gtag("consent", "update", {
      ...CONSENT_MODE,
      analytics_storage: "denied",
    });
  }
};

export const trackPageView = (pathname, pageLocation) => {
  if (getAnalyticsConsent() !== "granted") {
    return;
  }

  initGA();
  if (!isInitialized || pathname === lastTrackedPage) {
    return;
  }

  lastTrackedPage = pathname;
  ReactGA.send({
    hitType: "pageview",
    page: pathname,
    location: pageLocation,
  });
};

export default ReactGA;