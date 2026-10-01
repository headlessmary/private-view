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
const {
  findCurrentEvent,
} = require("../services/eventService");
const {
  toTicketPrices,
} = require("../services/eventConfigService");


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
      !ticketType
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const normalizedTicketType = String(ticketType).trim().toUpperCase();

    const event = await findCurrentEvent();

    if (!event) {
      return res.status(409).json({
        success: false,
        message: "There is no published event currently accepting ticket purchases.",
      });
    }

    const ticketPrices = toTicketPrices(event);
    const ticketPrice = Object.prototype.hasOwnProperty.call(
      ticketPrices,
      normalizedTicketType
    )
      ? ticketPrices[normalizedTicketType]
      : 0;

    if (!ticketPrice || Number(amount) !== ticketPrice) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket type or amount for the current event.",
      });
    }

    // Generate unique ticket reference
    const reference = uuid();

    // FIRST initialize payment
    const payment = await initializePayment({
      fullName,
      email,
      phone,
      amount: ticketPrice,
      reference,
      eventName: event.eventName,
    });

    // ONLY create attendee if Flutterwave succeeds
    await prisma.attendee.create({
      data: {
        eventId: event.id,
        fullName,
        email,
        phone,
        ticketType: normalizedTicketType,
        amount: ticketPrice,
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
      include: { event: { select: { id: true, eventName: true } } },
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
      include: { event: { select: { id: true, eventName: true } } },
    });

    // Send ticket email
    await sendTicketEmail({
      fullName: updatedAttendee.fullName,
      email: updatedAttendee.email,
      ticketType: updatedAttendee.ticketType,
      reference: updatedAttendee.reference,
      qrCode,
      eventId: updatedAttendee.eventId,
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