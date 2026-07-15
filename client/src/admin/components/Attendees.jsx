import { useEffect, useState } from "react";
import API_URL from "../../config/api";

export default function Attendees() {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [completionResult, setCompletionResult] = useState(null);

  const getAssetUrl = (assetPath) => {
    if (!assetPath) {
      return "";
    }

    if (assetPath.startsWith("http://") || assetPath.startsWith("https://")) {
      return assetPath;
    }

    return `${API_URL}${assetPath}`;
  };

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

  const completePayment = async (guest) => {
    if (!window.confirm("Complete this pending payment now?")) return;

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_URL}/api/admin/complete-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reference: guest.reference,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setCompletionResult({
        success: true,
        message: data.message || "Payment completed successfully.",
        qrCode: data.qrCode || data.attendee?.qrCode || "",
        reference: data.attendee?.reference || guest.reference,
      });

      alert(data.message || "Payment completed successfully.");

      await loadAttendees();
    } catch (err) {
      setCompletionResult({
        success: false,
        message: err.message,
        qrCode: "",
        reference: guest.reference,
      });
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

        {completionResult && (
          <div
            className={`mb-6 rounded-xl border p-4 sm:p-5 ${
              completionResult.success
                ? "border-[#d4a24d] bg-[#141008]"
                : "border-red-700 bg-red-950/30"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d4a24d]">
                  Complete Payment Result
                </p>
                <p className="mt-2 text-sm sm:text-base">{completionResult.message}</p>
                {completionResult.reference && (
                  <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                    Reference: {completionResult.reference}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setCompletionResult(null)}
                className="rounded-md border border-[#2d2111] px-3 py-1 text-xs text-gray-300 hover:border-[#d4a24d] hover:text-white"
              >
                Close
              </button>
            </div>

            {completionResult.success && completionResult.qrCode && (
              <div className="mt-4 inline-block rounded-lg border border-[#d4a24d] bg-white p-2">
                <img
                  src={getAssetUrl(completionResult.qrCode)}
                  alt="Generated barcode"
                  className="h-32 w-32 sm:h-40 sm:w-40"
                />
              </div>
            )}
          </div>
        )}

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
                      <span className="inline-flex items-center rounded-full bg-green-700/30 px-3 py-1 text-sm font-medium text-green-400">
                        ✔ Used
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-yellow-700/30 px-3 py-1 text-sm font-medium text-yellow-400">
                        Waiting
                      </span>
                    )}
                  </td>

                  <td className="whitespace-nowrap p-3 text-sm sm:p-4 sm:text-base">
                    {guest.reference}
                  </td>

                  <td className="whitespace-nowrap p-3 text-sm sm:p-4 sm:text-base">
                    <div className="flex flex-wrap justify-center gap-2">
                      {!guest.checkedIn && (
                        <button
                          onClick={() => checkIn(guest.reference)}
                          className="whitespace-nowrap rounded-lg bg-[#d4a24d] px-4 py-2 text-sm font-medium text-black sm:px-5 sm:text-base"
                        >
                          Check In
                        </button>
                      )}

                      {guest.paymentStatus === "PENDING" && (
                        <button
                          onClick={() => completePayment(guest)}
                          className="whitespace-nowrap rounded-lg border border-[#d4a24d] px-4 py-2 text-sm font-medium text-[#d4a24d] sm:px-5 sm:text-base"
                        >
                          Complete Payment
                        </button>
                      )}
                    </div>
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