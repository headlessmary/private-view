const prisma = require("../database/prisma");

const {
  verifyPayment,
} = require("../services/paystackService");

const {
  generateQRCode,
} = require("../services/qrService");

const verifyTransaction = async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required.",
      });
    }

    const payment = await verifyPayment(reference);

    if (payment.status !== "success") {
      return res.status(400).json({
        success: false,
        message: "Payment not successful.",
      });
    }

    const existingAttendee = await prisma.attendee.findUnique({
      where: {
        reference,
      },
    });

    if (!existingAttendee) {
      return res.status(404).json({
        success: false,
        message: "Attendee not found.",
      });
    }

    const qrCode = existingAttendee.qrCode || await generateQRCode(reference);

    const attendee = await prisma.attendee.update({
      where: {
        reference,
      },
      data: {
        paymentStatus: "SUCCESS",
        qrCode,
      },
    });

    return res.json({
      success: true,
      message: "Payment verified successfully.",
      attendee,
      qrCode,
    });

  } catch (error) {
    console.error(error.response?.data || error);

    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
};

module.exports = {
  verifyTransaction,
};