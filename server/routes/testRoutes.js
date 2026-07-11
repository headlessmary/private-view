const express = require("express");
const transporter = require("../config/mail");

const router = express.Router();

router.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_USER,
      subject: "Private View Test Email",
      html: "<h1>🎉 Your mailer is working!</h1>",
    });

    res.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;