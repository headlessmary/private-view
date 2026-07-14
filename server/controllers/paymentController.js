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
   console.log("=========== VERIFY START ===========");
  console.log(req.query);
  console.log(req.params);

  try {
    // Accept BOTH query params and route params
    const transactionId =
      req.params.transactionId ||
      req.query.transaction_id;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required.",
      });
    }

    // Verify with Flutterwave
   console.log("STEP 1");

const payment = await verifyPayment(transactionId);

console.log("STEP 2");

const attendee = await prisma.attendee.findUnique({
  where: { reference: payment.tx_ref },
});

console.log("STEP 3");

let qrCode = attendee.qrCode;

if (!qrCode) {
  console.log("STEP 4");
  qrCode = await generateQRCode(payment.tx_ref);
}

console.log("STEP 5");

const updatedAttendee = await prisma.attendee.update({
  where: { reference: payment.tx_ref },
  data: {
    paymentStatus: "SUCCESS",
    qrCode,
  },
});


console.log("STEP 6");

try {
 

} catch (err) {
  console.error("========== EMAIL ERROR ==========");
  console.error(err);

  if (err.response) {
    console.error(err.response.data);
  }

  if (err.code) {
    console.error("CODE:", err.code);
  }

  if (err.command) {
    console.error("COMMAND:", err.command);
  }
}

console.log("STEP 7");

    return res.json({
      success: true,
      message: "Payment verified successfully.",
      attendee: updatedAttendee,
      qrCode,
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
}

module.exports = {
  initializeTransaction,
  verifyTransaction,
};