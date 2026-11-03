const axios = require("axios");
const { getFlutterwaveSecretKey } = require("../config/flutterwaveCredentials");
const { requestFlutterwave } = require("../config/flutterwaveRequest");

const flutterwave = axios.create({
  baseURL: "https://api.flutterwave.com/v3",
  headers: {
    "Content-Type": "application/json",
  },
});

flutterwave.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getFlutterwaveSecretKey()}`;
  return config;
});

const toAbsoluteUrl = (value) => {
  if (!value) {
    return "";
  }

  const trimmed = String(value).trim();
  if (!trimmed) {
    return "";
  }

  try {
    return new URL(trimmed).toString().replace(/\/$/, "");
  } catch {
    try {
      return new URL(`https://${trimmed}`).toString().replace(/\/$/, "");
    } catch {
      return "";
    }
  }
};

const initializePayment = async ({
  fullName,
  email,
  phone,
  amount,
  reference,
  redirectUrl: redirectUrlInput,
  eventName = "Headless Society",
}) => {
  const frontendUrl = toAbsoluteUrl(process.env.FRONTEND_URL);
  const configuredRedirectUrl = toAbsoluteUrl(process.env.FLW_REDIRECT_URL);
  const requestRedirectUrl = toAbsoluteUrl(redirectUrlInput);

  const safeFallbackRedirectUrl = "https://www.headlessmary.com/payment-success";

  const finalRedirectUrl =
    requestRedirectUrl ||
    configuredRedirectUrl ||
    (frontendUrl
      ? `${frontendUrl}/payment-success`
      : safeFallbackRedirectUrl);

  const customerName = (fullName || "").trim();
  const customerEmail = (email || "").trim();
  const customerPhone = String(phone || "").trim();
  const normalizedAmount = Number(amount);

  const customizations = {
    title: eventName,
    description: "Event Ticket Purchase",
  };

  if (frontendUrl) {
    customizations.logo = `${frontendUrl}/logo.png`;
  }

  return requestFlutterwave(
    () =>
      flutterwave.post("/payments", {
        tx_ref: reference,
        amount: normalizedAmount,
        currency: "NGN",
        redirect_url: toAbsoluteUrl(finalRedirectUrl) || safeFallbackRedirectUrl,
        customer: {
          email: customerEmail,
          phonenumber: customerPhone,
          phone_number: customerPhone,
          name: customerName,
        },
        customizations,
      }),
    "payment initialization",
  );
};

const verifyPayment = (transactionId) =>
  requestFlutterwave(
    () => flutterwave.get(`/transactions/${transactionId}/verify`),
    "transaction verification",
  );

const verifyPaymentByReference = (reference) =>
  requestFlutterwave(
    () =>
      flutterwave.get("/transactions/verify_by_reference", {
        params: {
          tx_ref: reference,
        },
      }),
    "transaction verification",
  );

module.exports = {
  initializePayment,
  verifyPayment,
  verifyPaymentByReference,
};
