const prisma = require("../database/prisma");
const { generateQRCode } = require("./qrService");
const { sendTicketEmail } = require("./emailService");

const completeAttendeePayment = async ({
  attendee,
  paymentMethod = "Flutterwave",
  confirmedBy = null,
  confirmedAt = new Date(),
  paymentReference = null,
  adminNotes = null,
}) => {
  if (!attendee) {
    const error = new Error("Attendee not found.");
    error.statusCode = 404;
    throw error;
  }

  const reference = attendee.reference;
  const normalizedPaymentMethod = String(paymentMethod || "Flutterwave").trim() || "Flutterwave";
  const normalizedPaymentReference = String(paymentReference || "").trim() || null;
  const normalizedAdminNotes = String(adminNotes || "").trim() || null;
  const normalizedConfirmedBy = String(confirmedBy || "").trim() || null;
  const normalizedConfirmedAt = confirmedAt ? new Date(confirmedAt) : new Date();

  if (!reference) {
    const error = new Error("Attendee reference is required.");
    error.statusCode = 400;
    throw error;
  }

  let qrCode = attendee.qrCode;

  if (!qrCode) {
    qrCode = await generateQRCode(reference);
  }

  const updateData = {
    paymentStatus: "SUCCESS",
    qrCode,
    paymentMethod: normalizedPaymentMethod,
    ...(normalizedConfirmedBy ? { confirmedBy: normalizedConfirmedBy } : {}),
    confirmedAt: normalizedConfirmedAt,
    ...(normalizedPaymentReference ? { paymentReference: normalizedPaymentReference } : {}),
    ...(normalizedAdminNotes ? { adminNotes: normalizedAdminNotes } : {}),
  };

  const updatedAttendee = await prisma.attendee.update({
    where: { reference },
    data: updateData,
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

  return {
    attendee: updatedAttendee,
    qrCode: updatedAttendee.qrCode,
    emailSent,
    emailError,
  };
};

module.exports = {
  completeAttendeePayment,
};
