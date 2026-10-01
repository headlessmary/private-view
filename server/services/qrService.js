const generateQRCode = async (qrToken) => {
  const normalizedToken = String(qrToken || "").trim();

  if (!normalizedToken) {
    throw new Error("QR token is required to generate QR code.");
  }

  return `/uploads/qr/${encodeURIComponent(normalizedToken)}.png`;
};

module.exports = {
  generateQRCode,
};