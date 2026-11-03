const assert = require("node:assert/strict");
const test = require("node:test");

test("payment service loads without credentials and validates them when used", async () => {
  const originalSecret = process.env.FLW_SECRET_KEY;
  delete process.env.FLW_SECRET_KEY;

  try {
    const { initializePayment } = require("./flutterwaveService");

    await assert.rejects(
      initializePayment({
        fullName: "Test attendee",
        email: "attendee@example.com",
        phone: "0000000000",
        amount: 100,
        reference: "test-reference",
      }),
      /Flutterwave payment initialization failed/,
    );
  } finally {
    if (originalSecret === undefined) {
      delete process.env.FLW_SECRET_KEY;
    } else {
      process.env.FLW_SECRET_KEY = originalSecret;
    }
  }
});
