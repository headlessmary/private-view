import { useEffect, useRef, useState } from "react";
import {
  FaArrowUp,
  FaExternalLinkAlt,
  FaPhone,
  FaPlay,
  FaSnapchatGhost,
  FaWhatsapp,
} from "react-icons/fa";
import useScrollReveal from "../hooks/useScrollReveal";
import { Link } from "react-router-dom";
import {
  DEFAULT_SOCIETY_EVENT,
  fetchPublicEvents,
  fetchSocietyEvent,
  formatEventDateTime,
} from "../services/eventConfig";

import brandLogo from "../assets/logo.png";
import heroVideo from "../assets/herovideo.mp4";
import galleryVideoOne from "../assets/gallery3 (1).mp4";
import galleryVideoTwo from "../assets/gallery.mp4";
import galleryVideoThree from "../assets/gallery3 (2).mp4";
import galleryImageOne from "../assets/gallery1.jpeg";
import galleryImageTwo from "../assets/gallery2 (1).jpeg";
import galleryImageThree from "../assets/gallery2 (2).jpeg";
import galleryImageFour from "../assets/gallery2 (3).jpeg";
import galleryImageFive from "../assets/gallery2 (4).jpeg";
import galleryImageSix from "../assets/gallery2 (5).jpeg";
import galleryImageEight from "../assets/gallery2 (6).jpeg";
import galleryImageNine from "../assets/gallery2 (7).jpeg";
import galleryImageTen from "../assets/gallery3 (1).jpeg";
import galleryImageSeven from "../assets/gallery3 (2).jpeg";
import galleryImageEleven from "../assets/gallery3 (3).jpeg";

const galleryTabs = ["All", "Events", "Portraits", "Stills", "Video"];

const galleryMedia = [
  {
    id: 1,
    type: "image",
    event: "Private View",
    label: "Room 06",
    category: "Events",
    src: galleryImageOne,
  },
  {
    id: 2,
    type: "image",
    event: "After Dark",
    label: "Velvet Noise",
    category: "Portraits",
    src: galleryImageTwo,
  },
  {
    id: 3,
    type: "video",
    event: "Signal",
    label: "Live Cut",
    category: "Video",
    src: galleryVideoOne,
  },
  {
    id: 4,
    type: "image",
    event: "Backstage",
    label: "Noir Frame",
    category: "Stills",
    src: galleryImageThree,
  },
  {
    id: 5,
    type: "image",
    event: "RTM",
    label: "Green Room",
    category: "Events",
    src: galleryImageFour,
  },
  {
    id: 6,
    type: "image",
    event: "After Dark",
    label: "Warm Light",
    category: "Portraits",
    src: galleryImageFive,
  },
  {
    id: 7,
    type: "image",
    event: "Signal",
    label: "Glass Echo",
    category: "Stills",
    src: galleryImageSix,
  },
  {
    id: 8,
    type: "image",
    event: "Private View",
    label: "Static Bloom",
    category: "Portraits",
    src: galleryImageSeven,
  },
  {
    id: 9,
    type: "image",
    event: "Private View",
    label: "After Hours",
    category: "Events",
    src: galleryImageEight,
  },
  {
    id: 10,
    type: "image",
    event: "After Dark",
    label: "Night Shift",
    category: "Portraits",
    src: galleryImageNine,
  },
  {
    id: 11,
    type: "image",
    event: "Signal",
    label: "Flash Memory",
    category: "Stills",
    src: galleryImageTen,
  },
  {
    id: 12,
    type: "image",
    event: "Backstage",
    label: "Last Look",
    category: "Stills",
    src: galleryImageEleven,
  },
  {
    id: 13,
    type: "video",
    event: "After Dark",
    label: "Crowd Cut",
    category: "Video",
    src: galleryVideoTwo,
  },
  {
    id: 14,
    type: "video",
    event: "Private View",
    label: "Night Reel",
    category: "Video",
    src: galleryVideoThree,
  },
  {
    id: 15,
    type: "video",
    event: "Headless Mary",
    label: "Experience Beyond the Ordinary",
    category: "Video",
    src: heroVideo,
  },
];

const galleryVideoPosters = {
  3: galleryImageTen,
  13: galleryImageNine,
  14: galleryImageEight,
  15: galleryImageOne,
};

const signalStats = [
  { value: "4", label: "Cities" },
  { value: "2", label: "Countries" },
  { value: "9k+", label: "People through the door" },
];

function GalleryVideoCard({ item, onOpen }) {
  const cardRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  const videoIsNearViewport =
    shouldLoad || typeof IntersectionObserver === "undefined";

  return (
    <button
      ref={cardRef}
      type="button"
      className="hm-media"
      aria-label={`Open ${item.event}: ${item.label}`}
      onClick={() => onOpen(item)}
    >
      <video
        src={videoIsNearViewport ? item.src : undefined}
        poster={galleryVideoPosters[item.id]}
        muted
        playsInline
        preload={videoIsNearViewport ? "metadata" : "none"}
      />

      <span className="hm-media-play" aria-hidden="true">
        <FaPlay />
      </span>
      <span className="hm-media-caption">
        <strong>{item.label}</strong>
        <small>{item.event}</small>
      </span>
    </button>
  );
}

