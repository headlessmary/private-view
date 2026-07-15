const prisma = require("../database/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  generateExcel,
  generatePDF,
} = require("../services/reportService");

const {
  sendTicketEmail,
} = require("../services/emailService");

const {
  verifyPaymentByReference,
} = require("../services/flutterwaveService");

const {
  generateQRCode,
} = require("../services/qrService");

const isPaymentSuccessful = (status) => {
  const normalized = String(status || "").trim().toLowerCase();

  return [
    "successful",
    "success",
    "succeeded",
    "completed",
    "paid",
  ].includes(normalized);
};

// ==============================
// Admin Login
// ==============================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Check if admin exists
    const admin = await prisma.admin.findUnique({
      where: {
        email,
      },
    });


console.log("Login email:", email);
console.log("Admin found:", admin);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });

  } catch (error) {
    console.error(error.response?.data || error);

    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
};

// ==============================
// Dashboard
// ==============================
const dashboard = async (req, res) => {
  try {

    const totalTickets = await prisma.attendee.count();

    const vipTickets = await prisma.attendee.count({
      where: {
        ticketType: "VIP",
      },
    });

    const regularTickets = await prisma.attendee.count({
      where: {
        ticketType: "REGULAR",
      },
    });

    const checkedIn = await prisma.attendee.count({
      where: {
        checkedIn: true,
      },
    });

    const revenue = await prisma.attendee.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        paymentStatus: "SUCCESS",
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        totalTickets,
        vipTickets,
        regularTickets,
        checkedIn,
        remainingTickets: 60 - totalTickets,
        revenue: revenue._sum.amount || 0,
      },
    });

  } catch (error) {
    console.error(error.response?.data || error);

    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
};
// ==============================
// Get All Attendees
// ==============================
const getAttendees = async (req, res) => {
  try {
    const attendees = await prisma.attendee.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: attendees.length,
      attendees,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==============================
// Search Attendees
// ==============================
const searchAttendees = async (req, res) => {
  try {
    const { keyword } = req.query;

    const attendees = await prisma.attendee.findMany({
      where: {
        OR: [
          {
            fullName: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: keyword,
              mode: "insensitive",
            },
          },
          {
            reference: {
              contains: keyword,
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      attendees,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==============================
// Filter Attendees
// ==============================
const filterAttendees = async (req, res) => {
  try {

    const {
      ticketType,
      paymentStatus,
      checkedIn,
    } = req.query;

    const attendees = await prisma.attendee.findMany({
      where: {
        ...(ticketType && { ticketType }),
        ...(paymentStatus && { paymentStatus }),
        ...(checkedIn !== undefined && {
          checkedIn: checkedIn === "true",
        }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      attendees,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ==============================
// Check In Attendee
// ==============================
const checkIn = async (req, res) => {
  try {
    const reference = String(req.body?.reference || "").trim();
    const qrToken = String(req.body?.qrToken || "").trim();
    const scannedValue = qrToken || reference;

    if (!scannedValue) {
      return res.status(400).json({
        success: false,
        message: "Ticket reference is required.",
      });
    }

    let matchedByQrToken = false;

    let attendee = await prisma.attendee.findFirst({
      where: {
        qrToken: scannedValue,
        qrTokenUsed: false,
      },
    });

    if (attendee) {
      matchedByQrToken = true;
    } else {
      attendee = await prisma.attendee.findUnique({
        where: {
          reference: scannedValue,
        },
      });
    }

    if (!attendee) {
      return res.status(404).json({
        success: false,
        message: "Invalid ticket.",
      });
    }

    if (attendee.paymentStatus !== "SUCCESS") {
      return res.status(400).json({
        success: false,
        message: "Payment has not been completed.",
      });
    }

    if (attendee.checkedIn) {
      return res.status(400).json({
        success: false,
        message: "This ticket has already been used.",
      });
    }

    const updatedAttendee = await prisma.attendee.update({
      where: {
        reference: attendee.reference,
      },
      data: {
        checkedIn: true,
        qrTokenUsed: matchedByQrToken ? true : attendee.qrTokenUsed,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Check-in successful.",
      attendee: updatedAttendee,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==============================
// Reports
// ==============================
const reports = async (req, res) => {
  try {
    const totalAttendees = await prisma.attendee.count();

    const vipTickets = await prisma.attendee.count({
      where: {
        ticketType: "VIP",
        paymentStatus: "SUCCESS",
      },
    });

    const regularTickets = await prisma.attendee.count({
      where: {
        ticketType: "REGULAR",
        paymentStatus: "SUCCESS",
      },
    });

    const checkedIn = await prisma.attendee.count({
      where: {
        checkedIn: true,
      },
    });

    const remaining = await prisma.attendee.count({
      where: {
        checkedIn: false,
        paymentStatus: "SUCCESS",
      },
    });

    const revenue = await prisma.attendee.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        paymentStatus: "SUCCESS",
      },
    });

    return res.json({
      success: true,
      report: {
        totalAttendees,
        vipTickets,
        regularTickets,
        checkedIn,
        remaining,
        revenue: revenue._sum.amount || 0,
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ============================
// Export Excel
// ============================
const exportExcel = async (req, res) => {

  const attendees = await prisma.attendee.findMany();

  const workbook = await generateExcel(attendees);

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=attendees.xlsx"
  );

  await workbook.xlsx.write(res);

  res.end();

};

// ============================
// Export PDF
// ============================
const exportPDF = async (req, res) => {

  const attendees = await prisma.attendee.findMany();

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=attendees.pdf"
  );

  generatePDF(attendees, res);

};

// ==============================
// Resend Ticket Email
// ==============================
const resendTicket = async (req, res) => {
  try {
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Ticket reference is required.",
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

    if (attendee.paymentStatus !== "SUCCESS") {
      return res.status(400).json({
        success: false,
        message: "Payment has not been completed.",
      });
    }

    await sendTicketEmail({
      fullName: attendee.fullName,
      email: attendee.email,
      ticketType: attendee.ticketType,
      reference: attendee.reference,
      qrCode: attendee.qrCode,
    });

    return res.status(200).json({
      success: true,
      message: "Ticket email sent successfully.",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const completePendingRegistration = async (req, res) => {
  try {
    const reference = String(req.body?.reference || "").trim();

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Ticket reference is required.",
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

    if (attendee.paymentStatus === "SUCCESS" && attendee.qrCode) {
      return res.status(200).json({
        success: true,
        message: "Payment already completed and QR/barcode ticket is already available.",
        attendee,
        qrCode: attendee.qrCode,
        emailSent: false,
      });
    }

    const payment = await verifyPaymentByReference(reference);

    if (!isPaymentSuccessful(payment?.status)) {
      return res.status(400).json({
        success: false,
        message: "Payment could not be verified as successful on Flutterwave.",
      });
    }

    const qrCode = attendee.qrCode || (await generateQRCode(reference));

    const updatedAttendee = await prisma.attendee.update({
      where: {
        reference,
      },
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
        qrCode: updatedAttendee.qrCode,
      });
    } catch (error) {
      emailSent = false;
      emailError = error.message;
    }

    return res.status(200).json({
      success: true,
      message: emailSent
        ? "Payment completed successfully and QR/barcode ticket is ready."
        : "Payment completed and QR/barcode ticket is ready, but confirmation email could not be sent right now.",
      attendee: updatedAttendee,
      qrCode: updatedAttendee.qrCode,
      emailSent,
      emailError,
    });
  } catch (error) {
    console.error(error.response?.data || error);

    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
};

const reverifyPendingPayment = async (req, res) => {
  try {
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Ticket reference is required.",
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

    if (attendee.paymentStatus === "SUCCESS" && attendee.qrCode) {
      return res.status(200).json({
        success: true,
        message: "Payment already completed and QR/barcode ticket is already available.",
        attendee,
      });
    }

    const payment = await verifyPaymentByReference(reference);

    if (!isPaymentSuccessful(payment?.status)) {
      return res.status(400).json({
        success: false,
        message: "Payment could not be verified as successful on Flutterwave.",
      });
    }

    const qrCode = attendee.qrCode || (await generateQRCode(reference));

    const updatedAttendee = await prisma.attendee.update({
      where: {
        reference: attendee.reference,
      },
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
        qrCode: updatedAttendee.qrCode,
      });
    } catch (error) {
      emailSent = false;
      emailError = error.message;
    }

    return res.status(200).json({
      success: true,
      message: emailSent
        ? "Payment completed successfully and QR/barcode ticket is ready."
        : "Payment completed and QR/barcode ticket is ready, but confirmation email could not be sent right now.",
      attendee: updatedAttendee,
      qrCode: updatedAttendee.qrCode,
      emailSent,
      emailError,
    });
  } catch (error) {
    console.error(error.response?.data || error);

    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
};

const reverifyPendingPayments = async (req, res) => {
  try {
    const pendingAttendees = await prisma.attendee.findMany({
      where: {
        paymentStatus: {
          not: "SUCCESS",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!pendingAttendees.length) {
      return res.status(200).json({
        success: true,
        message: "No pending attendees found.",
        count: 0,
      });
    }

    const results = [];
    const failures = [];

    for (const attendee of pendingAttendees) {
      try {
        const payment = await verifyPaymentByReference(attendee.reference);

        if (!isPaymentSuccessful(payment?.status)) {
          failures.push({
            reference: attendee.reference,
            reason: "Payment not verified as successful",
          });
          continue;
        }

        const qrCode = attendee.qrCode || (await generateQRCode(attendee.reference));

        const updatedAttendee = await prisma.attendee.update({
          where: {
            id: attendee.id,
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
          reference: updatedAttendee.reference,
          qrCode: updatedAttendee.qrCode,
        });

        results.push(updatedAttendee);
      } catch (error) {
        failures.push({
          reference: attendee.reference,
          reason: error.response?.data?.message || error.message,
        });

        console.error(`Failed to recover attendee ${attendee.reference}`, error);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Completed ${results.length} pending payment(s).`,
      count: results.length,
      attendees: results,
      failures,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  login,
  dashboard,
  getAttendees,
  searchAttendees,
  filterAttendees,
  checkIn,
  reports,
  exportExcel,
  exportPDF,
  resendTicket,
  completePendingRegistration,
  reverifyPendingPayment,
  reverifyPendingPayments,
};
