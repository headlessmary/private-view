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
            transform: translateY(22px);
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
                className={`
                  flex
                  h-12
                  w-full
                  max-w-[16rem]
                  items-center
                  justify-center
                  rounded-none
                  bg-linear-to-r
                  from-[#F3D084]
                  via-[#DFA03B]
                  to-[#F2D28D]
                  px-4
                  text-center
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-black
                  shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_12px_30px_rgba(223,160,59,0.25)]
                  transition-all
                  duration-500
                  sm:h-14
                  sm:max-w-[18rem]
                  sm:px-6
                  sm:text-[11px]
                  lg:h-14
                  lg:max-w-[20rem]
                  lg:px-8
                  lg:text-sm
                  ${isVisible ? "translate-y-0 opacity-100 animate-[ticketFadeUp_0.95s_ease-out_both]" : "translate-y-6 opacity-0"}
                  hover:brightness-110
                  hover:-translate-y-0.5
                `}
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