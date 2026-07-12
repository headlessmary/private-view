import { useEffect, useState } from "react";
import { formatEventTime, getEventSettings } from "../services/eventSettings";
import useOnScreen from "../hooks/useOnScreen";

import calendar from "../assets/icon-calendar.png";
import location from "../assets/icon-location.png";
import ticket from "../assets/ticket.png";
import rides from "../assets/ride.png";

export default function EventInfo() {
  const [settings, setSettings] = useState(getEventSettings);
  const [ref, isVisible] = useOnScreen();

  useEffect(() => {
    const handleSettingsUpdate = () => setSettings(getEventSettings());
    window.addEventListener("event-settings-updated", handleSettingsUpdate);
    return () => window.removeEventListener("event-settings-updated", handleSettingsUpdate);
  }, []);

  const cards = [
    {
      icon: calendar,
      label: "DATE",
      title: "8th August 2026",
      subtitle: `Doors open ${formatEventTime(settings.eventTime)} WAT`,
    },
    {
      icon: location,
      label: "LOCATION",
      title: settings.venue,
      subtitle: "Exact venue revealed to ticket holders",
    },
    {
      icon: ticket,
      label: "CAPACITY",
      title: `${settings.maxCapacity || 60} Guests`,
      subtitle: "Strictly limited",
    },
    {
      icon: rides,
      label: "RIDES",
      title: "Complimentary",
      subtitle: "For all guests",
    },
  ];

  return (
    <>
      <style>{`
        @keyframes eventInfoFadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    <section id="event-info" ref={ref} className="bg-black py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Heading */}
        <p className={`mb-8 text-center uppercase tracking-[0.35em] text-[11px] font-semibold text-[#C89A3D] transition-all duration-700 sm:text-[12px] lg:text-left ${isVisible ? "translate-y-0 opacity-100 animate-[eventInfoFadeUp_0.6s_ease-out_both]" : "translate-y-6 opacity-0"}`}>
          EVENT INFORMATION
        </p>
        <h2 className={`mx-auto mb-10 max-w-3xl text-center font-['Cormorant_Garamond'] text-[30px] leading-tight text-[#C89A3D] transition-all duration-700 sm:text-[38px] md:text-[44px] lg:mx-0 lg:mb-14 lg:max-w-none lg:text-left lg:text-[55px] lg:leading-[0.92] ${isVisible ? "translate-y-0 opacity-100 animate-[eventInfoFadeUp_0.7s_ease-out_0.1s_both]" : "translate-y-6 opacity-0"}`}>
          Everything you need to know
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">

          {cards.map((card) => (
            <div
              key={card.label}
              className={`
                flex
                min-h-44
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                border-[#23170E]
                bg-[#120F0B]
                px-5
                py-7
                text-center
                transition-all duration-300
                sm:min-h-48
                sm:px-6
                lg:min-h-52
                ${isVisible ? "translate-y-0 opacity-100 animate-[eventInfoFadeUp_0.8s_ease-out_both]" : "translate-y-6 opacity-0"}
                hover:-translate-y-1
                hover:border-[#C8922E]
              `}
            >
              <div className="mb-4 flex items-center justify-center">
                <img
                  src={card.icon}
                  alt={card.label}
                  className="w-10 h-10 object-contain"
                  style={{
                    filter:
                      "brightness(0) saturate(100%) invert(69%) sepia(35%) saturate(805%) hue-rotate(7deg) brightness(95%) contrast(90%)",
                  }}
                />
              </div>

              <p className="uppercase tracking-[0.35em] text-[11px] font-semibold text-[#C8922E]">
                {card.label}
              </p>

              <h3 className="mt-4 max-w-full font-['Cormorant_Garamond'] text-[22px] leading-tight text-[#ECE7E1] sm:text-[24px] lg:text-[28px]">
                {card.title}
              </h3>

              <p className="mt-3 max-w-[16rem] text-[14px] leading-6 text-[#8B847D] sm:text-[15px]">
                {card.subtitle}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
    </>
  );
}