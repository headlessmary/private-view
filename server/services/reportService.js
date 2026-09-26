const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const { formatTicketType } = require("../constants/societyTickets");
const { formatEventDateTime } = require("./eventConfigService");

// ==========================
// Excel Report
// ==========================
const generateExcel = async (attendees, event) => {

  const workbook = new ExcelJS.Workbook();

  const eventSheet = workbook.addWorksheet("Event Details");
  eventSheet.columns = [
    { header: "Setting", key: "setting", width: 28 },
    { header: "Value", key: "value", width: 40 },
  ];
  eventSheet.addRows([
    { setting: "Event name", value: event.eventName },
    { setting: "Venue", value: event.venue },
    { setting: "Date and time (WAT)", value: formatEventDateTime(event.eventDateTime) },
    { setting: "Maximum capacity", value: event.maxCapacity },
    { setting: "Early Bird price (NGN)", value: event.earlyBirdPrice },
    { setting: "Saints & Rebels price (NGN)", value: event.saintsRebelsPrice },
    { setting: "Five Friends price (NGN)", value: event.fiveFriendsPrice },
  ]);

  const sheet = workbook.addWorksheet("Attendees");

  sheet.columns = [
    {
      header: "Name",
      key: "fullName",
      width: 30,
    },
    {
      header: "Email",
      key: "email",
      width: 35,
    },
    {
      header: "Phone",
      key: "phone",
      width: 20,
    },
    {
      header: "Ticket",
      key: "ticketType",
      width: 15,
    },
    {
      header: "Amount",
      key: "amount",
      width: 15,
    },
    {
      header: "Payment",
      key: "paymentStatus",
      width: 18,
    },
    {
      header: "Checked In",
      key: "checkedIn",
      width: 15,
    },
  ];

  attendees.forEach((attendee) => {

    sheet.addRow({
      fullName: attendee.fullName,
      email: attendee.email,
      phone: attendee.phone,
      ticketType: formatTicketType(attendee.ticketType),
      amount: attendee.amount,
      paymentStatus: attendee.paymentStatus,
      checkedIn: attendee.checkedIn ? "YES" : "NO",
    });

  });

  return workbook;
};

// ==========================
// PDF Report
// ==========================
const generatePDF = (attendees, res, event) => {

  const doc = new PDFDocument();

  doc.pipe(res);

  doc.fontSize(24);

  doc.text(event.eventName);

  doc.fontSize(12);
  doc.text(`${event.venue} | ${formatEventDateTime(event.eventDateTime)} WAT`);

  doc.moveDown();

  doc.fontSize(18);

  doc.text("Attendee Report");

  doc.moveDown();

  attendees.forEach((a) => {

    doc.fontSize(12);

    doc.text(
      `${a.fullName} | ${formatTicketType(a.ticketType)} | ₦${a.amount} | ${a.paymentStatus} | ${a.checkedIn ? "Checked In" : "Pending"}`
    );

  });

  doc.end();
};

module.exports = {
  generateExcel,
  generatePDF,
};