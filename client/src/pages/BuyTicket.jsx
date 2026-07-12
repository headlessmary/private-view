import { useEffect, useState } from "react";
import { getEventSettings } from "../services/eventSettings";
import API_URL from "../config/api";

export default function BuyTicket() {
  const [settings, setSettings] = useState(getEventSettings);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    ticketType: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleSettingsUpdate = () => setSettings(getEventSettings());
    window.addEventListener("event-settings-updated", handleSettingsUpdate);
    return () => window.removeEventListener("event-settings-updated", handleSettingsUpdate);
  }, []);

  const ticketPrices = settings.ticketPrices || { VIP: 70000, REGULAR: 55000 };

  const displayTicketType = (type) => {
    if (type === "REGULAR") return "Regular";
    return type;
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const selectedPrice = ticketPrices[form.ticketType] || 0;

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.ticketType) {
    alert("Please select a ticket type");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(`${API_URL}/api/payment/initialize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        amount: selectedPrice,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    // Redirect to Flutterwave payment page
    window.location.assign(data.paymentLink);

  } catch (err) {
    console.error(err);
    alert(err.message);
  } finally {
    setLoading(false);
  }
};
  return (
    <section className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="w-full max-w-lg">
        <div className="text-center">
          <p className="uppercase tracking-[0.25em] sm:tracking-[0.45em] text-[#d4a24d] text-xs font-semibold">
            Reserve Your Seat
          </p>

          <h1 className="mt-4 font-serif text-[#d4a24d] text-4xl sm:text-5xl lg:text-6xl">
            The Private View
          </h1>
        </div>

        <div className="mt-10 bg-[#0b0907] border border-[#22170a] rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,.45)]">
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
              <label className="block uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[#d4a24d] text-[11px] sm:text-xs mb-3 font-semibold">
                Select Ticket
              </label>

              <CustomSelect
                value={form.ticketType}
                onChange={(value) =>
                  setForm({
                    ...form,
                    ticketType: value,
                  })
                }
                displayTicketType={displayTicketType}
                ticketPrices={ticketPrices}
              />
            </div>

            {form.ticketType && (
              <div className="rounded-lg border border-[#d4a24d]/30 bg-[#19130d] p-4 flex justify-between text-sm">
                <span className="text-gray-400">
                  {displayTicketType(form.ticketType)} Ticket
                </span>

                <span className="text-[#d4a24d] font-semibold">
                  ₦{selectedPrice.toLocaleString()}
                </span>
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full h-14 rounded-lg uppercase tracking-[0.25em] text-sm font-bold text-black bg-linear-to-r from-[#F1D08B] via-[#E4A321] to-[#F2CD84] hover:brightness-110 transition disabled:opacity-50"
            >
              {loading ? "Processing..." : "Continue To Payment"}
            </button>

            <p className="text-center text-gray-500 text-xs sm:text-sm leading-6">
              Payment is securely processed by Paystack.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function InputField({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label className="block uppercase tracking-[0.3em] text-[#d4a24d] text-xs mb-3 font-semibold">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full h-14 rounded-lg bg-[#19130d] border border-[#1d1409] px-5 text-white placeholder:text-gray-600 outline-none focus:border-[#d4a24d] transition"
      />
    </div>
  );
}

function CustomSelect({ value, onChange, displayTicketType, ticketPrices }) {
  const [open, setOpen] = useState(false);

  const options = [
    {
      label: `VIP — ₦${(ticketPrices?.VIP || 0).toLocaleString()}`,
      value: "VIP",
    },
    {
      label: `Regular — ₦${(ticketPrices?.REGULAR || 0).toLocaleString()}`,
      value: "REGULAR",
    },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-12 sm:h-14 rounded-lg bg-[#19130d] border border-[#1d1409] px-5 text-white flex items-center justify-between outline-none focus:border-[#d4a24d] transition"
      >
        <span className={value ? "text-white" : "text-gray-500"}>
          {value
            ? `${displayTicketType(value)} Ticket`
            : "Choose a ticket"}
        </span>

        <span className="text-[#d4a24d]">
          {open ? "⌃" : "⌄"}
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-lg overflow-hidden border border-[#d4a24d]/30 bg-[#19130d] shadow-2xl">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="w-full px-5 py-4 text-left text-white hover:bg-[#d4a24d] hover:text-black transition"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}