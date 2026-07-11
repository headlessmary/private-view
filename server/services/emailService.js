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
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,

    to: email,

    subject: "Your Ticket - The Private View: Art & Indulgence",

    html: ticketTemplate({
      fullName,
      ticketType,
      reference,
    }),

    attachments: [
       {
    filename: "flyer.png",
    path: path.join(__dirname, "../uploads/flyer.jpg"),
    cid: "flyer",
  },
      {
        filename: "private-view-ticket.png",
        path: path.join(__dirname, "..", qrCode),
        cid: "qrcode",
      },
    ],
  });

  console.log(`✅ Ticket email sent to ${email}`);
};

module.exports = {
  sendTicketEmail,
};