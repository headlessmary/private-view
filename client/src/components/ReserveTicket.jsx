import { Link } from "react-router-dom";

export default function ReserveTicket() {
  return (
    <section
      id="tickets"
      className="border-y border-white/15 bg-[#080808] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono-headless text-[10px] uppercase tracking-[0.18em] text-headless-acid sm:text-xs">
            The Private View / Archive
          </p>
          <h2 className="society-serif mt-4 text-4xl uppercase leading-none text-headless-amber sm:text-5xl">
            That night has passed.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/60 sm:text-base">
            The Private View is over. Find your next night at Headless Society.
          </p>
        </div>
        <Link
          to="/headless-society"
          className="inline-flex shrink-0 items-center justify-center border-2 border-headless-acid bg-headless-acid px-6 py-4 text-center text-xs font-bold uppercase tracking-[0.15em] text-black transition hover:bg-transparent hover:text-headless-acid"
        >
          Explore Headless Society <span className="ml-4 text-lg" aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
