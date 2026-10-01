const express = require("express");
const cors = require("cors");
require("dotenv").config();
const QRCode = require("qrcode");

const ticketRoutes = require("./routes/ticketRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const path = require("path");
const adminRoutes = require("./routes/adminRoutes");
const testRoutes = require("./routes/testRoutes");
const eventRoutes = require("./routes/eventRoutes");
const { getPublicEventConfig } = require("./controllers/eventConfigController");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Generate ticket QR images on demand so production does not depend on local files.
app.get("/uploads/qr/:filename", async (req, res) => {
  try {
    const rawFilename = String(req.params.filename || "").trim();

    if (!rawFilename.toLowerCase().endsWith(".png")) {
      return res.status(400).json({
        success: false,
        message: "Invalid QR filename.",
      });
    }

    const encodedToken = rawFilename.slice(0, -4);
    const qrToken = decodeURIComponent(encodedToken);

    if (!qrToken) {
      return res.status(400).json({
        success: false,
        message: "QR token is required.",
      });
    }

    const qrPng = await QRCode.toBuffer(qrToken, {
      type: "png",
      margin: 1,
      width: 420,
    });

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "private, max-age=300");
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
  const loggedBody = { ...req.body };
  if (loggedBody.qrToken) loggedBody.qrToken = "[REDACTED]";
  console.log("BODY:", loggedBody);
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

app.get("/api/event-settings", getPublicEventConfig);
app.use("/api", eventRoutes);

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