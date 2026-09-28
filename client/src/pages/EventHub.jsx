import { useCallback, useEffect, useRef, useState } from "react";
import { FaPhone, FaSnapchatGhost, FaWhatsapp } from "react-icons/fa";
import useScrollReveal from "../hooks/useScrollReveal";
import { Link } from "react-router-dom";
import {
  DEFAULT_SOCIETY_EVENT,
  fetchSocietyEvent,
  formatEventDateTime,
} from "../services/eventConfig";

import privateViewFlyer from "../assets/flyer.png";
import societyFlyer from "../assets/Headless society Ticket Policy.jpeg";
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

      <span className="hm-media-type">Film</span>
      <span className="hm-media-open" aria-hidden="true">
        ↗
      </span>
    </button>
  );
}

export default function EventHub() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [societyEvent, setSocietyEvent] = useState(DEFAULT_SOCIETY_EVENT);
  const [eventError, setEventError] = useState("");
  const [canScrollGalleryPrev, setCanScrollGalleryPrev] = useState(false);
  const [canScrollGalleryNext, setCanScrollGalleryNext] = useState(false);
  const galleryCarouselRef = useRef(null);
  useScrollReveal(".event-hub > .hm-navbar, .event-hub > section");

  useEffect(() => {
    let active = true;
    fetchSocietyEvent()
      .then((event) => {
        if (active) setSocietyEvent(event);
      })
      .catch((error) => {
        if (active) setEventError(error.message);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredMedia =
    activeFilter === "All"
      ? galleryMedia
      : galleryMedia.filter((item) => item.category === activeFilter);

  const updateGalleryControls = useCallback(() => {
    const carousel = galleryCarouselRef.current;
    if (!carousel) return;

    setCanScrollGalleryPrev(carousel.scrollLeft > 2);
    setCanScrollGalleryNext(
      carousel.scrollLeft + carousel.clientWidth < carousel.scrollWidth - 2,
    );
  }, []);

  useEffect(() => {
    const carousel = galleryCarouselRef.current;
    if (!carousel) return;

    carousel.scrollTo({ left: 0 });
    const frame = requestAnimationFrame(updateGalleryControls);
    window.addEventListener("resize", updateGalleryControls);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateGalleryControls);
    };
  }, [activeFilter, filteredMedia.length, updateGalleryControls]);

  const scrollGallery = (direction) => {
    const carousel = galleryCarouselRef.current;
    if (!carousel) return;

    const firstCard = carousel.querySelector(".hm-media");
    const gap = Number.parseFloat(getComputedStyle(carousel).columnGap) || 0;
    const distance = firstCard
      ? firstCard.getBoundingClientRect().width + gap
      : carousel.clientWidth;

    carousel.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

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
          font-size: 12px;
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
            rgba(0, 0, 0, 0.78) 0%,
            rgba(0, 0, 0, 0.58) 40%,
            rgba(0, 0, 0, 0.25) 100%
          );
        }

        .hm-hero-content {
          position: relative;
          z-index: 2;
          max-width: 1600px;
          margin: auto;
          padding: 110px 60px 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: calc(100vh - 86px);
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
          line-height: 0.88;
          font-family: Impact, "Arial Black", sans-serif;
          font-size: clamp(68px, 7.5vw, 150px);
          letter-spacing: -0.04em;
          color: var(--cream);
          text-shadow: 0 10px 0 rgba(255, 255, 255, 0.08);
        }

        .hm-hero .hm-hero-kicker {
          width: auto;
          margin: 0 0 22px;
          color: #00e676;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.2em;
          line-height: 1.4;
          text-transform: uppercase;
        }

        .hm-hero h1 .hm-hero-gold {
          color: #ffc629;
        }

        .hm-hero p {
          width: 560px;
          max-width: 100%;
          color: #c8c8c8;
          font-size: 19px;
          line-height: 1.7;
          margin: 28px 0 40px;
        }

        .hm-buttons {
          display: flex;
          gap: 18px;
        }

        .event-hub .hm-white-btn {
          background: #f4f0e8;
          color: #111;
          padding: 20px 30px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .event-hub .hm-white-btn:hover {
          color: #111;
          background: #ffc629;
        }

        .hm-outline-btn {
          border: 1px solid rgba(255, 255, 255, 0.4);
          color: #fff;
          padding: 20px 30px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.16em;
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

          .hm-radar-top {
            flex-direction: column;
            align-items: flex-start;
          }

          .hm-radar-grid {
            grid-template-columns: 1fr;
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
            font-size: 13px;
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
          gap: 30px;
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
          font-size: 14px;
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

        @media (max-width: 900px) {
          .hm-nav-inner {
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
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }

          .hm-radar-grid > .hm-large-card {
            grid-column: 1 / -1;
            min-height: 420px;
          }

          .hm-radar-grid > .hm-side-stack {
            display: contents;
          }

          .hm-radar-grid > .hm-side-stack > .hm-side-card {
            min-width: 0;
            min-height: clamp(230px, 64vw, 300px);
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
            padding: 14px;
            align-items: flex-start;
          }

          .hm-side-card .hm-status {
            padding: 6px 7px;
            max-width: calc(100% - 34px);
            font-size: 8px;
            letter-spacing: 0.08em;
          }

          .hm-side-card h4 {
            min-height: 3em;
            margin-bottom: 4px;
            width: 100%;
            font-size: 17px;
            line-height: 1;
            letter-spacing: -0.01em;
            text-align: left;
            overflow-wrap: anywhere;
          }

          .hm-side-card .hm-card-overlay p,
          .hm-side-card .hm-event-info {
            display: none;
          }

          .hm-side-card .hm-side-button {
            margin-top: 6px;
            padding: 7px 9px;
            font-size: 9px;
            letter-spacing: 0.08em;
          }

          .hm-side-card .hm-card-number {
            top: 12px;
            right: 12px;
            font-size: 22px;
          }

          .hm-side-card .hm-graduating-title {
            width: 116%;
            font-size: 18px;
            white-space: nowrap;
            letter-spacing: -0.035em;
            transform: scaleX(0.86);
            transform-origin: left center;
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
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            padding-top: 18px;
            padding-bottom: 18px;
            font-size: 9px;
            letter-spacing: 0.09em;
          }

          .pulse {
            gap: 30px;
            padding: 72px 20px;
          }

          .pulse-left h1 {
            font-size: clamp(52px, 13vw, 78px);
            line-height: 0.88;
            letter-spacing: -0.02em;
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

          .hm-hero-content {
            min-height: calc(100svh - 70px);
            padding: 54px 18px 24px;
          }

          .hm-hero h1 {
            font-size: clamp(38px, 10.5vw, 60px);
            line-height: 0.88;
          }

          .hm-hero .hm-hero-kicker {
            margin-bottom: 16px;
            font-size: 10px;
            letter-spacing: 0.14em;
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
      `}</style>

      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="hm-navbar">
        <div className="hm-nav-inner">
          <Link to="/" className="hm-logo-wrap" aria-label="Headless Mary home">
            <img src={brandLogo} alt="Headless Mary" className="hm-logo" />
          </Link>

          <nav className="hm-nav-links" aria-label="Main navigation">
            <a href="#archive">EVENTS</a>
            <a href="#gallery">ARCHIVE</a>
            <a href="#about">ABOUT</a>
          </nav>

          <a href="#dispatch" className="hm-ticket-btn">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 8H17V16H7z" stroke="currentColor" strokeWidth="1.8" />
              <path
                d="M10 8V6M14 18V16M17 10H19M5 14H7"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
            CONTACT US
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
              EVENTS
            </a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)}>
              ARCHIVE
            </a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>
              ABOUT
            </a>
            <a
              href="#dispatch"
              className="hm-ticket-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              CONTACT US
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
          <p className="hm-hero-kicker">AN EXPERIENCE BEYOND THE ORDINARY</p>
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
              EXPLORE WHAT'S NEXT ↗
            </a>

            <a href="#gallery" className="hm-outline-btn">
              ENTER THE ARCHIVE →
            </a>
          </div>

          <div className="hm-bottom-row" aria-hidden="true" />
        </div>

        <div className="hm-slide-number">01 / 04</div>
      </section>
      <div className="hm-marquee" aria-label="Headless Mary brand values">
        <div className="hm-marquee-track">
          {[
            "HEADLESS MARY",
            "LIVE CULTURE",
            "HARD SOUND",
            "GOOD PEOPLE",
            "NO REPEATS",
            "HEADLESS MARY",
            "LIVE CULTURE",
            "HARD SOUND",
            "GOOD PEOPLE",
            "NO REPEATS",
          ].map((item, i) => (
            <span key={i}>
              {item}
              <b>✦</b>
            </span>
          ))}
        </div>
      </div>

      <section className="hm-radar" id="archive">
        <div className="hm-radar-top">
          <div>
            <p>01 / ON THE RADAR</p>

            <h2>
              <span className="hm-radar-make">THE</span>{" "}
              <span className="hm-radar-night">NIGHT NEVER</span>
              <span className="hm-radar-rest">STANDS STILL.</span>
            </h2>
          </div>

          <div className="hm-radar-copy">
            From the nights we've lived to the ones still waiting to happen.
            Every event is another chapter in the Headless Mary story.
          </div>
        </div>

        <div className="hm-radar-grid">
          <Link to="/private-view" className="hm-large-card">
            <img src={privateViewFlyer} alt="The Private View" />

            <div className="hm-card-overlay">
              <span className="hm-status ended">ENDED</span>

              <h3>THE PRIVATE VIEW</h3>

              <p>
                A midnight collision of sound, light and 2,400 people who
                refused to go home.
              </p>

              <div className="hm-event-info">
                <strong>18.10.24</strong>
                <span>ASABA, DELTA STATE</span>
              </div>

              <div className="hm-card-number">01</div>
            </div>
          </Link>

          <div className="hm-side-stack">
            <Link to="/headless-society" className="hm-side-card">
              <img src={societyFlyer} alt={societyEvent.eventName} />

              <div className="hm-card-overlay">
                <span className={`hm-status ${eventError ? "ended" : "live"}`}>
                  {eventError
                    ? "EVENT DETAILS UNAVAILABLE"
                    : "TICKETS AVAILABLE"}
                </span>

                <h4>{societyEvent.eventName.toUpperCase()}</h4>

                <p>
                  Bass pressure, industrial architecture and a lineup built for
                  the front row.
                </p>

                <div className="hm-event-info">
                  <strong>
                    {formatEventDateTime(societyEvent.eventDateTime)}
                  </strong>
                  <span>{societyEvent.venue.toUpperCase()}</span>
                </div>

                <span className="hm-side-button">TICKETS ↗</span>

                <div className="hm-card-number">02</div>
              </div>
            </Link>

            <button
              type="button"
              className="hm-side-card"
              aria-label="Watch Graduating Into Summer live video"
              onClick={() =>
                setSelectedMedia({
                  type: "video",
                  event: "Graduating Into Summer",
                  label: "Live Broadcast",
                  src: galleryVideoOne,
                })
              }
            >
              <video src={galleryVideoOne} autoPlay muted loop playsInline />

              <div className="hm-card-overlay">
                <span className="hm-status live">LIVE NOW</span>

                <h4 className="hm-graduating-title">GRADUATING INTO SUMMER</h4>

                <p>
                  The live broadcast is moving now. Tap in before the last
                  transmission fades.
                </p>

                <div className="hm-event-info">
                  <strong>08.08.25</strong>
                  <span>LAGOS, NIGERIA</span>
                </div>

                <span className="hm-side-button">WATCH LIVE</span>

                <div className="hm-card-number">03</div>
              </div>
            </button>
          </div>
        </div>
      </section>

      <section className="hm-timeline">
        <div className="hm-time-head">
          <p>02 / THE RUN OF SHOW</p>

          <div className="hm-title-row">
            <h2>
              KEEP
              <br />
              <span>TRACK. CHANGE IT</span>
            </h2>

            <div className="hm-head-copy">
              Past, present and next. The signal never stops — it just changes
              frequency.
            </div>
          </div>
        </div>

        <div className="hm-run-list">
          <div className="hm-run-row">
            <div className="hm-date-block">
              <span className="hm-date-badge">JULY 4TH, 2026</span>
            </div>

            <div className="hm-row-main">
              <h3 className="hm-row-title">Buss 22</h3>
            </div>

            <div className="hm-row-status ended">ENDED</div>
          </div>

          <div className="hm-run-row">
            <div className="hm-date-block">
              <span className="hm-date-badge">JULY 25TH, 2026</span>
            </div>

            <div className="hm-row-main">
              <h3 className="hm-row-title">Warehouse Rave</h3>
            </div>

            <div className="hm-row-status ended">ENDED</div>
          </div>

          <div className="hm-run-row">
            <div className="hm-date-block">
              <span className="hm-date-badge">AUGUST 4TH, 2026</span>
            </div>

            <div className="hm-row-main">
              <h3 className="hm-row-title">Graduating Into Summer</h3>
            </div>

            <div className="hm-row-status ended">ENDED</div>
          </div>

          <div className="hm-run-row">
            <div className="hm-date-block">
              <span className="hm-date-badge">AUGUST 8TH, 2026</span>
            </div>

            <div className="hm-row-main">
              <h3 className="hm-row-title">Private View</h3>
            </div>

            <div className="hm-row-status ended">ENDED</div>
          </div>
        </div>
      </section>

      <section className="hm-proof" id="gallery">
        <div className="hm-proof-head">
          <div>
            <p>03 / ARCHIVE</p>
            <h2>
              PROOF
              <br />
              <span>OF LIFE.</span>
            </h2>
          </div>

          <div className="hm-proof-copy">
            The nights disappear. The evidence stays.
          </div>
        </div>

        <div className="hm-filter-row">
          {galleryTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`hm-filter ${activeFilter === tab ? "active" : ""}`}
              onClick={() => setActiveFilter(tab)}
              aria-pressed={activeFilter === tab}
            >
              {tab}
            </button>
          ))}
          <div className="hm-carousel-controls">
            <span className="hm-frame-count" aria-live="polite">
              {filteredMedia.length}{" "}
              {filteredMedia.length === 1 ? "frame" : "frames"}
            </span>
            <button
              type="button"
              className="hm-carousel-arrow"
              aria-label="Previous gallery items"
              disabled={!canScrollGalleryPrev}
              onClick={() => scrollGallery(-1)}
            >
              ←
            </button>
            <button
              type="button"
              className="hm-carousel-arrow"
              aria-label="Next gallery items"
              disabled={!canScrollGalleryNext}
              onClick={() => scrollGallery(1)}
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={galleryCarouselRef}
          className="hm-carousel"
          aria-label="Event photo and video carousel"
          onScroll={updateGalleryControls}
        >
          {filteredMedia.map((item) =>
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

                <span className="hm-media-type">Photo</span>
                <span className="hm-media-open" aria-hidden="true">
                  ↗
                </span>
              </button>
            ),
          )}
        </div>
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

      <section className="pulse" id="about">
        <div className="pulse-left">
          <h1>
            NOT A <br />
            CALENDAR. <br />A <span>PULSE</span>
            <br />
            <span>CHECK.</span>
          </h1>
        </div>

        <div className="pulse-right">
          <div className="yellow-line" />

          <div className="pulse-content">
            <p>
              Headless Mary is an independent media hub for the live moments
              that refuse to be background noise. We find the rooms, people and
              sounds that move culture forward — then bring you right up to the
              barricade.
            </p>

            <h3>TURN UP. TUNE IN.</h3>
            <h3>STAY LATE.</h3>
          </div>
        </div>
      </section>

      <section className="dispatch" id="dispatch">
        <div className="dispatch-top">
          <div>
            <p className="section-label">04 / THE DISPATCH</p>

            <h2>
              STAY
              <br />
              <em>IN RANGE.</em>
            </h2>

            <p className="sub">
              One sharp email when the next room opens. No filler, no daily
              digest.
            </p>
          </div>

          <form className="subscribe">
            <svg
              className="dispatch-mail-icon"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.7" />
            </svg>
            <input type="email" placeholder="Your email address" required />
            <button type="submit">JOIN&nbsp; ↗</button>
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

        <div className="copyright">
          <span>© 2026 HEADLESS MARY</span>
          <span>POWERED BY PICASSO MEDIA HUB</span>
        </div>
      </section>
    </div>
  );
}
