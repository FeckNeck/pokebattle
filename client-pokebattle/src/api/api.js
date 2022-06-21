import axios from "axios";
import router from "@/router";
import store from "@/store/index";
const instance = axios.create({
  baseURL: "http://localhost:3000",
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.config.url != "users/refreshToken" &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      await instance
        .get("users/refreshToken", { withCredentials: true })
        .then((response) => {
          store.state.token = response.data.accessToken;
          instance.defaults.headers.common[
            "authorization"
          ] = `Bearer ${response.data.accessToken}`;
          localStorage.setItem("token", response.data.accessToken);
        })
        .catch(() => {
          store.commit("logout");
          localStorage.removeItem("token");
          router.push({ name: "login", params: { error: "refreshToken" } });
        });
      return instance(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default instance;
