const express = require("express");
const router = express.Router();

const protectAdmin = require("../middleware/auth");

const {
  login,
  dashboard,
  getAttendees,
  searchAttendees,
  filterAttendees,
  checkIn,
  reports,
  exportExcel,
  exportPDF,
  resendTicket,
  completePendingRegistration,
  reverifyPendingPayment,
  reverifyPendingPayments,
} = require("../controllers/adminController");

router.post("/login", login);

router.get("/dashboard", protectAdmin, dashboard);

router.get("/attendees", protectAdmin, getAttendees);

router.get("/attendees/search", protectAdmin, searchAttendees);

router.get("/attendees/filter", protectAdmin, filterAttendees);

router.post("/check-in", protectAdmin, checkIn);

router.get("/reports", protectAdmin, reports);

router.get(
  "/export/excel",
  protectAdmin,
  exportExcel
);

router.get(
  "/export/pdf",
  protectAdmin,
  exportPDF
);

router.post("/resend-ticket", protectAdmin, resendTicket);
router.post("/complete-registration", protectAdmin, completePendingRegistration);
router.post("/complete-payment", protectAdmin, completePendingRegistration);
router.post("/reverify-payment", protectAdmin, reverifyPendingPayment);
router.post("/complete-registration/bulk", protectAdmin, reverifyPendingPayments);
router.post("/complete-payment/bulk", protectAdmin, reverifyPendingPayments);
router.post("/reverify-payment/bulk", protectAdmin, reverifyPendingPayments);

module.exports = router;