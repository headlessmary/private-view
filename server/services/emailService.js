const axios = require("axios");
const ticketTemplate = require("./emailTemplates/ticketTemplate");

const sanitizeEnvValue = (value) => {
  if (!value || typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/^"|"$/g, "");
};

const parseSender = (senderValue) => {
  const normalizedSender = sanitizeEnvValue(senderValue);

  if (!normalizedSender) {
    return {
      name: "Private View",
      email: "",
    };
  }

  const senderMatch = normalizedSender.match(/^(.*)<(.+)>$/);

  if (!senderMatch) {
    return {
      name: "Private View",
      email: normalizedSender,
    };
  }

  return {
    name: senderMatch[1].trim().replace(/^"|"$/g, "") || "Private View",
    email: senderMatch[2].trim(),
  };
};

const getEmailDiagnostics = () => {
  const sender = parseSender(process.env.MAIL_FROM);
  const baseUrl = sanitizeEnvValue(process.env.BASE_URL);
  const brevoApiKey = sanitizeEnvValue(process.env.BREVO_API_KEY);

  return {
    mailFromConfigured: Boolean(sender.email),
    normalizedSenderName: sender.name,
    normalizedSenderEmail: sender.email,
    baseUrlConfigured: Boolean(baseUrl),
    baseUrl,
    brevoApiKeyPresent: Boolean(brevoApiKey),
    brevoApiKeyLength: brevoApiKey.length,
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
    const baseUrl = sanitizeEnvValue(process.env.BASE_URL);
    const brevoApiKey = sanitizeEnvValue(process.env.BREVO_API_KEY);

    if (!sender.email) {
      throw new Error("MAIL_FROM is not configured correctly.");
    }

    if (!baseUrl) {
      throw new Error("BASE_URL must be set for email QR links.");
    }

    if (!brevoApiKey) {
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
          "api-key": brevoApiKey,
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
      const providerMessage =
        error.response.data?.message ||
        error.response.data?.code ||
        error.message;

      const wrappedError = new Error(providerMessage);
      wrappedError.response = error.response;
      throw wrappedError;
    } else {
      console.error(error.message);
      throw error;
    }
  }
};

module.exports = {
  getEmailDiagnostics,
  sendTicketEmail,
};