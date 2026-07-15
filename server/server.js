const express = require("express");
const cors = require("cors");
require("dotenv").config();
const QRCode = require("qrcode");

const ticketRoutes = require("./routes/ticketRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const path = require("path");
const adminRoutes = require("./routes/adminRoutes");
const testRoutes = require("./routes/testRoutes");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dynamic QR fallback for ticket links in emails and admin views.
// This keeps older /uploads/qr/<reference>.png links working even when files are not on disk.
app.get("/uploads/qr/:filename", async (req, res) => {
  try {
    const rawFilename = String(req.params.filename || "").trim();

    if (!rawFilename.toLowerCase().endsWith(".png")) {
      return res.status(400).json({
        success: false,
        message: "Invalid QR filename.",
      });
    }

    const encodedReference = rawFilename.slice(0, -4);
    const reference = decodeURIComponent(encodedReference);

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "QR reference is required.",
      });
    }

    const qrPng = await QRCode.toBuffer(reference, {
      type: "png",
      margin: 1,
      width: 420,
    });

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.send(qrPng);
  } catch (error) {
    console.error("QR FALLBACK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to generate QR code.",
    });
  }
});

// Debug Middleware
app.use((req, res, next) => {
  console.log("\n===============================");
  console.log("METHOD:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("HEADERS:", req.headers);
  console.log("BODY:", req.body);
  console.log("===============================\n");
  next();
});

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
); 
// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Private View API Running",
  });
});

// Test Route
app.post("/test", (req, res) => {
  console.log("TEST BODY:", req.body);

  res.json({
    success: true,
    body: req.body,
  });
});

// Ticket Routes
app.use("/api/tickets", ticketRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", testRoutes);


// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});