export default function EventHub() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [showAllMedia, setShowAllMedia] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [societyEvent, setSocietyEvent] = useState(DEFAULT_SOCIETY_EVENT);
  const [eventHistory, setEventHistory] = useState([]);
  const [eventError, setEventError] = useState("");
  useScrollReveal(
    ".event-hub > .hm-navbar, .event-hub > section:not(.hm-hero)",
  );

  useEffect(() => {
    const updateScrollState = () => setHasScrolled(window.scrollY > 0);

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([fetchSocietyEvent(), fetchPublicEvents()])
      .then(([event, events]) => {
        if (active) {
          setSocietyEvent(event);
          setEventHistory(events);
        }
      })
      .catch((error) => {
        if (active) setEventError(error.message);
      });

    return () => {
      active = false;
    };
  }, []);

  const galleryOrder = [9, 3, 14, 2, 11];
  const filteredMedia = (
    activeFilter === "All"
      ? galleryMedia
      : galleryMedia.filter((item) => item.category === activeFilter)
  ).sort((first, second) => {
    const firstPriority = galleryOrder.indexOf(first.id);
    const secondPriority = galleryOrder.indexOf(second.id);

    return (
      (firstPriority === -1 ? galleryOrder.length : firstPriority) -
      (secondPriority === -1 ? galleryOrder.length : secondPriority)
    );
  });
  const visibleGalleryMedia =
    activeFilter === "All" && !showAllMedia
      ? filteredMedia.slice(0, 5)
      : filteredMedia;
  const featuredEvent =
    societyEvent.status === "LIVE" || societyEvent.status === "UPCOMING"
      ? societyEvent
      : null;
  const upcomingEventDates = featuredEvent?.eventDateTime
    ? (() => {
        const start = new Date(`${featuredEvent.eventDateTime}:00+01:00`);
        const end = featuredEvent.eventEndDateTime
          ? new Date(`${featuredEvent.eventEndDateTime}:00+01:00`)
          : new Date(start.getTime() + 3 * 60 * 60 * 1000);
        const calendarDate = (date) =>
          date.toISOString().replace(/[-:]|\.\d{3}/g, "");

        return `${calendarDate(start)}/${calendarDate(end)}`;
      })()
    : "";
  const pastEventCards = [...eventHistory]
    .sort(
      (first, second) => {
        if (first.slug !== second.slug) {
          if (first.slug === "headless-society") return -1;
          if (second.slug === "headless-society") return 1;
        }
        return (
          new Date(second.eventDateTime).getTime() -
          new Date(first.eventDateTime).getTime()
        );
      },
    )
    .map((event) => ({
      id: event.id,
      name: event.eventName,
      date: event.slug === "private-view"
        ? "08 Aug 2026"
        : event.eventDateTime
        ? formatEventDateTime(event.eventDateTime).split(" ·")[0]
        : "Date unavailable",
      venue: event.venue,
      slug: event.slug,
    }));

  return (
    <div className="event-hub">
      <style>{`
        /* =========================================================
           ROOT
        ========================================================= */

        .event-hub {
          --hub-black: #050505;
          --hub-deep-black: #020202;
          --hub-paper: #f1eee5;
          --hub-cream: #f4f1e8;

          --hub-muted: rgba(241, 238, 229, 0.68);
          --hub-soft-muted: rgba(241, 238, 229, 0.48);

          --hub-line: rgba(241, 238, 229, 0.24);

          --hub-yellow: #ffbd18;
          --hub-green: #2cb39e;

          --hub-ink: #101010;
          --hub-coral: #e45738;
          --hub-teal: #174f4a;

          background: var(--hub-black);
          color: var(--hub-paper);

          font-family:
            "DM Sans",
            "Helvetica Neue",
            Arial,
            sans-serif;

          min-height: 100vh;
        }

        .event-hub *,
        .event-hub *::before,
        .event-hub *::after {
          box-sizing: border-box;
        }

        .event-hub a {
          color: inherit;
        }

        /* =========================================================
           HEADER / HERO REPLACEMENT
        ========================================================= */

        .event-hub {
          --bg: #05070b;
          --gold: #ffc629;
          --green: #00e676;
          --cream: #f4f0e8;
        }

        .hm-navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 999;
          background: #05070b;
          border-bottom: 1px solid rgba(0, 230, 118, 0.35);
        }

        .hm-nav-inner {
          max-width: 1600px;
          margin: auto;
          height: 86px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 48px;
        }

        .hm-logo-wrap {
          display: flex;
          align-items: center;
          gap: 18px;
          text-decoration: none;
          color: #00e676;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
        }

        .hm-logo {
          width: 82px;
          object-fit: contain;
        }

        .hm-nav-links {
          display: flex;
          gap: 48px;
        }

        .hm-nav-links a {
          color: #d8b85f;
          text-decoration: none;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.2em;
        }

        .hm-ticket-btn {
          background: var(--gold);
          color: #111;
          padding: 15px 26px;
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.15em;
          border: 2px solid #111;
          box-shadow: 6px 6px 0 #00c76a;
        }

        .hm-ticket-btn svg {
          width: 15px;
        }

        .hm-menu-toggle,
        .hm-mobile-menu {
          display: none;
        }

        .hm-hero {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background: #000;
          padding-top: 86px;
        }

        .hm-hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(1) contrast(1.2) brightness(0.58);
        }

        .hm-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(0, 0, 0, 0.84) 0%,
            rgba(0, 0, 0, 0.62) 48%,
            rgba(0, 0, 0, 0.42) 100%
          );
        }

        .hm-hero-content {
          position: relative;
          z-index: 2;
          max-width: 1600px;
          margin: auto;
          padding: 110px 60px 50px;
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.65fr);
          align-items: end;
          align-content: center;
          gap: 48px;
          min-height: calc(100vh - 86px);
        }

        .hm-hero-copy {
          max-width: 820px;
        }

        .hm-small-line {
          display: flex;
          align-items: center;
          gap: 14px;
          color: #cfcfcf;
          font-size: 12px;
          letter-spacing: 0.28em;
          font-weight: 700;
          margin-bottom: 38px;
        }

        .hm-small-line span {
          width: 46px;
          height: 2px;
          background: #fff;
          display: block;
        }

        .hm-hero h1 {
          margin: 0;
          display: flex;
          flex-direction: column;
          line-height: 0.84;
          font-family: Impact, "Arial Black", sans-serif;
          font-size: clamp(54px, 7.2vw, 124px);
          letter-spacing: -0.04em;
          color: var(--cream);
          text-shadow: 0 8px 0 rgba(255, 255, 255, 0.06);
        }

        .hm-hero .hm-hero-kicker {
          width: auto;
          margin: 0 0 18px;
          color: #ffc629;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
          line-height: 1.4;
          text-transform: uppercase;
        }

        .hm-hero h1 .hm-hero-gold {
          color: #ffc629;
        }

        .hm-hero p {
          width: 500px;
          max-width: 100%;
          color: #c8c8c8;
          font-size: 16px;
          line-height: 1.6;
          margin: 20px 0 24px;
        }

        .hm-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .event-hub .hm-white-btn {
          border-radius: 999px;
          background: #ffc629;
          color: #111;
          padding: 13px 20px;
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.02em;
          transition: background-color 180ms ease, transform 180ms ease;
        }

        .event-hub .hm-white-btn:hover {
          color: #111;
          background: #ffd75e;
          transform: translateY(-2px);
        }

        .hm-white-btn > span {
          display: inline-block;
          margin-left: 0.4rem;
          transition: transform 180ms ease;
        }

        .event-hub .hm-white-btn:hover > span,
        .event-hub .hm-white-btn:focus-visible > span {
          transform: translateX(4px);
        }

        .hm-outline-btn {
          border: 1px solid rgba(255, 255, 255, 0.32);
          border-radius: 999px;
          color: #fff;
          padding: 13px 18px;
          text-decoration: none;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.02em;
          transition: border-color 180ms ease, background-color 180ms ease;
        }

        .hm-outline-btn:hover {
          border-color: rgba(255, 255, 255, 0.7);
          background: rgba(255, 255, 255, 0.08);
        }

        .hm-hero-feature {
          width: 100%;
          max-width: 360px;
          justify-self: end;
          margin-bottom: 4px;
          padding: 20px 22px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 12px;
          background: rgba(8, 8, 8, 0.78);
          text-decoration: none;
          backdrop-filter: blur(12px);
          transition: border-color 180ms ease, background-color 180ms ease,
            transform 180ms ease;
        }

        .hm-hero-feature:hover {
          border-color: rgba(255, 198, 41, 0.55);
          background: rgba(8, 8, 8, 0.92);
          transform: translateY(-3px);
        }

        .hm-hero-feature-label {
          display: block;
          margin-bottom: 8px;
          color: #ffc629;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .hm-hero-feature h2 {
          margin: 0 0 10px;
          color: #f4f0e8;
          font-family: Impact, "Arial Black", sans-serif;
          font-size: 22px;
          line-height: 1;
          text-transform: uppercase;
        }

        .hm-hero-feature-meta {
          display: grid;
          gap: 5px;
          color: rgba(244, 240, 232, 0.72);
          font-size: 11px;
          line-height: 1.4;
        }

        .hm-hero-feature-cta {
          display: inline-flex;
          align-items: center;
          margin-top: 13px;
          color: #f4f0e8;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }

        .hm-arrow-icon {
          width: 0.8em;
          height: 0.8em;
          margin-left: 0.35em;
          vertical-align: -0.05em;
          transition: transform 180ms ease;
        }

        .hm-hero-feature:hover .hm-arrow-icon,
        .hm-hero-feature:focus-visible .hm-arrow-icon {
          transform: translate(2px, -2px);
        }

        .hm-bottom-row {
          margin-top: auto;
          padding-top: 70px;
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #9b9b9b;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.14em;
        }

        .hm-scroll {
          color: #fff;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .hm-slide-number {
          position: absolute;
          top: 160px;
          right: 70px;
          z-index: 3;
          color: #f4f0e8;
          font-size: 18px;
          font-weight: 900;
          letter-spacing: 0.15em;
        }

        .hm-marquee {
          background: #ffc629;
          overflow: hidden;
          height: 72px;
          display: flex;
          align-items: center;
          border-top: 1px solid rgba(0, 0, 0, 0.25);
          border-bottom: 1px solid rgba(0, 0, 0, 0.25);
        }

        .hm-marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 22s linear infinite;
        }

        .hm-marquee-track span {
          display: flex;
          align-items: center;
          gap: 26px;
          padding: 0 34px;
          white-space: nowrap;
          color: #111;
          font-weight: 900;
          letter-spacing: 0.15em;
          font-size: 19px;
          text-transform: uppercase;
        }

        .hm-marquee-track b {
          color: #00e676;
        }

        @keyframes marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        .hm-radar {
          background: #05070b;
          padding: 90px 58px;
          position: relative;
        }

        .hm-radar::before {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 18px;
          background: rgba(0, 230, 118, 0.08);
          transform: translateX(-50%);
        }

        .hm-radar-top {
          max-width: 1600px;
          margin: auto;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 60px;
          margin-bottom: 42px;
        }

        .hm-radar-top p {
          color: #00e676;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.28em;
          margin-bottom: 22px;
          text-transform: uppercase;
        }

        .hm-radar-top h2 {
          font-family: Impact, "Arial Black", sans-serif;
          font-size: clamp(64px, 6.2vw, 124px);
          line-height: 0.82;
          letter-spacing: -0.035em;
          margin: 0;
          color: #f4f0e8;
          text-transform: uppercase;
        }

        .hm-radar-top h2 .hm-radar-night {
          color: #ffc629;
        }

        .hm-radar-make,
        .hm-radar-night,
        .hm-radar-rest {
          display: inline;
        }

        .hm-radar-top h2 .hm-radar-rest {
          display: block;
        }

        .hm-radar-copy {
          width: 360px;
          color: #b8b8b8;
          font-size: 20px;
          line-height: 1.7;
        }

        .hm-radar-grid {
          max-width: 1600px;
          margin: auto;
          display: grid;
          grid-template-columns: 1.25fr 0.95fr;
          gap: 26px;
        }

        .hm-past-toggle {
          display: block;
          max-width: 1600px;
          margin: 38px auto 0;
          padding: 16px 22px;
          border: 1px solid #ffc629;
          background: #ffc629;
          color: #111;
          font: inherit;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-align: left;
          cursor: pointer;
        }

        .hm-past-toggle:focus-visible {
          outline: 2px solid #f4f0e8;
          outline-offset: 4px;
        }

        .hm-past-events {
          max-width: 1600px;
          margin: 72px auto 0;
        }

        .hm-past-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 26px;
        }

        .hm-past-card {
          position: relative;
          min-width: 0;
          min-height: 460px;
          overflow: hidden;
          border: 1px solid rgba(0, 230, 118, 0.35);
          background: #111;
        }

        .hm-past-card img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.55);
        }

        .hm-past-card h3 {
          margin: 0 0 18px;
          color: #f4f0e8;
          font-family: Impact, "Arial Black", sans-serif;
          font-size: clamp(42px, 5vw, 72px);
          line-height: 0.9;
          text-transform: uppercase;
        }

        .hm-mobile-title-break {
          display: none;
        }

        .hm-signal {
          overflow: hidden;
          background:
            radial-gradient(ellipse at 50% 45%, rgba(20, 50, 35, 0.28), transparent 72%),
            #0b110e;
          padding: 136px 30px 40px;
        }

        .hm-signal-inner {
          max-width: 1600px;
          margin: 0 auto;
        }

        .hm-signal-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 48px;
          margin-bottom: 54px;
        }

        .hm-signal-kicker {
          margin: 0 0 24px;
          color: #18d768;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.28em;
          text-transform: uppercase;
        }

        .hm-signal-title {
          margin: 0;
          color: #f4f0e8;
          font-family: Impact, "Arial Black", sans-serif;
          font-size: clamp(64px, 7.2vw, 112px);
          line-height: 0.82;
          letter-spacing: -0.035em;
          text-transform: uppercase;
        }

        .hm-signal-title span {
          color: #ffc629;
        }

        .hm-signal-copy {
          max-width: 420px;
          margin: 0 0 4px;
          color: #aaa9a2;
          font-size: 17px;
          line-height: 1.65;
        }

        .hm-signal-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          border-top: 1px solid rgba(255, 198, 41, 0.32);
          border-bottom: 1px solid rgba(255, 198, 41, 0.32);
        }

        .hm-signal-stat {
          min-height: 212px;
          padding: 30px 28px 26px;
        }

        .hm-signal-stat + .hm-signal-stat {
          border-left: 1px solid rgba(0, 230, 118, 0.24);
        }

        .hm-signal-stat strong {
          display: block;
          margin-bottom: 14px;
          color: #ffc629;
          font-family: Impact, "Arial Black", sans-serif;
          font-size: clamp(72px, 8vw, 108px);
          line-height: 0.86;
        }

        .hm-signal-stat span {
          color: #18d768;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .hm-signal-foot {
          display: flex;
          justify-content: flex-end;
          align-items: flex-start;
          margin: 38px 32px 0 0;
          color: #aaa9a2;
        }

        .hm-signal-foot p {
          max-width: 610px;
          margin: 0;
          font-size: 17px;
          line-height: 1.7;
        }

        .hm-large-card,
        .hm-side-card {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(0, 230, 118, 0.35);
          background: #111;
          text-decoration: none;
        }

        .hm-large-card {
          min-height: 720px;
        }

        .hm-side-stack {
          display: flex;
          flex-direction: column;
          gap: 26px;
        }

        .hm-side-card {
          min-height: 346px;
        }

        button.hm-side-card {
          width: 100%;
          padding: 0;
          color: inherit;
          font: inherit;
          text-align: left;
          cursor: pointer;
        }

        .hm-large-card img,
        .hm-side-card img,
        .hm-side-card video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.55);
        }

        .hm-card-overlay {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          height: 100%;
          padding: 28px;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.1) 20%,
            rgba(0, 0, 0, 0.75) 100%
          );
        }

        .hm-status {
          align-self: flex-start;
          padding: 8px 12px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.18em;
          margin-bottom: auto;
          text-transform: uppercase;
        }

        .hm-status.ended {
          background: #1c1c1c;
          color: #ffc629;
        }

        .hm-status.live {
          background: #071a13;
          color: #00e676;
        }

        .hm-large-card h3,
        .hm-side-card h4 {
          font-family: Impact, "Arial Black", sans-serif;
          line-height: 0.82;
          letter-spacing: -0.02em;
          color: #f4f0e8;
          margin: 0 0 14px;
          text-transform: uppercase;
        }

        .hm-large-card h3 {
          font-size: 82px;
        }

        .hm-side-card h4 {
          font-size: 56px;
        }

        .hm-card-overlay p {
          color: #d1d1d1;
          line-height: 1.7;
          margin-bottom: 28px;
          max-width: 420px;
        }

        .hm-event-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          color: #ffc629;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 12px;
          font-weight: 800;
        }

        .hm-side-button {
          align-self: flex-start;
          margin-top: 24px;
          background: #ffc629;
          border: none;
          color: #111;
          padding: 10px 16px;
          font-weight: 900;
          letter-spacing: 0.15em;
          cursor: pointer;
          text-transform: uppercase;
        }

        .hm-card-number {
          position: absolute;
          top: 26px;
          right: 24px;
          color: #00e676;
          font-size: 42px;
          font-weight: 900;
        }

        @media (max-width: 1100px) {
          .hm-radar {
            padding: 72px 32px;
          }

          .hm-signal {
            padding: 100px 32px 38px;
          }

          .hm-signal-head {
            gap: 32px;
          }

          .hm-radar-top {
            flex-direction: column;
            align-items: flex-start;
          }

          .hm-radar-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 900px) {
          .hm-signal {
            padding: 88px 24px 36px;
          }

          .hm-hero-content {
            grid-template-columns: minmax(0, 1fr) minmax(220px, 0.68fr);
            gap: 28px;
            padding-right: 32px;
            padding-left: 32px;
          }

          .hm-hero h1 {
            font-size: clamp(48px, 7.2vw, 68px);
          }

          .hm-hero-feature {
            padding: 18px;
          }

          .hm-signal-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 26px;
            margin-bottom: 38px;
          }

          .hm-signal-copy {
            max-width: 38rem;
          }

          .hm-signal-foot {
            margin-right: 0;
          }
        }

        @media (max-width: 760px) {
          .hm-signal-stat {
            min-height: 150px;
            padding: 24px 16px;
          }
        }

        .hm-timeline {
          position: relative;
          background: #061b16;
          padding: 118px 60px 42px;
          overflow: hidden;
        }

        .hm-timeline::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at center,
            rgba(0, 230, 118, 0.08),
            transparent 70%
          );
          pointer-events: none;
        }

        .hm-time-head {
          max-width: 1600px;
          margin: 0 auto 30px;
          position: relative;
          z-index: 1;
        }

        .hm-time-head p {
          color: #18d768;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.28em;
          margin: 0 0 20px;
          text-transform: uppercase;
        }

        .hm-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 48px;
        }

        .hm-time-head h2 {
          font-family: Impact, "Arial Black", sans-serif;
          font-size: clamp(84px, 9vw, 220px);
          line-height: 0.72;
          letter-spacing: -0.04em;
          margin: 0;
          color: #f4f0e8;
          text-transform: uppercase;
        }

        .hm-time-head h2 span {
          color: #ffc629;
        }

        .hm-head-copy {
          max-width: 430px;
          color: rgba(244, 240, 232, 0.8);
          font-size: 17px;
          line-height: 1.7;
          margin-bottom: 12px;
        }

        .hm-run-list {
          position: relative;
          z-index: 1;
          max-width: 1600px;
          margin: 0 auto;
        }

        .hm-run-list::before {
          content: "";
          position: absolute;
          left: 145px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: rgba(255, 198, 41, 0.5);
        }

        .hm-run-row {
          display: grid;
          grid-template-columns: 220px minmax(0, 1fr) 200px;
          gap: 24px;
          align-items: center;
          min-height: 160px;
          border-top: 1px solid rgba(255, 198, 41, 0.3);
          padding: 14px 0 12px;
        }

        .hm-date-block {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding-left: 8px;
        }

        .hm-date-badge {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          color: #d6a63a;
          font-size: 18px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .hm-date-badge::after {
          content: "";
          display: block;
          width: 12px;
          height: 12px;
          background: #18d768;
          border: 1px solid rgba(24, 215, 104, 0.45);
        }

        .hm-row-main {
          position: relative;
          z-index: 1;
          padding-left: 30px;
        }

        .hm-row-title {
          margin: 0;
          font-family: Impact, "Arial Black", sans-serif;
          font-size: clamp(38px, 5vw, 86px);
          line-height: 0.82;
          letter-spacing: -0.035em;
          color: #f4f0e8;
          text-transform: uppercase;
        }

        .hm-row-location {
          margin-top: 8px;
          color: rgba(244, 240, 232, 0.82);
          font-size: 16px;
          line-height: 1.6;
        }

        .hm-row-status {
          position: relative;
          z-index: 1;
          justify-self: end;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          border: 1px solid rgba(24, 215, 104, 0.35);
          background: rgba(24, 215, 104, 0.05);
          color: #18d768;
        }

        .hm-row-status::before {
          content: "";
          display: block;
          width: 10px;
          height: 10px;
          background: currentColor;
        }

        .hm-row-status.live {
          color: #18d768;
          border-color: rgba(24, 215, 104, 0.35);
        }

        .hm-row-status.ended {
          color: #f0c75d;
          border-color: rgba(240, 199, 93, 0.4);
        }

        @media (max-width: 900px) {
          .hm-timeline {
            padding: 76px 22px 38px;
          }

          .hm-title-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 24px;
          }

          .hm-run-list::before {
            display: none;
          }

          .hm-run-row {
            display: flex;
            min-height: 0;
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            padding: 22px 0;
          }

          .hm-date-block {
            justify-content: flex-start;
            padding: 0;
          }

          .hm-date-badge {
            gap: 10px;
            font-size: 11px;
            letter-spacing: 0.12em;
          }

          .hm-date-badge::after {
            width: 8px;
            height: 8px;
          }

          .hm-row-main {
            width: 100%;
            padding-left: 0;
          }

          .hm-row-title {
            font-size: clamp(32px, 6vw, 54px);
            line-height: 0.94;
            letter-spacing: -0.015em;
            overflow-wrap: anywhere;
          }

          .hm-row-location {
            margin-top: 8px;
            font-size: 15px;
            line-height: 1.5;
            overflow-wrap: anywhere;
          }

          .hm-row-status {
            justify-self: start;
            max-width: 100%;
            font-size: 10px;
            letter-spacing: 0.14em;
          }
        }

        .hm-proof {
          position: relative;
          isolation: isolate;
          background: #05070b;
          padding: 110px 60px;
        }

        .hm-proof::before {
          content: "";
          position: absolute;
          z-index: -1;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 18px;
          background: rgba(0, 230, 118, 0.08);
          transform: translateX(-50%);
          pointer-events: none;
        }

        .hm-proof-head {
          max-width: 1600px;
          margin: auto;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 60px;
          margin-bottom: 40px;
        }

        .hm-proof-head p {
          color: #00e676;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.28em;
          margin-bottom: 18px;
          text-transform: uppercase;
        }

        .hm-proof-head h2 {
          font-family: Impact, "Arial Black", sans-serif;
          font-size: clamp(82px, 8vw, 160px);
          line-height: 0.8;
          letter-spacing: -0.04em;
          color: #f4f0e8;
          margin: 0;
          text-transform: uppercase;
        }

        .hm-proof-head h2 span {
          color: #ffc629;
        }

        .hm-proof-copy {
          width: 320px;
          color: #aeb7c3;
          font-size: 18px;
          line-height: 1.7;
        }

        .hm-filter-row {
          max-width: 1600px;
          margin: 0 auto 36px;
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .hm-filter {
          background: transparent;
          border: 1px solid rgba(24, 215, 104, 0.4);
          color: #d6a63a;
          padding: 12px 18px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .hm-filter.active {
          background: #ffc629;
          color: #111;
          border-color: #ffc629;
        }

        .hm-frame-count {
          align-self: center;
          color: #7f8791;
          font-size: 11px;
          letter-spacing: 0.12em;
        }

        .hm-carousel-controls {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hm-carousel-arrow {
          width: 42px;
          height: 42px;
          border: 1px solid rgba(24, 215, 104, 0.4);
          background: transparent;
          color: #ffc629;
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
          transition: color 180ms ease, background-color 180ms ease, opacity 180ms ease;
        }

        .hm-carousel-arrow:hover:not(:disabled) {
          background: #ffc629;
          color: #111;
        }

        .hm-carousel-arrow:disabled {
          cursor: default;
          opacity: 0.35;
        }

        .hm-carousel-arrow:focus-visible,
        .hm-filter:focus-visible {
          outline: 2px solid #ffc629;
          outline-offset: 3px;
        }

        .hm-carousel {
          max-width: 1600px;
          margin: auto;
          display: grid;
          grid-auto-columns: calc((100% - 28px) / 3);
          grid-auto-flow: column;
          gap: 14px;
          overflow-x: auto;
          overscroll-behavior-x: contain;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .hm-carousel::-webkit-scrollbar {
          display: none;
        }

        .hm-media {
          position: relative;
          width: 100%;
          height: clamp(230px, 24vw, 310px);
          min-width: 0;
          scroll-snap-align: start;
          scroll-snap-stop: always;
          border: none;
          padding: 0;
          margin: 0;
          background: #101216;
          border: 1px solid rgba(24, 215, 104, 0.22);
          cursor: pointer;
          overflow: hidden;
          text-align: left;
        }

        .hm-media img,
        .hm-media video {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          filter: brightness(0.82) contrast(1.04);
          transition: transform 350ms ease, filter 350ms ease;
        }

        .hm-media:hover img,
        .hm-media:hover video {
          transform: scale(1.03);
          filter: brightness(0.96) contrast(1.04);
        }

        .hm-media-type {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          min-width: 64px;
          padding: 9px 12px;
          background: rgba(5, 7, 11, 0.9);
          color: #18d768;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .hm-media-open {
          position: absolute;
          right: 14px;
          bottom: 14px;
          z-index: 1;
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          background: #ffc629;
          color: #111;
          font-size: 20px;
          font-weight: 800;
          line-height: 1;
          transition: background-color 180ms ease, transform 180ms ease;
        }

        .hm-media:hover .hm-media-open {
          background: #18d768;
          transform: translate(2px, -2px);
        }

        .hm-media:focus-visible {
          outline: 2px solid #ffc629;
          outline-offset: 3px;
        }

        .hm-lightbox {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.82);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
        }

        .hm-lightbox-inner {
          position: relative;
          max-width: 1100px;
          width: min(90vw, 1100px);
          background: #090d0d;
          border: 1px solid rgba(0, 230, 118, 0.35);
          box-shadow: 0 0 60px rgba(0, 230, 118, 0.15);
        }

        .hm-lightbox-close {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(0, 0, 0, 0.45);
          color: #f4f0e8;
          font-size: 24px;
          cursor: pointer;
        }

        .hm-lightbox-media {
          display: block;
          width: 100%;
          max-height: 80vh;
          object-fit: contain;
          background: #000;
        }

        .hm-lightbox-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 18px 22px 24px;
        }

        .hm-lightbox-meta span {
          color: #ffc629;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .hm-lightbox-meta strong {
          color: #f4f0e8;
          font-size: 18px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        /* ===== Pulse Section ===== */

        .pulse {
          background: #07170d;
          color: #f1eee6;
          padding: 120px 30px;
          display: grid;
          grid-template-columns: minmax(0, 580px) minmax(0, 340px);
          gap: 0;
          align-items: center;
        }

        .pulse-left h1 {
          margin: 0;
          font-family: Impact, "Arial Black", sans-serif;
          font-size: clamp(72px, 7.6vw, 132px);
          line-height: 0.86;
          letter-spacing: -0.025em;
          font-weight: 900;
          color: #f3efe8;
          text-transform: uppercase;
        }

        .pulse-left h1 span {
          color: #19d65f;
        }

        .pulse-right {
          display: flex;
          align-items: flex-start;
          gap: 28px;
          padding-left: 30px;
        }

        .yellow-line {
          width: 2px;
          min-height: 385px;
          background: #ffc928;
          flex-shrink: 0;
        }

        .pulse-content {
          max-width: 300px;
        }

        .pulse-content p {
          color: #aeb7c3;
          line-height: 1.65;
          font-size: 17px;
          margin: 0 0 36px;
        }

        .pulse-content h3 {
          color: #ffc928;
          font-family: Impact, "Arial Black", sans-serif;
          font-size: clamp(22px, 2vw, 30px);
          line-height: 1.12;
          letter-spacing: 0.06em;
          margin: 10px 0;
          text-transform: uppercase;
        }

        /* ===== Dispatch ===== */

        .dispatch {
          background: #07111b;
          color: #f5f2ea;
        }

        .dispatch-top {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
          align-items: center;
          gap: clamp(40px, 8vw, 150px);
          min-height: 390px;
          padding: 70px clamp(28px, 4.5vw, 86px);
          border-bottom: 1px solid rgba(0, 255, 120, 0.22);
          background:
            linear-gradient(90deg, rgba(5, 7, 11, 0.98) 0 49.5%, rgba(15, 18, 23, 0.96) 49.5% 100%);
        }

        .dispatch-top::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 49.5%;
          width: 18px;
          background: rgba(0, 230, 118, 0.08);
          transform: translateX(-50%);
          pointer-events: none;
        }

        .section-label {
          color: #19d65f;
          letter-spacing: 0.24em;
          font-size: 11px;
          font-weight: 800;
          margin: 0 0 22px;
          text-transform: uppercase;
        }

        .dispatch h2 {
          margin: 0;
          color: #f4f0e8;
          font-family: Impact, "Arial Black", sans-serif;
          font-size: clamp(62px, 6.2vw, 118px);
          font-weight: 900;
          letter-spacing: -0.025em;
          line-height: 0.82;
          text-transform: uppercase;
        }

        .dispatch h2 em {
          font-style: italic;
        }

        .sub {
          margin: 18px 0 0;
          color: #aeb7c3;
          max-width: 560px;
          font-size: 16px;
          line-height: 1.5;
        }

        .subscribe {
          display: flex;
          align-items: center;
          gap: 0;
          min-width: 0;
          border-bottom: 1px solid rgba(24, 215, 104, 0.68);
        }

        .subscribe input {
          flex: 1;
          min-width: 0;
          background: transparent;
          border: none;
          color: #fff;
          padding: 18px 14px;
          font-size: 15px;
          outline: none;
        }

        .subscribe input::placeholder {
          color: #b38a3b;
        }

        .subscribe button {
          background: #ffc928;
          color: #111;
          border: none;
          min-height: 56px;
          padding: 0 25px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.16em;
          cursor: pointer;
          white-space: nowrap;
        }

        .dispatch-mail-icon {
          width: 20px;
          height: 20px;
          flex: 0 0 auto;
          color: #aeb7c3;
        }

        .dispatch-bottom {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: start;
          justify-content: space-between;
          gap: 36px;
          padding: 60px clamp(28px, 4.5vw, 86px) 86px;
          background:
            radial-gradient(ellipse at 22% 50%, rgba(0, 230, 118, 0.035), transparent 58%),
            #07110d;
        }

        .brand {
          min-width: 0;
        }

        .mini {
          color: #18d768;
          letter-spacing: 0.2em;
          font-size: 10px;
          font-weight: 900;
          line-height: 1.4;
          text-transform: uppercase;
        }

        .dispatch-brand-heading {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .dispatch-brand-heading .hm-logo-wrap {
          flex: 0 0 auto;
        }

        .dispatch-brand-heading .hm-logo {
          display: block;
          width: 98px;
          height: 72px;
          object-fit: contain;
        }

        .brand p {
          color: #aeb7c3;
          max-width: 310px;
          margin: 26px 0 0;
          font-size: clamp(14px, 1.4vw, 18px);
          line-height: 1.55;
        }

        .dispatch-contact-phone {
          display: inline-block;
          margin-top: 14px;
          color: #18d768;
          font-size: 14px;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .dispatch-contact-phone:hover {
          color: #ffc928;
        }

        .socials {
          display: flex;
          gap: 11px;
          flex-wrap: wrap;
        }

        .socials a {
          width: 48px;
          height: 48px;
          border: 1px solid rgba(24, 215, 104, 0.45);
          color: #18d768;
          display: grid;
          place-items: center;
          text-decoration: none;
          transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }

        .socials a:hover {
          border-color: #ffc928;
          color: #ffc928;
          transform: translateY(-1px);
        }

        .socials a svg {
          width: 18px;
          height: 18px;
          display: block;
        }

        .copyright {
          border-top: 1px solid rgba(196, 153, 59, 0.42);
          padding: 24px clamp(28px, 4.5vw, 86px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          background:
            radial-gradient(ellipse at 22% 50%, rgba(0, 230, 118, 0.035), transparent 58%),
            #07110d;
          color: #a78339;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          flex-wrap: wrap;
        }

        .copyright span:last-child {
          color: #18d768;
        }

        .copyright a {
          color: #d8b85f;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .copyright a:hover {
          color: #18d768;
        }

        @media (max-width: 900px) {
          .hm-nav-inner {
            width: 100%;
            max-width: none;
            height: 70px;
            padding: 0 20px;
          }

          .hm-logo {
            width: 66px;
          }

          .hm-nav-links,
          .hm-navbar > .hm-nav-inner > .hm-ticket-btn {
            display: none;
          }

          .hm-menu-toggle {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            border: 1px solid rgba(0, 230, 118, 0.5);
            background: transparent;
            color: #f4f0e8;
            font-size: 24px;
            cursor: pointer;
          }

          .hm-mobile-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            display: flex;
            flex-direction: column;
            gap: 0;
            padding: 8px 20px 18px;
            background: #05070b;
            border-bottom: 1px solid rgba(0, 230, 118, 0.35);
          }

          .hm-mobile-menu a {
            padding: 16px 0;
            color: #f4f0e8;
            text-decoration: none;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.16em;
          }

          .hm-mobile-menu .hm-ticket-btn {
            display: inline-flex;
            justify-content: center;
            margin-top: 8px;
          }
        }

        @media (max-width: 1000px) {
          .hm-carousel {
            grid-auto-columns: calc((100% - 14px) / 2);
          }

          .pulse,
          .dispatch-top {
            grid-template-columns: 1fr;
          }

          .dispatch-top {
            gap: 36px;
            min-height: 0;
            padding: 76px 32px;
            background: linear-gradient(180deg, #05070b 0 50%, #0f1217 50% 100%);
          }

          .dispatch-top::after {
            display: none;
          }

          .dispatch-top > div:first-child {
            padding-bottom: 36px;
            border-bottom: 18px solid rgba(0, 230, 118, 0.08);
          }

          .pulse-right {
            flex-direction: column;
              gap: 22px;
              padding-left: 0;
            }

            .yellow-line {
            width: 100%;
              height: 2px;
              min-height: 0;
            }

            .pulse-content {
              max-width: 580px;
            }
        }

        @media (max-width: 900px) {
          .copyright {
            gap: 16px;
          }

          .subscribe {
            flex-direction: row;
            align-items: center;
          }

          .subscribe button {
            width: auto;
          }
        }

        @media (max-width: 700px) {
          .hm-radar-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 14px;
          }

          .hm-past-toggle {
            width: 100%;
            margin-top: 26px;
            padding: 15px 16px;
            font-size: 11px;
            text-align: center;
          }

          .hm-past-events {
            margin-top: 22px;
          }

          .hm-past-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }

          .hm-past-card {
            min-height: clamp(220px, 64vw, 280px);
          }

          .hm-past-card h3 {
            margin-bottom: 10px;
            font-size: clamp(20px, 6.2vw, 32px);
            line-height: 0.95;
          }

          .hm-past-card .hm-card-overlay {
            padding: 12px;
          }

          .hm-past-card .hm-status {
            padding: 6px 7px;
            font-size: clamp(8px, 1vw, 12px);
            letter-spacing: 0.1em;
          }

          .hm-past-card .hm-event-info {
            font-size: 8px;
            letter-spacing: 0.06em;
          }

          .hm-radar-grid > .hm-large-card {
            grid-column: auto;
            min-height: 420px;
          }

          .hm-radar-grid > .hm-side-stack {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            align-items: stretch;
            gap: 14px;
          }

          .hm-radar-grid > .hm-side-stack > .hm-side-card {
            min-width: 0;
            min-height: clamp(230px, 62vw, 300px);
          }

          .hm-large-card .hm-card-overlay {
            padding: 20px;
          }

          .hm-large-card .hm-status {
            padding: 6px 9px;
            font-size: 8px;
            letter-spacing: 0.12em;
          }

          .hm-large-card h3 {
            margin-bottom: 9px;
            font-size: clamp(40px, 10vw, 58px);
            line-height: 0.92;
          }

          .hm-large-card .hm-card-overlay p {
            margin-bottom: 16px;
            font-size: 13px;
            line-height: 1.45;
          }

          .hm-large-card .hm-event-info {
            gap: 4px;
            font-size: 9px;
            letter-spacing: 0.09em;
          }

          .hm-large-card .hm-card-number {
            top: 14px;
            right: 14px;
            font-size: 28px;
          }

          .hm-side-card .hm-card-overlay {
            padding: 12px;
          }

          .hm-side-card .hm-status {
            padding: 6px 7px;
            max-width: calc(100% - 34px);
            font-size: 7px;
            line-height: 1.3;
            letter-spacing: 0.06em;
          }

          .hm-side-card h4 {
            min-height: 0;
            margin-bottom: 8px;
            width: 100%;
            font-size: clamp(15px, 4.3vw, 22px);
            line-height: 0.95;
            letter-spacing: -0.01em;
            text-align: left;
            overflow-wrap: break-word;
          }

          .hm-side-card .hm-card-overlay p,
          .hm-side-card .hm-event-info {
            display: none;
          }

          .hm-side-card .hm-side-button {
            margin-top: 8px;
            padding: 7px 8px;
            font-size: 8px;
            letter-spacing: 0.06em;
          }

          .hm-side-card .hm-card-number {
            top: 9px;
            right: 9px;
            font-size: 18px;
          }

          .hm-side-card .hm-graduating-title {
            width: 100%;
            font-size: clamp(15px, 4.1vw, 21px);
            white-space: normal;
            letter-spacing: -0.02em;
            transform: none;
          }

          .hm-mobile-title-break {
            display: block;
          }

          .pulse,
          .dispatch-top {
            padding-top: 64px;
            padding-bottom: 64px;
          }

          .dispatch h2 {
            font-size: clamp(58px, 16vw, 92px);
          }

          .dispatch-top .sub {
            max-width: 32rem;
            font-size: 15px;
          }

          .subscribe {
            width: 100%;
          }

          .subscribe input {
            padding: 15px 10px;
            font-size: 14px;
          }

          .subscribe button {
            min-height: 50px;
            padding: 0 16px;
          }

          .dispatch-bottom,
          .copyright {
            padding-left: 20px;
            padding-right: 20px;
          }

          .dispatch-bottom {
            grid-template-columns: minmax(0, 1fr);
            gap: 32px;
            padding-top: 44px;
            padding-bottom: 46px;
          }

          .dispatch-brand-heading {
            gap: 14px;
          }

          .dispatch-brand-heading .hm-logo {
            width: 82px;
            height: 62px;
          }

          .mini {
            font-size: 9px;
            letter-spacing: 0.14em;
          }

          .brand p {
            margin-top: 20px;
            font-size: 13px;
          }

          .socials a {
            width: 44px;
            height: 44px;
          }

          .copyright {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            flex-wrap: nowrap;
            gap: 8px;
            padding-top: 18px;
            padding-bottom: 18px;
            font-size: clamp(6px, 2.1vw, 8px);
            letter-spacing: 0.04em;
            white-space: nowrap;
          }

          .copyright span {
            min-width: 0;
          }

          .copyright span:last-child {
            text-align: right;
          }

          .pulse {
            gap: 30px;
            padding: 72px 20px;
          }

          .pulse-left h1 {
            font-size: clamp(38px, 10vw, 68px);
            line-height: 0.88;
            letter-spacing: -0.02em;
            overflow-wrap: anywhere;
          }

          .pulse-content p {
            font-size: 15px;
            line-height: 1.65;
            margin-bottom: 24px;
          }

          .pulse-content h3 {
            font-size: clamp(21px, 6vw, 28px);
          }

          .yellow-line {
            height: 2px;
            min-height: 0;
          }

          .hm-radar {
            padding: 64px 18px;
          }

          .hm-signal {
            padding: clamp(58px, 13vw, 82px) clamp(16px, 5vw, 28px) 30px;
          }

          .hm-signal-head {
            gap: 22px;
            margin-bottom: 28px;
          }

          .hm-signal-kicker {
            margin-bottom: 18px;
            font-size: clamp(9px, 2.5vw, 11px);
            letter-spacing: 0.22em;
          }

          .hm-signal-title {
            font-size: clamp(44px, 12vw, 84px);
            line-height: 0.86;
          }

          .hm-signal-copy {
            max-width: 36rem;
            font-size: clamp(14px, 3.8vw, 16px);
            line-height: 1.6;
          }

          .hm-signal-stat {
            min-height: 126px;
            padding: 20px clamp(8px, 2.5vw, 14px);
          }

          .hm-signal-stat strong {
            margin-bottom: 10px;
            font-size: clamp(44px, 14vw, 68px);
          }

          .hm-signal-stat span {
            font-size: clamp(7px, 2.2vw, 9px);
            letter-spacing: 0.08em;
          }

          .hm-signal-foot {
            justify-content: flex-start;
            margin: 24px 0 0;
          }

          .hm-signal-foot p {
            font-size: clamp(13px, 3.6vw, 15px);
            line-height: 1.6;
          }

          .hm-hero-content {
            grid-template-columns: minmax(0, 1fr);
            align-items: start;
            gap: 28px;
            min-height: calc(100svh - 70px);
            padding: 94px 18px 30px;
          }

          .hm-hero-feature {
            justify-self: start;
            max-width: 380px;
            margin: 0;
          }

          .hm-hero h1 {
            font-size: clamp(38px, 10.5vw, 60px);
            line-height: 0.88;
          }

          .hm-hero .hm-hero-kicker {
            margin-bottom: 14px;
            font-size: 10px;
            letter-spacing: 0.14em;
          }

          .hm-hero-copy > p:not(.hm-hero-kicker) {
            margin: 18px 0 22px;
            font-size: 15px;
          }

          .hm-small-line {
            gap: 9px;
            margin-bottom: 24px;
            font-size: 10px;
            letter-spacing: 0.16em;
          }

          .hm-buttons {
            flex-direction: column;
            align-items: stretch;
          }

          .hm-white-btn,
          .hm-outline-btn {
            padding: 16px 18px;
            text-align: center;
            font-size: 10px;
          }

          .hm-bottom-row {
            flex-wrap: wrap;
            gap: 14px 20px;
            padding-top: 28px;
            font-size: 9px;
            letter-spacing: 0.08em;
          }

          .hm-slide-number {
            display: none;
          }

          .hm-radar,
          .hm-timeline,
          .hm-proof {
            padding-left: 18px;
            padding-right: 18px;
          }

          .hm-large-card {
            min-height: 400px;
          }

          .hm-side-card {
            min-height: 260px;
          }

          .hm-large-card h3 {
            font-size: clamp(40px, 10vw, 58px);
            line-height: 0.92;
          }

          .hm-side-card h4 {
            font-size: 16px;
            text-align: left;
          }

          .hm-proof-head h2 {
            font-size: clamp(56px, 16vw, 84px);
          }

          .hm-filter {
            padding: 10px 12px;
            font-size: 10px;
          }

          .hm-lightbox {
            padding: 12px;
          }

          .hm-lightbox-meta {
            align-items: flex-start;
            flex-direction: column;
            padding: 14px 16px 18px;
          }

          .hm-radar-top h2 {
            font-size: clamp(38px, 10vw, 52px);
            line-height: 0.9;
          }

          .hm-radar-top p {
            margin-bottom: 18px;
            font-size: 11px;
            letter-spacing: 0.22em;
          }

          .hm-radar-make,
          .hm-radar-night {
            display: inline;
            white-space: nowrap;
          }

          .hm-radar-top h2 br {
            display: none;
          }

          .hm-radar-copy {
            width: 100%;
            font-size: 19px;
            line-height: 1.6;
          }

          .hm-large-card {
            min-height: 460px;
          }

          .hm-side-card {
            min-height: clamp(220px, 58vw, 270px);
          }

          .hm-large-card .hm-card-overlay {
            padding: 16px;
          }

          .hm-large-card .hm-status,
          .hm-side-card .hm-status {
            padding: 8px 10px;
            font-size: 10px;
            letter-spacing: 0.09em;
          }

          .hm-large-card .hm-card-overlay p {
            margin-bottom: 14px;
            font-size: 16px;
            line-height: 1.45;
          }

          .hm-large-card .hm-event-info {
            font-size: 10px;
            letter-spacing: 0.09em;
          }

          .hm-large-card .hm-card-number,
          .hm-side-card .hm-card-number {
            font-size: 18px;
          }

          .hm-side-card h4 {
            width: 100%;
            font-size: 18px;
            line-height: 1.05;
            letter-spacing: -0.01em;
            text-align: left;
          }

          .hm-side-card .hm-graduating-title {
            width: 116%;
            font-size: 18px;
            white-space: nowrap;
            letter-spacing: -0.035em;
            transform: scaleX(0.86);
            transform-origin: left center;
          }

          .hm-side-card .hm-side-button {
            padding: 8px 10px;
            font-size: 9px;
            letter-spacing: 0.09em;
          }

          .hm-timeline {
            padding: 90px 18px;
          }

          .hm-time-head {
            margin-bottom: 28px;
          }

          .hm-time-head h2 {
            font-size: clamp(62px, 18vw, 100px);
            line-height: 0.78;
          }

          .hm-head-copy {
            font-size: 15px;
            line-height: 1.55;
            margin: 0;
          }

          .hm-run-list::before {
            display: none;
          }

          .hm-run-row {
            display: flex;
            min-height: 0;
            flex-direction: column;
            align-items: flex-start;
            gap: 13px;
            padding: 20px 0 22px;
          }

          .hm-date-block {
            padding: 0;
          }

          .hm-date-badge {
            gap: 9px;
            font-size: 12px;
            letter-spacing: 0.12em;
          }

          .hm-date-badge::after {
            width: 7px;
            height: 7px;
          }

          .hm-row-main {
            width: 100%;
          }

          .hm-row-title {
            font-size: clamp(30px, 8.5vw, 42px);
            line-height: 0.92;
            letter-spacing: -0.045em;
            overflow-wrap: anywhere;
          }

          .hm-row-location {
            margin-top: 8px;
            font-size: 14px;
            line-height: 1.45;
            overflow-wrap: anywhere;
          }

          .hm-row-status {
            align-self: flex-start;
            max-width: 100%;
            font-size: 9px;
            letter-spacing: 0.12em;
          }

          .hm-proof {
            padding: 80px 22px;
          }

          .hm-proof-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 22px;
            border-bottom: 18px solid rgba(0, 230, 118, 0.08);
            padding-bottom: 24px;
          }

          .hm-proof::before {
            display: none;
          }

          .hm-frame-count {
            margin-left: 0;
          }

          .hm-carousel-controls {
            margin-left: auto;
          }

          .hm-carousel {
            grid-auto-columns: 100%;
          }

          .hm-media {
            height: clamp(240px, 70vw, 360px);
          }

          .hm-proof-copy {
            width: 100%;
          }
        }

        @media (max-width: 380px) {
          .hm-nav-inner {
            padding-right: 16px;
            padding-left: 16px;
          }

          .hm-radar,
          .hm-proof {
            padding-right: 16px;
            padding-left: 16px;
          }

          .hm-radar-top h2 {
            font-size: clamp(34px, 9.5vw, 42px);
          }

          .hm-radar-copy {
            font-size: 16px;
          }

          .hm-filter-row {
            gap: 9px;
          }

          .hm-filter {
            padding: 9px 10px;
            font-size: 9px;
            letter-spacing: 0.12em;
          }

          .hm-carousel-arrow {
            width: 38px;
            height: 38px;
          }

          .hm-carousel-controls {
            gap: 6px;
          }

          .hm-lightbox {
            padding: 8px;
          }

          .hm-lightbox-meta strong {
            font-size: 15px;
            overflow-wrap: anywhere;
          }
        }

        .hm-navbar {
          background: transparent;
          border-bottom-color: transparent;
          backdrop-filter: none;
          transition:
            background-color 180ms ease,
            border-color 180ms ease,
            backdrop-filter 180ms ease;
        }

        .hm-navbar.is-scrolled {
          background: rgba(8, 9, 10, 0.92);
          border-bottom-color: rgba(244, 240, 232, 0.16);
          backdrop-filter: blur(8px);
        }

        .hm-nav-inner {
          position: relative;
          width: 100%;
          max-width: 1200px;
          height: 64px;
          padding: 0;
        }

        .hm-logo-wrap {
          gap: 0;
          color: #f4f0e8;
          white-space: nowrap;
        }

        .hm-logo {
          width: 52px;
          height: 52px;
          object-fit: contain;
        }

        .hm-nav-links {
          position: absolute;
          left: 50%;
          align-items: center;
          gap: 30px;
          transform: translateX(-50%);
        }

        .hm-nav-links a {
          color: rgba(244, 240, 232, 0.8);
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0;
          transition: color 180ms ease;
        }

        .hm-nav-links a:hover {
          color: #ffc629;
        }

        .hm-navbar .hm-ticket-btn {
          padding: 10px 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 999px;
          background: #ffc629;
          box-shadow: none;
          color: #111;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0;
          text-decoration: none;
          transition: background-color 180ms ease, transform 180ms ease;
        }

        .hm-navbar .hm-ticket-btn:hover {
          background: #ffda69;
          color: #111;
          transform: translateY(-1px);
        }

        .hm-navbar .hm-ticket-btn svg {
          display: none;
        }

        .hm-radar-top h2 {
          flex: 0 1 auto;
        }

        .hm-radar-copy {
          flex: 0 0 235px;
        }

        .hm-upcoming-card {
          height: clamp(190px, 30vw, 350px);
        }

        .hm-menu-toggle {
          border-color: rgba(244, 240, 232, 0.2);
          color: #f4f0e8;
        }

        .hm-radar {
          padding: 78px clamp(22px, 7vw, 110px) 48px;
          background: #0b0c0d;
        }

        .hm-radar::before,
        .hm-proof::before {
          display: none;
        }

        .hm-radar-top {
          max-width: 948px;
          flex-direction: row;
          align-items: center;
          gap: 28px;
          margin-bottom: 38px;
        }

        .hm-radar-top h2 {
          color: #f4f0e8;
          font-size: clamp(42px, 4.9vw, 54px);
          line-height: 0.95;
          letter-spacing: -0.035em;
          white-space: nowrap;
        }

        .hm-radar-top h2 span {
          color: #ffc629;
        }

        .hm-radar-top .hm-radar-copy {
          width: 300px;
          flex: 0 0 300px;
          color: rgba(244, 240, 232, 0.58);
          font-size: 13px;
          line-height: 1.5;
          font-weight: 400;
          letter-spacing: 0;
          text-transform: none;
          margin: 0;
        }

        .hm-live-banner {
          width: 100%;
          max-width: 1200px;
          min-height: 100px;
          margin: 0 auto 26px;
          padding: 16px 18px;
          display: grid;
          grid-template-columns: 9px minmax(0, 1fr) auto;
          align-items: center;
          gap: 12px;
          border: 1px solid rgba(43, 214, 115, 0.34);
          border-radius: 12px;
          background: #141617;
          color: #f4f0e8;
          text-align: left;
          cursor: pointer;
          transition: border-color 180ms ease, background-color 180ms ease;
        }

        .hm-live-banner:hover {
          border-color: rgba(43, 214, 115, 0.65);
          background: #181b1b;
        }

        .hm-live-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #2bd673;
          box-shadow: 0 0 10px rgba(43, 214, 115, 0.55);
        }

        .hm-live-copy {
          display: grid;
          gap: 4px;
          min-width: 0;
        }

        .hm-live-label {
          color: #2bd673;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.1em;
        }

        .hm-live-copy strong {
          font-family: Impact, "Arial Black", sans-serif;
          font-size: 24px;
          line-height: 1;
        }

        .hm-live-copy > span:last-child {
          color: rgba(244, 240, 232, 0.52);
          font-size: 12px;
          line-height: 1.4;
        }

        .hm-live-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 15px;
          border-radius: 999px;
          background: #2bd673;
          color: #092010;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
        }

        .hm-live-cta svg {
          width: 13px;
          height: 13px;
          flex: 0 0 13px;
        }

        .hm-subsection-label {
          max-width: 1200px;
          margin: 0 auto 9px;
          color: rgba(244, 240, 232, 0.53);
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .hm-upcoming-card {
          max-width: 1200px;
          height: clamp(190px, 20vw, 250px);
          min-height: 0;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
          overflow: hidden;
          border: 1px solid rgba(244, 240, 232, 0.07);
          border-radius: 9px;
          background: #151718;
        }

        .hm-upcoming-card.is-empty {
          height: auto;
          min-height: 180px;
          grid-template-columns: 1fr;
        }

        .hm-upcoming-card > img {
          width: 100%;
          height: 100%;
          min-height: 0;
          display: block;
          object-fit: cover;
          object-position: center 38%;
        }

        .hm-upcoming-copy {
          min-width: 0;
          padding: 18px 22px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          overflow: hidden;
        }

        .hm-upcoming-date {
          margin: 0 0 5px;
          color: #ffc629;
          font-size: 9px;
          font-weight: 700;
        }

        .hm-upcoming-copy h3 {
          margin: 0;
          color: #f4f0e8;
          font-family: Impact, "Arial Black", sans-serif;
          font-size: clamp(20px, 3vw, 30px);
          line-height: 1;
          text-transform: uppercase;
        }

        .hm-upcoming-description {
          max-width: 460px;
          margin: 8px 0 12px;
          color: rgba(244, 240, 232, 0.62);
          font-size: 10px;
          line-height: 1.5;
        }

        .hm-upcoming-meta {
          width: 100%;
          padding-top: 9px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          border-top: 1px solid rgba(244, 240, 232, 0.08);
          color: #f4f0e8;
          font-size: 9px;
        }

        .hm-upcoming-meta span {
          display: grid;
          gap: 3px;
        }

        .hm-upcoming-meta small {
          color: rgba(244, 240, 232, 0.45);
          font-size: 8px;
        }

        .hm-upcoming-actions {
          margin-top: auto;
          padding-top: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .hm-upcoming-ticket,
        .hm-upcoming-calendar {
          min-height: 27px;
          padding: 7px 12px;
          display: inline-flex;
          align-items: center;
          border: 1px solid rgba(244, 240, 232, 0.12);
          border-radius: 999px;
          color: #f4f0e8;
          font-size: 9px;
          text-decoration: none;
          transition: background-color 180ms ease, color 180ms ease;
        }

        .hm-upcoming-ticket {
          border-color: #ffc629;
          background: #ffc629;
          color: #151515;
          font-weight: 800;
        }

        .hm-upcoming-ticket:hover {
          background: #ffda69;
          color: #151515;
        }

        .hm-upcoming-calendar:hover {
          background: rgba(244, 240, 232, 0.1);
        }

        .hm-past-events {
          max-width: 1200px;
          margin: 24px auto 0;
        }

        .hm-past-events > .hm-subsection-label {
          margin-bottom: 4px;
        }

        .hm-past-list {
          border-top: 1px solid rgba(244, 240, 232, 0.11);
        }

        .hm-past-row {
          min-height: clamp(35px, 5vw, 62px);
          display: grid;
          grid-template-columns: minmax(88px, auto) minmax(0, 1fr) minmax(100px, 0.55fr) 12px;
          align-items: center;
          gap: 14px;
          border-bottom: 1px solid rgba(244, 240, 232, 0.1);
          color: rgba(244, 240, 232, 0.5);
          font-size: 8px;
          text-decoration: none;
          transition: color 180ms ease;
        }

        .hm-past-row time {
          white-space: nowrap;
          font-size: 11px;
          font-variant-numeric: tabular-nums;
        }

        .hm-past-row:hover {
          color: #ffc629;
        }

        .hm-past-row strong {
          color: #f4f0e8;
          font-family: Impact, "Arial Black", sans-serif;
          font-size: 14px;
          line-height: 1;
          text-transform: uppercase;
        }

        .hm-past-row > span:nth-last-child(2) {
          text-align: right;
        }

        .hm-past-arrow {
          justify-self: end;
          width: 12px;
          height: 12px;
        }

        .hm-empty-archive {
          margin: 0;
          padding: 12px 0;
          border-top: 1px solid rgba(244, 240, 232, 0.1);
          color: rgba(244, 240, 232, 0.55);
          font-size: 11px;
        }

        .hm-proof {
          padding: 48px clamp(22px, 7.5vw, 110px) 54px;
          background: #0b0c0d;
        }

        .hm-proof-head {
          max-width: 1200px;
          flex-direction: row;
          align-items: flex-end;
          gap: 28px;
          margin-bottom: 16px;
        }

        .hm-proof-head > div:first-child {
          min-width: 0;
        }

        .hm-proof-head h2 {
          color: #f4f0e8;
          font-size: clamp(32px, 4.2vw, 46px);
          line-height: 0.95;
          letter-spacing: -0.02em;
          white-space: nowrap;
        }

        .hm-proof-head h2 span {
          color: #ffc629;
        }

        .hm-proof-copy {
          width: auto;
          margin: 5px 0 0;
          color: rgba(244, 240, 232, 0.55);
          font-size: 10px;
          line-height: 1.4;
        }

        .hm-gallery-tools {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .hm-filter-row {
          max-width: none;
          margin: 0;
          justify-content: flex-end;
          gap: 5px;
        }

        .hm-filter {
          padding: 6px 9px;
          border: 1px solid transparent;
          border-radius: 999px;
          background: #17191a;
          color: rgba(244, 240, 232, 0.67);
          font-size: 8px;
          font-weight: 500;
          letter-spacing: 0;
          text-transform: none;
        }

        .hm-filter.active {
          border-color: #f4f0e8;
          background: #f4f0e8;
          color: #111;
        }

        .hm-carousel-controls {
          display: none;
        }

        .hm-carousel {
          max-width: 1200px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          grid-auto-rows: clamp(150px, 18vw, 240px);
          grid-auto-flow: row;
          gap: 8px;
          overflow: visible;
        }

        .hm-media {
          height: 100%;
          border: 0;
          border-radius: 7px;
          background: #17191a;
        }

        .hm-media:nth-child(1) {
          grid-column: span 2;
          grid-row: span 2;
        }

        .hm-media img,
        .hm-media video {
          position: absolute;
          inset: 0;
          filter: brightness(0.94);
        }

        .hm-media::after {
          content: "";
          position: absolute;
          inset: 45% 0 0;
          background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.75));
          pointer-events: none;
        }

        .hm-media-caption {
          position: absolute;
          z-index: 1;
          right: 0;
          bottom: 0;
          left: 0;
          padding: 24px 10px 9px;
          display: grid;
          gap: 2px;
          color: #fff;
          pointer-events: none;
        }

        .hm-media-caption strong {
          font-size: 9px;
          font-weight: 700;
        }

        .hm-media-caption small {
          color: rgba(255, 255, 255, 0.65);
          font-size: 7px;
        }

        .hm-media-play {
          position: absolute;
          z-index: 2;
          top: 50%;
          left: 50%;
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #f4f0e8;
          color: #111;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .hm-media-play svg {
          width: 10px;
          height: 10px;
          margin-left: 2px;
        }

        .hm-gallery-more {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin: 16px auto 0;
          padding: 7px 12px;
          border: 1px solid rgba(244, 240, 232, 0.14);
          border-radius: 999px;
          background: transparent;
          color: rgba(244, 240, 232, 0.7);
          font-size: 9px;
          cursor: pointer;
          transition: border-color 180ms ease, color 180ms ease;
        }

        .hm-gallery-more:hover {
          border-color: #ffc629;
          color: #ffc629;
        }

        .hm-gallery-more svg {
          width: 10px;
          height: 10px;
        }

        .hm-signal {
          padding: 44px clamp(22px, 7.5vw, 110px) 34px;
          background: #ffc629;
          color: #111;
        }

        .hm-signal-inner {
          max-width: 1200px;
        }

        .hm-signal-head {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: start;
          gap: clamp(24px, 7vw, 90px);
          margin-bottom: 28px;
        }

        .hm-signal-title {
          color: #111;
          font-size: clamp(32px, 4.6vw, 52px);
          line-height: 0.9;
          letter-spacing: -0.02em;
        }

        .hm-signal-title span {
          color: #111;
        }

        .hm-signal-copy {
          max-width: 370px;
          margin: 0;
          color: rgba(17, 17, 17, 0.82);
          font-size: 11px;
          line-height: 1.55;
        }

        .hm-signal-copy strong {
          display: block;
          margin-top: 12px;
          color: #111;
          font-family: Impact, "Arial Black", sans-serif;
          font-size: 12px;
          line-height: 1.2;
          text-transform: uppercase;
        }

        .hm-signal-stats {
          border-top: 1px solid rgba(17, 17, 17, 0.18);
          border-bottom: 0;
        }

        .hm-signal-stat {
          min-height: 58px;
          padding: 12px 0 0;
        }

        .hm-signal-stat + .hm-signal-stat {
          border-left: 0;
        }

        .hm-signal-stat strong {
          margin-bottom: 2px;
          color: #111;
          font-size: clamp(24px, 3.2vw, 34px);
          line-height: 0.95;
        }

        .hm-signal-stat span {
          color: rgba(17, 17, 17, 0.72);
          font-size: 8px;
          font-weight: 500;
          letter-spacing: 0;
          text-transform: none;
        }

        .dispatch {
          background: #0b0c0d;
          color: #f4f0e8;
        }

        .dispatch-top {
          min-height: 0;
          padding: 42px clamp(22px, 7.5vw, 110px);
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 48px;
          border-bottom: 1px solid rgba(244, 240, 232, 0.09);
          background: #0b0c0d;
        }

        .dispatch-top::after {
          display: none;
        }

        .dispatch h2 {
          color: #f4f0e8;
          font-size: clamp(28px, 4vw, 40px);
          line-height: 0.95;
          letter-spacing: -0.02em;
        }

        .dispatch h2 em {
          font-style: normal;
        }

        .dispatch-top .sub {
          max-width: 330px;
          margin-top: 8px;
          color: rgba(244, 240, 232, 0.52);
          font-size: 10px;
          line-height: 1.5;
        }

        .subscribe {
          display: block;
          border: 0;
        }

        .subscribe label {
          display: block;
          margin-bottom: 7px;
          color: #f4f0e8;
          font-size: 9px;
        }

        .hm-subscribe-field {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .subscribe input {
          min-height: 34px;
          padding: 0 12px;
          border: 1px solid rgba(244, 240, 232, 0.08);
          border-radius: 999px;
          background: #17191a;
          color: #f4f0e8;
          font-size: 9px;
        }

        .subscribe input::placeholder {
          color: rgba(244, 240, 232, 0.4);
        }

        .subscribe button {
          min-height: 34px;
          padding: 0 14px;
          border-radius: 999px;
          background: #ffc629;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0;
          text-transform: none;
        }

        .dispatch-bottom {
          padding: 30px clamp(22px, 7.5vw, 110px);
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: start;
          gap: 48px;
          background: #0b0c0d;
        }

        .dispatch-brand-heading .hm-logo {
          width: 42px;
          height: 30px;
        }

        .brand p {
          max-width: 260px;
          margin-top: 9px;
          color: rgba(244, 240, 232, 0.52);
          font-size: 9px;
          line-height: 1.5;
        }

        .hm-footer-navigation {
          display: flex;
          gap: clamp(32px, 7vw, 88px);
        }

        .hm-footer-column {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 7px;
        }

        .hm-footer-column h3 {
          margin: 0 0 3px;
          color: #f4f0e8;
          font-size: 9px;
          font-weight: 600;
        }

        .hm-footer-column > a {
          color: rgba(244, 240, 232, 0.55);
          font-size: 9px;
          text-decoration: none;
        }

        .hm-footer-column > a:hover {
          color: #ffc629;
        }

        .socials {
          gap: 6px;
        }

        .socials a {
          width: 22px;
          height: 22px;
          border: 0;
          border-radius: 50%;
          background: #17191a;
          color: rgba(244, 240, 232, 0.8);
        }

        .socials a svg {
          width: 10px;
          height: 10px;
        }

        .copyright {
          padding: 11px clamp(22px, 7.5vw, 110px);
          border-top-color: rgba(244, 240, 232, 0.09);
          background: #0b0c0d;
          color: rgba(244, 240, 232, 0.42);
          font-size: 7px;
          font-weight: 400;
          letter-spacing: 0;
        }

        .copyright span:last-child {
          color: rgba(244, 240, 232, 0.42);
        }

        .copyright a {
          color: rgba(244, 240, 232, 0.55);
        }

        @media (max-width: 700px) {
          .hm-nav-inner {
            height: 64px;
            padding: 0 18px;
          }

          .hm-logo-wrap {
            font-size: 13px;
          }

          .hm-radar,
          .hm-proof {
            padding-right: 22px;
            padding-left: 22px;
          }

          .hm-radar-top {
            flex-direction: row;
            align-items: center;
            gap: 22px;
          }

          .hm-radar-top h2 {
            font-size: clamp(28px, 8vw, 38px);
          }

          .hm-radar-copy {
            width: auto;
            max-width: 300px;
            font-size: 10px;
          }

          .hm-upcoming-card {
            grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
          }

          .hm-upcoming-copy {
            padding: 14px;
          }

          .hm-upcoming-copy h3 {
            font-size: clamp(18px, 5vw, 24px);
          }

          .hm-proof-head {
            flex-direction: row;
            align-items: flex-end;
            gap: 20px;
          }

          .hm-proof-head h2 {
            font-size: clamp(31px, 8.5vw, 42px);
          }

          .hm-gallery-tools {
            width: 100%;
          }

          .hm-filter-row {
            justify-content: flex-start;
            gap: 4px;
          }

          .hm-filter {
            padding: 6px 8px;
          }

          .hm-signal-title {
            font-size: clamp(34px, 9vw, 46px);
          }

        }

        @media (max-width: 480px) {
          .hm-nav-inner {
            height: 60px;
          }

          .hm-radar,
          .hm-proof {
            padding-right: 16px;
            padding-left: 16px;
          }

          .hm-radar-top {
            align-items: flex-start;
            flex-direction: column;
            gap: 9px;
          }

          .hm-live-banner {
            grid-template-columns: 7px minmax(0, 1fr);
            padding: 11px;
          }

          .hm-live-cta {
            grid-column: 2;
            justify-self: start;
          }

          .hm-upcoming-card {
            grid-template-columns: 1fr;
            height: auto;
          }

          .hm-upcoming-card > img {
            height: 155px;
            min-height: 155px;
          }

          .hm-upcoming-meta {
            grid-template-columns: 1fr 1fr;
          }

          .hm-past-row {
            grid-template-columns: 54px minmax(0, 1fr) 12px;
            gap: 9px;
          }

          .hm-past-row > span:nth-last-child(2) {
            display: none;
          }

          .hm-proof-head {
            flex-direction: column;
            align-items: flex-start;
            flex-direction: column;
            gap: 12px;
          }

          .hm-carousel {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-auto-rows: clamp(140px, 43vw, 200px);
          }

          .hm-media:nth-child(1) {
            grid-column: span 2;
            grid-row: span 2;
          }

          .hm-signal-head {
            grid-template-columns: 1fr;
            gap: 16px;
            margin-bottom: 20px;
          }

          .hm-signal-copy {
            max-width: 480px;
          }

          .hm-signal-stats {
            gap: 12px;
          }

          .hm-signal-stat {
            min-height: 48px;
            padding: 10px 0 0;
          }

          .hm-signal-stat strong {
            font-size: clamp(22px, 7vw, 30px);
          }

          .hm-signal-stat span {
            font-size: 7px;
          }

          .dispatch-top {
            grid-template-columns: 1fr;
            gap: 20px;
            padding-top: 36px;
            padding-bottom: 36px;
          }

          .dispatch-bottom {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .hm-footer-navigation {
            justify-content: flex-start;
          }
        }

        .hm-white-btn,
        .hm-outline-btn {
          font-size: 12px;
        }

        .hm-subsection-label,
        .hm-upcoming-date,
        .hm-upcoming-meta,
        .hm-upcoming-ticket,
        .hm-upcoming-calendar,
        .hm-past-row,
        .hm-filter,
        .hm-gallery-more,
        .hm-signal-copy,
        .sub,
        .subscribe label,
        .subscribe input,
        .subscribe button,
        .brand p,
        .hm-footer-column > a {
          font-size: 12px;
        }

        .hm-upcoming-description,
        .hm-media-caption strong {
          font-size: 13px;
        }

        .hm-upcoming-meta small,
        .hm-media-caption small {
          font-size: 11px;
        }

        .hm-past-row strong {
          font-size: 16px;
        }

        .hm-footer-column h3 {
          font-size: 12px;
        }

        .copyright {
          font-size: 10px;
        }

        @media (max-width: 900px) {
          .hm-radar-top {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .hm-radar-top h2 {
            max-width: 100%;
            font-size: clamp(36px, 6vw, 50px);
            line-height: 1;
            white-space: normal;
          }

          .hm-radar-top .hm-radar-copy {
            width: 100%;
            max-width: 440px;
            flex: 0 1 auto;
          }

          .hm-proof-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .hm-proof-head h2 {
            max-width: 100%;
            font-size: clamp(38px, 8vw, 64px);
            white-space: normal;
          }

          .hm-proof-copy {
            max-width: 100%;
          }

          .dispatch-top {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            gap: 28px;
          }

          .dispatch-bottom {
            grid-template-columns: minmax(0, 1fr);
          }
        }

        @media (max-width: 700px) {
          .hm-radar,
          .hm-proof {
            padding-right: 22px;
            padding-left: 22px;
          }

          .hm-upcoming-card:not(.is-empty) {
            grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
          }

          .hm-carousel {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-auto-rows: clamp(145px, 38vw, 200px);
          }

          .hm-media:nth-child(1) {
            grid-column: span 2;
            grid-row: span 2;
          }

          .hm-signal-copy,
          .dispatch-top .sub {
            font-size: 14px;
          }
        }

        @media (max-width: 600px) {
          .hm-upcoming-card:not(.is-empty) {
            height: auto;
            grid-template-columns: minmax(0, 1fr);
          }

          .hm-upcoming-card > img {
            height: clamp(170px, 48vw, 240px);
            min-height: 0;
          }

          .hm-upcoming-copy {
            min-height: 190px;
          }

          .dispatch-top {
            grid-template-columns: minmax(0, 1fr);
            gap: 24px;
            padding-top: 36px;
            padding-bottom: 36px;
          }

          .hm-footer-navigation {
            flex-wrap: wrap;
            gap: 32px;
          }
        }

        @media (max-width: 480px) {
          .hm-radar,
          .hm-proof {
            padding-right: 18px;
            padding-left: 18px;
          }

          .hm-radar-top h2 {
            font-size: clamp(30px, 8.5vw, 40px);
            line-height: 1;
          }

          .hm-radar-top .hm-radar-copy {
            max-width: 100%;
            font-size: 13px;
          }

          .hm-live-banner {
            grid-template-columns: 9px minmax(0, 1fr);
            gap: 10px;
            padding: 14px;
          }

          .hm-live-copy strong {
            font-size: 20px;
          }

          .hm-live-copy > span:last-child {
            font-size: 12px;
          }

          .hm-live-cta {
            grid-column: 2;
            justify-self: start;
            min-height: 40px;
            font-size: 12px;
          }

          .hm-past-row {
            grid-template-columns: minmax(90px, auto) minmax(0, 1fr) 16px;
            gap: 8px;
            font-size: 11px;
            white-space: nowrap;
          }

          .hm-past-row time {
            font-size: 10px;
          }

          .hm-past-row > span:nth-last-child(2) {
            display: none;
          }

          .hm-past-row strong {
            font-size: 15px;
            overflow-wrap: anywhere;
          }

          .hm-filter-row {
            justify-content: flex-start;
            flex-wrap: wrap;
            gap: 7px;
          }

          .hm-filter {
            min-height: 40px;
            padding: 8px 11px;
          }

          .hm-media-caption strong {
            font-size: 12px;
          }

          .hm-media-caption small {
            font-size: 11px;
          }

          .hm-signal-copy,
          .dispatch-top .sub,
          .brand p {
            font-size: 14px;
          }

          .hm-signal-stat span {
            font-size: 10px;
          }

          .hm-footer-column > a {
            min-height: 32px;
            display: inline-flex;
            align-items: center;
          }

          .copyright {
            gap: 8px 16px;
            justify-content: flex-start;
            flex-wrap: wrap;
            white-space: normal;
            font-size: 11px;
          }
        }

        @media (max-width: 380px) {
          .hm-hero h1 {
            font-size: clamp(36px, 10.5vw, 42px);
          }

          .hm-radar-top h2 {
            font-size: clamp(28px, 8vw, 32px);
          }

          .hm-past-row {
            grid-template-columns: minmax(90px, auto) minmax(0, 1fr) 14px;
          }

          .hm-past-row strong {
            font-size: 14px;
          }

          .hm-signal-stats {
            gap: 8px;
          }

          .hm-signal-stat span {
            font-size: 9px;
          }

          .hm-footer-navigation {
            gap: 20px;
          }
        }

        .hm-proof-head .hm-proof-copy {
          color: rgba(244, 240, 232, 0.68);
          font-size: 14px;
          font-weight: 400;
          letter-spacing: normal;
          text-transform: none;
        }

        .hm-proof {
          border-top: 1px solid rgba(244, 240, 232, 0.2);
        }

        .hm-radar {
          padding-bottom: 76px;
        }

        .hm-live-copy strong,
        .hm-past-row strong {
          letter-spacing: 0.025em;
        }

        .hm-past-row {
          min-height: clamp(48px, 5vw, 68px);
          color: rgba(244, 240, 232, 0.8);
        }

        .hm-past-row strong {
          color: #fff;
          font-size: 18px;
          font-weight: 900;
        }

        .hm-hero-content {
          transform: translateY(-56px);
        }

        @media (max-width: 700px) {
          .hm-hero-content {
            align-content: start;
            transform: none;
          }

          .hm-live-copy strong,
          .hm-past-row strong {
            letter-spacing: 0.01em;
          }

          .hm-past-row strong {
            font-size: 16px;
          }
        }

        @media (max-width: 380px) {
          .hm-past-row strong {
            font-size: 15px;
          }
        }

        @media (min-width: 701px) {
          .hm-hero-feature-label,
          .hm-live-label {
            font-size: 11px;
          }

          .hm-hero-feature-meta,
          .hm-radar-top .hm-radar-copy,
          .hm-live-copy > span:last-child,
          .hm-upcoming-meta,
          .hm-empty-archive,
          .hm-signal-copy,
          .dispatch-top .sub,
          .brand p {
            font-size: 14px;
          }

          .hm-hero-feature-cta,
          .hm-live-cta,
          .hm-subsection-label,
          .hm-upcoming-date,
          .hm-upcoming-ticket,
          .hm-upcoming-calendar,
          .hm-past-row time,
          .hm-past-row,
          .hm-filter,
          .hm-gallery-more,
          .subscribe label,
          .subscribe button,
          .hm-footer-column h3,
          .hm-footer-column > a {
            font-size: 13px;
          }

          .event-hub .hm-white-btn {
            font-size: 13px;
          }

          .hm-upcoming-description,
          .hm-media-caption strong {
            font-size: 14px;
          }

          .hm-upcoming-meta small,
          .hm-media-caption small {
            font-size: 12px;
          }

          .hm-signal-stat span,
          .copyright {
            font-size: 12px;
          }

          .subscribe input {
            font-size: 14px;
          }

          .hm-footer-column {
            gap: 10px;
          }

          .hm-footer-column .socials a {
            width: 36px;
            height: 36px;
          }

          .hm-footer-column .socials a svg {
            width: 16px;
            height: 16px;
          }
        }

        .hm-nav-links a:hover {
          color: #18d768;
        }

        .hm-outline-btn {
          border-color: rgba(24, 215, 104, 0.45);
        }

        .hm-outline-btn:hover {
          border-color: #18d768;
          background: rgba(24, 215, 104, 0.1);
        }

        .hm-hero-feature {
          border-left: 2px solid rgba(24, 215, 104, 0.7);
        }

        .hm-hero-feature-label,
        .hm-subsection-label,
        .hm-past-row time {
          color: #18d768;
        }

        .hm-hero-feature:hover {
          border-color: #18d768;
        }

        .hm-upcoming-card {
          border-color: rgba(24, 215, 104, 0.2);
        }

        .hm-upcoming-card.is-empty {
          border-left: 2px solid rgba(24, 215, 104, 0.7);
        }

        .hm-past-row:hover strong {
          color: #18d768;
        }

        .hm-filter.active {
          border-color: #18d768;
          background: #18d768;
          color: #07110a;
        }

        .hm-media-play {
          background: #18d768;
        }

        .hm-proof {
          border-top-color: rgba(24, 215, 104, 0.38);
        }

        @media (max-width: 600px) {
          .dispatch-bottom {
            grid-template-columns: minmax(0, 1fr);
            gap: 28px;
            padding: 28px 20px;
          }

          .brand {
            display: grid;
            grid-template-columns: 64px minmax(0, 1fr);
            align-items: center;
            column-gap: 14px;
          }

          .dispatch-brand-heading .hm-logo {
            width: 64px;
            height: 48px;
          }

          .brand p {
            max-width: none;
            margin: 0;
            font-size: 12px;
            line-height: 1.5;
          }

          .hm-footer-navigation {
            display: grid;
            grid-template-columns: 1fr 1fr;
            justify-content: stretch;
            gap: 20px;
            padding-top: 20px;
            border-top: 1px solid rgba(244, 240, 232, 0.1);
          }

          .hm-footer-column {
            min-width: 0;
            gap: 8px;
          }

          .hm-footer-column .socials {
            gap: 8px;
            max-width: 100%;
            flex-wrap: wrap;
          }

          .hm-footer-column .socials a {
            width: 36px;
            height: 36px;
          }

          .hm-footer-column .socials a svg {
            width: 14px;
            height: 14px;
          }

          .copyright {
            display: grid;
            grid-template-columns: auto auto;
            justify-content: center;
            align-items: center;
            gap: 8px 12px;
            padding: 16px 20px 20px;
            font-size: 10px;
            line-height: 1.4;
            white-space: nowrap;
          }

          .copyright span:last-child {
            grid-column: 1 / -1;
            justify-self: center;
            text-align: center;
          }
        }

        @media (max-width: 360px) {
          .dispatch-bottom,
          .copyright {
            padding-right: 16px;
            padding-left: 16px;
          }

          .brand {
            grid-template-columns: 52px minmax(0, 1fr);
            column-gap: 10px;
          }

          .dispatch-brand-heading .hm-logo {
            width: 52px;
            height: 40px;
          }

          .hm-footer-column .socials {
            gap: 6px;
          }

          .hm-footer-column .socials a {
            width: 34px;
            height: 34px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hm-white-btn > span,
          .hm-arrow-icon {
            transition: none;
          }

          .event-hub .hm-white-btn:hover > span,
          .event-hub .hm-white-btn:focus-visible > span,
          .hm-hero-feature:hover .hm-arrow-icon,
          .hm-hero-feature:focus-visible .hm-arrow-icon {
            transform: none;
          }
        }
      `}</style>

      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className={`hm-navbar${hasScrolled ? " is-scrolled" : ""}`}>
        <div className="hm-nav-inner">
          <Link to="/" className="hm-logo-wrap" aria-label="Headless Mary home">
            <img src={brandLogo} alt="" className="hm-logo" />
          </Link>

          <nav className="hm-nav-links" aria-label="Main navigation">
            <a href="#archive">Events</a>
            <a href="#gallery">Archive</a>
            <a href="#about">About</a>
          </nav>

          <a href="#dispatch" className="hm-ticket-btn">
            Contact us
          </a>

          <button
            type="button"
            className="hm-menu-toggle"
            aria-label={
              mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? "×" : "☰"}
          </button>
        </div>
        {mobileMenuOpen && (
          <nav className="hm-mobile-menu" aria-label="Mobile navigation">
            <a href="#archive" onClick={() => setMobileMenuOpen(false)}>
              Events
            </a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>
              Archive
            </a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>
              About
            </a>
            <a
              href="#dispatch"
              className="hm-ticket-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact us
            </a>
          </nav>
        )}
      </header>

      <section className="hm-hero" id="home">
        <video
          className="hm-hero-video"
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
        />

        <div className="hm-overlay" />

        <div className="hm-hero-content">
          <div className="hm-hero-copy">
            <h1>
              <span>LOSE YOUR HEAD.</span>
              <span className="hm-hero-gold">FIND YOUR SOUL.</span>
            </h1>

            <p>
              Where music takes over, strangers become familiar and every night
              becomes a story worth telling.
            </p>

            <div className="hm-buttons">
              <a href="#archive" className="hm-white-btn">
                SEE UPCOMING EVENTS <span aria-hidden="true">→</span>
              </a>

              <a href="#gallery" className="hm-outline-btn">
                BROWSE THE ARCHIVE
              </a>
            </div>
          </div>

          {societyEvent.status === "LIVE" ||
          societyEvent.status === "UPCOMING" ? (
            <Link to="/headless-society" className="hm-hero-feature">
              <span className="hm-hero-feature-label">
                {societyEvent.status === "LIVE" ? "LIVE NOW" : "NEXT UP"}
              </span>
              <h2>{societyEvent.eventName}</h2>
              <span className="hm-hero-feature-meta">
                <span>
                  {formatEventDateTime(societyEvent.eventDateTime)}
                </span>
                <span>{societyEvent.venue}</span>
              </span>
              <span className="hm-hero-feature-cta">
                Reserve a spot
                <FaExternalLinkAlt className="hm-arrow-icon" aria-hidden="true" />
              </span>
            </Link>
          ) : (
            <a href="#archive" className="hm-hero-feature">
              <span className="hm-hero-feature-label">NEXT UP</span>
              <h2>A new night is on the way</h2>
              <span className="hm-hero-feature-meta">
                <span>New dates and details announced here first.</span>
              </span>
              <span className="hm-hero-feature-cta">
                Explore the archive
                <FaExternalLinkAlt className="hm-arrow-icon" aria-hidden="true" />
              </span>
            </a>
          )}
        </div>
      </section>
      <section className="hm-radar" id="archive">
        <div className="hm-radar-top">
          <h2>
            THE NIGHT NEVER <span>STANDS STILL.</span>
          </h2>
          <p className="hm-radar-copy">
            What’s live, what’s next, and the nights we’ve already lived.
          </p>
        </div>

        <button
          type="button"
          className="hm-live-banner"
          aria-label="Watch Graduating Into Summer live"
          onClick={() =>
            setSelectedMedia({
              type: "video",
              event: "Graduating Into Summer",
              label: "Live Broadcast",
              src: galleryVideoOne,
            })
          }
        >
          <span className="hm-live-dot" aria-hidden="true" />
          <span className="hm-live-copy">
            <span className="hm-live-label">LIVE NOW</span>
            <strong>GRADUATING INTO SUMMER</strong>
            <span>
              Coventry, United Kingdom · The live broadcast is running now. Tap
              in before the last transmission fades.
            </span>
          </span>
          <span className="hm-live-cta">
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <circle cx="8" cy="8" r="1.5" fill="currentColor" />
              <path d="M4.5 4.5a5 5 0 0 0 0 7M11.5 4.5a5 5 0 0 1 0 7M2.5 2.5a8 8 0 0 0 0 11M13.5 2.5a8 8 0 0 1 0 11" />
            </svg>
            Watch live
          </span>
        </button>

        {eventError && (
          <p role="alert" className="mb-5 text-sm text-[#ffc629]">
            {eventError}
          </p>
        )}

        <p className="hm-subsection-label">UPCOMING</p>
        <div
          className={`hm-upcoming-card${featuredEvent?.imageUrl ? "" : " is-empty"}`}
        >
          {featuredEvent?.imageUrl && (
            <img
              src={featuredEvent.imageUrl}
              alt={`${featuredEvent.eventName} event flyer`}
            />
          )}
          <div className="hm-upcoming-copy">
            <p className="hm-upcoming-date">
              {featuredEvent?.eventDateTime
                ? formatEventDateTime(featuredEvent.eventDateTime)
                : "NEW DATES ANNOUNCED SOON"}
            </p>
            <h3>{featuredEvent?.eventName || "A NEW NIGHT IS ON THE WAY"}</h3>
            <p className="hm-upcoming-description">
              {featuredEvent?.status === "LIVE"
                ? "The doors are open. Join us for a night made to be remembered."
                : featuredEvent
                  ? "An after-dark experience of music, art and culture, made for the people who shape the night."
                  : "The next chapter is taking shape. Explore the archive while we get the next room ready."}
            </p>
            {featuredEvent?.venue && (
              <div className="hm-upcoming-meta">
                <span>
                  <small>WHERE</small>
                  {featuredEvent.venue}
                </span>
                <span>
                  <small>WHEN</small>
                  {formatEventDateTime(featuredEvent.eventDateTime)}
                </span>
              </div>
            )}
            <div className="hm-upcoming-actions">
              {featuredEvent ? (
                <Link to="/headless-society" className="hm-upcoming-ticket">
                  Get tickets
                </Link>
              ) : (
                <a href="#gallery" className="hm-upcoming-ticket">
                  Explore the archive
                </a>
              )}
              {featuredEvent && upcomingEventDates && (
                <a
                  className="hm-upcoming-calendar"
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(featuredEvent.eventName)}&dates=${upcomingEventDates}&location=${encodeURIComponent(featuredEvent.venue || "")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Add to calendar
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="hm-past-events">
          <p className="hm-subsection-label">PAST EVENTS</p>
          {pastEventCards.length > 0 ? (
            <div className="hm-past-list">
              {pastEventCards.map((event) => (
                <Link
                  className="hm-past-row"
                  key={event.id || event.name}
                  to={event.slug === "private-view" ? "/private-view" : "/headless-society"}
                >
                  <time>{event.date}</time>
                  <strong>{event.name}</strong>
                  <span>{event.venue || "Location to be announced"}</span>
                  <FaExternalLinkAlt
                    className="hm-past-arrow"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <p className="hm-empty-archive">
              {eventError
                ? "Past events could not be loaded."
                : "Past events will appear here."}
            </p>
          )}
        </div>
      </section>

      <section className="hm-proof" id="gallery">
        <div className="hm-proof-head">
          <div>
            <h2>
              PROOF OF <span>LIFE</span>
            </h2>
            <p className="hm-proof-copy">
              The nights disappear. The evidence stays.
            </p>
          </div>
          <div className="hm-gallery-tools">
            <div className="hm-filter-row">
              {galleryTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`hm-filter ${activeFilter === tab ? "active" : ""}`}
                  onClick={() => {
                    setActiveFilter(tab);
                    setShowAllMedia(false);
                  }}
                  aria-pressed={activeFilter === tab}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="hm-carousel"
          aria-label="Event photo and video carousel"
        >
          {visibleGalleryMedia.map((item) =>
            item.type === "video" ? (
              <GalleryVideoCard
                key={item.id}
                item={item}
                onOpen={setSelectedMedia}
              />
            ) : (
              <button
                key={item.id}
                type="button"
                className="hm-media"
                aria-label={`Open ${item.event}: ${item.label}`}
                onClick={() => setSelectedMedia(item)}
              >
                <img src={item.src} alt={item.label} />
                <span className="hm-media-caption">
                  <strong>{item.label}</strong>
                  <small>{item.event}</small>
                </span>
              </button>
            ),
          )}
        </div>
        {activeFilter === "All" && filteredMedia.length > 5 && (
          <button
            type="button"
            className="hm-gallery-more"
            aria-expanded={showAllMedia}
            onClick={() => setShowAllMedia((isExpanded) => !isExpanded)}
          >
            {showAllMedia ? (
              <>
                Show fewer memories <FaArrowUp aria-hidden="true" />
              </>
            ) : (
              <>
                View full archive
                <FaExternalLinkAlt aria-hidden="true" />
              </>
            )}
          </button>
        )}
      </section>

      {selectedMedia && (
        <div className="hm-lightbox" onClick={() => setSelectedMedia(null)}>
          <div
            className="hm-lightbox-inner"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="hm-lightbox-close"
              onClick={() => setSelectedMedia(null)}
              aria-label="Close gallery item"
            >
              ×
            </button>

            {selectedMedia.type === "video" ? (
              <video
                className="hm-lightbox-media"
                src={selectedMedia.src}
                controls
                autoPlay
                muted
                loop
                preload="none"
              />
            ) : (
              <img
                className="hm-lightbox-media"
                src={selectedMedia.src}
                alt={selectedMedia.label}
              />
            )}

            <div className="hm-lightbox-meta">
              <span>{selectedMedia.event}</span>
              <strong>{selectedMedia.label}</strong>
            </div>
          </div>
        </div>
      )}

      <section className="hm-signal" id="about" aria-labelledby="hm-signal-title">
        <div className="hm-signal-inner">
          <div className="hm-signal-head">
            <div>
              <h2 className="hm-signal-title" id="hm-signal-title">
                NOT JUST AN EVENT.
                <br />
                AN <span>EXPERIENCE.</span>
              </h2>
            </div>

            <p className="hm-signal-copy">
              Headless Mary creates experiences at the intersection of music,
              art, nightlife and culture—from intimate gatherings to
              full-scale raves, exhibitions and unexpected collaborations.
              Spaces where people come to connect, discover, and let the night
              take its course.
              <strong>SHOW UP. GET LOST. LEAVE WITH A STORY.</strong>
            </p>
          </div>

          <div className="hm-signal-stats">
            {signalStats.map((stat) => (
              <div className="hm-signal-stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dispatch" id="dispatch">
        <div className="dispatch-top">
          <div>
            <h2>
              STAY IN RANGE
            </h2>

            <p className="sub">
              One email when the next room opens. Early access to tickets
              before they go public. No filler, no daily digest.
            </p>
          </div>

          <form className="subscribe">
            <label htmlFor="dispatch-email">Email address</label>
            <div className="hm-subscribe-field">
              <input
                id="dispatch-email"
                type="email"
                placeholder="you@example.com"
                required
              />
              <button type="submit">Join the list</button>
            </div>
          </form>
        </div>

        <div className="dispatch-bottom">
          <div className="brand">
            <div className="dispatch-brand-heading">
              <Link
                to="/"
                className="hm-logo-wrap"
                aria-label="Headless Mary home"
              >
                <img src={brandLogo} alt="Headless Mary" className="hm-logo" />
              </Link>
            </div>

            <p>
              Independent event intelligence, documentation and live culture
              from the places that still have something to say.
            </p>
          </div>

          <div className="hm-footer-navigation">
            <nav className="hm-footer-column" aria-label="Explore">
              <h3>Explore</h3>
              <a href="#archive">Events</a>
              <a href="#gallery">Archive</a>
              <a href="#about">About</a>
            </nav>
            <div className="hm-footer-column">
              <h3>Contact</h3>
              <div className="socials" aria-label="Social media links">
            <a
              href="https://www.instagram.com/headlessmaryevents/"
              aria-label="Instagram @headlessmaryevents"
              target="_blank"
              rel="noreferrer"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect
                  x="3.5"
                  y="3.5"
                  width="17"
                  height="17"
                  rx="5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4.2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle cx="17.1" cy="6.9" r="1.1" fill="currentColor" />
              </svg>
            </a>
            <a
              href="https://www.snapchat.com/add/headlessmary"
              aria-label="Snapchat @headlessmary"
              target="_blank"
              rel="noreferrer"
            >
              <FaSnapchatGhost aria-hidden="true" />
            </a>
            <a href="tel:08139121566" aria-label="Call 08139121566">
              <FaPhone aria-hidden="true" />
            </a>
            <a
              href="https://wa.me/2348139121566"
              aria-label="Message Headless Mary Events on WhatsApp"
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp aria-hidden="true" />
            </a>
              </div>
            </div>
          </div>
        </div>

        <div className="copyright">
          <span>© 2026 HEADLESS MARY</span>
          <Link to="/privacy-policy">PRIVACY POLICY</Link>
          <span>POWERED BY PICASSO MEDIA HUB</span>
        </div>
      </section>
    </div>
  );
}
