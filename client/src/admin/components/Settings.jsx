import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEventSettings, readFileAsDataUrl, saveEventSettings } from "../../services/eventSettings";

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(() => getEventSettings());
  const [form, setForm] = useState({
    eventName: settings.eventName,
    venue: settings.venue,
    eventTime: settings.eventTime,
    ticketPrices: { ...settings.ticketPrices },
    maxCapacity: settings.maxCapacity,
    logo: settings.logo || "",
    flyer: settings.flyer || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handlePriceChange = (event, key) => {
    const { value } = event.target;
    setForm((current) => ({
      ...current,
      ticketPrices: {
        ...current.ticketPrices,
        [key]: Number(value) || 0,
      },
    }));
  };

  const handleFileChange = async (event, fieldName) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setForm((current) => ({ ...current, [fieldName]: dataUrl }));
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      saveEventSettings({
        ...form,
        maxCapacity: Number(form.maxCapacity) || 60,
      });
      setSettings(getEventSettings());
      setMessage("Event settings saved successfully.");
    } catch (error) {
      setMessage(error.message || "Unable to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="min-h-screen bg-black text-white px-5 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#d4a24d]">Admin Settings</p>
            <h1 className="mt-2 font-serif text-3xl text-[#d4a24d] sm:text-4xl">Event Configuration</h1>
            <p className="mt-2 text-sm text-gray-400">Update the public event details, ticket pricing, and visual assets.</p>
          </div>

          <button
            onClick={() => navigate("/admin/dashboard")}
            className="rounded-lg border border-[#d4a24d] px-5 py-3 text-sm uppercase tracking-[0.2em] text-[#d4a24d]"
          >
            Back to Dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6 rounded-3xl border border-[#22170a] bg-[#0b0907] p-6 sm:p-8">
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
                label="Event Time"
                name="eventTime"
                type="time"
                value={form.eventTime}
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

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="VIP Ticket Price"
                type="number"
                value={form.ticketPrices.VIP}
                onChange={(event) => handlePriceChange(event, "VIP")}
              />
              <Field
                label="Regular Ticket Price"
                type="number"
                value={form.ticketPrices.REGULAR}
                onChange={(event) => handlePriceChange(event, "REGULAR")}
              />
            </div>

            <div className="rounded-2xl border border-[#2d1e09] bg-[#140f0a] p-5">
              <label className="mb-3 block text-xs uppercase tracking-[0.3em] text-[#d4a24d]">Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleFileChange(event, "logo")}
                className="w-full rounded-lg border border-[#2d1e09] bg-[#19130d] px-4 py-3 text-sm text-gray-300"
              />
              {form.logo && (
                <img src={form.logo} alt="Event logo preview" className="mt-4 h-20 w-auto rounded-lg border border-[#2d1e09] object-contain bg-white p-2" />
              )}
            </div>

            <div className="rounded-2xl border border-[#2d1e09] bg-[#140f0a] p-5">
              <label className="mb-3 block text-xs uppercase tracking-[0.3em] text-[#d4a24d]">Flyer</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleFileChange(event, "flyer")}
                className="w-full rounded-lg border border-[#2d1e09] bg-[#19130d] px-4 py-3 text-sm text-gray-300"
              />
              {form.flyer && (
                <img src={form.flyer} alt="Event flyer preview" className="mt-4 max-h-60 w-full rounded-lg border border-[#2d1e09] object-cover" />
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="h-14 w-full rounded-lg bg-[#d4a24d] px-6 text-sm font-semibold uppercase tracking-[0.25em] text-black transition hover:brightness-110 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Settings"}
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
              <p className="mt-2 text-xl font-semibold text-white">{form.eventName}</p>
              <p className="mt-2 text-sm text-gray-400">{form.venue}</p>
              <p className="mt-2 text-sm text-[#f1ca7b]">{form.eventTime ? `Starts at ${form.eventTime}` : "Time not set"}</p>
            </div>

            <div className="rounded-2xl border border-[#2d1e09] bg-[#140f0a] p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[#d4a24d]">Ticket Prices</p>
              <div className="mt-3 space-y-2 text-sm text-gray-300">
                <div className="flex items-center justify-between">
                  <span>VIP</span>
                  <span>₦{Number(form.ticketPrices.VIP || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Regular</span>
                  <span>₦{Number(form.ticketPrices.REGULAR || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#2d1e09] bg-[#140f0a] p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-[#d4a24d]">Capacity</p>
              <p className="mt-2 text-3xl font-semibold text-[#e7bc67]">{form.maxCapacity || 60}</p>
              <p className="mt-2 text-sm text-gray-400">Guests maximum</p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({ label, name, value, onChange, type = "text", ...props }) {
  return (
    <label className="block">
      <span className="mb-3 block text-xs uppercase tracking-[0.3em] text-[#d4a24d]">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="h-14 w-full rounded-lg border border-[#1d1409] bg-[#19130d] px-4 text-white outline-none focus:border-[#d4a24d]"
        {...props}
      />
    </label>
  );
}
