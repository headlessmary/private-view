import { useEffect, useState } from "react";
import EventHub from "./EventHub";
import { HeadlessSociety, SocietyNavbar } from "./EventLanding";
import { fetchSocietyEvent } from "../services/eventConfig";

export default function EventHome() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const refreshEventStatus = async () => {
      try {
        const currentEvent = await fetchSocietyEvent();
        if (active) setEvent(currentEvent);
      } catch (error) {
        console.error("Unable to load the current event status:", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    refreshEventStatus();
    const intervalId = window.setInterval(refreshEventStatus, 30_000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-black" aria-label="Loading event status" />;
  }

  if (event?.status === "LIVE") {
    return (
      <>
        <SocietyNavbar />
        <HeadlessSociety />
      </>
    );
  }

  return <EventHub />;
}
