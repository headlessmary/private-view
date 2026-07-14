const express = require("express");

const {
  getEmailDiagnostics,
  sendTicketEmail,
} = require("../services/emailService");


const router = express.Router();

const getTestRecipient = (email) => {
  if (email) {
    return email;
  }

  const senderMatch = process.env.MAIL_FROM?.match(/<(.+)>$/);
  return senderMatch ? senderMatch[1].trim() : process.env.MAIL_FROM;
};

router.get("/test-email", async (req, res) => {
  console.log("📧 Testing email...");

  try {
    console.log("Sending email...");
    const recipient = getTestRecipient(req.query.email);

    if (!recipient) {
      return res.status(400).json({
        success: false,
        message: "Provide ?email=you@example.com or configure MAIL_FROM.",
      });
    }

    const info = await sendTicketEmail({
      fullName: "Private View Test",
      email: recipient,
      ticketType: "VIP",
      reference: "PV-TEST-EMAIL",
      qrCode: "/uploads/qr/test.png",
    });

    console.log("✅ Email sent:", info);

    return res.json({
      success: true,
      info,
    });
  } catch (err) {
    console.error("❌ EMAIL ERROR");
    console.error(err);
    console.error(err.code);
    console.error(err.response);

    return res.status(500).json({
      success: false,
      message: err.message,
      code: err.code,
      response: err.response,
    });
  }
});

router.get("/email-diagnostics", (req, res) => {
  return res.json({
    success: true,
    diagnostics: getEmailDiagnostics(),
  });
});

module.exports = router;