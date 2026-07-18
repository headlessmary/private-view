import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "./utils/analytics";

export default function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname,
    });
  }, [location]);

  return null;
}