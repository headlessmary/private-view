import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAnalyticsConsent,
  subscribeToAnalyticsConsent,
} from "../utils/analyticsConsentStore.js";
import { setAnalyticsConsent } from "../utils/analytics.js";

const sections = [
  {
    title: "1. Information we collect",
    content: (
      <>
        <p>
          When you book a ticket, we collect the name, email address, and phone
          number you provide. We also process information needed to administer
          the booking, including the event, ticket type, ticket price, booking
          reference, payment status, payment method and, where provided for a
          manual payment, payment reference and confirmation notes.
        </p>
        <p>
          Our ticket records also contain a ticket/QR token, whether the ticket
          has been checked in, and record timestamps. When a payment is
          verified, Flutterwave returns transaction information to our server.
          The application uses it to verify the payment and link it to your
          booking.
        </p>
        <p>
          The QR/barcode token is used to validate the ticket at entry. The
          ticket image link contains that token; keep the ticket and link
          private because someone holding a valid ticket link could present it
          for scanning.
        </p>
        <p>
          Optional Google Analytics page-view measurement is enabled only if
          you accept analytics. With consent, the client sends the page path
          and page location; Google may also receive technical information
          through its analytics tools. We do not intentionally send your name,
          email, or phone number in those page-view events.
        </p>
        <p>
          Your browser also stores the analytics choice and, for administrators
          only, an authentication token and event-display settings in local
          storage. The website and its services may also process technical
          request information needed to deliver and secure the service. The
          page loads typefaces from Google Fonts; those font requests may make
          technical connection information available to Google independently
          of analytics consent.
        </p>
      </>
    ),
  },
  {
    title: "2. How we use your information",
    content: (
      <ul>
        <li>To create and administer ticket orders and confirm payments.</li>
        <li>
          To send booking confirmations and tickets, including the ticket
          reference and QR/barcode information, to the email address supplied.
        </li>
        <li>
          To respond to customer support requests and resolve payment or ticket
          issues.
        </li>
        <li>
          To manage attendee lists, verify tickets, record event entry, and
          prevent a ticket from being used more than once.
        </li>
        <li>
          To maintain operational records and, where applicable, meet legal
          obligations and protect the service from misuse.
        </li>
        <li>
          To understand website visits through optional page-view analytics
          only if you accept it.
        </li>
      </ul>
    ),
  },
  {
    title: "3. Ticket and payment records",
    content: (
      <>
        <p>
          The application stores attendee name, email, phone, event and ticket
          type, ticket amount, payment status, an order reference, QR-related
          values, check-in status, and created/updated timestamps in a
          PostgreSQL database. The system can also store the payment method,
          payment reference, confirmation details and administrator notes for
          manual payment handling.
        </p>
        <p>
          The application sends Flutterwave the customer name, email address,
          phone number, order amount, currency (NGN), and our transaction
          reference to initialize checkout. It then uses transaction
          information returned by Flutterwave to verify the payment and update
          the ticket record.
        </p>
        <p>
          The attendee database schema does not contain fields for card numbers,
          CVV/security codes, or bank login credentials, and the payment
          verification code does not save the complete Flutterwave verification
          response as an attendee record. This describes the application code
          reviewed; it is not a claim about information Flutterwave processes,
          or about separate infrastructure, logs, or backups.
        </p>
      </>
    ),
  },
  {
    title: "4. Payments through Flutterwave",
    content: (
      <p>
        Payment checkout and transaction verification are provided through
        Flutterwave. You provide payment details to Flutterwave through its
        checkout experience, and Flutterwave processes the payment under its
        own terms and privacy notice. We receive transaction information
        needed to verify the result and associate it with your order. We do not
        control Flutterwave’s systems or its retention practices; review
        Flutterwave’s current privacy information for details about its
        processing.
      </p>
    ),
  },
  {
    title: "5. When we share information",
    content: (
      <>
        <p>
          We share information only as needed for the purposes described in
          this notice:
        </p>
        <ul>
          <li>
            <strong>Flutterwave</strong> receives checkout information and
            provides transaction verification.
          </li>
          <li>
            <strong>Brevo</strong> is used by the application to send ticket
            emails. The email request includes the recipient’s name and email,
            ticket type, booking reference, event details, and a QR/barcode
            link.
          </li>
          <li>
            <strong>Google Analytics</strong> receives page-view measurement
            data as described in the analytics section.
          </li>
          <li>
            <strong>Event operations personnel</strong> may need attendee and
            ticket information to administer orders and verify entry. The
            authenticated admin tools allow administrators to view, search,
            filter, and export attendee records, and to verify check-in. The
            scanner response itself contains only the attendee name and ticket
            type. The application has a shared administrator role and does not
            implement a separate event-organizer permission model.
          </li>
        </ul>
        <p>
          We may also disclose information where required by law or where
          necessary to protect rights, safety, or the service.
        </p>
        <p>
          The application does not establish whether an event organizer
          receives a separate attendee list or the terms for any such sharing.
          Contact us for questions about a specific event’s data handling.
        </p>
      </>
    ),
  },
  {
    title: "6. Storage and protection",
    content: (
      <>
        <p>
          Ticket and attendee records are stored in PostgreSQL through the
          application’s database layer. Administrative tools require
          authentication, and administrator passwords are checked against
          bcrypt-hashed values. Access should be limited to people who need it
          to operate the service.
        </p>
        <p>
          The application server logs request methods and paths. The reviewed
          logger does not log request bodies or query strings; hosting-provider
          logs and other operational logs are not established by the
          application code.
        </p>
        <p>
          The code repository does not identify the production database or
          hosting provider, the countries where data and backups are stored,
          or whether encryption at rest, backup protections, and other
          infrastructure safeguards are enabled. Contact us for questions
          about the safeguards used in the deployed service. No security
          measure can be described as absolute.
        </p>
      </>
    ),
  },
  {
    title: "7. Retention and deletion",
    content: (
      <>
        <p>
          Ticket records include creation and update timestamps. The
          application code reviewed does not define an automatic retention
          period or a customer self-service deletion workflow. A specific
          retention schedule has not been confirmed. Retention decisions are
          needed for ticket/order records, payment and accounting references,
          QR tokens and check-in records, administrator notes, email and
          analytics records, and backups. Records should be retained only as
          long as needed for the purposes described here and applicable legal,
          accounting, dispute, and security requirements.
        </p>
      </>
    ),
  },
  {
    title: "8. Your privacy rights",
    content: (
      <>
        <p>
          Subject to the Nigeria Data Protection Act 2023 and any applicable
          limits, you may have the right to be informed about our processing,
          request access to your personal data, correct inaccurate data,
          request erasure or restriction, receive or transfer certain data,
          object to certain processing, and withdraw consent where processing
          is based on consent. You may also lodge a complaint with the Nigeria
          Data Protection Commission (NDPC). These rights are not absolute and
          may depend on the circumstances and legal obligations that apply.
        </p>
        <p>
          To request access to, correction of, or deletion of information,
          email{" "}
          <a href="mailto:headlessmaryevents@gmail.com?subject=Privacy%20Request">
            headlessmaryevents@gmail.com
          </a>{" "}
          with “Privacy Request” in the subject line and state whether you
          request access, correction, or deletion. A booking reference may help
          us locate the record. Do not send card details, passwords, or
          identity documents unless we specifically request verification
          through an appropriate channel. We will verify requests as
          appropriate and consider any legal or operational record-retention
          requirements before taking action. You can also use this address to
          ask a privacy question or raise a concern.
        </p>
      </>
    ),
  },
  {
    title: "9. Cookies, browser storage, and analytics",
    content: (
      <>
        <p>
          Google Analytics is optional. Its tag is not initialized and
          page-view events are not sent unless you choose “Accept analytics.”
          You can reject analytics or change the choice later using the
          “Privacy choices” control. Your choice is saved in browser local
          storage. Google Analytics may use cookies or similar technologies
          when enabled; the exact cookies and retention depend on Google’s
          deployed configuration. You can also manage cookies through your
          browser settings.
        </p>
        <p>
          The admin interface stores its authentication token in browser
          local storage after an administrator signs in. This is for
          administrative access and is not a ticket-purchaser account feature.
        </p>
      </>
    ),
  },
  {
    title: "10. Children’s privacy",
    content: (
      <p>
        The ticketing code does not include age screening or a child-specific
        data collection flow. Contact us if you believe a child’s personal
        information was provided and needs review.
      </p>
    ),
  },
  {
    title: "11. International transfers",
    content: (
      <p>
        Flutterwave, Brevo, Google Analytics, and the production hosting or
        database providers may process information in locations outside
        Nigeria. The application code does not establish those processing
        locations or the safeguards used for any transfer. Contact us with
        questions about transfers related to your booking.
      </p>
    ),
  },
  {
    title: "12. Contact and changes",
    content: (
      <>
        <p>
          <strong>HDLSS MARY EVENTS</strong> handles privacy questions at{" "}
          <a href="mailto:headlessmaryevents@gmail.com">
            headlessmaryevents@gmail.com
          </a>
          . Please use the subject line “Privacy Request.” Our postal/business
          address and any designated Data Protection Officer contact are not
          provided here.
        </p>
        <p>
          We may update this notice when our practices or legal requirements
          change. The date at the top indicates when this version was last
          reviewed.
        </p>
      </>
    ),
  },
];

