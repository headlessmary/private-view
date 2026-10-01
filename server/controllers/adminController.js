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
  completeAttendeePayment,
} = require("../services/paymentCompletionService");
const {
  findCurrentEvent,
  getEvent,
  toEventResponse,
} = require("../services/eventService");

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

const getSelectedEvent = async (requestedId) => {
  if (requestedId) {
    const event = await getEvent(requestedId);
    if (!event) {
      const error = new Error("Event not found.");
      error.statusCode = 404;
      throw error;
    }
    return event;
  }

  const currentEvent = await findCurrentEvent();
  return currentEvent || prisma.event.findFirst({
    orderBy: [{ createdAt: "desc" }, { eventName: "asc" }],
  });
};

const getEventFilter = (req, fallbackEvent) => {
  const requestedId =
    typeof req.query.eventId === "string" ? req.query.eventId.trim() : "";
  const eventId = requestedId || fallbackEvent?.id;
  return eventId ? { eventId } : {};
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

    return res.status(error.statusCode || 500).json({
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
    const event = await getSelectedEvent(
      typeof req.query.eventId === "string" ? req.query.eventId : "",
    );
    if (!event) {
      return res.status(200).json({
        success: true,
        data: {
          totalTickets: 0,
          maxCapacity: 0,
          eventName: "",
          venue: "",
          eventDateTime: "",
          checkedIn: 0,
          remainingTickets: 0,
          revenue: 0,
        },
      });
    }

    const attendeeWhere = {
      ...getEventFilter(req, event),
      paymentStatus: "SUCCESS",
    };
    const [attendees, revenue] = await Promise.all([
      prisma.attendee.findMany({
        where: attendeeWhere,
        select: { ticketType: true, checkedIn: true },
      }),
      prisma.attendee.aggregate({
        _sum: { amount: true },
        where: attendeeWhere,
      }),
    ]);
    const admissionCount = {
      EARLY_BIRD: 1,
      SAINTS_REBELS: 2,
      FIVE_FRIENDS: 4,
      VIP: 1,
      REGULAR: 1,
    };
    const totalTickets = attendees.reduce(
      (count, attendee) => count + (admissionCount[attendee.ticketType] || 1),
      0
    );
    const checkedIn = attendees.reduce(
      (count, attendee) =>
        count + (attendee.checkedIn ? admissionCount[attendee.ticketType] || 1 : 0),
      0
    );

    return res.status(200).json({
      success: true,
      data: {
        totalTickets,
        maxCapacity: event.maxCapacity,
        eventName: event.eventName,
        venue: event.venue,
        eventDateTime: toEventResponse(event).eventDateTime,
        checkedIn,
        remainingTickets: Math.max(0, event.maxCapacity - totalTickets),
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
      where: getEventFilter(req),
      include: {
        event: {
          select: { id: true, eventName: true, slug: true },
        },
      },
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
    const keyword = typeof req.query.keyword === "string" ? req.query.keyword.trim() : "";

    const attendees = await prisma.attendee.findMany({
      where: {
        ...getEventFilter(req),
        ...(keyword ? { OR: [
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
        ] } : {}),
      },
      include: {
        event: {
          select: { id: true, eventName: true, slug: true },
        },
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
        ...getEventFilter(req),
        ...(ticketType && { ticketType }),
        ...(paymentStatus && { paymentStatus }),
        ...(checkedIn !== undefined && {
          checkedIn: checkedIn === "true",
        }),
      },
      include: {
        event: {
          select: { id: true, eventName: true, slug: true },
        },
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
    const eventId = String(req.body?.eventId || "").trim();

    if (!scannedValue || !eventId) {
      return res.status(400).json({
        success: false,
        message: "Ticket value and event ID are required.",
      });
    }

    let attendee = qrToken
      ? await prisma.attendee.findUnique({ where: { qrToken: scannedValue } })
      : null;
    if (!attendee) {
      attendee = await prisma.attendee.findUnique({
        where: { reference: scannedValue },
      });
    }

    if (!attendee) {
      return res.status(404).json({
        success: false,
        message: "Invalid ticket.",
      });
    }

    if (attendee.eventId !== eventId) {
      return res.status(409).json({
        success: false,
        message: "This ticket belongs to a different event.",
      });
    }

    if (attendee.paymentStatus !== "SUCCESS") {
      return res.status(400).json({
        success: false,
        message: "Payment has not been completed.",
      });
    }

    if (attendee.checkedIn || attendee.qrTokenUsed) {
      return res.status(400).json({
        success: false,
        message: "This ticket has already been used.",
      });
    }

    const checkInResult = await prisma.attendee.updateMany({
      where: {
        id: attendee.id,
        eventId,
        paymentStatus: "SUCCESS",
        checkedIn: false,
        qrTokenUsed: false,
      },
      data: {
        checkedIn: true,
        qrTokenUsed: true,
      },
    });

    if (checkInResult.count !== 1) {
      return res.status(400).json({
        success: false,
        message: "This ticket has already been used or is no longer valid.",
      });
    }

    const updatedAttendee = await prisma.attendee.findUnique({
      where: { id: attendee.id },
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
    const event = await getSelectedEvent(
      typeof req.query.eventId === "string" ? req.query.eventId : "",
    );
    if (!event) {
      return res.json({
        success: true,
        report: {
          totalAttendees: 0,
          vipTickets: 0,
          regularTickets: 0,
          earlyBirdTickets: 0,
          saintsRebelsTickets: 0,
          fiveFriendsTickets: 0,
          checkedIn: 0,
          remaining: 0,
          totalAdmissions: 0,
          checkedInAdmissions: 0,
          remainingAdmissions: 0,
          maxCapacity: 0,
          eventName: "",
          venue: "",
          eventDateTime: "",
          revenue: 0,
        },
      });
    }

    const eventWhere = getEventFilter(req, event);
    const [totalAttendees, successfulAttendees, revenue] = await Promise.all([
      prisma.attendee.count({ where: eventWhere }),
      prisma.attendee.findMany({
        where: { ...eventWhere, paymentStatus: "SUCCESS" },
        select: { ticketType: true, checkedIn: true },
      }),
      prisma.attendee.aggregate({
        _sum: { amount: true },
        where: { ...eventWhere, paymentStatus: "SUCCESS" },
      }),
    ]);
    const admissionCount = {
      EARLY_BIRD: 1,
      SAINTS_REBELS: 2,
      FIVE_FRIENDS: 4,
      VIP: 1,
      REGULAR: 1,
    };
    const ticketCounts = successfulAttendees.reduce((counts, attendee) => {
      counts[attendee.ticketType] = (counts[attendee.ticketType] || 0) + 1;
      return counts;
    }, {});
    const checkedInAttendees = successfulAttendees.filter(
      (attendee) => attendee.checkedIn
    );
    const totalAdmissions = successfulAttendees.reduce(
      (total, attendee) =>
        total + (admissionCount[attendee.ticketType] || 1),
      0
    );
    const checkedInAdmissions = checkedInAttendees.reduce(
      (total, attendee) =>
        total + (admissionCount[attendee.ticketType] || 1),
      0
    );

    return res.json({
      success: true,
      report: {
        totalAttendees,
        vipTickets: ticketCounts.VIP || 0,
        regularTickets: ticketCounts.REGULAR || 0,
        earlyBirdTickets: ticketCounts.EARLY_BIRD || 0,
        saintsRebelsTickets: ticketCounts.SAINTS_REBELS || 0,
        fiveFriendsTickets: ticketCounts.FIVE_FRIENDS || 0,
        checkedIn: checkedInAttendees.length,
        remaining: successfulAttendees.length - checkedInAttendees.length,
        totalAdmissions,
        checkedInAdmissions,
        remainingAdmissions: Math.max(0, event.maxCapacity - totalAdmissions),
        maxCapacity: event.maxCapacity,
        eventName: event.eventName,
        venue: event.venue,
        eventDateTime: toEventResponse(event).eventDateTime,
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
  try {
    const event = await getSelectedEvent(
      typeof req.query.eventId === "string" ? req.query.eventId : "",
    );
    if (!event) {
      return res.status(404).json({ success: false, message: "No event is available to export." });
    }
    const attendees = await prisma.attendee.findMany({
      where: getEventFilter(req, event),
      include: { event: { select: { eventName: true } } },
    });
    const workbook = await generateExcel(attendees, toEventResponse(event));

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=attendees.xlsx");
    await workbook.xlsx.write(res);
    return res.end();
  } catch (error) {
    console.error("EXPORT EXCEL ERROR:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to export attendees.",
    });
  }
};

// ============================
// Export PDF
// ============================
const exportPDF = async (req, res) => {
  try {
    const event = await getSelectedEvent(
      typeof req.query.eventId === "string" ? req.query.eventId : "",
    );
    if (!event) {
      return res.status(404).json({ success: false, message: "No event is available to export." });
    }
    const attendees = await prisma.attendee.findMany({
      where: getEventFilter(req, event),
      include: { event: { select: { eventName: true } } },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=attendees.pdf");
    return generatePDF(attendees, res, toEventResponse(event));
  } catch (error) {
    console.error("EXPORT PDF ERROR:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to export attendees.",
    });
  }
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
      eventId: attendee.eventId,
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

    if (attendee.paymentStatus === "SUCCESS" && attendee.qrCode && attendee.qrToken) {
      return res.status(200).json({
        success: true,
        message: "Payment already completed and QR/barcode ticket is already available.",
        attendee,
        qrCode: attendee.qrCode,
        emailSent: false,
      });
    }

    const completion = await completeAttendeePayment({
      attendee,
      paymentMethod: "Bank Transfer",
      confirmedBy: req.admin?.email || "admin",
      confirmedAt: new Date(),
      paymentReference: reference,
      adminNotes: "Manual bank transfer confirmation by admin",
    });

    return res.status(200).json({
      success: true,
      message: completion.emailSent
        ? "Payment was completed manually by the admin and the QR/barcode ticket is ready."
        : "Payment was completed manually by the admin, and the QR/barcode ticket is ready, but the confirmation email could not be sent right now.",
      attendee: completion.attendee,
      qrCode: completion.qrCode,
      emailSent: completion.emailSent,
      emailError: completion.emailError,
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

    if (attendee.paymentStatus === "SUCCESS" && attendee.qrCode && attendee.qrToken) {
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

    const completion = await completeAttendeePayment({
      attendee,
      paymentMethod: "Flutterwave",
      confirmedBy: "Flutterwave",
      confirmedAt: new Date(),
      paymentReference: reference,
    });

    return res.status(200).json({
      success: true,
      message: completion.emailSent
        ? "Payment completed successfully and QR/barcode ticket is ready."
        : "Payment completed and QR/barcode ticket is ready, but confirmation email could not be sent right now.",
      attendee: completion.attendee,
      qrCode: completion.qrCode,
      emailSent: completion.emailSent,
      emailError: completion.emailError,
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
    const eventId =
      typeof req.body?.eventId === "string" ? req.body.eventId.trim() : "";
    const pendingAttendees = await prisma.attendee.findMany({
      where: {
        ...(eventId ? { eventId } : {}),
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

        const completion = await completeAttendeePayment({
          attendee,
          paymentMethod: "Flutterwave",
          confirmedBy: "Flutterwave",
          confirmedAt: new Date(),
          paymentReference: attendee.reference,
        });

        results.push(completion.attendee);
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

const confirmManualPayment = async (req, res) => {
  try {
    const attendeeId = String(req.params?.id || "").trim();
    const paymentReference = String(req.body?.paymentReference || "").trim();
    const notes = String(req.body?.notes || "").trim();

    if (!attendeeId) {
      return res.status(400).json({
        success: false,
        message: "Attendee ID is required.",
      });
    }

    const attendee = await prisma.attendee.findUnique({
      where: { id: attendeeId },
    });

    if (!attendee) {
      return res.status(404).json({
        success: false,
        message: "Attendee not found.",
      });
    }

    const completion = await completeAttendeePayment({
      attendee,
      paymentMethod: "Bank Transfer",
      confirmedBy: req.admin?.email || "admin",
      confirmedAt: new Date(),
      paymentReference: paymentReference || attendee.reference,
      adminNotes: notes || null,
    });

    return res.status(200).json({
      success: true,
      message: completion.emailSent
        ? "Manual bank transfer payment confirmed successfully and the ticket is ready."
        : "Manual bank transfer payment confirmed successfully, but the confirmation email could not be sent right now.",
      attendee: completion.attendee,
      qrCode: completion.qrCode,
      emailSent: completion.emailSent,
      emailError: completion.emailError,
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
  confirmManualPayment,
};
