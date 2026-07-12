import flyer from "../assets/flyer.png";

export default function AboutSection() {
  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    <section
      id="about"
      className="bg-black text-white py-16 lg:py-30"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Label */}
  <p className="uppercase tracking-[0.35em] text-[12px] font-semibold text-[#C89A3D] mb-8 text-center lg:text-left">
  ABOUT THE EVENT
</p>

        <div className="grid grid-cols-1 lg:grid-cols-[620px_620px] gap-10 lg:gap-12 items-center">

          {/* Text */}
         <div className="max-w-full lg:max-w-155">

  <h2 className="mx-auto max-w-[12rem] font-['Cormorant_Garamond'] text-[22px] leading-tight text-center text-[#C89A3D] sm:max-w-none sm:text-[40px] md:text-[46px] lg:max-w-none lg:text-left lg:text-[55px] lg:leading-[0.92] animate-[fadeInUp_0.8s_ease-out]">
    An escape into art,elegance & self-expression
  </h2>

  <div className="mt-6 lg:mt-8 space-y-5 animate-[fadeInUp_1s_ease-out_0.15s_both]">

    <p className="max-w-none text-left text-[15px] leading-7 text-[#D9D9D9] sm:text-[16px] sm:leading-8 lg:max-w-130 lg:text-[18px]">
      The Private View: Art & Indulgence is an exclusive escape into the world of art,
      elegance, and self-expression; a curated experience where creativity, culture,
      and luxury collide. From captivating artworks and immersive conversations to
      signature cocktails, music, photo booths, and unforgettable connections,
      The Private View: Art & Indulgence is designed for those who appreciate the
      finer side of life.
    </p>

    <p className="max-w-none text-left text-[15px] leading-7 text-[#A9A9A9] sm:text-[16px] sm:leading-8 lg:max-w-130 lg:text-[18px]">
      With complimentary rides to and from the event, every detail is curated to
      give you a seamless experience from arrival to the final moment. A private
      world of aesthetics, energy, and memories waiting to be captured.
    </p>

  </div>

</div>

          {/* Flyer */}
<div className="flex justify-center lg:justify-end lg:pt-24">
  <img
    src={flyer}
    alt="The Private View Flyer"
    className="w-full max-w-[320px] rounded-3xl sm:max-w-90 sm:rounded-[28px] md:max-w-105 lg:max-w-140 lg:w-190 animate-[fadeInUp_1s_ease-out_0.25s_both]"
  />
</div>

        </div>

      </div>
    </section>
    </>
  );
}