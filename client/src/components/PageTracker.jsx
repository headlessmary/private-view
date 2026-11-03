import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../utils/analytics.js";
import {
  getAnalyticsConsent,
  subscribeToAnalyticsConsent,
} from "../utils/analyticsConsentStore.js";

export default function PageTracker() {
  const location = useLocation();
  const [consent, setConsent] = useState(getAnalyticsConsent);

  useEffect(
    () => subscribeToAnalyticsConsent(() => setConsent(getAnalyticsConsent())),
    [],
  );

  useEffect(() => {
    if (consent !== "granted" || location.pathname.startsWith("/admin")) {
      return;
    }

    const pageLocation = new URL(
      location.pathname,
      window.location.origin,
    ).toString();

    trackPageView(location.pathname, pageLocation);
  }, [consent, location.pathname]);

  return null;
}