import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../config/api";
import {
  DEFAULT_SOCIETY_EVENT,
  fetchEventHistory,
  fetchSocietyEvent,
  formatEventDateTime,
} from "../../services/eventConfig";

const createEventForm = () => ({
  ...DEFAULT_SOCIETY_EVENT,
  eventName: "",
  venue: "",
  eventDateTime: "",
  eventEndDateTime: "",
  imageUrl: "",
});

export default function Settings() {
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_SOCIETY_EVENT);
  const [events, setEvents] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingEventId, setEditingEventId] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("adminToken");
    Promise.all([fetchSocietyEvent(), fetchEventHistory(token || "")])
      .then(([event, history]) => {
        if (active) {
          setForm(event);
          setEvents(history);
        }
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
      const token = localStorage.getItem("adminToken");
      const endpoint = isCreating
        ? `${API_URL}/api/admin/events`
        : editingEventId
          ? `${API_URL}/api/admin/events/${editingEventId}`
          : `${API_URL}/api/admin/event-settings`;
      const response = await fetch(endpoint, {
        method: isCreating ? "POST" : "PUT",
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
      setIsCreating(false);
      setEditingEventId(data.event.id || "");
      setEvents(await fetchEventHistory(token || ""));
      setMessage(
        isCreating
          ? "Draft event created. Publish it when ready."
          : "Event settings saved successfully.",
      );
    } catch (error) {
      setMessage(error.message || "Unable to save settings");
    } finally {
      setSaving(false);
    }
  };

  const publishEvent = async (eventId) => {
    setMessage("");
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/events/${eventId}/publish`, {
        method: "PATCH",
        headers: {
          Authorization: `******"adminToken")}`,
        },
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to publish event.");
      }

      setEvents(await fetchEventHistory(token || ""));
      setMessage(`${data.event.eventName} is now published.`);
    } catch (error) {
      setMessage(error.message || "Unable to publish event.");
    }
  };

  return (
    <section className="min-h-screen bg-black px-4 py-6 text-white sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#d4a24d] sm:tracking-[0.35em]">Admin Settings</p>
            <h1 className="mt-2 font-serif text-3xl text-[#d4a24d] sm:text-4xl">Event Configuration</h1>
            <p className="mt-2 text-sm text-gray-400">
              Set the start and end times; the homepage and past-event archive follow the schedule automatically.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => {
                setForm(
                  isCreating
                    ? events.find((event) => event.slug === "headless-society") || DEFAULT_SOCIETY_EVENT
                    : createEventForm(),
                );
                setIsCreating((creating) => !creating);
                setEditingEventId("");
                setMessage("");
              }}
              className="w-full rounded-lg border border-[#d4a24d] px-4 py-3 text-sm uppercase tracking-[0.15em] text-[#d4a24d] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-5 sm:tracking-[0.2em]"
            >
              {isCreating ? "Cancel New Event" : "Create Event"}
            </button>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="w-full rounded-lg border border-white/20 px-4 py-3 text-sm uppercase tracking-[0.15em] text-gray-300 sm:w-auto sm:px-5 sm:tracking-[0.2em]"
            >
              Back to Dashboard
            </button>
          </div>
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
                required
              />
              <Field
                label="Venue"
                name="venue"
                value={form.venue}
                onChange={handleChange}
                required
              />
              <Field
                label="Start Date & Time (WAT)"
                name="eventDateTime"
                type="datetime-local"
                value={form.eventDateTime}
                onChange={handleChange}
                required
              />
              <Field
                label="End Date & Time (WAT)"
                name="eventEndDateTime"
                type="datetime-local"
                value={form.eventEndDateTime || ""}
                onChange={handleChange}
                required
              />
              <Field
                label="Poster Image URL (Optional)"
                name="imageUrl"
                type="url"
                value={form.imageUrl || ""}
                onChange={handleChange}
                placeholder="https://…"
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
              {saving ? "Saving..." : isCreating ? "Create Draft Event" : "Save Event Settings"}
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
              <p className="mt-2 text-sm text-gray-400">
                Ends: {form.eventEndDateTime ? formatEventDateTime(form.eventEndDateTime) : "Set an end date and time"}
              </p>
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

        {!loading && !loadError && (
          <section className="mt-8 rounded-3xl border border-[#22170a] bg-[#0b0907] p-4 sm:p-8">
            <h2 className="font-serif text-2xl text-[#d4a24d]">Event History</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <article key={event.id} className="rounded-xl border border-white/10 bg-[#140f0a] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-white">{event.eventName}</h3>
                    <span className="text-xs uppercase tracking-wider text-[#f1ca7b]">
                      {event.isCurrent ? "CURRENT · " : ""}{event.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">{event.venue}</p>
                  <p className="mt-1 text-xs text-gray-500">{formatEventDateTime(event.eventDateTime)}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {!event.isHistorical && (
                      <button
                        type="button"
                        onClick={() => {
                          setForm(event);
                          setIsCreating(false);
                          setEditingEventId(event.id);
                          setMessage("");
                        }}
                        className="rounded border border-white/20 px-3 py-2 text-xs text-gray-200"
                      >
                        Edit
                      </button>
                    )}
                    {!event.published && (
                      <button
                        type="button"
                        onClick={() => publishEvent(event.id)}
                        className="rounded border border-[#d4a24d] px-3 py-2 text-xs text-[#f1ca7b]"
                      >
                        Publish
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
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
