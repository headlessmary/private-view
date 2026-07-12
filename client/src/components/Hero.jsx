import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import image from "../assets/hero.jpg";
import calendarIcon from "../assets/icon-calendar.png";
import locationIcon from "../assets/icon-location.png";
import {  getEventSettings } from "../services/eventSettings";

export default function HeroSection() {
  const [settings, setSettings] = useState(getEventSettings);

  useEffect(() => {
    const handleSettingsUpdate = () => setSettings(getEventSettings());
    window.addEventListener("event-settings-updated", handleSettingsUpdate);
    return () => window.removeEventListener("event-settings-updated", handleSettingsUpdate);
  }, []);

  const calculateTimeLeft = useCallback(() => {
    const eventDate = new Date(`2026-08-08T${settings.eventTime || "20:00"}:00`);
    const difference = eventDate - new Date();

    if (difference <= 0) {
      return {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      };
    }

    return {
      days: String(
        Math.floor(difference / (1000 * 60 * 60 * 24))
      ).padStart(2, "0"),
      hours: String(
        Math.floor((difference / (1000 * 60 * 60)) % 24)
      ).padStart(2, "0"),
      minutes: String(
        Math.floor((difference / (1000 * 60)) % 60)
      ).padStart(2, "0"),
      seconds: String(
        Math.floor((difference / 1000) % 60)
      ).padStart(2, "0"),
    };
  }, [settings.eventTime]);

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return (
    <>
      <style>{`
        @keyframes heroFadeUp {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-animate {
          animation: heroFadeUp 1.05s ease-out both;
        }

        .hero-animate-delay {
          animation: heroFadeUp 1.2s ease-out 0.16s both;
        }
      `}</style>

    <section className="min-h-screen bg-black text-white pt-10 sm:pt-32 lg:pt-6">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8 lg:px-12 py-10 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 xl:gap-24 items-center">

          {/* LEFT SIDE */}
          <div className="hero-animate w-full max-w-xl mx-auto lg:mx-0">

            {/* Badge */}
               <div className="flex justify-center lg:justify-start">
  <div className="inline-block border border-[#C89A3D]/40 px-4 py-2">
    <p className="text-[10px] md:text-[11px] uppercase tracking-[0.28em] font-medium text-[#C89A3D] text-center">
      Exclusive Party • Limited Tickets
    </p>
  </div>
</div>

            
             {/* Title */}

       <h1 className="mt-8 font-['Cormorant_Garamond'] text-[#C89A3D] leading-tight text-center lg:text-left">
  {/* Mobile */}
  <span className="block sm:hidden text-[28px] whitespace-nowrap">
    The Private View: Art & Indulgence
  </span>

  {/* Tablet & Desktop */}
  <>
    <span className="hidden sm:block text-5xl lg:text-6xl xl:text-[68px]">
      {settings.eventName || "The Private View"}:
    </span>

    <span className="hidden sm:block text-5xl lg:text-6xl xl:text-[68px]">
      Art & Indulgence
    </span>
  </>
</h1>      
            {/* Event Details */}
           
           <div className="mt-6 space-y-5 text-center lg:text-left">
<div className="mt-6 flex items-center justify-center lg:justify-start gap-3 sm:gap-6 text-[10px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.18em] font-medium text-[#A6A6A6] whitespace-nowrap">
 <div className="flex items-center gap-2">
    <img
      src={calendarIcon}
      alt="Calendar"
      className="w-5 h-5 object-contain shrink-0"
       style={{
    filter:
      "brightness(0) saturate(100%) invert(69%) sepia(35%) saturate(805%) hue-rotate(7deg) brightness(95%) contrast(90%)",
  }}
    />
    <span>8th August 2026</span>
  </div>

  <div className="flex items-center gap-2">
    <img
      src={locationIcon}
      alt="Location"
      className="w-5 h-5 object-contain shrink-0"
       style={{
    filter:
      "brightness(0) saturate(100%) invert(69%) sepia(35%) saturate(805%) hue-rotate(7deg) brightness(95%) contrast(90%)",
  }}
    />
    <span>{settings.venue}</span>
  </div>

</div>

  <p className="mx-auto lg:mx-0 max-w-md lg:max-w-xl text-center lg:text-left text-base sm:text-lg lg:text-2xl leading-7 lg:leading-9 font-light text-[#D9D9D9]">
    Only <span className="text-[#C89A3D] font-medium">{settings.maxCapacity || 60} guests.</span> One
    night of art, sound, ink and indulgence presented by{" "}
    <span className="text-[#C89A3D] font-medium">
      Headless Mary Events.
    </span>
  </p>

</div>

            {/* Countdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 max-w-md lg:max-w-xl mx-auto lg:mx-0">
              {[
                [timeLeft.days, "Days"],
                [timeLeft.hours, "Hours"],
                [timeLeft.minutes, "Minutes"],
                [timeLeft.seconds, "Seconds"],
              ].map(([value, label]) => (
                <div
                  key={label}
                 className="border border-[#2A1C08] bg-[#0C0A08] h-20 sm:h-24  md:h-28 flex flex-col items-center justify-center">
                  <div className="font-['Cormorant_Garamond'] text-[#C89A3D] text-3xl sm:text-4xl md:text-5xl">
                    {value}
                  </div>

                  <div className="mt-2 text-[10px] uppercase tracking-[0.24em] font-medium text-[#787878]">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-center lg:justify-start lg:items-start lg:text-left">
              <Link
                to="/buy-ticket"
                className="inline-flex min-w-48 items-center justify-center rounded-none bg-[#D8A74E] px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-black transition duration-300 hover:bg-[#C89A3D] sm:min-w-56 sm:px-10 sm:py-4 sm:text-[13px] lg:min-w-60 lg:px-12 lg:py-5 lg:text-[14px]"
              >
                Reserve Ticket
              </Link>
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="hero-animate-delay order-first lg:order-last flex justify-center mb-6 lg:mb-0 lg:justify-end">
            <img
  src={settings.flyer || image}
  alt={settings.eventName || "The Private View"}
  className="w-full max-w-70 sm:max-w-85 md:max-w-105 lg:max-w-120 xl:max-w-130 border border-[#1A1205] shadow-2xl object-cover"
/>
            </div>

        </div>
      </div>
    </section>
    </>
  );
}