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
    const transactionId = req.params.transactionId || req.query.transaction_id || req.query.transactionId;
    const txRef = req.query.tx_ref || req.query.txRef || req.query.reference || req.query.referenceId;
    const incomingStatus = String(req.query.status || "").trim().toLowerCase();

    let payment = null;
    let reference = txRef;

    if (transactionId) {
      try {
        payment = await verifyPayment(transactionId);
        reference = payment?.tx_ref || payment?.txRef || payment?.reference || reference;
      } catch (error) {
        if (!reference || !["successful", "success", "succeeded", "completed", "paid"].includes(incomingStatus)) {
          throw error;
        }

        console.warn("Flutterwave verification failed; using callback status to complete payment.", error.message);
      }
    }

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required.",
      });
    }

    const normalizedStatus = String(payment?.status || incomingStatus || "").trim().toLowerCase();
    const isSuccessful = ["successful", "success", "succeeded", "completed", "paid"].includes(normalizedStatus);

    if (!isSuccessful) {
      return res.status(400).json({
        success: false,
        message: "Payment not successful.",
      });
    }

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
    if (attendee.paymentStatus === "SUCCESS") {
  return res.json({
    success: true,
    message: "Payment already verified.",
    attendee,
    qrCode: attendee.qrCode,
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
      reference,
      qrCode: updatedAttendee.qrCode,
    });

    return res.json({
      success: true,
      message: "Payment verified successfully.",
      attendee: updatedAttendee,
      qrCode: updatedAttendee.qrCode,
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
  initializeTransaction,
  verifyTransaction,
};