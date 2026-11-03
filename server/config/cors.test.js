const assert = require("node:assert/strict");
const { after, test } = require("node:test");
const cors = require("cors");
const express = require("express");
const {
  createCorsOptions,
  getAllowedOrigins,
} = require("./cors");

const servers = [];

after(async () => {
  await Promise.all(
    servers.map(
      (server) =>
        new Promise((resolve, reject) => {
          server.close((error) => (error ? reject(error) : resolve()));
        }),
    ),
  );
});

const startCorsServer = async (env) => {
  const app = express();
  app.use(cors(createCorsOptions(env)));
  app.get("/health", (_req, res) => res.status(200).json({ ok: true }));

  const server = app.listen(0, "127.0.0.1");
  servers.push(server);
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  return `http://127.0.0.1:${server.address().port}`;
};

test("CORS allows configured production origins and answers preflight", async () => {
  const apiUrl = await startCorsServer({
    NODE_ENV: "production",
    CORS_ALLOWED_ORIGINS: "https://headlessmary.example",
  });

  const response = await fetch(`${apiUrl}/health`, {
    method: "OPTIONS",
    headers: {
      Origin: "https://headlessmary.example",
      "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "content-type,authorization",
    },
  });

  assert.equal(response.status, 204);
  assert.equal(
    response.headers.get("access-control-allow-origin"),
    "https://headlessmary.example",
  );
  assert.match(
    response.headers.get("access-control-allow-methods"),
    /POST/,
  );
});

test("CORS omits allow-origin for unlisted production websites", async () => {
  const apiUrl = await startCorsServer({
    NODE_ENV: "production",
    CORS_ALLOWED_ORIGINS: "https://headlessmary.example",
  });

  const response = await fetch(`${apiUrl}/health`, {
    headers: { Origin: "https://untrusted.example" },
  });

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("access-control-allow-origin"), null);
});

test("development allows the Vite localhost origins", () => {
  assert.deepEqual(
    getAllowedOrigins({ NODE_ENV: "development" }),
    ["http://localhost:5173", "http://127.0.0.1:5173"],
  );
});

test("production requires explicitly configured origins", () => {
  assert.throws(
    () => createCorsOptions({ NODE_ENV: "production" }),
    /CORS_ALLOWED_ORIGINS/,
  );
});

test("CORS configuration rejects origin URLs containing paths", () => {
  assert.throws(
    () =>
      getAllowedOrigins({
        NODE_ENV: "production",
        CORS_ALLOWED_ORIGINS: "https://headlessmary.example/path",
      }),
    /without paths/,
  );
});
