const express = require("express");
const protectAdmin = require("../middleware/auth");
const {
  createAdminEvent,
  getCurrentEvent,
  listAdminEvents,
  listPublicEvents,
  publishAdminEvent,
  updateAdminEvent,
} = require("../controllers/eventController");

const router = express.Router();

router.get("/current-event", getCurrentEvent);
router.get("/events", listPublicEvents);
router.get("/admin/events", protectAdmin, listAdminEvents);
router.post("/admin/events", protectAdmin, createAdminEvent);
router.put("/admin/events/:id", protectAdmin, updateAdminEvent);
router.patch("/admin/events/:id/publish", protectAdmin, publishAdminEvent);

module.exports = router;
