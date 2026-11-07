const FRONTEND_ORIGINS = [
  "https://private-view-two.vercel.app",
  "https://headlessmary.com",
  "https://www.headlessmary.com",
];

const DEVELOPMENT_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const normalizeOrigin = (value) => {
  let url;

  try {
    url = new URL(value);
  } catch {
    throw new Error("CORS_ALLOWED_ORIGINS must contain valid HTTP(S) origins.");
  }

  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    !["", "/"].includes(url.pathname) ||
    url.search ||
    url.hash
  ) {
    throw new Error("CORS_ALLOWED_ORIGINS must contain origin URLs without paths.");
  }

  return url.origin;
};

const getAllowedOrigins = (env = process.env) => {
  const configuredOrigins = (env.CORS_ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map(normalizeOrigin);

  return [
    ...FRONTEND_ORIGINS,
    ...(env.NODE_ENV === "production" ? [] : DEVELOPMENT_ORIGINS),
    ...new Set(configuredOrigins),
  ];
};

const isOriginAllowed = (origin, allowedOrigins) =>
  !origin || allowedOrigins.includes(origin);

const createCorsOptions = (env = process.env) => {
  const allowedOrigins = getAllowedOrigins(env);

  return {
    origin: (origin, callback) =>
      callback(null, isOriginAllowed(origin, allowedOrigins)),
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 204,
    maxAge: 600,
  };
};

module.exports = {
  createCorsOptions,
  getAllowedOrigins,
  isOriginAllowed,
};
