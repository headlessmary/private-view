const TICKET_LABELS = {
  EARLY_BIRD: "Regular",
  SAINTS_REBELS: "Saints & Rebels",
  FIVE_FRIENDS: "Five Friends",
  VIP: "Legacy VIP",
  REGULAR: "Regular",
};

export function formatTicketType(type) {
  return TICKET_LABELS[type] || type;
}
