import axios from "axios";

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL, // get correct URL from env
  withCredentials: true, // Ensure cookies are included in requests
});

let onUnauthorized = null;

export function setOnUnauthorized(callback) {
  onUnauthorized = callback;
}

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && onUnauthorized) {
      onUnauthorized();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
