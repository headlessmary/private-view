const prisma = require("../database/prisma");

const {
  verifyPayment,
} = require("../services/flutterwaveService");

const {
  generateQRCode,
} = require("../services/qrService");

const {
  sendTicketEmail,
} = require("../services/emailService");

const verifyTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required.",
      });
    }

    const payment = await verifyPayment(transactionId);

    if (payment.status !== "successful") {
      return res.status(400).json({
        success: false,
        message: "Payment not successful.",
      });
    }

    // Flutterwave tx_ref becomes our attendee reference
    const reference = payment.tx_ref;

    const attendee = await prisma.attendee.findUnique({
      where: {
        reference,
      },
    });

    if (!attendee) {
      return res.status(404).json({
        success: false,
        message: "Attendee not found.",
      });
    }

    const qrCode =
      attendee.qrCode || (await generateQRCode(reference));

    const updatedAttendee = await prisma.attendee.update({
      where: {
        reference,
      },
      data: {
        paymentStatus: "SUCCESS",
        qrCode,
      },
    });

    await sendTicketEmail({
      fullName: updatedAttendee.fullName,
      email: updatedAttendee.email,
      ticketType: updatedAttendee.ticketType,
      reference,
      qrCode,
    });

    return res.json({
      success: true,
      message: "Payment verified successfully.",
      attendee: updatedAttendee,
    });

  } catch (error) {
    console.error(error.response?.data || error);

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.message || error.message,
    });
  }
};

module.exports = {
  verifyTransaction,
};