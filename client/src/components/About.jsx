import flyer from "../assets/flyer.png";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="bg-black text-white py-16 lg:py-30"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* Section Label */}
        <p className="uppercase tracking-[0.35em] text-[5px] sm:text-[12px] font-semibold text-[#C89A3D] mb-8 lg:mb-12 text-center lg:text-left">
          ABOUT THE EVENT
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[620px_620px] gap-10 lg:gap-12 items-center">

          {/* Text */}
          <div className="max-w-full lg:max-w-155 text-center lg:text-left">

            <h2 className="font-['Cormorant_Garamond'] text-[#C89A3D] text-[36px] sm:text-[44px] md:text-[50px] lg:text-[55px] leading-none lg:leading-[0.92] font-normal">
              An escape into art, elegance & self-expression
            </h2>

            <div className="mt-5 lg:mt-8 space-y-3">

              <p className="max-w-md mx-auto lg:mx-0 lg:max-w-130 text-base sm:text-lg lg:text-[18px] leading-7 lg:leading-9 font-light text-[#D9D9D9]">
               The Private View: Art & Indulgence is an exclusive escape into the world of art, elegance, and 
               self-expression;
                a curated experience where creativity, culture, and luxury collide.
                 From captivating artworks and immersive conversations to signature cocktails, music, photo booths,
                  and unforgettable connections,The Private View: Art & Indulgence is designed for those who appreciate 
                  the finer side of life. 
              </p>

              <p className="max-w-md mx-auto lg:mx-0 lg:max-w-130 text-base sm:text-lg lg:text-[18px] leading-7 lg:leading-9 font-light text-[#A9A9A9]">
                 With complimentary rides to and from the event, every detail is curated to give you a seamless experience from arrival to the final moment. 
                 A private world of aesthetics, energy, and memories waiting to be captured.
              </p>

            </div>

          </div>

          {/* Flyer */}
<div className="flex justify-center lg:justify-end lg:pt-24">
  <img
    src={flyer}
    alt="The Private View Flyer"
    className="w-full max-w-140 sm:max-w-155 md:max-w-170 lg:w-190 rounded-[28px]"
  />
</div>

        </div>

      </div>
    </section>
  );
}