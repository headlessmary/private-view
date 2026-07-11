import { FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-[#15110D]">
      <div className="max-w-280 mx-auto px-6 py-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">

          {/* Left */}
          <div className="text-center md:text-left">
            <h3 className="font-['Cormorant_Garamond'] text-[24px] leading-none text-[#C8922E]">
              The Private View
            </h3>

            <p className="mt-4 text-[15px] text-[#B8B0A8]">
              Art & Indulgence
            </p>
          </div>

          {/* Center */}
          <div className="text-center md:text-left">
            <p className="text-[13px] text-[#D8D2CB]">
              <span className="font-semibold">
                RSVP ·
              </span>{" "}
              <span className="text-[#C8922E] font-semibold">
                08139121566
              </span>
            </p>

            <p className="mt-3 text-[15px] text-[#D8D2CB] flex items-center justify-center md:justify-start gap-2">
              <span>Instagram ·</span>

              <FaInstagram className="text-[#C8922E] text-[16px]" />

              <span className="text-[#C8922E]">
                @headlessmaryevents
              </span>
            </p>
          </div>

          {/* Right */}
          <div className="text-center md:text-right">
            <p className="text-[15px] text-[#A89E93]">
              © 2026 Headless Mary Events. Strictly private.
            </p>

            <p className="mt-2 text-[10px] text-[#C8922E] font-medium">
              Powered by Picasso Media Hub
            </p>
          </div>

        </div>

      </div>
    </footer>
  );
}