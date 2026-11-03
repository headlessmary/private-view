const toPublicPaymentAttendee = (attendee) => ({
  event: attendee.event
    ? { eventName: attendee.event.eventName }
    : null,
});

module.exports = { toPublicPaymentAttendee };
