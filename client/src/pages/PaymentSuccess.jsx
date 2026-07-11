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
      const reference = searchParams.get("reference");

      if (!reference) {
        setMessage("Payment reference is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
  `${API_URL}/api/payment/verify/${reference}`
);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Payment verification failed.");
        }

        if (data.success) {
          setSuccess(true);
          setMessage(data.message || "Payment verified successfully.");
        } else {
          setSuccess(false);
          setMessage(data.message || "Payment verification failed.");
        }
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
            <div className="text-6xl mb-6">✅</div>

            <h1 className="text-5xl font-serif text-[#D4A24D]">
              Payment Successful
            </h1>

            <p className="mt-6 text-gray-300 leading-8">
              Thank you for purchasing your ticket for
              <span className="text-[#D4A24D]">
                {" "}The Private View: Art & Indulgence.
              </span>
            </p>

            <p className="mt-4 text-gray-400">
              Your QR ticket has been generated successfully.
              Please check your inbox if email delivery is enabled.
            </p>

            <Link
              to="/"
              className="inline-block mt-10 bg-[#D4A24D] hover:bg-[#C89A3D] text-black px-8 py-4 uppercase tracking-[0.2em] font-semibold transition"
            >
              Back to Homepage
            </Link>
          </>
        ) : (
          <>
            <div className="text-6xl mb-6">❌</div>

            <h1 className="text-5xl font-serif text-red-500">
              Payment Failed
            </h1>

            <p className="mt-6 text-gray-400">
              {message || "We couldn't verify your payment. Please contact support if your account has been debited."}
            </p>

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