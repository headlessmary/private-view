const prisma = require("../database/prisma");

const {
  initializePayment,
  verifyPayment,
} = require("../services/flutterwaveService");

const {
  generateQRCode,
} = require("../services/qrService");

const {
  sendTicketEmail,
} = require("../services/emailService");

// =====================================
// INITIALIZE PAYMENT
// =====================================
const initializeTransaction = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      ticketType,
      amount,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !phone ||
      !ticketType ||
      !amount
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const reference = `PV-${Date.now()}`;

    // Create payment link first
    const payment = await initializePayment({
      fullName,
      email,
      phone,
      amount,
      reference,
    });

    // Save attendee after Flutterwave succeeds
    await prisma.attendee.create({
      data: {
        fullName,
        email,
        phone,
        ticketType,
        amount: Number(amount),
        reference,
        paymentStatus: "PENDING",
      },
    });

    return res.status(200).json({
      success: true,
      paymentLink: payment.link,
      reference,
    });

  } catch (error) {
    console.error(
      "INITIALIZE PAYMENT ERROR:",
      error.response?.data || error
    );

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Payment initialization failed",
    });
  }
};

// =====================================
// VERIFY PAYMENT
// =====================================
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

    if (
      !payment ||
      payment.status.toLowerCase() !== "successful"
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed.",
      });
    }

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

    // Already verified
    if (attendee.paymentStatus === "SUCCESS") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified.",
        attendee,
        qrCode: attendee.qrCode,
      });
    }

    // Generate QR only once
    const qrCode = attendee.qrCode
      ? attendee.qrCode
      : await generateQRCode(reference);

    const updatedAttendee = await prisma.attendee.update({
      where: {
        reference,
      },
      data: {
        paymentStatus: "SUCCESS",
        qrCode,
      },
    });

    // Send ticket email
    await sendTicketEmail({
      fullName: updatedAttendee.fullName,
      email: updatedAttendee.email,
      ticketType: updatedAttendee.ticketType,
      reference,
      qrCode,
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
      attendee: updatedAttendee,
      qrCode,
    });

  } catch (error) {
    console.error(
      "VERIFY PAYMENT ERROR:",
      error.response?.data || error
    );

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Payment verification failed",
    });
  }
};

module.exports = {
  initializeTransaction,
  verifyTransaction,
};