const express = require("express");

const router = express.Router();

const {
  initializeTransaction,
  verifyTransaction,
} = require("../controllers/paymentController");

// Flutterwave Payment Initialization
router.post(
  "/initialize",
  initializeTransaction
);

// Verify Payment
router.get("/verify", verifyTransaction);
router.get("/verify/:transactionId", verifyTransaction);

module.exports = router;