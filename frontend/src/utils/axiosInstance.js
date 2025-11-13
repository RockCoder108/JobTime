import axios from "axios";
import { BASE_URL } from "./apiPaths";

// Helper to convert HTTP to HTTPS
const getSecureUrl = (url) => {
  if (!url) return "";
  return url.replace(/^http:\/\//i, "https://");
};


const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (fix image URLs and handle errors)
axiosInstance.interceptors.response.use(
  (response) => {
    // Automatically fix image URLs in response data
    const fixImageUrls = (data) => {
      if (Array.isArray(data)) return data.map(fixImageUrls);
      if (data !== null && typeof data === "object") {
        const newData = { ...data };
        Object.keys(newData).forEach((key) => {
          if (
            key.toLowerCase().includes("image") &&
            typeof newData[key] === "string"
          ) {
            newData[key] = getSecureUrl(newData[key]);
          } else if (typeof newData[key] === "object") {
            newData[key] = fixImageUrls(newData[key]);
          }
        });
        return newData;
      }
      return data;
    };

    response.data = fixImageUrls(response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        window.location.href = "/";
      } else if (error.response.status === 500) {
        console.error("Server error. Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again.");
    }
    return Promise.reject(error);
  }
);

