import axios from "axios";

const rawBaseURL = import.meta.env.VITE_API_URL || (
  import.meta.env.PROD
    ? "https://campusbite-ylzz.onrender.com"
    : "http://localhost:5000"
);

const normalizedBaseURL = rawBaseURL.replace(/\/$/, "");
const baseURL = normalizedBaseURL.endsWith("/api")
  ? normalizedBaseURL
  : `${normalizedBaseURL}/api`;

const API = axios.create({
  baseURL,
});

export default API;
