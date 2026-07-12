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
  const response = await flutterwave.post("/payments", {
    tx_ref: reference,
    amount,
    currency: "NGN",
    redirect_url: `${process.env.FRONTEND_URL}/payment-success`,

    customer: {
      email,
      phonenumber: phone,
      name: fullName,
    },

    customizations: {
      title: "The Private View: Art & Indulgence",
      description: "Event Ticket Purchase",
      logo: `${process.env.FRONTEND_URL}/logo.png`,
    },
  });

  return response.data.data;
};

const verifyPayment = async (transactionId) => {
  const response = await flutterwave.get(
    `/transactions/${transactionId}/verify`
  );

  return response.data.data;
};

module.exports = {
  initializePayment,
  verifyPayment,
};