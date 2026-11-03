const axios = require("axios");
const { getFlutterwaveSecretKey } = require("./flutterwaveCredentials");
const { createSafeFlutterwaveError } = require("./flutterwaveRequest");

const flutterwave = axios.create({
  baseURL: "https://api.flutterwave.com/v3",
  headers: {
    Authorization: `Bearer ${getFlutterwaveSecretKey()}`,
    "Content-Type": "application/json",
  },
});

flutterwave.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(createSafeFlutterwaveError(error)),
);

module.exports = flutterwave;
