import { Link } from "react-router-dom";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#080808]/95 backdrop-blur-md border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto h-20 px-5 sm:px-6 lg:px-12 flex items-center justify-between lg:grid lg:grid-cols-3">

  {/* Logo */}
  <div>
    <Link
      to="/"
      className="font-['Cormorant_Garamond'] text-[#C89A3D] text-xl sm:text-2xl lg:text-[2rem] font-medium whitespace-nowrap"
    >
      The Private View
    </Link>
  </div>

  {/* Center Navigation */}
  <nav className="hidden lg:flex justify-center items-center gap-10">
    <Link
      to="/private-view#about"
      className="text-[13px] uppercase tracking-[0.22em] font-semibold text-[#B5B5B5] hover:text-[#C89A3D] transition-colors duration-300"
    >
      About
    </Link>

    <Link
      to="/private-view#experience"
      className="text-[13px] uppercase tracking-[0.22em] font-semibold text-[#B5B5B5] hover:text-[#C89A3D] transition-colors duration-300"
    >
      Experience
    </Link>

    <Link
      to="/private-view#tickets"
      className="text-[13px] uppercase tracking-[0.22em] font-semibold text-[#B5B5B5] hover:text-[#C89A3D] transition-colors duration-300"
    >
      Tickets
    </Link>

    <Link
      to="/private-view#contact"
      className="text-[13px] uppercase tracking-[0.22em] font-semibold text-[#B5B5B5] hover:text-[#C89A3D] transition-colors duration-300"
    >
      Contact
    </Link>
  </nav>

  {/* Button */}
  <div className="hidden lg:flex justify-end">
    <button
      type="button"
      disabled
      aria-disabled="true"
      className="min-w-56 cursor-not-allowed rounded-none bg-[#D8A74E] px-8 py-4 text-center text-[12px] font-semibold uppercase tracking-[0.22em] text-black opacity-80 sm:min-w-[16rem] sm:px-10 sm:py-4 sm:text-[13px] lg:min-w-66 lg:px-12 lg:py-5 lg:text-[14px]"
    >
      Reserve Ticket
    </button>
  </div>

  {/* Mobile Menu Button */}
  <button
    onClick={() => setOpen(!open)}
    className="lg:hidden text-white"
  >
    {open ? <HiOutlineX size={30} /> : <HiOutlineMenu size={30} />}
  </button>

</div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="bg-[#080808] border-t border-[#1A1A1A] px-6 py-8 space-y-6">
          <Link
            to="/private-view#about"
            onClick={() => setOpen(false)}
            className="block text-[13px] uppercase tracking-[0.22em] font-semibold text-[#B5B5B5] hover:text-[#C89A3D] transition"
          >
            About
          </Link>

          <Link
            to="/private-view#experience"
            onClick={() => setOpen(false)}
            className="block text-[13px] uppercase tracking-[0.22em] font-semibold text-[#B5B5B5] hover:text-[#C89A3D] transition"
          >
            Experience
          </Link>

          <Link
            to="/private-view#tickets"
            onClick={() => setOpen(false)}
            className="block text-[13px] uppercase tracking-[0.22em] font-semibold text-[#B5B5B5] hover:text-[#C89A3D] transition"
          >
            Tickets
          </Link>

          <Link
            to="/private-view#contact"
            onClick={() => setOpen(false)}
            className="block text-[13px] uppercase tracking-[0.22em] font-semibold text-[#B5B5B5] hover:text-[#C89A3D] transition"
          >
            Contact
          </Link>

          <button
            type="button"
            disabled
            aria-disabled="true"
           className="mt-8 block w-full cursor-not-allowed rounded-none bg-[#D8A74E] px-8 py-4 text-center text-[12px] font-semibold uppercase tracking-[0.22em] text-black opacity-80 sm:px-10 sm:py-4 sm:text-[13px]"
          >
            Reserve Ticket
          </button>
        </nav>
      </div>
    </header>
  );
}