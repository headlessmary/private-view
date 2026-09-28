import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import societyFlyer from "../assets/Headless society Ticket Policy.jpeg";
import societyArtwork from "../assets/Headless society.jpeg";
import privateViewFlyer from "../assets/flyer.png";
import useScrollReveal from "../hooks/useScrollReveal";
import SocietyDetails from "./SocietyDetails";
import {
  DEFAULT_SOCIETY_EVENT,
  fetchSocietyEvent,
  formatEventDateTime,
} from "../services/eventConfig";

function EventStyles() {
  return (
    <style>{`.society-page{--ink:#f5f1e8;--paper:#050509;--coral:#e33a36;--teal:#222d59;--lime:#e7c84d;font-family:var(--font-headless-body);background:var(--paper);color:var(--ink)}.society-page [class~="bg-(--ink)"]{background-color:var(--paper)}.society-page [class~="text-(--paper)"]{color:var(--ink)}.society-navbar{font-family:var(--font-headless-body)}.society-serif{font-family:var(--font-headless)}.society-grid{background-image:linear-gradient(rgba(245,241,232,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(245,241,232,.12) 1px,transparent 1px);background-size:32px 32px}.society-legacy{display:none}.society-hero{background:var(--paper);color:var(--ink)}.society-hero-grid{min-height:calc(100vh - 5rem)}.society-hero-title{color:var(--headless-amber);font-size:clamp(3rem,6vw,6rem);line-height:.85;text-transform:uppercase}.society-hero-rule{border-color:rgba(245,241,232,.18)}.society-hero-label{color:var(--headless-acid);font-family:var(--font-mono-headless);font-size:.65rem;letter-spacing:.06em;text-transform:uppercase}.society-hero-value{color:var(--headless-paper);font-size:1rem;font-weight:500;text-transform:uppercase}.society-hero-art{border:1px solid rgba(245,241,232,.18);background:#000}.society-hero-button{background:var(--headless-paper);color:var(--headless-ink);font-size:.7rem;font-weight:700;text-transform:uppercase;transition:background-color 180ms ease,color 180ms ease}.society-hero-button:hover{background:var(--headless-acid)}.society-full-divider{width:100vw;margin-left:calc(50% - 50vw)}`}</style>
  );
}

export function SocietyNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="society-navbar fixed inset-x-0 top-0 z-50 border-b-2 border-(--ink) bg-(--paper)/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          to="/headless-society"
          className="society-serif text-xl text-white sm:text-2xl"
        >
          HEADLESS <span className="text-(--coral)">SOCIETY</span>
        </Link>
        <nav className="hidden items-center gap-8 text-[11px] font-bold uppercase tracking-[.18em] text-white lg:flex">
          <a href="#about" className="transition hover:text-(--coral)">
            About
          </a>
          <a href="#experience" className="transition hover:text-(--coral)">
            Experience
          </a>
          <a href="#event-info" className="transition hover:text-(--coral)">
            Details
          </a>
          <a href="#tickets" className="transition hover:text-(--coral)">
            Tickets
          </a>
          <a href="#contact" className="transition hover:text-(--coral)">
            Contact
          </a>
        </nav>
        <Link
          to="/buy-ticket"
          className="hidden border-2 border-headless-paper bg-headless-paper px-4 py-3 text-[10px] font-bold uppercase tracking-[.15em] text-headless-ink transition hover:border-headless-acid hover:bg-headless-acid sm:block sm:px-6"
        >
          Headless Society Tickets
        </Link>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-label="Toggle Headless Society navigation"
          className="ml-3 border-2 border-(--ink) px-3 py-2 text-lg leading-none lg:hidden"
        >
          {open ? "×" : "☰"}
        </button>
      </div>
      <nav
        className={`${open ? "block" : "hidden"} border-t-2 border-(--ink) bg-(--paper) px-5 py-5 text-white lg:hidden`}
      >
        <div className="flex flex-col gap-5 text-xs font-bold uppercase tracking-[.18em]">
          <a href="#about" onClick={() => setOpen(false)}>
            About
          </a>
          <a href="#experience" onClick={() => setOpen(false)}>
            Experience
          </a>
          <a href="#event-info" onClick={() => setOpen(false)}>
            Details
          </a>
          <a href="#tickets" onClick={() => setOpen(false)}>
            Tickets
          </a>
          <a href="#contact" onClick={() => setOpen(false)}>
            Contact
          </a>
          <Link
            to="/buy-ticket"
            onClick={() => setOpen(false)}
            className="inline-flex w-full items-center justify-center border-2 border-headless-paper bg-headless-paper px-5 py-4 text-center text-headless-ink"
          >
            Headless Society Tickets
          </Link>
        </div>
      </nav>
    </header>
  );
}

