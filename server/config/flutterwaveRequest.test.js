const assert = require("node:assert/strict");
const test = require("node:test");
const {
  createSafeFlutterwaveError,
  requestFlutterwave,
} = require("./flutterwaveRequest");

test("Flutterwave request failures omit credentials and provider response data", async () => {
  const secret = "test-only-secret";
  const providerError = new Error(`Request failed with ${secret}`);
  providerError.config = {
    headers: { Authorization: `Bearer ${secret}` },
  };
  providerError.response = {
    status: 401,
    data: { message: `Invalid credential ${secret}` },
  };

  await assert.rejects(
    requestFlutterwave(() => Promise.reject(providerError), "payment"),
    (error) => {
      assert.equal(error.message, "Flutterwave payment failed (HTTP 401).");
      assert.equal(error.response, undefined);
      assert.equal(error.config, undefined);
      assert.equal(error.message.includes(secret), false);
      return true;
    },
  );
});

test("legacy Flutterwave client error sanitizer omits request metadata", () => {
  const secret = "test-only-secret";
  const safeError = createSafeFlutterwaveError(
    {
      message: `Failure with ${secret}`,
      config: { headers: { Authorization: `Bearer ${secret}` } },
      response: { status: 403, data: { message: secret } },
    },
    "request",
  );

  assert.equal(safeError.message, "Flutterwave request failed (HTTP 403).");
  assert.equal(safeError.message.includes(secret), false);
  assert.equal(safeError.config, undefined);
  assert.equal(safeError.response, undefined);
});
