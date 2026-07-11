import { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import API_URL from "../../config/api";

export default function QRScanner() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastScanned, setLastScanned] = useState("");
  const [successState, setSuccessState] = useState(null);
  const [errorState, setErrorState] = useState("");

  const playSuccess = () => {
  const audio = new Audio("/sounds/success.mp3");
  audio.play().catch(() => {});
};

const playError = () => {
  const audio = new Audio("/sounds/error.mp3");
  audio.play().catch(() => {});
};

  useEffect(() => {
    if (!successState && !errorState) return;

    const timer = setTimeout(() => {
      setSuccessState(null);
      setErrorState("");
      setMessage("");
      setLastScanned("");
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [successState, errorState]);

  const resetScannerView = () => {
    setMessage("");
    setLastScanned("");
    setSuccessState(null);
    setErrorState("");
    setLoading(false);
  };

  const verifyTicket = async (reference) => {
    if (loading) return;

    setLoading(true);
    setMessage("");
    setErrorState("");

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_URL}/api/admin/check-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reference }),
      });

      const data = await response.json();

      if (!response.ok) {
        playSuccess();
        throw new Error(data.message || "Unable to verify ticket");
      }

      playSuccess();

      const attendee = data.attendee || {};
      const checkedAt = new Date().toLocaleTimeString("en-NG", {
        hour: "numeric",
        minute: "2-digit",
      });

      setSuccessState({
        fullName: attendee.fullName || "Guest",
        ticketType: attendee.ticketType || "Guest",
        checkedAt,
      });
      setMessage(`✅ ${attendee.fullName || "Guest"} checked in successfully`);
    } catch (err) {
      playError();
      setErrorState(err.message || "Scan failed");
      setMessage(`❌ ${err.message || "Scan failed"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = (results) => {
    if (!results?.length) return;

    const reference = results[0].rawValue;

    if (!reference || loading || reference === lastScanned) return;

    setLastScanned(reference);
    verifyTicket(reference);
  };

  return (
    <section className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div className="text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]" />
            <p className="text-sm uppercase tracking-[0.35em] text-[#d4a24d]">Camera Connected</p>
          </div>

          <h1 className="font-serif text-4xl text-[#d4a24d] sm:text-5xl">QR Ticket Scanner</h1>
          <p className="mt-3 text-gray-400">Scan attendee tickets for instant check-in.</p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#d4a24d]/50 bg-[#0b0907] p-3 shadow-[0_0_40px_rgba(0,0,0,0.35)]">
          {successState ? (
            <div className="flex min-h-105 flex-col items-center justify-center rounded-[1.25rem] border border-green-500/40 bg-linear-to-br from-green-950/60 to-[#07120a] text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-3xl text-green-300">✓</div>
              <p className="text-3xl font-semibold text-white">{successState.fullName}</p>
              <p className="mt-2 text-lg text-[#d4a24d]">{successState.ticketType}</p>
              <div className="mt-8 rounded-2xl border border-green-500/30 bg-black/30 px-6 py-4">
                <p className="text-sm uppercase tracking-[0.35em] text-green-300">Checked In</p>
                <p className="mt-2 text-xl font-semibold text-white">{successState.checkedAt}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 text-sm text-[#d4a24d]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#d4a24d]" />
                <span>Ready to Scan</span>
              </div>

              <div className="relative overflow-hidden rounded-[1.25rem] border border-[#2d1e09]">
                <Scanner
                  onScan={handleScan}
                  onError={(err) => console.log(err)}
                  constraints={{ facingMode: "environment" }}
                />

                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute left-6 top-6 h-12 w-12 rounded-tl-2xl border-l-2 border-t-2 border-[#f1ca7b]" />
                  <div className="absolute right-6 top-6 h-12 w-12 rounded-tr-2xl border-r-2 border-t-2 border-[#f1ca7b]" />
                  <div className="absolute bottom-6 left-6 h-12 w-12 rounded-bl-2xl border-b-2 border-l-2 border-[#f1ca7b]" />
                  <div className="absolute bottom-6 right-6 h-12 w-12 rounded-br-2xl border-b-2 border-r-2 border-[#f1ca7b]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {loading && !successState && (
          <div className="rounded-2xl border border-[#d4a24d]/30 bg-[#11110e] px-5 py-4 text-center text-lg text-[#d4a24d]">
            Verifying ticket...
          </div>
        )}

        {message && (
          <div
            className={`rounded-2xl border p-6 text-center text-lg font-semibold transition-all ${
              message.startsWith("✅")
                ? "border-green-500 bg-green-900/30 text-green-300"
                : "border-red-500 bg-red-900/30 text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        {(errorState || successState) && (
          <button
            type="button"
            onClick={resetScannerView}
            className="rounded-lg border border-[#d4a24d] px-5 py-3 text-sm uppercase tracking-[0.25em] text-[#d4a24d]"
          >
            Reset Scanner
          </button>
        )}
      </div>
    </section>
  );
}