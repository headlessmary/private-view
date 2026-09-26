import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../config/api";
import {
  DEFAULT_SOCIETY_EVENT,
  fetchSocietyEvent,
  formatEventDateTime,
} from "../../services/eventConfig";

export default function Settings() {
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_SOCIETY_EVENT);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    fetchSocietyEvent()
      .then((event) => {
        if (active) setForm(event);
      })
      .catch((error) => {
        if (active) setLoadError(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: ["maxCapacity", "earlyBirdPrice", "saintsRebelsPrice", "fiveFriendsPrice"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/admin/event-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save event settings.");
      }

      setForm(data.event);
      setMessage("Headless Society settings saved successfully.");
    } catch (error) {
      setMessage(error.message || "Unable to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="min-h-screen bg-black px-4 py-6 text-white sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#d4a24d] sm:tracking-[0.35em]">Admin Settings</p>
            <h1 className="mt-2 font-serif text-3xl text-[#d4a24d] sm:text-4xl">Event Configuration</h1>
            <p className="mt-2 text-sm text-gray-400">Update the public event details, ticket pricing, and capacity.</p>
          </div>

          <button
            onClick={() => navigate("/admin/dashboard")}
            className="w-full rounded-lg border border-[#d4a24d] px-4 py-3 text-sm uppercase tracking-[0.15em] text-[#d4a24d] sm:w-auto sm:px-5 sm:tracking-[0.2em]"
          >
            Back to Dashboard
          </button>
        </div>

        {loading ? (
          <p className="text-gray-300">Loading active event settings…</p>
        ) : loadError ? (
          <p role="alert" className="text-red-400">{loadError}</p>
        ) : (
        <form onSubmit={handleSubmit} className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] sm:gap-6">
          <div className="min-w-0 space-y-6 rounded-3xl border border-[#22170a] bg-[#0b0907] p-4 sm:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Event Name"
                name="eventName"
                value={form.eventName}
                onChange={handleChange}
              />
              <Field
                label="Venue"
                name="venue"
                value={form.venue}
                onChange={handleChange}
              />
              <Field
                label="Event Date & Time"
                name="eventDateTime"
                type="datetime-local"
                value={form.eventDateTime}
                onChange={handleChange}
              />
              <Field
                label="Maximum Capacity"
                name="maxCapacity"
                type="number"
                min="1"
                value={form.maxCapacity}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <Field label="Early Bird Price (₦)" name="earlyBirdPrice" type="number" min="1" value={form.earlyBirdPrice} onChange={handleChange} />
              <Field label="Saints & Rebels Price (₦)" name="saintsRebelsPrice" type="number" min="1" value={form.saintsRebelsPrice} onChange={handleChange} />
              <Field label="Five Friends Price (₦)" name="fiveFriendsPrice" type="number" min="1" value={form.fiveFriendsPrice} onChange={handleChange} />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="h-14 w-full rounded-lg bg-[#d4a24d] px-6 text-sm font-semibold uppercase tracking-[0.25em] text-black transition hover:brightness-110 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Society Event"}
            </button>

            {message && <p className="text-sm text-[#f1ca7b]">{message}</p>}
          </div>

          <div className="space-y-6 rounded-3xl border border-[#22170a] bg-[#0b0907] p-6 sm:p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#d4a24d]">Live Preview</p>
              <h2 className="mt-3 font-serif text-2xl text-white">How the event looks</h2>
            </div>

            <div className="rounded-2xl border border-[#2d1e09] bg-[#140f0a] p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[#d4a24d]">Event Name</p>
              <p className="mt-2 break-words text-xl font-semibold text-white">{form.eventName}</p>
              <p className="mt-2 break-words text-sm text-gray-400">{form.venue}</p>
              <p className="mt-2 text-sm text-[#f1ca7b]">{formatEventDateTime(form.eventDateTime)}</p>
            </div>

            <div className="rounded-2xl border border-[#2d1e09] bg-[#140f0a] p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[#d4a24d]">Headless Society tickets</p>
              <div className="mt-3 space-y-2 text-sm text-gray-300">
                <PricePreview label="Early Bird" amount={form.earlyBirdPrice} />
                <PricePreview label="Saints & Rebels" amount={form.saintsRebelsPrice} />
                <PricePreview label="Five Friends" amount={form.fiveFriendsPrice} />
              </div>
            </div>

            <div className="rounded-2xl border border-[#2d1e09] bg-[#140f0a] p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[#d4a24d]">Capacity</p>
              <p className="mt-2 text-3xl font-semibold text-[#e7bc67]">{form.maxCapacity || 60}</p>
              <p className="mt-2 text-sm text-gray-400">Guests maximum</p>
            </div>
          </div>
        </form>
        )}
      </div>
    </section>
  );
}

function PricePreview({ label, amount }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span>{label}</span>
      <span>₦{Number(amount || 0).toLocaleString("en-NG")}</span>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text", ...props }) {
  return (
    <label className="block">
      <span className="mb-3 block text-xs uppercase tracking-[0.2em] text-[#d4a24d] sm:tracking-[0.3em]">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="h-14 w-full min-w-0 rounded-lg border border-[#1d1409] bg-[#19130d] px-3 text-white outline-none focus:border-[#d4a24d] sm:px-4"
        {...props}
      />
    </label>
  );
}
