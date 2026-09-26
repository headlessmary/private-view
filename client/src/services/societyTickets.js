const TICKET_LABELS = {
  EARLY_BIRD: "Early Bird",
  SAINTS_REBELS: "Saints & Rebels",
  FIVE_FRIENDS: "Five Friends",
  VIP: "Legacy VIP",
  REGULAR: "Legacy Regular",
};

export function formatTicketType(type) {
  return TICKET_LABELS[type] || type;
}
