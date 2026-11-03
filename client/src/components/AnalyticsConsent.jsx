import { useEffect, useState } from "react";
import {
  hasSeenPrivacyPolicy,
  markPrivacyPolicySeen,
  subscribeToAnalyticsPreferences,
} from "../utils/analyticsConsentStore.js";
import { setAnalyticsConsent } from "../utils/analytics.js";
import { Link } from "react-router-dom";

export default function AnalyticsConsent() {
  const [isOpen, setIsOpen] = useState(() => !hasSeenPrivacyPolicy());

  useEffect(
    () =>
      subscribeToAnalyticsPreferences(() => {
        setIsOpen(true);
      }),
    [],
  );

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const closePolicy = () => {
    markPrivacyPolicySeen();
    setIsOpen(false);
  };

  const chooseConsent = (choice) => {
    setAnalyticsConsent(choice);
    closePolicy();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6">
      <section
        aria-label="Privacy choices"
        aria-modal="true"
        className="relative w-full max-w-lg border border-[#C8922E]/50 bg-[#080808] p-6 text-[#E8E2DA] shadow-2xl sm:p-8"
        role="dialog"
      >
        <button
          type="button"
          onClick={closePolicy}
          aria-label="Close privacy choices"
          className="absolute right-3 top-3 z-10 p-2 text-2xl leading-none text-[#B8B0A8] transition hover:text-white"
        >
          ×
        </button>

        <div>
          <p className="font-mono-headless text-[10px] uppercase tracking-[0.22em] text-[#C8922E]">
            HDLSS MARY EVENTS
          </p>
          <h2 className="mt-3 font-['Cormorant_Garamond'] text-3xl text-[#E1B45F]">
            Your privacy choices
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#C6BFB7]">
            May we use optional Google Analytics to measure website visits?
            Your choice does not affect ticket purchases, payments, sign-in, or
            ticket verification.
          </p>
          <Link
            to="/privacy-policy"
            onClick={closePolicy}
            className="mt-3 inline-block text-sm text-[#E1B45F] underline underline-offset-4 transition hover:text-white"
          >
            Read the full Privacy Policy
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => chooseConsent("granted")}
            className="bg-[#C8922E] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#E1B45F]"
          >
            Accept analytics
          </button>
          <button
            type="button"
            onClick={() => chooseConsent("denied")}
            className="border border-white/30 px-4 py-2 text-sm font-semibold text-[#E8E2DA] transition hover:border-[#C8922E] hover:text-[#E1B45F]"
          >
            Reject analytics
          </button>
        </div>
      </section>
    </div>
  );
}
