import { Link } from "react-router-dom";

import artImage from "../assets/art.jpeg";
import useOnScreen from "../hooks/useOnScreen";
import indulgenceImage from "../assets/indulgence.jpeg";

export default function ReserveTicket() {
  const [ref, isVisible] = useOnScreen();

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
    <>
      <style>{`
        @keyframes ticketFadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    <section
      id="tickets"
      ref={ref}
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
                className="w-full rounded-2xl object-cover border border-[#24180D]"
              />

              <Link
                to="/buy-ticket"
                className="
                  h-10
                  w-full
                  max-w-56
                  rounded-none
                  bg-linear-to-r
                  from-[#F3D084]
                  via-[#DFA03B]
                  to-[#F2D28D]
                  flex
                  items-center
                  justify-center
                  px-3
                  text-center
                  uppercase
                  tracking-[0.16em]
                  text-black
                  text-[10px]
                  sm:h-11
                  sm:max-w-[16rem]
                  sm:px-4
                  sm:text-[11px]
                  lg:max-w-[18rem]
                  lg:text-sm
                  font-semibold
                  shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_12px_30px_rgba(223,160,59,0.25)]
                  transition-all
                  duration-300
                  ${isVisible ? "animate-[ticketFadeUp_0.6s_ease-out_both]" : "opacity-0"}
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
    </>
  );
}