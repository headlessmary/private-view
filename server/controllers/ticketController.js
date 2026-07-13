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

// =========================
// Create Ticket
// =========================
const createTicket = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      ticketType,
      amount,
    } = req.body || {};

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

    const existing = await prisma.attendee.findUnique({
      where: {
        email,
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email has already been used.",
      });
    }

    const reference = uuid();

    await prisma.attendee.create({
      data: {
        fullName,
        email,
        phone,
        ticketType: normalizedTicketType,
        amount: Number(amount),
        reference,
      },
    });

    const payment = await initializePayment({
    fullName,
    email,
    phone,
    amount,
    reference,
});

   return res.status(201).json({
  success: true,
  paymentLink: payment.link,
  reference,
});

  } catch (error) {
    console.error("CREATE TICKET ERROR:", error.response?.data || error);

    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
};

// =========================
// Verify Payment
// =========================
const verifyTicketPayment = async (req, res) => {
  try {
    const { transactionId } = req.params;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required.",
      });
    }

    const payment = await verifyPayment(transactionId);

    if (payment.status !== "successful") {
    return res.status(400).json({
        success:false,
        message:"Payment verification failed."
    });
}
const attendee = await prisma.attendee.findUnique({
    where:{
        reference: payment.tx_ref,
    },
});

    if (!attendee) {
      return res.status(404).json({
        success: false,
        message: "Attendee not found.",
      });
    }

    const qrResult = attendee.qrCode
      ? { qrCode: attendee.qrCode, qrToken: attendee.qrToken }
      : await generateQRCode(reference, attendee.qrToken);

    const updatedAttendee = await prisma.attendee.update({
      where: {
        reference,
      },
      data: {
        paymentStatus: "SUCCESS",
        qrCode: qrResult.qrCode,
        qrToken: qrResult.qrToken || attendee.qrToken,
        qrTokenUsed: false,
      },
    });

    await sendTicketEmail({
      fullName: updatedAttendee.fullName,
      email: updatedAttendee.email,
      ticketType: updatedAttendee.ticketType,
      reference: updatedAttendee.reference,
      qrCode: updatedAttendee.qrCode,
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
      attendee: updatedAttendee,
      qrCode: updatedAttendee.qrCode,
    });

  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error.response?.data || error);

    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
};

module.exports = {
  createTicket,
  verifyTicketPayment,
};