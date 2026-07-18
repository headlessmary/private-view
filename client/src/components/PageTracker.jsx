import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "../utils/analytics";

export default function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    // Don't track admin pages
    if (location.pathname.startsWith("/admin")) return;

    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);

  return null;
}