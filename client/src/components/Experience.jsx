import { Link } from "react-router-dom";

import art from "../assets/art.png";
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
  return (
    <section id="experience" className="bg-black py-16 sm:py-20 lg:py-24 xl:py-20">
      <div className="max-w-280 mx-auto px-5 sm:px-6 lg:px-8">

        {/* Heading */}
        <p className="uppercase tracking-[0.35em] text-[12px] font-semibold text-[#C89A3D] mb-8 text-center lg:text-left">
         Event Highlights
        </p>
        
       <h2 className="font-['Cormorant_Garamond'] text-[#C89A3D] text-[34px] sm:text-[44px] md:text-[50px] lg:text-[55px] leading-tight lg:leading-[0.92] text-center lg:text-left mb-10 lg:mb-14">
  The Experience
</h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {experiences.map((item) => (
            <div
              key={item.title}
              className="
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
                transition-all
                duration-300
                hover:border-[#C8922E]
                hover:bg-[#17120D]
                hover:-translate-y-2
              "
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
  className="inline-flex w-auto bg-[#D8A74E] hover:bg-[#C89A3D] text-black uppercase tracking-[0.18em] text-[11px] font-semibold px-6 py-3 transition duration-300 justify-center"
>
  Reserve Ticket
</Link>

        </div>

      </div>
    </section>
  );
}