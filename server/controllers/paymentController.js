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

const initializeTransaction = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      ticketType,
      amount,
    } = req.body;

    if (!fullName || !email || !phone || !ticketType || !amount) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const reference = `PV-${Date.now()}`;

    // Initialize Flutterwave FIRST
    const payment = await initializePayment({
      fullName,
      email,
      phone,
      amount,
      reference,
    });

    // Only save attendee if Flutterwave succeeds
    await prisma.attendee.create({
      data: {
        fullName,
        email,
        phone,
        ticketType,
        amount,
        reference,
        paymentStatus: "PENDING",
      },
    });

    return res.json({
      success: true,
      paymentLink: payment.link,
    });

  } catch (error) {
    console.error(error.response?.data || error);

    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
};

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
  initializeTransaction,
  verifyTransaction,
};