const {
  getEventConfig,
} = require("../services/eventConfigService");
const {
  updateEvent,
  toEventResponse,
} = require("../services/eventService");

const getPublicEventConfig = async (_req, res) => {
  try {
    const eventConfig = await getEventConfig();
    return res.json({ success: true, event: toEventResponse(eventConfig) });
  } catch (error) {
    console.error("GET EVENT CONFIG ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load event details.",
    });
  }
};

const updateEventConfig = async (req, res) => {
  try {
    const event = await updateEvent("headless-society", req.body || {});
    return res.json({ success: true, event: toEventResponse(event) });
  } catch (error) {
    console.error("UPDATE EVENT CONFIG ERROR:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : "Unable to save event details.",
    });
  }
};

module.exports = { getPublicEventConfig, updateEventConfig };
