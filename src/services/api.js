
import axios from "axios";

const api = axios.create({
  baseURL: "https://example.com/api", // Replace with your API URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
