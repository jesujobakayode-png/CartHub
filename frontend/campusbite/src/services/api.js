import axios from "axios";

const API = axios.create({
  baseURL: "https://campusbite-ylzz.onrender.com"
});

export default API;