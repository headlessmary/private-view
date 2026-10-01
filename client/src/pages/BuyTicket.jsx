import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API_URL from "../config/api";
import {
  fetchCurrentEvent,
  getSocietyTickets,
} from "../services/eventConfig";

const currency = new Intl.NumberFormat("en-NG");

export default function BuyTicket() {
  const [searchParams] = useSearchParams();
  const requestedTicket = searchParams.get("ticketType");
  const [event, setEvent] = useState(null);
  const [eventLoading, setEventLoading] = useState(true);
  const [eventError, setEventError] = useState("");
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    ticketType: "",
  });
  const [loading, setLoading] = useState(false);
  const selectedTicket = tickets.find(
    (ticket) => ticket.value === form.ticketType
  );

  useEffect(() => {
    let active = true;
    fetchCurrentEvent()
      .then((nextEvent) => {
        if (!active) return;
        if (!nextEvent) {
          setEventError("There is no published event currently accepting ticket purchases.");
          setTickets([]);
          return;
        }
        setEvent(nextEvent);
        const nextTickets = getSocietyTickets(nextEvent);
        setTickets(nextTickets);
        setForm((current) => ({
          ...current,
          ticketType: nextTickets.some((ticket) => ticket.value === requestedTicket)
            ? requestedTicket
            : "",
        }));
      })
      .catch((error) => {
        if (active) setEventError(error.message);
      })
      .finally(() => {
        if (active) setEventLoading(false);
      });

    return () => {
      active = false;
    };
  }, [requestedTicket]);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedTicket) {
      alert("      Please select an event ticket.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/payment/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: selectedTicket.amount,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to start payment.");
      }

      window.location.assign(data.paymentLink);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#050509] px-4 py-14 text-[#f5f1e8] sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="border-b border-white/20 pb-7 text-center">
          <p className="text-sm text-white/60 sm:text-base">
            {event
              ? `Choose your access and secure your place at ${event.venue}.`
              : "Event ticket sales are currently unavailable."}
          </p>
          {eventError && (
            <p role="alert" className="mt-3 text-sm text-red-400">
              {eventError}
            </p>
          )}
        </div>

        <div className="mt-8 border border-white/20 bg-black/40 p-5 sm:p-9">
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            <InputField
              label="Phone Number"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />

            <div>
              <label
                htmlFor="ticketType"
                className="mb-3 block font-mono-headless text-[10px] font-semibold uppercase tracking-[0.18em] text-headless-acid sm:text-xs"
              >
                Select Event Access
              </label>
              <select
                id="ticketType"
                name="ticketType"
                value={form.ticketType}
                onChange={handleChange}
                required
                disabled={eventLoading || Boolean(eventError)}
                className="h-14 w-full appearance-none border border-white/20 bg-[#101014] px-4 text-sm text-white outline-none transition focus:border-headless-acid sm:px-5"
              >
                <option value="" disabled>
                  Choose your ticket
                </option>
                {tickets.map((ticket) => (
                  <option key={ticket.value} value={ticket.value}>
                    {ticket.name} — ₦{currency.format(ticket.amount)}
                  </option>
                ))}
              </select>
            </div>

            {selectedTicket && (
              <div className="flex items-center justify-between gap-4 border border-headless-acid/40 bg-headless-acid/5 p-4">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {selectedTicket.name}
                  </p>
                  <p className="mt-1 text-xs text-white/55">
                    {selectedTicket.description}
                  </p>
                </div>
                <p className="shrink-0 font-mono-headless text-sm font-semibold text-headless-acid sm:text-base">
                  ₦{currency.format(selectedTicket.amount)}
                </p>
              </div>
            )}

            <button
              disabled={loading || eventLoading || Boolean(eventError)}
              type="submit"
              className="w-full border-2 border-headless-acid bg-headless-acid px-5 py-4 text-xs font-bold uppercase tracking-[0.16em] text-black transition hover:bg-transparent hover:text-headless-acid disabled:cursor-wait disabled:opacity-50 sm:text-sm"
            >
              {eventLoading
                ? "Loading tickets..."
                : loading
                  ? "Opening secure payment..."
                  : "Continue to payment"}
            </button>

            <p className="text-center text-xs leading-5 text-white/45">
              Your payment is securely processed by Flutterwave.
            </p>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-white/45">
          <Link
            to="/#tickets"
            className="underline decoration-white/30 underline-offset-4 transition hover:text-headless-acid"
          >
            Back to the current event
          </Link>
        </p>
      </div>
    </section>
  );
}

function InputField({ label, type = "text", name, value, onChange, placeholder }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-3 block font-mono-headless text-[10px] font-semibold uppercase tracking-[0.18em] text-headless-acid sm:text-xs"
      >
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="h-14 w-full border border-white/20 bg-[#101014] px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-headless-acid sm:px-5"
      />
    </div>
  );
}
