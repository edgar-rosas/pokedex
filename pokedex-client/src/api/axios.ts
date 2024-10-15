import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use(function (config) {
  if (!config.headers.user) {
    const userId = localStorage.getItem("userId");

    if (userId) {
      config.headers.user = userId;
    }
  }

  return config;
});

export default axiosClient;
