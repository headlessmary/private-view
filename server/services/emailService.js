const transporter = require("../config/mail");
const ticketTemplate = require("./emailTemplates/ticketTemplate");
const path = require("path");

const sendTicketEmail = async (data) => {
  try {
    console.log("Sending email to:", data.email);

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: data.email,
      subject: "Your Ticket",
      html: ticketTemplate({
        fullName: data.fullName,
        ticketType: data.ticketType,
        reference: data.reference,
      }),
      attachments: [
        {
          filename: "flyer.png",
          path: path.join(__dirname, "../uploads/flyer.jpg"),
          cid: "flyer",
        },
        {
          filename: "ticket.png",
          path: path.join(__dirname, "..", data.qrCode),
          cid: "qrcode",
        },
      ],
    });

    console.log("EMAIL SENT");
    console.log(info);

  } catch (err) {
    console.error("EMAIL ERROR");
    console.error(err);
    throw err;
  }
};