const axios = require("axios");
const ticketTemplate = require("./emailTemplates/ticketTemplate");

const sendTicketEmail = async ({
  fullName,
  email,
  ticketType,
  reference,
  qrCode,
}) => {
  try {
    // Make QR code URL absolute
    const qrUrl = `${process.env.API_URL}${qrCode}`;

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Private View",
          email: process.env.MAIL_FROM,
        },

        to: [
          {
            email,
            name: fullName,
          },
        ],

        subject: "Your Ticket - The Private View: Art & Indulgence",

        htmlContent: ticketTemplate({
          fullName,
          ticketType,
          reference,
          qrCode: qrUrl,
        }),
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("✅ Email sent successfully");
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Brevo Email Error");

    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }

    throw error;
  }
};

module.exports = {
  sendTicketEmail,
};