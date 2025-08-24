import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api-onevote.onrender.com/api",
});

export default API;
