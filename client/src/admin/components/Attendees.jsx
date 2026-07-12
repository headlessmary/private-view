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

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl sm:text-4xl font-serif text-[#d4a24d]">
          Attendees
        </h1>

        <p className="text-gray-400 mt-2">
          Total Guests: {filtered.length}
        </p>

        <input
          placeholder="Search attendee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
           className="w-full mt-6 mb-6 sm:mt-8 sm:mb-8 h-12 sm:h-14 rounded-lg bg-[#141414] border border-[#333] px-4 sm:px-5 text-sm sm:text-base"
        />

        <div className="overflow-x-auto rounded-xl border border-[#222]">

          <table className="w-full  min-w-225">

            <thead className="bg-[#111]">

              <tr>

                <th className="p-3 sm:p-4 text-left text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap">Guest</th>

                <th className="p-3 sm:p-4 text-left text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap">Ticket</th>

                <th className="p-3 sm:p-4 text-left text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap">Payment</th>

                <th className="p-3 sm:p-4 text-left text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap">Checked In</th>

                <th className="p-3 sm:p-4 text-left text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap">Reference</th>

                <th className="p-3 sm:p-4 text-center text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap">Action</th>

              </tr>

            </thead>

            <tbody>

              {filtered.map((guest) => (

                <tr
                  key={guest.id}
                  className="border-t border-[#222]"
                >

                  <td className="p-3 sm:p-4 text-sm whitespace-nowrap">

                    <div  className="font-semibold text-sm sm:text-base">
                      {guest.fullName}
                    </div>

                    <div  className="text-xs sm:text-sm text-gray-400">
                      {guest.email}
                    </div>

                  </td>

                  <td className="p-3 sm:p-4 text-sm whitespace-nowrap">
                    {guest.ticketType}
                  </td>

                  <td className="p-3 sm:p-4 text-sm whitespace-nowrap">

                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                        guest.paymentStatus === "SUCCESS"
                          ? "bg-green-700"
                          : "bg-red-700"
                      }`}
                    >
                      {guest.paymentStatus}
                    </span>

                  </td>

                  <td className="p-3 sm:p-4 text-sm whitespace-nowrap">

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

                  <td className="p-3 sm:p-4 text-sm whitespace-nowrap">
                    {guest.reference}
                  </td>

                  <td className="p-3 sm:p-4 text-sm whitespace-nowrap">

                    {!guest.checkedIn && (
                      <button
                        onClick={() =>
                          checkIn(guest.reference)
                        }
                        className="bg-[#d4a24d] text-black px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap"
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