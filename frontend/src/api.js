import axios from "axios";

const API = axios.create({
  baseURL: "https://api-onevote.onrender.com/api/polls",
});

export default API;
