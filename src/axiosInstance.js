import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000", // Replace with your backend URL
  withCredentials: true, // Ensure cookies are included in requests
});

export default axiosInstance;