import { useEffect, useState } from "react";
import API_URL from "../../config/api";

export default function Attendees() {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const loadAttendees = async () => {
    try {
      const token = localStorage.getItem("adminToken");

     const response = await fetch(`${API_URL}/api/admin/attendees`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setAttendees(data.attendees);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await loadAttendees();
    };

    void initialize();
  }, []);

  const checkIn = async (reference) => {
    if (!window.confirm("Check in this attendee?")) return;

    try {
      const token = localStorage.getItem("adminToken");

    const response = await fetch(`${API_URL}/api/admin/check-in`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    reference,
  }),
});

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert("Guest checked in successfully.");

      loadAttendees();

    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = attendees.filter((guest) => {
    const value = search.toLowerCase();

    return (
      guest.fullName.toLowerCase().includes(value) ||
      guest.email.toLowerCase().includes(value) ||
      guest.reference.toLowerCase().includes(value)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-serif text-[#d4a24d] sm:text-4xl lg:text-5xl">
          Attendees
        </h1>

        <p className="mt-3 text-base text-gray-400 sm:text-lg">
          Total Guests: {filtered.length}
        </p>

        <input
          placeholder="Search attendee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-6 mb-6 h-14 w-full rounded-lg border border-[#333] bg-[#141414] px-4 text-base sm:mt-8 sm:mb-8 sm:h-14 sm:px-5 sm:text-lg"
        />

        <div className="overflow-x-auto rounded-xl border border-[#222]">

          <table className="w-full  min-w-225">

            <thead className="bg-[#111]">

              <tr>

                <th className="whitespace-nowrap p-3 text-left text-xs uppercase tracking-wide sm:p-4 sm:text-sm">Guest</th>

                <th className="whitespace-nowrap p-3 text-left text-xs uppercase tracking-wide sm:p-4 sm:text-sm">Ticket</th>

                <th className="whitespace-nowrap p-3 text-left text-xs uppercase tracking-wide sm:p-4 sm:text-sm">Payment</th>

                <th className="whitespace-nowrap p-3 text-left text-xs uppercase tracking-wide sm:p-4 sm:text-sm">Checked In</th>

                <th className="whitespace-nowrap p-3 text-left text-xs uppercase tracking-wide sm:p-4 sm:text-sm">Reference</th>

                <th className="whitespace-nowrap p-3 text-center text-xs uppercase tracking-wide sm:p-4 sm:text-sm">Action</th>

              </tr>

            </thead>

            <tbody>

              {filtered.map((guest) => (

                <tr
                  key={guest.id}
                  className="border-t border-[#222]"
                >

                  <td className="whitespace-nowrap p-3 text-sm sm:p-4 sm:text-base">
                    <div className="font-semibold text-sm sm:text-base">
                      {guest.fullName}
                    </div>

                    <div className="text-xs text-gray-400 sm:text-sm">
                      {guest.email}
                    </div>
                  </td>

                  <td className="whitespace-nowrap p-3 text-sm sm:p-4 sm:text-base">
                    {guest.ticketType}
                  </td>

                  <td className="whitespace-nowrap p-3 text-sm sm:p-4 sm:text-base">

                    <span
                      className={`rounded-full px-2 py-1 text-xs sm:px-3 sm:text-sm ${
                        guest.paymentStatus === "SUCCESS"
                          ? "bg-green-700"
                          : "bg-red-700"
                      }`}
                    >
                      {guest.paymentStatus}
                    </span>

                  </td>

                  <td className="whitespace-nowrap p-3 text-sm sm:p-4 sm:text-base">
                    {guest.checkedIn ? (
                      <span className="text-green-400">
                        ✔ Yes
                      </span>
                    ) : (
                      <span className="text-yellow-400">
                        Waiting
                      </span>
                    )}

                  </td>

                  <td className="whitespace-nowrap p-3 text-sm sm:p-4 sm:text-base">
                    {guest.reference}
                  </td>

                  <td className="whitespace-nowrap p-3 text-sm sm:p-4 sm:text-base">

                    {!guest.checkedIn && (
                      <button
                        onClick={() =>
                          checkIn(guest.reference)
                        }
                        className="whitespace-nowrap rounded-lg bg-[#d4a24d] px-4 py-2 text-sm font-medium text-black sm:px-5 sm:text-base"
                      >
                        Check In
                      </button>
                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </section>
  );
}