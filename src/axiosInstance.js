import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "http://143.198.235.252:8000", // Replace with your backend URL
  withCredentials: true, // Ensure cookies are included in requests
});

export default axiosInstance;
