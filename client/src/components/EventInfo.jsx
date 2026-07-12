import { useEffect, useState } from "react";
import { formatEventTime, getEventSettings } from "../services/eventSettings";

import calendar from "../assets/icon-calendar.png";
import location from "../assets/icon-location.png";
import ticket from "../assets/ticket.png";
import rides from "../assets/ride.png";

export default function EventInfo() {
  const [settings, setSettings] = useState(getEventSettings);

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

    <section id="event-info" className="bg-black py-16 sm:py-20 lg:py-24">
      <div className="max-w-280 mx-auto px-5 sm:px-6 lg:px-8">

        {/* Heading */}
        <p className="mb-8 text-center uppercase tracking-[0.35em] text-[12px] font-semibold text-[#C89A3D] lg:text-left animate-[eventInfoFadeUp_0.6s_ease-out_both]">
        
         EVENT INFORMATION
        </p>
<h2 className="mb-10 text-center font-['Cormorant_Garamond'] text-[34px] leading-tight text-[#C89A3D] sm:text-[44px] md:text-[50px] lg:mb-14 lg:text-left lg:text-[55px] lg:leading-[0.92] animate-[eventInfoFadeUp_0.7s_ease-out_0.1s_both]">
 
         Everything you need to know
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

          {cards.map((card) => (
            <div
              key={card.label}
              className="
                bg-[#120F0B]
                border
                border-[#23170E]
                rounded-2xl
                min-h-42
                px-5
                sm:px-6
                py-7
                flex
                flex-col
                items-center
                justify-center
                text-center
                transition-all
                duration-300
                animate-[eventInfoFadeUp_0.8s_ease-out_both]
                hover:border-[#C8922E]
                hover:-translate-y-1
              "
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

               <h3 className="mt-4 font-['Cormorant_Garamond'] text-[24px] lg:text-[28px] text-[#ECE7E1] leading-none font-normal whitespace-nowrap">
               {card.title}
              </h3>

              <p className="mt-3 text-[15px] leading-6 text-[#8B847D] max-w-45">
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