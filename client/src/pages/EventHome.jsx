import { HeadlessSociety, SocietyNavbar } from "./EventLanding";

export default function EventHome({ event }) {
  return (
    <>
      <SocietyNavbar eventName={event.eventName} />
      <HeadlessSociety key={event.id} initialEvent={event} />
    </>
  );
}
