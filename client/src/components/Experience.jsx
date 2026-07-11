import { Link } from "react-router-dom";

const experiences = [
  { icon: "🎨", title: "Art Exhibition" },
  { icon: "🍸", title: "Signature Cocktails" },
  { icon: "🎵", title: "Music by DJ Switchy" },
  { icon: "📸", title: "360° Camera" },
  { icon: "🖌️", title: "Sip & Paint" },
  { icon: "🖋️", title: "Tattoos by Wicked Unclevee" },
  { icon: "🎤", title: "Live Performances" },
  { icon: "🚗", title: "Complimentary Rides" },
];

export default function Experience() {
  return (
    <section id="experience" className="bg-black py-16 sm:py-20 lg:py-24 xl:py-20">
      <div className="max-w-280 mx-auto px-5 sm:px-6 lg:px-8">

        {/* Heading */}
        <h4 className="uppercase tracking-[0.35em] text-[5px] sm:text-[12px] font-semibold text-[#C89A3D] mb-8 lg:mb-12 text-center lg:text-center">
           Event Highlights
        </h4>
        
        <p className="text-center font-['Cormorant_Garamond'] text-[#C8922E] text-[40px] sm:text-[48px] md:text-[56px] lg:text-[60px] leading-none font-normal mb-10 sm:mb-12 lg:mb-14">
          The Experience
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

          {experiences.map((item) => (
            <div
              key={item.title}
              className="
                bg-[#120F0B]
                border
                border-[#23170E]
                rounded-2xl
                min-h-35
                sm:min-h-36.25
                px-5
                sm:px-6
                py-6
                sm:py-7
                flex
                flex-col
                justify-center
                transition-all
                duration-300
                hover:border-[#C8922E]
                hover:-translate-y-1
              "
            >
              <div className="text-[28px] sm:text-[30px] mb-4 sm:mb-5">
                {item.icon}
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