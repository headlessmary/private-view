import { useEffect, useState } from "react";

export default function Attendees() {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const loadAttendees = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        "http://localhost:5000/api/admin/attendees",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

      const response = await fetch(
        "http://localhost:5000/api/admin/check-in",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reference,
          }),
        }
      );

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
    <section className="min-h-screen bg-black text-white p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-serif text-[#d4a24d]">
          Attendees
        </h1>

        <p className="text-gray-400 mt-2">
          Total Guests: {filtered.length}
        </p>

        <input
          placeholder="Search attendee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mt-8 mb-8 h-14 rounded-lg bg-[#141414] border border-[#333] px-5"
        />

        <div className="overflow-auto rounded-xl border border-[#222]">

          <table className="w-full">

            <thead className="bg-[#111]">

              <tr>

                <th className="p-4 text-left">Guest</th>

                <th className="p-4 text-left">Ticket</th>

                <th className="p-4 text-left">Payment</th>

                <th className="p-4 text-left">Checked In</th>

                <th className="p-4 text-left">Reference</th>

                <th className="p-4 text-center">Action</th>

              </tr>

            </thead>

            <tbody>

              {filtered.map((guest) => (

                <tr
                  key={guest.id}
                  className="border-t border-[#222]"
                >

                  <td className="p-4">

                    <div className="font-semibold">
                      {guest.fullName}
                    </div>

                    <div className="text-sm text-gray-400">
                      {guest.email}
                    </div>

                  </td>

                  <td className="p-4">
                    {guest.ticketType}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        guest.paymentStatus === "SUCCESS"
                          ? "bg-green-700"
                          : "bg-red-700"
                      }`}
                    >
                      {guest.paymentStatus}
                    </span>

                  </td>

                  <td className="p-4">

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

                  <td className="p-4 text-xs">
                    {guest.reference}
                  </td>

                  <td className="p-4 text-center">

                    {!guest.checkedIn && (
                      <button
                        onClick={() =>
                          checkIn(guest.reference)
                        }
                        className="bg-[#d4a24d] text-black px-5 py-2 rounded-lg"
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