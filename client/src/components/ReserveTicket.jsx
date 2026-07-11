import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

import artImage from "../assets/art.jpeg";
import indulgenceImage from "../assets/indulgence.jpeg";

export default function ReserveTicket() {
  const tickets = [
    {
      label: "THE FULL PRIVATE VIEW EXPERIENCE",
      title: "Art Ticket",
      image: artImage,
      price: "₦55,000",
      button: "Reserve Art Ticket",
      features: [
        "Exhibition access",
        "Interactive session",
        "Cocktails",
        "Finger foods",
        "After party",
        "360° cam & photo booth",
      ],
    },
    {
      label: "EVERYTHING, ELEVATED",
      title: "Indulgence Ticket",
      image: indulgenceImage,
      price: "₦70,000",
      button: "Reserve Indulgence Ticket",
      features: [
        "Everything in Art Ticket",
        "Jay's Sip & Paint",
        "Tattoos by Wicked Unclevee",
        "Priority entry",
        "Reserved lounge seating",
      ],
    },
  ];

  return (
    <section
      id="tickets"
      className="bg-black py-16 sm:py-20 lg:py-24"
    >
      <div className="max-w-280 mx-auto px-5 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center">

          <p className="uppercase tracking-[0.35em] text-[12px] font-semibold text-[#C8922E]">
            RESERVE YOUR TICKET
          </p>

          <h2 className="mt-4 font-['Cormorant_Garamond'] text-[#C8922E] text-[40px] sm:text-[48px] md:text-[56px] lg:text-[60px] leading-none font-normal">
            Tickets
          </h2>

          <p className="mt-5 text-[#AFA8A2] text-base sm:text-lg lg:text-[20px]">
            Two tiers. Sixty seats. Once they're gone, they're gone.
          </p>

        </div>

        {/* Cards */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-7">

          {tickets.map((ticket) => (
            <div
              key={ticket.title}
              className="
                rounded-2xl
                border
                border-[#24180D]
                bg-[#120F0B]
                p-6
                sm:p-7
                lg:p-8
                flex
                flex-col
              "
            >

              <p className="uppercase tracking-[0.35em] text-[11px] font-semibold text-[#C8922E]">
                {ticket.label}
              </p>

              <img
                src={ticket.image}
                alt={ticket.title}
                className="mt-5 h-44 w-full rounded-xl object-cover"
              />

              <h3 className="mt-4 font-['Cormorant_Garamond'] text-[#ECE6E0] text-[36px] lg:text-[42px] leading-none font-normal">
                {ticket.title}
              </h3>

              <div className="mt-6 flex items-end gap-2">

                <span className="font-['Cormorant_Garamond'] text-[#D9A03A] text-[46px] lg:text-[54px] leading-none">
                  {ticket.price}
                </span>

                <span className="text-[#9D958E] mb-1 text-sm">
                  / ticket
                </span>

              </div>

              <ul className="mt-8 space-y-4 flex-1">

                {ticket.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-[#D7D3CF] text-[17px]"
                  >
                    <FaStar className="text-[#D9A03A] text-[10px] shrink-0" />

                    <span>{feature}</span>
                  </li>
                ))}

              </ul>

              <Link
                to="/buy-ticket"
                className="
                  mt-10
                  h-13
                  w-full
                  rounded-lg
                  bg-linear-to-r
                  from-[#F3D084]
                  via-[#DFA03B]
                  to-[#F2D28D]
                  flex
                  items-center
                  justify-center
                  uppercase
                  tracking-[0.28em]
                  text-black
                  text-xs
                  sm:text-sm
                  font-semibold
                  transition-all
                  duration-300
                  hover:brightness-110
                "
              >
                {ticket.button}
              </Link>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}