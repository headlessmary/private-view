const generateQRCode = async (reference) => {
  const normalizedReference = String(reference || "").trim();

  if (!normalizedReference) {
    throw new Error("Reference is required to generate QR code.");
  }

  return `/uploads/qr/${encodeURIComponent(normalizedReference)}.png`;
};

module.exports = {
  generateQRCode,
};