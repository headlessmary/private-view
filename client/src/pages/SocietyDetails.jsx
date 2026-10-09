import { Link } from "react-router-dom";
import {
  formatEventDateTime,
  getSocietyTickets,
} from "../services/eventConfig";
import societyArtwork from "../assets/Headless society.jpeg";
import societyRewardFlyer from "../assets/Headless society reward.jpeg";

const experiences = [
  [
    "♪",
    "Afrobeats",
    "Rhythm-forward selections for a room that never stands still.",
  ],
  ["◎", "Amapiano", "Deep log drums and late-night South African movement."],
  ["◉", "Afrohouse", "A darker pulse built for the final hours of the night."],
];

export default function SocietyDetails({ event }) {
  const tickets = getSocietyTickets(event);

  return (
    <>
      <section
        id="about"
        className="bg-(--paper) px-5 py-12 text-(--ink) sm:px-8 sm:py-20 lg:px-12 lg:py-28"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
          <div>
            <p className="font-mono-headless text-xs uppercase tracking-[.18em] text-(--lime)">
              01 / About the transmission
            </p>
            <h2 className="society-serif mt-7 max-w-xl text-4xl leading-[.92] text-headless-amber sm:text-6xl">
              A Triple A<br />
              Threat After
              <br />
              Dark.
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-8 text-headless-muted sm:text-xl">
              {event.eventName} is a gathering built around three sounds and one
              shared pulse. Afrobeats, Amapiano and Afrohouse meet for a night
              without quiet corners.
            </p>
          </div>
          <div className="relative border border-white/20 bg-black p-5 sm:p-8">
            <img
              src={societyArtwork}
              alt={`${event.eventName} artwork`}
              className="aspect-4/3 w-full object-contain"
            />
            <span className="absolute bottom-5 left-5 bg-(--lime) px-3 py-2 font-mono-headless text-[10px] uppercase tracking-[.12em] text-black sm:bottom-8 sm:left-8">
              Private access / {event.venue}
            </span>
          </div>
        </div>
        <div className="relative left-1/2 mt-10 w-screen -translate-x-1/2 border-t-2 border-white/30 sm:mt-16" />
      </section>

      <section
        id="experience"
        className="bg-(--paper) px-5 py-12 sm:px-8 sm:py-20 lg:px-12 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <p className="font-mono-headless text-xs uppercase tracking-[.12em] text-(--lime)">
            02 / Frequency range
          </p>
          <h2 className="society-serif mt-7 text-4xl leading-none text-headless-amber sm:text-6xl lg:text-7xl">
            The Experience
          </h2>
          <div className="mt-8 grid border border-white/20 sm:mt-12 lg:grid-cols-3">
            {experiences.map(([icon, title, description], index) => (
              <article
                key={title}
                className="min-h-0 border-b border-white/20 p-5 last:border-b-0 sm:min-h-72 sm:p-9 lg:border-b-0 lg:border-r lg:last:border-r-0"
              >
                <span className="text-3xl text-headless-acid">{icon}</span>
                <p className="mt-8 font-mono-headless text-[10px] text-headless-muted sm:mt-14">
                  0{index + 1}
                </p>
                <h3 className="society-serif mt-5 text-3xl text-headless-amber">
                  {title}
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-6 text-headless-muted">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="event-info"
        className="relative bg-(--paper) px-5 py-12 sm:px-8 sm:py-20 lg:px-12 lg:py-28"
      >
        <div className="absolute left-1/2 top-0 w-screen -translate-x-1/2 border-t-2 border-white/30" />
        <div className="mx-auto max-w-7xl">
          <p className="font-mono-headless text-xs uppercase tracking-[.12em] text-(--lime)">
            03 / Coordinates
          </p>
          <div className="mt-7 grid bg-black sm:mt-10 sm:grid-cols-3">
            {[
              ["⌖", "Location", event.venue, "Asaba, Delta State"],
              [
                "ϟ",
                "Date & time",
                formatEventDateTime(event.eventDateTime),
                "West Africa Time",
              ],
              ["♧", "Access", "Three ticket modes", "Choose your circle"],
            ].map(([icon, label, title, detail]) => (
              <article
                key={label}
                className="min-h-56 border border-white/20 p-6 sm:border-r-0 sm:last:border-r sm:p-9"
              >
                <span className="text-3xl text-headless-acid">{icon}</span>
                <p className="mt-8 font-mono-headless text-[10px] uppercase tracking-widest text-headless-acid sm:mt-12">
                  {label}
                </p>
                <h3 className="society-serif mt-4 text-2xl text-headless-amber sm:text-3xl">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-headless-muted">{detail}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="relative left-1/2 mt-10 w-screen -translate-x-1/2 border-t-2 border-white/30 sm:mt-16" />
      </section>

      <section
        id="tickets"
        className="bg-(--paper) px-5 py-12 sm:px-8 sm:py-20 lg:px-12 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="font-mono-headless text-xs uppercase tracking-[.12em] text-(--lime)">
                04 / Select access
              </p>
              <h2 className="society-serif mt-7 text-4xl leading-none text-headless-amber sm:text-6xl lg:text-7xl">
                Tickets
              </h2>
            </div>
            <p className="hidden font-mono-headless text-[10px] uppercase tracking-[.08em] text-headless-muted sm:block">
              Active / Reservations open
            </p>
          </div>
          <div className="mt-8 grid border border-white/20 sm:mt-12 lg:grid-cols-3">
            {tickets.map((ticket, index) => (
              <article
                key={ticket.value}
                className="relative flex min-h-0 flex-col border-b border-white/20 p-5 last:border-b-0 sm:min-h-88 sm:p-9 lg:border-b-0 lg:border-r lg:last:border-r-0"
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono-headless text-[10px] uppercase tracking-[.08em] text-headless-acid">
                    Access 0{index + 1}
                  </p>
                  {index === 2 && (
                    <span className="bg-headless-acid px-3 py-2 font-mono-headless text-[9px] uppercase text-black">
                      Group
                    </span>
                  )}
                </div>
                <h3 className="society-serif mt-8 text-3xl text-headless-amber sm:mt-14">
                  {ticket.name}
                </h3>
                <p className="mt-2 text-base text-headless-muted">
                  {ticket.description}
                </p>
                <p className="society-serif mt-7 text-5xl text-headless-acid sm:mt-10">
                  ₦{ticket.amount.toLocaleString("en-NG")}
                </p>
                <Link
                  to={`/buy-ticket?ticketType=${ticket.value}`}
                  className="society-motion mt-auto flex items-center justify-center gap-5 bg-headless-paper px-5 py-4 text-center text-[10px] font-bold uppercase text-headless-ink transition hover:bg-headless-acid"
                >
                  Reserve ticket{" "}
                  <span aria-hidden="true" className="text-lg">
                    →
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="rewards"
        className="relative bg-(--paper) px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16"
      >
        <div className="absolute left-1/2 top-0 w-screen -translate-x-1/2 border-t-2 border-white/30" />
        <div className="mx-auto grid max-w-7xl items-center border-x border-white/20 lg:grid-cols-[.85fr_1.15fr]">
          <div className="flex justify-center border-b border-white/20 p-4 sm:p-6 lg:border-b-0 lg:border-r">
            <img
              src={societyRewardFlyer}
              alt="Headless Society Best Dressed Reward: win ₦75,000"
              className="aspect-4/5 max-h-136 w-full object-contain lg:h-136 lg:w-auto"
            />
          </div>
          <div className="flex flex-col justify-center px-5 py-8 sm:px-8 sm:py-10 lg:px-8 lg:py-10 xl:px-12">
            <p className="font-mono-headless text-[10px] uppercase tracking-[.12em] text-headless-acid">
              05 / Best Dressed
            </p>
            <h2 className="society-serif mt-5 whitespace-nowrap text-[clamp(1.5rem,5.2vw,4.5rem)] leading-[.98] text-headless-amber">
              Dress To Collect.
            </h2>
            <p className="mt-5 text-sm leading-6 text-headless-muted sm:text-base sm:leading-7 lg:text-[15px]">
              <span className="block lg:whitespace-nowrap">
                The best Halloween-themed outfit in the room takes home ₦75,000.
              </span>
              <span className="mt-1 block lg:mt-0 lg:whitespace-nowrap">
                Commit to the look — the room is watching, and the prize is
                real.
              </span>
            </p>
            <div className="mt-6 space-y-4 border-y border-white/20 py-5 sm:mt-7 sm:space-y-5 sm:py-6">
              <div>
                <p className="font-mono-headless text-[10px] uppercase tracking-[.12em] text-headless-acid">
                  Prize
                </p>
                <p className="mt-2 text-sm font-semibold text-headless-paper sm:text-base">
                  ₦75,000
                </p>
              </div>
              <div>
                <p className="font-mono-headless text-[10px] uppercase tracking-[.12em] text-headless-acid">
                  Category
                </p>
                <p className="mt-2 text-sm font-semibold uppercase text-headless-paper sm:text-base">
                  Best Halloween Outfit
                </p>
              </div>
              <div>
                <p className="font-mono-headless text-[10px] uppercase tracking-[.12em] text-headless-acid">
                  Judged
                </p>
                <p className="mt-2 text-sm font-semibold uppercase text-headless-paper sm:text-base">
                  On the night, by Headless Mary
                </p>
              </div>
            </div>
            <Link
              to="/buy-ticket"
              className="society-motion mt-6 inline-flex min-h-12 w-fit items-center gap-5 bg-headless-paper px-5 py-4 text-[10px] font-bold uppercase text-headless-ink transition hover:bg-headless-acid"
            >
              Reserve ticket{" "}
              <span aria-hidden="true" className="text-lg">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section
        id="registration"
        className="bg-headless-plum px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <p className="font-mono-headless text-xs uppercase tracking-[.12em] text-(--lime)">
            06 / Registration
          </p>
          <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="society-serif max-w-4xl text-4xl leading-[.92] text-headless-amber sm:text-6xl lg:text-7xl">
                Choose your access. Enter
                <br className="hidden sm:block" /> the Society.
              </h2>
              <p className="mt-7 max-w-2xl text-base leading-6 text-headless-muted">
                Reservations for this event are handled securely online. Select
                a ticket to begin.
              </p>
            </div>
            <a
              href="https://chat.whatsapp.com/JVWpnm5ROelAvywBeV087j?s=cl&p=i&mlu=0&ilr=4"
              target="_blank"
              rel="noreferrer"
              className="society-motion flex shrink-0 items-center justify-center gap-5 bg-headless-paper px-5 py-4 text-center text-[10px] font-bold uppercase text-headless-ink transition hover:bg-headless-acid"
            >
              Join the Community{" "}
              <span aria-hidden="true" className="text-lg">
                →
              </span>
            </a>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="border-t border-white/20 bg-(--paper) px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_.9fr] lg:gap-20">
          <div>
            <p className="font-mono-headless text-xs uppercase tracking-[.12em] text-(--lime)">
              07 / Contact
            </p>
            <h2 className="society-serif mt-7 text-4xl leading-none text-headless-amber sm:text-6xl lg:text-7xl">
              Open Channel
            </h2>
          </div>
          <div className="space-y-7 text-sm text-headless-muted">
            <p>
              Questions about {event.eventName}? Get in touch with Headless Mary
              Events.
            </p>
            <a
              className="block transition hover:text-headless-acid"
              href="tel:08139121566"
            >
              08139121566
            </a>
            <a
              className="block transition hover:text-headless-acid"
              href="https://www.instagram.com/headlessmaryevents/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram · @headlessmaryevents
            </a>
            <a
              className="block transition hover:text-headless-acid"
              href="https://www.snapchat.com/add/headlessmary"
              target="_blank"
              rel="noreferrer"
            >
              Snapchat · @headlessmary
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