function LegacyHeadlessSociety() {
  return (
    <div className="society-page">
      <EventStyles />
      <section className="society-grid border-b-2 border-(--ink) px-5 py-14 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.3em] text-(--teal)">
              Headless Mary presents
            </p>
            <h1 className="society-serif mt-6 text-6xl leading-[.9] sm:text-8xl">
              Headless <em className="text-(--coral)">Society</em>
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-8 text-white/65">
              A late-night gathering for sound, style and the beautiful trouble
              that happens when three rhythms share one room.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[.15em]">
              <span className="bg-(--ink) px-4 py-3 text-(--paper)">
                29 Oct 2026
              </span>
              <span className="border-2 border-(--ink) px-4 py-3">
                Five Friends, Asaba
              </span>
            </div>
            <a
              href="#tickets"
              className="mt-8 inline-flex bg-(--coral) px-7 py-4 text-xs font-bold uppercase tracking-[.2em] text-white hover:bg-(--teal)"
            >
              Reserve your place -&gt;
            </a>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -right-4 -top-4 h-full w-full border-2 border-(--coral)" />
            <img
              src={societyFlyer}
              alt="Headless Society event flyer"
              className="relative w-full border-2 border-(--ink) shadow-[12px_12px_0_var(--teal)]"
            />
          </div>
        </div>
      </section>
      <section
        id="about"
        className="bg-(--paper) px-5 py-20 text-(--ink) sm:px-8 lg:px-12 lg:py-28"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.85fr_1.15fr] lg:gap-20">
          <div>
            <p className="font-mono-headless text-xs uppercase tracking-[.18em] text-(--lime)">
              01 / About the transmission
            </p>
            <h2 className="society-serif mt-7 max-w-xl text-5xl leading-[.92] text-headless-amber sm:text-6xl">
              A Triple A<br />
              Threat After
              <br />
              Dark.
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-8 text-headless-muted sm:text-xl">
              Headless Society is an October gathering built around three sounds
              and one shared pulse. Afrobeats, Amapiano and Afrohouse meet at
              Five Friends for a night without quiet corners.
            </p>
          </div>
          <div className="relative border border-white/20 bg-black p-5 sm:p-8">
            <img
              src={societyArtwork}
              alt="Headless Society artwork"
              className="aspect-4/3 w-full object-contain"
            />
            <span className="absolute bottom-5 left-5 bg-(--lime) px-3 py-2 font-mono-headless text-[10px] uppercase tracking-[.12em] text-black sm:bottom-8 sm:left-8">
              Private access / Asaba
            </span>{" "}
          </div>
        </div>
        <div className="relative left-1/2 mt-16 w-screen -translate-x-1/2 border-t-2 border-white/30" />
      </section>{" "}
      <section
        id="experience"
        className="bg-(--paper) px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <p className="font-mono-headless text-xs uppercase tracking-[.12em] text-(--lime)">
            02 / Frequency range
          </p>
          <h2 className="society-serif mt-7 text-5xl leading-none text-headless-amber sm:text-7xl">
            The Experience
          </h2>
          <div className="mt-12 grid border border-white/20 lg:grid-cols-3">
            {[
              [
                "♪",
                "Afrobeats",
                "Rhythm-forward selections for a room that never stands still.",
              ],
              [
                "◎",
                "Amapiano",
                "Deep log drums and late-night South African movement.",
              ],
              [
                "◉",
                "Afrohouse",
                "A darker pulse built for the final hours of the night.",
              ],
            ].map(([icon, title, description], index) => (
              <article
                key={title}
                className="min-h-72 border-b border-white/20 p-7 last:border-b-0 sm:p-9 lg:border-b-0 lg:border-r lg:last:border-r-0"
              >
                <span className="text-3xl text-headless-acid">{icon}</span>
                <p className="mt-14 font-mono-headless text-[10px] text-headless-muted">
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
      </section>{" "}
      <section
        id="event-info"
        className="relative bg-(--paper) px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
      >
        <div className="absolute left-1/2 top-0 w-screen -translate-x-1/2 border-t-2 border-white/30" />
        <div className="mx-auto max-w-7xl">
          <p className="font-mono-headless text-xs uppercase tracking-[.12em] text-(--lime)">
            03 / Coordinates
          </p>
          <div className="mt-10 grid bg-black sm:grid-cols-3">
            {[
              ["⌖", "Location", "Five Friends", "Asaba, Delta State"],
              ["ϟ", "Date & time", "29 October 2026", "9PM WAT"],
              ["♧", "Access", "Three ticket modes", "Choose your circle"],
            ].map(([icon, label, title, detail]) => (
              <article
                key={label}
                className="min-h-56 border border-white/20 p-8 sm:border-r-0 sm:last:border-r sm:p-9"
              >
                <span className="text-3xl text-headless-acid">{icon}</span>
                <p className="mt-12 font-mono-headless text-[10px] uppercase tracking-widest text-headless-acid">
                  {label}
                </p>
                <h3 className="society-serif mt-4 text-3xl text-headless-amber">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-headless-muted">{detail}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="relative left-1/2 mt-16 w-screen -translate-x-1/2 border-t-2 border-white/30" />
      </section>{" "}
      <section
        id="tickets"
        className="bg-(--paper) px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="font-mono-headless text-xs uppercase tracking-[.12em] text-(--lime)">
                04 / Select access
              </p>
              <h2 className="society-serif mt-7 text-5xl leading-none text-headless-amber sm:text-7xl">
                Tickets
              </h2>
            </div>
            <p className="hidden font-mono-headless text-[10px] uppercase tracking-[.08em] text-headless-muted sm:block">
              Active / Reservations open
            </p>
          </div>
          <div className="mt-12 grid border border-white/20 lg:grid-cols-3">
            {[
              ["Early Bird", "Ticket for one", "N10K"],
              ["Saints & Rebels", "Ticket for two", "N15K"],
              ["Five Friends", "Ticket for four", "N40K"],
            ].map(([title, subtitle, price], index) => (
              <article
                key={title}
                className="relative flex min-h-88 flex-col border-b border-white/20 p-7 last:border-b-0 sm:p-9 lg:border-b-0 lg:border-r lg:last:border-r-0"
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
                <h3 className="society-serif mt-14 text-3xl text-headless-amber">
                  {title}
                </h3>
                <p className="mt-2 text-base text-headless-muted">{subtitle}</p>
                <p className="society-serif mt-10 text-5xl text-headless-acid">
                  {price}
                </p>
                <Link
                  to="/buy-ticket"
                  className="mt-auto flex items-center justify-center gap-5 bg-headless-paper px-5 py-4 text-center text-[10px] font-bold uppercase text-headless-ink transition hover:bg-headless-acid"
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
      </section>{" "}
      <section
        id="registration"
        className="bg-headless-plum px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <p className="font-mono-headless text-xs uppercase tracking-[.12em] text-(--lime)">
            05 / Registration
          </p>
          <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="society-serif max-w-4xl text-5xl leading-[.92] text-headless-amber sm:text-7xl">
                Choose your access. Enter
                <br className="hidden sm:block" /> the Society.
              </h2>
              <p className="mt-7 max-w-2xl text-base leading-6 text-headless-muted">
                Reservations for this event are handled directly by Headless
                Mary Events. Send your ticket choice to begin.
              </p>
            </div>
            <Link
              to="/buy-ticket"
              className="flex shrink-0 items-center justify-center gap-5 bg-headless-paper px-5 py-4 text-center text-[10px] font-bold uppercase text-headless-ink transition hover:bg-headless-acid"
            >
              Start registration{" "}
              <span aria-hidden="true" className="text-lg">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>{" "}
      <section
        id="contact"
        className="border-t border-white/20 bg-(--paper) px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_.9fr] lg:gap-20">
          <div>
            <p className="font-mono-headless text-xs uppercase tracking-[.12em] text-(--lime)">
              06 / Contact
            </p>
            <h2 className="society-serif mt-7 text-5xl leading-none text-headless-amber sm:text-7xl">
              Open Channel
            </h2>
          </div>
          <div className="space-y-7">
            <div>
              <p className="font-mono-headless text-[10px] uppercase tracking-widest text-(--lime)">
                Call
              </p>
              <a
                href="tel:08139121566"
                className="mt-2 block text-lg text-headless-muted transition hover:text-headless-acid"
              >
                08139121566
              </a>
            </div>
            <div>
              <p className="font-mono-headless text-[10px] uppercase tracking-widest text-(--lime)">
                Email
              </p>
              <a
                href="mailto:headlessmaryevents@gmail.com"
                className="mt-2 block text-lg text-headless-muted transition hover:text-headless-acid"
              >
                headlessmaryevents@gmail.com
              </a>
            </div>
          </div>{" "}
        </div>
      </section>
    </div>
  );
}

function SocietyHero({ event }) {
  return (
    <section className="society-hero border-b society-hero-rule px-5 pb-16 pt-28 sm:px-8 lg:px-12 lg:pb-20">
      <div className="society-hero-grid mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_.9fr] lg:gap-20">
        <div>
          <div className="flex items-center justify-between society-hero-label">
            <span>// System.state: active event</span>
            <span>HS / {formatEventDateTime(event.eventDateTime)}</span>
          </div>
          <h1 className="society-serif society-hero-title mt-10 max-w-3xl">
            {event.eventName}
          </h1>
          <div className="mt-10 border-y society-hero-rule py-7">
            <div className="grid gap-7 sm:grid-cols-3 lg:grid-cols-1">
              <div>
                <p className="society-hero-label">Terminal</p>
                <p className="society-hero-value mt-3">{event.venue}</p>
              </div>
              <div>
                <p className="society-hero-label">Sequence</p>
                <p className="society-hero-value mt-3">
                  {formatEventDateTime(event.eventDateTime)}
                </p>
              </div>
              <div>
                <p className="society-hero-label">Transmission</p>
                <p className="society-hero-value mt-3">
                  Afrobeats · Amapiano · Afrohouse
                </p>
              </div>
            </div>
          </div>
          <Link
            to="/buy-ticket"
            className="society-hero-button mt-8 inline-flex items-center gap-5 px-5 py-4"
          >
            Reserve ticket{" "}
            <span aria-hidden="true" className="text-lg">
              →
            </span>
          </Link>
        </div>
        <div className="society-hero-art p-3 sm:p-5">
          <img
            src={societyFlyer}
            alt={`${event.eventName} event flyer`}
            className="h-full max-h-[44rem] w-full object-cover object-top"
          />
        </div>
      </div>
    </section>
  );
}

function SocietyFooter() {
  return (
    <footer className="border-t border-white/30 bg-black px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-7 text-headless-muted lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <div>
          <p className="society-serif text-xl text-headless-paper">
            HEADLESS SOCIETY
          </p>
          <p className="mt-2 text-sm">Curated nights. Singular experiences.</p>
        </div>
        <nav className="flex flex-wrap gap-6 text-[10px] uppercase tracking-[.08em]">
          <a href="#event-info" className="transition hover:text-headless-acid">
            Events
          </a>
          <a href="#tickets" className="transition hover:text-headless-acid">
            Headless Society
          </a>
          <a
            href="#past-events"
            className="transition hover:text-headless-acid"
          >
            Archive
          </a>
        </nav>
        <div className="text-sm lg:text-right">
          <p>© 2026 Headless Mary Events</p>
          <p>Powered by Picasso Media Hub</p>
        </div>
      </div>
    </footer>
  );
}

export function HeadlessSociety() {
  const [event, setEvent] = useState(DEFAULT_SOCIETY_EVENT);
  const [eventError, setEventError] = useState("");

  useEffect(() => {
    fetchSocietyEvent()
      .then(setEvent)
      .catch((error) => {
        console.error("Unable to load current event details", error);
        setEventError(error.message);
      });
  }, []);

  useScrollReveal(
    ".society-navbar, .society-page > .society-hero, .society-details > section, .society-page > footer",
  );
  return (
    <div className="society-page">
      <EventStyles />
      {eventError && (
        <p
          role="alert"
          className="bg-red-950 px-5 py-3 text-center text-sm text-white"
        >
          Event details could not be loaded: {eventError}
        </p>
      )}
      <SocietyHero event={event} />
      <div className="society-legacy">
        <LegacyHeadlessSociety />
      </div>
      <SocietyDetails event={event} />
      <SocietyFooter />
    </div>
  );
}

export function NoCurrentEvents() {
  return (
    <div className="society-page">
      <EventStyles />
      <section className="society-grid px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.3em] text-(--teal)">
              Headless Mary Events
            </p>
            <h1 className="society-serif mt-6 max-w-3xl text-6xl leading-[.95] sm:text-8xl">
              Nothing on the calendar.{" "}
              <em className="text-(--coral)">For now.</em>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-black/60">
              There&apos;s nothing on the calendar right now. Check back soon;
              the next beautiful interruption is already taking shape.
            </p>
            <a
              href="#past-events"
              className="mt-9 inline-flex border-2 border-(--ink) px-7 py-4 text-xs font-bold uppercase tracking-[.2em] hover:bg-(--teal) hover:text-white"
            >
              Look back at past events -&gt;
            </a>
          </div>
          <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center border-2 border-(--ink) bg-(--teal) p-10 text-center shadow-[14px_14px_0_var(--coral)]">
            <div className="absolute inset-7 border border-(--lime)" />
            <p className="society-serif relative text-5xl leading-tight text-(--paper)">
              The room is quiet.
              <br />
              <em className="text-(--lime)">The story isn&apos;t.</em>
            </p>
          </div>
        </div>
      </section>
      <section
        id="past-events"
        className="bg-(--ink) px-5 py-20 text-(--paper) sm:px-8 lg:px-12 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[.3em] text-(--lime)">
            From the archive
          </p>
          <h2 className="society-serif mt-5 text-5xl">Past events</h2>
          <article className="mt-10 max-w-sm overflow-hidden border border-white/20 bg-white/5">
            <img
              src={privateViewFlyer}
              alt="The Private View flyer"
              className="aspect-4/3 w-full object-cover grayscale"
            />
            <div className="p-6">
              <span className="inline-block bg-white/15 px-3 py-2 text-[10px] font-bold uppercase tracking-[.2em] text-white/65">
                Event ended
              </span>
              <h3 className="society-serif mt-5 text-3xl text-white/80">
                The Private View
              </h3>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
