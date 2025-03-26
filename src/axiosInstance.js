import axios from "axios";

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL, // get correct URL from env
  withCredentials: true, // Ensure cookies are included in requests
});

export default axiosInstance;
