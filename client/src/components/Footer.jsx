import { FaInstagram, FaSnapchatGhost } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-[#15110D]">
      <div className="mx-auto max-w-280 px-4 py-8 sm:px-6">

        <div className="grid grid-cols-1 gap-8 items-start md:grid-cols-3 md:gap-10">

          {/* Left */}
          <div className="text-center md:text-left">
            <h3 className="font-['Cormorant_Garamond'] text-[22px] leading-none text-[#C8922E] sm:text-[24px]">
              The Private View
            </h3>

            <p className="mt-3 text-[14px] text-[#B8B0A8] sm:text-[15px]">
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

            <p className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[14px] text-[#D8D2CB] md:justify-start sm:text-[15px]">
              <span>Instagram ·</span>

              <FaInstagram className="text-[#C8922E] text-[16px]" />

              <span className="text-[#C8922E]">
                @headlessmaryevents
              </span>
            </p>

            <p className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[14px] text-[#D8D2CB] md:justify-start sm:text-[15px]">
              <span>Snapchat ·</span>

              <FaSnapchatGhost className="text-[#C8922E] text-[16px]" />

              <a
                href="https://www.snapchat.com/add/headlessmary"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C8922E] no-underline"
              >
                @headlessmary
              </a>
            </p>
          </div>

          {/* Right */}
          <div className="text-center md:text-right">
            <p className="text-[14px] text-[#A89E93] sm:text-[15px]">
              © 2026 Headless Mary Events. Strictly private.
            </p>

            <p className="mt-2 text-[10px] font-medium text-[#C8922E] sm:text-[11px]">
              Powered by Picasso Media Hub
            </p>
          </div>

        </div>

      </div>
    </footer>
  );
}