import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || (
  import.meta.env.PROD ? "/api" : "http://localhost:5000/api"
);

const API = axios.create({
  baseURL
});

export default API;
