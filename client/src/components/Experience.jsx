import { Link } from "react-router-dom";

import art from "../assets/art.png";
import useOnScreen from "../hooks/useOnScreen";
import cocktail from "../assets/cocktail.png";
import music from "../assets/music.png";
import camera from "../assets/camera.png";
import paint from "../assets/paint.png";
import tattoo from "../assets/tatto.png";
import performance from "../assets/performance.png";
import ride from "../assets/ride.png";

const experiences = [
  { image: art, title: "Art Exhibition" },
  { image: cocktail, title: "Signature Cocktails" },
  { image: music, title: "Music by DJ Switchy" },
  { image: camera, title: "360° Camera" },
  { image: paint, title: "Sip & Paint" },
  { image: tattoo, title: "Tattoos by Wicked Unclevee" },
  { image: performance, title: "Live Performances" },
  { image: ride, title: "Complimentary Rides" },
];

export default function Experience() {
  const [ref, isVisible] = useOnScreen();

  return (
    <>
      <style>{`
        @keyframes experienceFadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    <section id="experience" ref={ref} className="bg-black py-16 sm:py-20 lg:py-24 xl:py-20">
      <div className="max-w-280 mx-auto px-5 sm:px-6 lg:px-8">

        {/* Heading */}
        <p className={`mb-8 text-center uppercase tracking-[0.35em] text-[12px] font-semibold text-[#C89A3D] transition-all duration-700 lg:text-left ${isVisible ? "translate-y-0 opacity-100 animate-[experienceFadeUp_0.6s_ease-out_both]" : "translate-y-6 opacity-0"}`}>
         Event Highlights
        </p>
        
       <h2 className={`mb-10 font-['Cormorant_Garamond'] text-[34px] leading-tight text-[#C89A3D] text-center transition-all duration-700 sm:text-[44px] md:text-[50px] lg:mb-14 lg:text-left lg:text-[55px] lg:leading-[0.92] ${isVisible ? "translate-y-0 opacity-100 animate-[experienceFadeUp_0.7s_ease-out_0.1s_both]" : "translate-y-6 opacity-0"}`}>
  The Experience
</h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {experiences.map((item) => (
            <div
              key={item.title}
              className={`
                bg-[#120F0B]
                border border-[#23170E]
                rounded-2xl
                min-h-55
                px-6
                py-8
                flex
                flex-col
                items-center
                justify-center
                text-center
                transition-all duration-700
                ${isVisible ? "translate-y-0 opacity-100 animate-[experienceFadeUp_0.8s_ease-out_both]" : "translate-y-6 opacity-0"}
                hover:border-[#C8922E]
                hover:bg-[#17120D]
                hover:-translate-y-2
              `}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-20 object-contain mb-6"
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(61%) sepia(93%) saturate(392%) hue-rotate(7deg) brightness(97%) contrast(92%)",
                }}
              />

              <h3 className="text-[20px] sm:text-[22px] leading-7 font-medium text-[#ECE7E1]">
                {item.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center lg:items-start gap-5 text-center lg:text-left">
         <Link
  to="/buy-ticket"
  className={`inline-flex w-auto transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100 animate-[experienceFadeUp_0.9s_ease-out_0.2s_both]" : "translate-y-6 opacity-0"} bg-[#D8A74E] hover:bg-[#C89A3D] text-black uppercase tracking-[0.18em] text-[11px] font-semibold px-6 py-3 justify-center`}
>
  Reserve Ticket
</Link>

        </div>

      </div>
    </section>
    </>
  );
}