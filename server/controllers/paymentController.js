const prisma = require("../database/prisma");
const { v4: uuid } = require("uuid");

const {
  initializePayment,
  verifyPayment,
  verifyPaymentByReference,
} = require("../services/flutterwaveService");

const {
  completeAttendeePayment,
} = require("../services/paymentCompletionService");
const { findCurrentEvent } = require("../services/eventService");
const { toTicketPrices } = require("../services/eventConfigService");

const finalizeVerifiedPayment = async (payment) => {
  if (payment.status !== "successful") {
    const error = new Error("Payment was not successful.");
    error.statusCode = 400;
    throw error;
  }

  const attendee = await prisma.attendee.findUnique({
    where: { reference: payment.tx_ref },
    include: { event: { select: { id: true, eventName: true } } },
  });

  if (!attendee) {
    const error = new Error("Attendee not found.");
    error.statusCode = 404;
    throw error;
  }

  if (attendee.paymentStatus === "SUCCESS" && attendee.qrCode) {
    return {
      attendee,
      qrCode: attendee.qrCode,
      emailSent: false,
      emailError: null,
    };
  }

  return completeAttendeePayment({
    attendee,
    paymentMethod: "Flutterwave",
    confirmedBy: "Flutterwave",
    confirmedAt: new Date(),
    paymentReference: payment.tx_ref,
  });
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

    const normalizedFullName = typeof fullName === "string" ? fullName.trim() : "";
    const normalizedEmail = typeof email === "string" ? email.trim() : "";
    const normalizedPhone = String(phone || "").trim();
    const normalizedTicketType =
      typeof ticketType === "string" ? ticketType.trim().toUpperCase() : "";
    const event = await findCurrentEvent();
    if (!event) {
      return res.status(409).json({
        success: false,
        message: "There is no published event currently accepting ticket purchases.",
      });
    }

    const ticketPrices = toTicketPrices(event);
    const normalizedAmount = Object.prototype.hasOwnProperty.call(
      ticketPrices,
      normalizedTicketType
    )
      ? ticketPrices[normalizedTicketType]
      : 0;

    if (
      !normalizedFullName ||
      !normalizedEmail ||
      !normalizedPhone ||
      !normalizedAmount
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment request. Please provide valid attendee details and select a ticket for the current event.",
      });
    }
    if (amount !== undefined && Number(amount) !== normalizedAmount) {
      return res.status(409).json({
        success: false,
        message: "This ticket price has changed. Refresh the page to see the latest price.",
      });
    }

    const reference = `HS-${uuid()}`;
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
      eventName: event.eventName,
    });

    // Save attendee after Flutterwave succeeds
    await prisma.attendee.create({
      data: {
        eventId: event.id,
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
        include: { event: { select: { id: true, eventName: true } } },
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
              eventId: existingAttendee.eventId,
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