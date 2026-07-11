const express = require("express");

const router = express.Router();

const {
  verifyTransaction,
} = require("../controllers/paymentController");

router.get(
  "/verify/:reference",
  verifyTransaction
);

module.exports = router;