const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

// ==========================
// Excel Report
// ==========================
const generateExcel = async (attendees) => {

  const workbook = new ExcelJS.Workbook();

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
      ticketType: attendee.ticketType,
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
const generatePDF = (attendees, res) => {

  const doc = new PDFDocument();

  doc.pipe(res);

  doc.fontSize(24);

  doc.text("The Private View");

  doc.moveDown();

  doc.fontSize(18);

  doc.text("Attendee Report");

  doc.moveDown();

  attendees.forEach((a) => {

    doc.fontSize(12);

    doc.text(
      `${a.fullName} | ${a.ticketType} | ₦${a.amount} | ${a.paymentStatus} | ${a.checkedIn ? "Checked In" : "Pending"}`
    );

  });

  doc.end();
};

module.exports = {
  generateExcel,
  generatePDF,
};