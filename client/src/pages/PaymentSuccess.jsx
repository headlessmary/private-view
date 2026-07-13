import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API_URL from "../config/api";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      const status = searchParams.get("status");
const transactionId = searchParams.get("transaction_id");

if (!transactionId) {
  setMessage("Transaction ID is missing.");
  setLoading(false);
  return;
}

if (status === "cancelled") {
  setMessage("Payment was cancelled.");
  setLoading(false);
  return;
}

if (status !== "successful") {
  setMessage("Payment was not successful.");
  setLoading(false);
  return;
}

      try {
        const response = await fetch(
          `${API_URL}/api/payment/verify/${transactionId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Payment verification failed.");
        }

        setSuccess(data.success);
setMessage(
  data.message ||
  (data.success
    ? "Payment verified successfully."
    : "Payment verification failed.")
);
      } catch (error) {
        console.error(error);
        setSuccess(false);
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <section className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-5xl text-[#D4A24D] font-serif">
            Verifying Payment...
          </h1>

          <p className="mt-4 text-gray-400">
            Please wait while we confirm your payment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-xl w-full bg-[#0b0907] border border-[#2a1c08] rounded-3xl p-10 text-center">
        {success ? (
          <>
            <div className="w-24 h-24 mx-auto rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <span className="text-5xl">✅</span>
            </div>

            <h1 className="mt-8 text-4xl md:text-5xl font-serif text-[#D4A24D]">
              Ticket Confirmed!
            </h1>

            <p className="mt-5 text-gray-300 leading-8 text-lg">
              Thank you for purchasing your ticket for
              <span className="text-[#D4A24D] font-medium">
                {" "}
                The Private View: Art & Indulgence.
              </span>
            </p>

            {/* Notification Card */}

            <div className="mt-8 rounded-2xl border border-[#D4A24D]/20 bg-[#16110B] p-6 text-left">

              <h3 className="text-[#D4A24D] text-lg font-semibold mb-4">
                🎉 Your ticket has been successfully booked!
              </h3>

              <ul className="space-y-4 text-gray-300 text-sm leading-7">

                <li className="flex gap-3">
                  <span className="text-green-400">✔</span>
                  <span>Your payment has been confirmed.</span>
                </li>

                <li className="flex gap-3">
                  <span className="text-green-400">✔</span>
                  <span>Your QR Code ticket has been generated.</span>
                </li>

                <li className="flex gap-3">
                  <span className="text-green-400">✔</span>
                  <span>
                    A confirmation email containing your ticket has been sent to your
                    email address.
                  </span>
                </li>

                <li className="flex gap-3">
                  <span className="text-green-400">✔</span>
                  <span>
                    If you don't receive it within a few minutes, please check your
                    Spam or Promotions folder.
                  </span>
                </li>

                <li className="flex gap-3">
                  <span className="text-green-400">✔</span>
                  <span>
                    Save your QR Code. It will be scanned at the event entrance.
                  </span>
                </li>

              </ul>
            </div>

            <div className="mt-10">
              <Link
                to="/"
                className="inline-block bg-[#D4A24D] hover:bg-[#C89A3D] text-black px-10 py-4 rounded-lg uppercase tracking-[0.2em] font-semibold transition"
              >
                Return Home
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="text-6xl mb-6">❌</div>

            <h1 className="text-5xl font-serif text-red-500">
              Payment Failed
            </h1>

            <p className="mt-6 text-gray-400">{message}</p>

            <Link
              to="/buy-ticket"
              className="inline-block mt-10 bg-[#D4A24D] hover:bg-[#C89A3D] text-black px-8 py-4 uppercase tracking-[0.2em] font-semibold transition"
            >
              Try Again
            </Link>
          </>
        )}
      </div>
    </section>
  );
}