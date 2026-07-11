const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs");

const generateQRCode = async (reference) => {
  const folder = path.join(__dirname, "../uploads/qr");

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  const filename = `${reference}.png`;
  const filepath = path.join(folder, filename);

  await QRCode.toFile(filepath, reference);

  return `/uploads/qr/${filename}`;
};

module.exports = {
  generateQRCode,
};