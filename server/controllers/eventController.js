const {
  createEvent,
  findCurrentEvent,
  getAdminEvents,
  getPublicEvents,
  publishEvent,
  toEventResponse,
  updateEvent,
} = require("../services/eventService");

const getCurrentEvent = async (_req, res) => {
  try {
    const event = await findCurrentEvent();

    return res.json({
      success: true,
      active: Boolean(event),
      event: event ? toEventResponse(event) : null,
    });
  } catch (error) {
    console.error("GET CURRENT EVENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to determine the current event.",
    });
  }
};

const listPublicEvents = async (_req, res) => {
  try {
    const events = await getPublicEvents();
    return res.json({ success: true, events });
  } catch (error) {
    console.error("GET PUBLIC EVENTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load the event archive.",
    });
  }
};

const listAdminEvents = async (_req, res) => {
  try {
    const events = await getAdminEvents();
    return res.json({ success: true, events });
  } catch (error) {
    console.error("GET ADMIN EVENTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load event history.",
    });
  }
};

const createAdminEvent = async (req, res) => {
  try {
    const event = await createEvent(req.body || {});
    return res.status(201).json({
      success: true,
      event: toEventResponse(event),
    });
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Unable to create event.",
    });
  }
};

const updateAdminEvent = async (req, res) => {
  try {
    const event = await updateEvent(req.params.id, req.body || {});
    return res.json({
      success: true,
      event: toEventResponse(event),
    });
  } catch (error) {
    console.error("UPDATE EVENT ERROR:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Unable to update event.",
    });
  }
};

const publishAdminEvent = async (req, res) => {
  try {
    const event = await publishEvent(req.params.id);
    return res.json({
      success: true,
      event: toEventResponse(event),
    });
  } catch (error) {
    console.error("PUBLISH EVENT ERROR:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Unable to publish event.",
    });
  }
};

module.exports = {
  createAdminEvent,
  getCurrentEvent,
  listAdminEvents,
  listPublicEvents,
  publishAdminEvent,
  updateAdminEvent,
};
