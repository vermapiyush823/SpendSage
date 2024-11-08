import Axios from "axios";

const axiosInstance = Axios.create({
  baseURL: "http://localhost:8000/",
  withCredentials: true,
  withXSRFToken: true,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default axiosInstance;
