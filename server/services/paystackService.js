const paystack = require("../config/paystack");

const initializePayment = async ({
  email,
  amount,
  reference,
}) => {
  const response = await paystack.post(
    "/transaction/initialize",
    {
      email,
      amount: amount * 100,
      reference,
      callback_url: process.env.PAYSTACK_CALLBACK_URL,
    }
  );

  return response.data.data;
};

const verifyPayment = async (reference) => {
  const response = await paystack.get(
    `/transaction/verify/${reference}`
  );

  return response.data.data;
};

module.exports = {
  initializePayment,
  verifyPayment,
};