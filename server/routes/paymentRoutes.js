const express = require("express");

const router = express.Router();

const {
  initializeTransaction,
  verifyTransaction,
  handleFlutterwaveWebhook,
} = require("../controllers/paymentController");

// Flutterwave Payment Initialization
router.post(
  "/initialize",
  initializeTransaction
);

// Verify Payment
router.get("/verify", verifyTransaction);
router.get("/verify/:transactionId", verifyTransaction);
router.post("/webhook", handleFlutterwaveWebhook);

module.exports = router;