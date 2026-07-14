const axios = require("axios");
const ticketTemplate = require("./emailTemplates/ticketTemplate");

const parseSender = (senderValue) => {
  if (!senderValue) {
    return {
      name: "Private View",
      email: "",
    };
  }

  const senderMatch = senderValue.match(/^(.*)<(.+)>$/);

  if (!senderMatch) {
    return {
      name: "Private View",
      email: senderValue.trim(),
    };
  }

  return {
    name: senderMatch[1].trim().replace(/^"|"$/g, "") || "Private View",
    email: senderMatch[2].trim(),
  };
};

const sendTicketEmail = async ({
  fullName,
  email,
  ticketType,
  reference,
  qrCode,
}) => {
  try {
    const sender = parseSender(process.env.MAIL_FROM);
    const baseUrl = process.env.BASE_URL;

    if (!sender.email) {
      throw new Error("MAIL_FROM is not configured correctly.");
    }

    if (!baseUrl) {
      throw new Error("BASE_URL must be set for email QR links.");
    }

    if (!process.env.BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is not configured.");
    }

    const qrUrl = qrCode.startsWith("http")
      ? qrCode
      : `${baseUrl.replace(/\/$/, "")}${qrCode}`;

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender,

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