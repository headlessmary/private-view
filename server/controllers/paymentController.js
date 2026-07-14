const prisma = require("../database/prisma");

const {
  initializePayment,
  verifyPayment,
  verifyPaymentByReference,
} = require("../services/flutterwaveService");

const {
  generateQRCode,
} = require("../services/qrService");

const {
  sendTicketEmail,
} = require("../services/emailService");

const finalizeVerifiedPayment = async (payment) => {
  if (payment.status !== "successful") {
    const error = new Error("Payment was not successful.");
    error.statusCode = 400;
    throw error;
  }

  const attendee = await prisma.attendee.findUnique({
    where: { reference: payment.tx_ref },
  });

  if (!attendee) {
    const error = new Error("Attendee not found.");
    error.statusCode = 404;
    throw error;
  }

  let qrCode = attendee.qrCode;

  if (!qrCode) {
    qrCode = await generateQRCode(payment.tx_ref);
  }

  if (attendee.paymentStatus === "SUCCESS" && attendee.qrCode) {
    return {
      attendee,
      qrCode: attendee.qrCode,
      emailSent: false,
      emailError: null,
    };
  }

  const updatedAttendee = await prisma.attendee.update({
    where: { reference: payment.tx_ref },
    data: {
      paymentStatus: "SUCCESS",
      qrCode,
    },
  });

  let emailSent = true;
  let emailError = null;

  try {
    await sendTicketEmail({
      fullName: updatedAttendee.fullName,
      email: updatedAttendee.email,
      ticketType: updatedAttendee.ticketType,
      reference: updatedAttendee.reference,
      qrCode,
    });
  } catch (error) {
    emailSent = false;
    emailError = error.message;
  }

  return {
    attendee: updatedAttendee,
    qrCode,
    emailSent,
    emailError,
  };
};

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

    const normalizedFullName = (fullName || "").trim();
    const normalizedEmail = (email || "").trim();
    const normalizedPhone = String(phone || "").trim();
    const normalizedTicketType = (ticketType || "").trim().toUpperCase();
    const normalizedAmount = Number(amount);

    if (
      !normalizedFullName ||
      !normalizedEmail ||
      !normalizedPhone ||
      !normalizedTicketType ||
      !Number.isFinite(normalizedAmount) ||
      normalizedAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment request. Please provide valid attendee details and ticket amount.",
      });
    }

    const reference = `PV-${Date.now()}`;
    const requestOrigin = String(req.headers.origin || "").trim().replace(/\/$/, "");
    const runtimeRedirectUrl = requestOrigin
      ? `${requestOrigin}/payment-success`
      : undefined;

    // Create payment link first
    const payment = await initializePayment({
      fullName: normalizedFullName,
      email: normalizedEmail,
      phone: normalizedPhone,
      amount: normalizedAmount,
      reference,
      redirectUrl: runtimeRedirectUrl,
    });

    // Save attendee after Flutterwave succeeds
    await prisma.attendee.create({
      data: {
        fullName: normalizedFullName,
        email: normalizedEmail,
        phone: normalizedPhone,
        ticketType: normalizedTicketType,
        amount: normalizedAmount,
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
   console.log("=========== VERIFY START ===========");
  console.log(req.query);
  console.log(req.params);

  try {
    const resendEmail = req.query.resend_email === "1";
    const txRef =
      req.query.tx_ref ||
      req.query.txRef ||
      req.query.reference;

    if (txRef) {
      const existingAttendee = await prisma.attendee.findUnique({
        where: { reference: txRef },
      });

      if (
        existingAttendee?.paymentStatus === "SUCCESS" &&
        existingAttendee.qrCode
      ) {
        let resendError = null;

        if (resendEmail) {
          try {
            await sendTicketEmail({
              fullName: existingAttendee.fullName,
              email: existingAttendee.email,
              ticketType: existingAttendee.ticketType,
              reference: existingAttendee.reference,
              qrCode: existingAttendee.qrCode,
            });
          } catch (error) {
            resendError = error.message;
          }
        }

        return res.json({
          success: true,
          message: resendEmail
            ? resendError
              ? "Payment verified, but the ticket email could not be resent right now."
              : "Ticket email resent successfully."
            : "Payment already verified.",
          attendee: existingAttendee,
          qrCode: existingAttendee.qrCode,
          emailSent: !resendError,
          emailError: resendError,
        });
      }
    }

    const transactionId =
      req.params.transactionId ||
      req.query.transaction_id;

    if (!transactionId && !txRef) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID or payment reference is required.",
      });
    }

    console.log("STEP 1");

    let payment;

    try {
      if (transactionId) {
        payment = await verifyPayment(transactionId);
      } else {
        payment = await verifyPaymentByReference(txRef);
      }
    } catch (error) {
      if (!txRef) {
        throw error;
      }

      payment = await verifyPaymentByReference(txRef);
    }

    if (payment.status !== "successful") {
      return res.status(400).json({
        success: false,
        message: "Payment was not successful.",
      });
    }

    console.log("STEP 2");

    const {
      attendee,
      qrCode,
      emailSent,
      emailError,
    } = await finalizeVerifiedPayment(payment);

    console.log("STEP 7");

    return res.json({
      success: true,
      message: emailSent
        ? "Payment verified successfully."
        : "Payment verified successfully, but the ticket email could not be sent right now.",
      attendee,
      qrCode,
      emailSent,
      emailError,
    });
  } catch (error) {
    console.log("========== VERIFY ERROR ==========");
    console.log(error);

    if (error.response) {
      console.log("STATUS:", error.response.status);
      console.log("DATA:", error.response.data);
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const handleFlutterwaveWebhook = async (req, res) => {
  try {
    const signature = req.headers["verif-hash"];

    if (!process.env.FLW_WEBHOOK_SECRET) {
      return res.status(500).json({
        success: false,
        message: "FLW_WEBHOOK_SECRET is not configured.",
      });
    }

    if (signature !== process.env.FLW_WEBHOOK_SECRET) {
      return res.status(401).json({
        success: false,
        message: "Invalid webhook signature.",
      });
    }

    const event = req.body;
    const transactionId = event?.data?.id;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: "Webhook transaction ID is missing.",
      });
    }

    const payment = await verifyPayment(transactionId);

    if (payment.status !== "successful") {
      return res.status(200).json({
        success: true,
        message: "Webhook received for non-successful payment.",
      });
    }

    await finalizeVerifiedPayment(payment);

    return res.status(200).json({
      success: true,
      message: "Webhook processed successfully.",
    });
  } catch (error) {
    console.error("========== WEBHOOK ERROR ==========");
    console.error(error.response?.data || error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  initializeTransaction,
  verifyTransaction,
  handleFlutterwaveWebhook,
};