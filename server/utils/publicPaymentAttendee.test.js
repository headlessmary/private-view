const assert = require("node:assert/strict");
const test = require("node:test");
const { toPublicPaymentAttendee } = require("./publicPaymentAttendee");

test("public payment confirmation omits attendee and transaction details", () => {
  const result = toPublicPaymentAttendee({
    fullName: "Attendee",
    email: "private@example.test",
    phone: "0000000000",
    reference: "private-reference",
    qrToken: "private-ticket-token",
    paymentStatus: "SUCCESS",
    event: { id: "event-id", eventName: "Example Event" },
  });

  assert.deepEqual(result, {
    event: { eventName: "Example Event" },
  });
  assert.equal("email" in result, false);
  assert.equal("qrToken" in result, false);
});
