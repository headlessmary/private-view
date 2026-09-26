const SOCIETY_TICKET_LABELS = Object.freeze({
  EARLY_BIRD: "Early Bird",
  SAINTS_REBELS: "Saints & Rebels",
  FIVE_FRIENDS: "Five Friends",
  VIP: "Legacy VIP",
  REGULAR: "Legacy Regular",
});

const formatTicketType = (type) => SOCIETY_TICKET_LABELS[type] || type;

module.exports = {
  formatTicketType,
};
