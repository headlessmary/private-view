import { Link } from "react-router-dom";

import art from "../assets/experience/art.png";
import cocktail from "../assets/experience/cocktail.png";
import music from "../assets/experience/music.png";
import camera from "../assets/experience/camera.png";
import paint from "../assets/experience/paint.png";
import tattoo from "../assets/experience/tattoo.png";
import performance from "../assets/experience/performance.png";
import ride from "../assets/experience/ride.png";

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
min-h-45
px-6
py-8
flex
flex-col
justify-center
transition-all
duration-300
hover:border-[#C8922E]
hover:bg-[#17120D]
hover:-translate-y-2
"
            >
              <div className="mb-5">
  <img
  src={item.image}
  alt={item.title}
  className="w-16 h-16 object-contain mb-6"
  style={{
    filter:
      "brightness(0) saturate(100%) invert(69%) sepia(35%) saturate(805%) hue-rotate(7deg) brightness(95%) contrast(90%)",
  }}
/>
</div>

              <h3 className="text-[18px] sm:text-[20px] leading-7 sm:leading-8 font-medium text-[#ECE7E1]">
                {item.title}
              </h3>
            </div>
          ))}

        </div>

        {/* Button */}
        <div className="flex justify-center mt-12 sm:mt-14 lg:mt-16">
          <Link
            to="/buy-ticket"
            className="
              w-full
              sm:w-auto
              flex
              items-center
              justify-center
              px-8
              sm:px-10
              lg:px-12
              h-12
              sm:h-14
              rounded-lg
              bg-linear-to-r
              from-[#C8922E]
              via-[#E6B75A]
              to-[#F4CC80]
              text-black
              uppercase
              tracking-[0.2em]
              sm:tracking-[0.3em]
              text-xs
              sm:text-sm
              font-semibold
              transition-all
              duration-300
              hover:brightness-110
            "
          >
            Reserve My Seat
          </Link>
        </div>

      </div>
    </section>
  );
}