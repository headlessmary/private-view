const express = require("express");
const transporter = require("../config/mail");

const router = express.Router();

router.get("/test-email", async (req, res) => {
  console.log("📧 Testing email...");

  try {
    console.log("Sending email...");

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_USER,
      subject: "Private View Test",
      text: "This is a test email.",
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

module.exports = router;