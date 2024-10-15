import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use(function (config) {
  const storedUserId = localStorage.getItem("userId");
  if (!config.headers.user && storedUserId) {
    const userId = parseInt(storedUserId, 10);
    config.headers.user = userId;
  }

  if (config.method === "POST") {
    config.headers["Content-Type"] = "multipart/form-data";
  }

  return config;
});

export default axiosClient;