export function PrivacyPolicyContent({ compact = false }) {
  return (
    <>
      <header
        className={
          compact
            ? "mb-6 border-b border-[#C8922E]/35 pb-5"
            : "mb-10 border-b border-[#C8922E]/35 pb-8 sm:mb-14 sm:pb-10"
        }
      >
        <p className="font-mono-headless text-[10px] uppercase tracking-[0.22em] text-[#C8922E] sm:text-xs">
          HDLSS MARY EVENTS
        </p>
        <h1
          className={
            compact
              ? "mt-2 font-['Cormorant_Garamond'] text-4xl leading-none text-[#C8922E] sm:text-5xl"
              : "mt-4 font-['Cormorant_Garamond'] text-5xl leading-none text-[#C8922E] sm:text-6xl md:text-7xl"
          }
        >
          Privacy Policy
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#B8B0A8] sm:text-base sm:leading-7">
          This notice explains how we handle personal information when you
          visit our website or purchase a HeadlessMary event ticket.
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.12em] text-[#8F877F]">
          Last reviewed: 29 October 2026
        </p>
      </header>

      <div className={compact ? "space-y-6" : "space-y-9 sm:space-y-11"}>
        {sections.map(({ title, content }) => (
          <section
            key={title}
            className={
              compact
                ? "border-b border-white/10 pb-5 last:border-b-0"
                : "border-b border-white/10 pb-8 last:border-b-0"
            }
          >
            <h2
              className={
                compact
                  ? "font-['Cormorant_Garamond'] text-xl font-semibold text-[#E1B45F] sm:text-2xl"
                  : "font-['Cormorant_Garamond'] text-2xl font-semibold text-[#E1B45F] sm:text-3xl"
              }
            >
              {title}
            </h2>
            <div className="mt-3 space-y-4 text-sm leading-6 text-[#C6BFB7] sm:text-base sm:leading-7">
              {content}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

export default function PrivacyPolicy() {
  const [analyticsConsent, setAnalyticsConsentState] =
    useState(getAnalyticsConsent);

  useEffect(
    () =>
      subscribeToAnalyticsConsent(() =>
        setAnalyticsConsentState(getAnalyticsConsent()),
      ),
    [],
  );

  const updateAnalyticsConsent = (consent) => {
    setAnalyticsConsent(consent);
    setAnalyticsConsentState(consent);
  };

  return (
    <article className="min-h-screen bg-[#080808] px-4 pb-20 pt-28 text-[#E8E2DA] sm:px-6 sm:pt-32 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          aria-label="Back home"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#E1B45F] transition hover:-translate-x-1 hover:text-white"
        >
          <span aria-hidden="true" className="text-2xl leading-none">
            ←
          </span>
          <span>Back Home</span>
        </Link>

        <PrivacyPolicyContent />

        <section
          aria-labelledby="analytics-preferences-heading"
          className="mt-10 border-t border-white/10 pt-6"
        >
          <h2
            id="analytics-preferences-heading"
            className="text-xl font-semibold text-[#E1B45F]"
          >
            Analytics preferences
          </h2>
          <p className="mt-2 text-sm text-[#C6BFB7]">
            Optional analytics are currently{" "}
            {analyticsConsent === "granted" ? "enabled" : "disabled"}.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => updateAnalyticsConsent("granted")}
              className="rounded-full bg-[#C8922E] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#E1B45F]"
            >
              Allow optional analytics
            </button>
            <button
              type="button"
              onClick={() => updateAnalyticsConsent("denied")}
              className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-[#E8E2DA] transition hover:border-[#C8922E] hover:text-[#E1B45F]"
            >
              Keep analytics off
            </button>
          </div>
        </section>
      </div>
    </article>
  );
}
