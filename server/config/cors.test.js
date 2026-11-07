const assert = require("node:assert/strict");
const { after, test } = require("node:test");
const cors = require("cors");
const express = require("express");
const {
  createCorsOptions,
  getAllowedOrigins,
} = require("./cors");

const FRONTEND_ORIGINS = [
  "https://private-view-two.vercel.app",
  "https://headlessmary.com",
  "https://www.headlessmary.com",
];

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
  app.get("/api/current-event", (_req, res) =>
    res.json({ success: true, active: false, event: null }),
  );

  const server = app.listen(0, "127.0.0.1");
  servers.push(server);
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  return `http://127.0.0.1:${server.address().port}`;
};

test("CORS allows each frontend to request the current event with credentials", async () => {
  const apiUrl = await startCorsServer({ NODE_ENV: "production" });

  for (const origin of FRONTEND_ORIGINS) {
    const response = await fetch(`${apiUrl}/api/current-event`, {
      headers: { Origin: origin },
    });

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("access-control-allow-origin"), origin);
    assert.equal(response.headers.get("access-control-allow-credentials"), "true");
    assert.deepEqual(await response.json(), {
      success: true,
      active: false,
      event: null,
    });

    const preflight = await fetch(`${apiUrl}/api/current-event`, {
      method: "OPTIONS",
      headers: {
        Origin: origin,
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Headers": "authorization,content-type",
      },
    });

    assert.equal(preflight.status, 204);
    assert.equal(preflight.headers.get("access-control-allow-origin"), origin);
    assert.equal(preflight.headers.get("access-control-allow-credentials"), "true");
    assert.match(preflight.headers.get("access-control-allow-methods"), /GET/);
    assert.match(
      preflight.headers.get("access-control-allow-headers"),
      /authorization/i,
    );
  }
});

test("CORS omits allow-origin for unlisted production websites", async () => {
  const apiUrl = await startCorsServer({
    NODE_ENV: "production",
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
    [
      ...FRONTEND_ORIGINS,
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
  );
});

test("production also allows configured additional origins", () => {
  assert.deepEqual(
    getAllowedOrigins({
      NODE_ENV: "production",
      CORS_ALLOWED_ORIGINS: "https://extra.example",
    }),
    [...FRONTEND_ORIGINS, "https://extra.example"],
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
