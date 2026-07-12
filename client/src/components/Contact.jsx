import {
  FaPhoneAlt,
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa";

export default function ContactPage() {
  return (
    <section
      id="contact"
      className="bg-black text-white py-16 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-10">

          {/* LEFT */}
          <div className="text-center lg:text-left">

            <p className="uppercase tracking-[0.35em] text-[11px] sm:text-[12px] font-semibold text-[#C89A3D] mb-5">
              GET IN TOUCH
            </p>

            <h2 className="font-['Cormorant_Garamond'] text-[#C89A3D] text-[42px] sm:text-[54px] lg:text-[64px] leading-none font-normal">
              Contact
            </h2>

            <p className="mt-5 text-[#B6B2AE] text-base sm:text-lg leading-8 lg:leading-9 max-w-lg mx-auto lg:mx-0">
              Questions, private-table requests, or press enquiries reach us directly.
            </p>

            <div className="mt-10 space-y-4">

              {/* Phone */}
              <div className="bg-[#120F0B] border border-[#22170D] rounded-2xl p-5 flex items-center gap-4">

                <FaPhoneAlt className="text-[#C89A3D] text-2xl sm:text-3xl shrink-0" />

                <div>
                  <p className="uppercase tracking-[0.28em] text-[11px] sm:text-[12px] text-[#C89A3D]">
                    Phone / RSVP
                  </p>

                  <a
                    href="tel:08139121566"
                    className="text-base sm:text-[18px] text-[#ECE7E1] font-medium no-underline"
                  >
                    08139121566
                  </a>
                </div>

              </div>

              {/* WhatsApp */}
              <a
                href="https://wa.me/2348139121566"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#120F0B] border border-[#22170D] rounded-2xl p-5 flex items-center gap-4 no-underline hover:border-[#C89A3D] transition"
              >

                <FaWhatsapp className="text-[#C89A3D] text-2xl sm:text-3xl shrink-0" />

                <div>
                  <p className="uppercase tracking-[0.28em] text-[11px] sm:text-[12px] text-[#C89A3D]">
                    WhatsApp
                  </p>

                  <p className="text-base sm:text-[18px] text-[#ECE7E1] font-medium">
                    Message us instantly
                  </p>
                </div>

              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/headlessmaryevents"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#120F0B] border border-[#22170D] rounded-2xl p-5 flex items-center gap-4 no-underline hover:border-[#C89A3D] transition"
              >

                <FaInstagram className="text-[#C89A3D] text-2xl sm:text-3xl shrink-0" />

                <div>
                  <p className="uppercase tracking-[0.28em] text-[11px] sm:text-[12px] text-[#C89A3D]">
                    Instagram
                  </p>

                  <p className="text-base sm:text-[18px] text-[#ECE7E1] font-medium break-all sm:break-normal">
                    @headlessmaryevents
                  </p>
                </div>

              </a>

            </div>

          </div>

          {/* RIGHT */}

          <div className="bg-[#120F0B] border border-[#22170D] rounded-3xl p-5 sm:p-8">

            <form className="space-y-6 sm:space-y-8">

              <div>

                <label className="block uppercase tracking-[0.28em] text-[11px] sm:text-[12px] text-[#C89A3D] mb-3">
                  Name
                </label>

                <input
                  type="text"
                  className="w-full h-12 sm:h-14 rounded-lg bg-[#1A140E] border border-transparent px-4 sm:px-5 text-white outline-none focus:border-[#C89A3D]"
                />

              </div>

              <div>

                <label className="block uppercase tracking-[0.28em] text-[11px] sm:text-[12px] text-[#C89A3D] mb-3">
                  Email
                </label>

                <input
                  type="email"
                  className="w-full h-12 sm:h-14 rounded-lg bg-[#1A140E] border border-transparent px-4 sm:px-5 text-white outline-none focus:border-[#C89A3D]"
                />

              </div>

              <div>

                <label className="block uppercase tracking-[0.28em] text-[11px] sm:text-[12px] text-[#C89A3D] mb-3">
                  Message
                </label>

                <textarea
                  rows={6}
                  className="w-full rounded-lg bg-[#1A140E] border border-transparent px-4 sm:px-5 py-4 text-white outline-none resize-none focus:border-[#C89A3D]"
                />

              </div>

              <button
                type="submit"
                className="w-full h-12 sm:h-14 rounded-lg bg-linear-to-r from-[#EFC978] via-[#E2A53A] to-[#F2D189] text-black uppercase tracking-[0.25em] sm:tracking-[0.35em] text-xs sm:text-sm font-semibold transition hover:brightness-110"
              >
                Send Message
              </button>

            </form>

          </div>

        </div>

      </div>
    </section>
  );
}