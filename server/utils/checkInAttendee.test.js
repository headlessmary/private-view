const assert = require("node:assert/strict");
const test = require("node:test");
const { toCheckInAttendee } = require("./checkInAttendee");

test("check-in response includes only fields used by the scanner", () => {
  const result = toCheckInAttendee({
    fullName: "Attendee",
    ticketType: "VIP",
    email: "private@example.test",
    phone: "0000000000",
    qrToken: "private-ticket-token",
    paymentReference: "private-payment-reference",
  });

  assert.deepEqual(result, {
    fullName: "Attendee",
    ticketType: "VIP",
  });
  assert.equal("email" in result, false);
  assert.equal("phone" in result, false);
  assert.equal("qrToken" in result, false);
});
