const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

transporter.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("✅ Mail server ready");
  }
});

module.exports = transporter;