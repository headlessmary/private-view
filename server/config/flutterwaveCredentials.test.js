const assert = require("node:assert/strict");
const test = require("node:test");
const { getFlutterwaveSecretKey } = require("./flutterwaveCredentials");

test("Flutterwave secret key is required without exposing its value", () => {
  assert.throws(
    () => getFlutterwaveSecretKey({}),
    /FLW_SECRET_KEY is required/,
  );
});

test("Flutterwave secret key is trimmed from server environment", () => {
  assert.equal(
    getFlutterwaveSecretKey({ FLW_SECRET_KEY: " test-placeholder " }),
    "test-placeholder",
  );
});
