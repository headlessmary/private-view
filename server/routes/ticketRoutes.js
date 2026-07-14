const express = require("express");
const router = express.Router();

const {
  createTicket,
  verifyTicketPayment,
} = require("../controllers/ticketController");

const {
  sendTicketEmail,
} = require("../services/emailService");

const getTestRecipient = (email) => {
  if (email) {
    return email;
  }

  const senderMatch = process.env.MAIL_FROM?.match(/<(.+)>$/);
  return senderMatch ? senderMatch[1].trim() : process.env.MAIL_FROM;
};

// Create Ticket
router.post("/", createTicket);

// Verify Payment
router.post("/verify", verifyTicketPayment);

// ===========================
// Test Email
// ===========================
router.get("/test-email", async (req, res) => {
  try {
    const recipient = getTestRecipient(req.query.email);

    if (!recipient) {
      return res.status(400).json({
        success: false,
        message: "Provide ?email=you@example.com or configure MAIL_FROM.",
      });
    }

    await sendTicketEmail({
      fullName: "Joy Kuroko",
      email: recipient,
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