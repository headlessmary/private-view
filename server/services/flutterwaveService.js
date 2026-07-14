const axios = require("axios");


const flutterwave = axios.create({
  baseURL: "https://api.flutterwave.com/v3",
  headers: {
    Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

const initializePayment = async ({
  fullName,
  email,
  phone,
  amount,
  reference,
}) => {
  const frontendUrl = (process.env.FRONTEND_URL || "").replace(/\/$/, "");
  const redirectUrl =
    process.env.FLW_REDIRECT_URL ||
    (frontendUrl
      ? `${frontendUrl}/payment-success`
      : "https://www.headlessmary.com/payment-success");

  const customerName = (fullName || "").trim();
  const customerEmail = (email || "").trim();
  const customerPhone = String(phone || "").trim();
  const normalizedAmount = Number(amount);

  const customizations = {
    title: "The Private View: Art & Indulgence",
    description: "Event Ticket Purchase",
  };

  if (frontendUrl) {
    customizations.logo = `${frontendUrl}/logo.png`;
  }

  const response = await flutterwave.post("/payments", {
    tx_ref: reference,
    amount: normalizedAmount,
    currency: "NGN",
    redirect_url: redirectUrl,

    customer: {
      email: customerEmail,
      phonenumber: customerPhone,
      phone_number: customerPhone,
      name: customerName,
    },

    customizations,
  });

  return response.data.data;
};

const verifyPayment = async (transactionId) => {
  const response = await flutterwave.get(
    `/transactions/${transactionId}/verify`
  );

  return response.data.data;
};

const verifyPaymentByReference = async (reference) => {
  const response = await flutterwave.get(
    "/transactions/verify_by_reference",
    {
      params: {
        tx_ref: reference,
      },
    }
  );

  return response.data.data;
};

module.exports = {
  initializePayment,
  verifyPayment,
  verifyPaymentByReference,
};