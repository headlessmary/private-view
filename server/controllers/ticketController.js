const prisma = require("../database/prisma");
const { v4: uuid } = require("uuid");

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


// ==========================================
// CREATE TICKET
// ==========================================
const createTicket = async (req, res) => {
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

    const normalizedTicketType = ticketType.toUpperCase();

    if (!["VIP", "REGULAR"].includes(normalizedTicketType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket type.",
      });
    }

    // Generate unique ticket reference
    const reference = uuid();

    // FIRST initialize payment
    const payment = await initializePayment({
      fullName,
      email,
      phone,
      amount,
      reference,
    });

    // ONLY create attendee if Flutterwave succeeds
    await prisma.attendee.create({
      data: {
        fullName,
        email,
        phone,
        ticketType: normalizedTicketType,
        amount: Number(amount),
        paymentStatus: "PENDING",
        reference,
      },
    });

    return res.status(201).json({
      success: true,
      paymentLink: payment.link,
      reference,
    });

  } catch (error) {
    console.error(
      "CREATE TICKET ERROR:",
      error.response?.data || error
    );

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.message || error.message,
    });
  }
};


// ==========================================
// VERIFY PAYMENT
// ==========================================
const verifyTicketPayment = async (req, res) => {
  try {
    const { transactionId } = req.params;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required.",
      });
    }

    // Verify payment with Flutterwave
    const payment = await verifyPayment(transactionId);

    if (payment.status !== "successful") {
      return res.status(400).json({
        success: false,
        message: "Payment was not successful.",
      });
    }

    // tx_ref is the reference we generated
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

    // Prevent duplicate verification
    if (attendee.paymentStatus === "SUCCESS") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified.",
        attendee,
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
      reference: updatedAttendee.reference,
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
        error.response?.data?.message || error.message,
    });
  }
};

module.exports = {
  createTicket,
  verifyTicketPayment,
};