const express = require("express");
const router = express.Router();

const {
  createTicket,
  verifyTicketPayment,
} = require("../controllers/ticketController");

const {
  sendTicketEmail,
} = require("../services/emailService");

// Create Ticket
router.post("/", createTicket);

// Verify Payment
router.post("/verify", verifyTicketPayment);

// ===========================
// Test Email
// ===========================
router.get("/test-email", async (req, res) => {
  try {
    await sendTicketEmail({
      fullName: "Joy Kuroko",
      email: process.env.EMAIL_USER, 
      ticketType: "VIP",
      reference: "PV-TEST-001",
      qrCode: "/uploads/qr/test.png",
    });

    return res.json({
      success: true,
      message: "Email sent successfully.",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;