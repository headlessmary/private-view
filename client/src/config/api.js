const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const API_URL = configuredApiUrl
  ? configuredApiUrl.replace(/\/+$/, "")
  : import.meta.env.DEV
    ? "http://127.0.0.1:5000"
    : "";

export default API_URL;