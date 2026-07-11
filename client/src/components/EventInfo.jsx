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
    <section id="event-info" className="bg-black py-16 sm:py-20 lg:py-24">
      <div className="max-w-280 mx-auto px-5 sm:px-6 lg:px-8">

        {/* Heading */}
        <p className="font-['Cormorant_Garamond'] text-[#C89A3D] text-[34px] sm:text-[44px] md:text-[50px] lg:text-[55px] leading-tight lg:leading-[0.92] text-center lg:text-left">
        EVENT INFORMATION
        </p>

        <h2 className="text-center font-['Cormorant_Garamond'] text-[#C8922E] text-[40px] sm:text-[48px] md:text-[56px] lg:text-[60px] leading-none font-normal mb-10 sm:mb-12 lg:mb-14">
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
  );
}