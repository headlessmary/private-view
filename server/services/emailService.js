const transporter = require("../config/mail");
const ticketTemplate = require("./emailTemplates/ticketTemplate");
const path = require("path");

const sendTicketEmail = async ({
  fullName,
  email,
  ticketType,
  reference,
  qrCode,
}) => {
  console.log("========== SENDING EMAIL ==========");
  console.log("Recipient:", email);

  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Your Ticket - The Private View: Art & Indulgence",

    html: ticketTemplate({
      fullName,
      ticketType,
      reference,
    }),

    attachments: [
      {
        filename: "flyer.jpg",
        path: path.join(__dirname, "../uploads/flyer.jpg"),
        cid: "flyer",
      },
      {
        filename: "ticket.png",
        path: path.join(__dirname, "..", qrCode),
        cid: "qrcode",
      },
    ],
  });

  console.log("EMAIL SENT!");
  console.log(info);
};

module.exports = {
  sendTicketEmail,
};