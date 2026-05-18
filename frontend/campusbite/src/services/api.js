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


// ADD TOKEN TO REQUESTS
API.interceptors.request.use((req) => {

  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;