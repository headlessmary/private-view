import { Link } from "react-router-dom";

import artImage from "../assets/art.jpeg";
import indulgenceImage from "../assets/indulgence.jpeg";

export default function ReserveTicket() {
  const tickets = [
    {
      title: "Art Ticket",
      image: artImage,
      button: "Reserve Art Ticket",
    },
    {
      title: "Indulgence Ticket",
      image: indulgenceImage,
      button: "Reserve Indulgence Ticket",
    },
  ];

  return (
    <section
      id="tickets"
      className="bg-black py-16 sm:py-20 lg:py-24"
    >
      <div className="max-w-280 mx-auto px-5 sm:px-6 lg:px-8">

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-6 lg:gap-7">
          {tickets.map((ticket) => (
            <div
              key={ticket.title}
              className="flex flex-col items-center gap-4 sm:gap-5"
            >
              <img
                src={ticket.image}
                alt={ticket.title}
                className="w-full rounded-2xl object-cover"
              />

              <Link
                to="/buy-ticket"
                className="
                  h-11
                  w-full
                  max-w-55
                  sm:max-w-65
                  lg:max-w-[320px]
                  rounded-none
                  bg-linear-to-r
                  from-[#F3D084]
                  via-[#DFA03B]
                  to-[#F2D28D]
                  flex
                  items-center
                  justify-center
                  uppercase
                  tracking-[0.24em]
                  text-black
                  text-[11px]
                  sm:text-sm
                  font-semibold
                  shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_12px_30px_rgba(223,160,59,0.25)]
                  transition-all
                  duration-300
                  hover:brightness-110
                  hover:-translate-y-0.5
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