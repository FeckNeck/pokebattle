import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000",
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log(error);
    const originalRequest = error.config;
    if (
      error.config.url != "users/refreshToken  " &&
      error.response.status === 401 &&
      originalRequest._retry !== true
    ) {
      originalRequest._retry = true;
      await instance
        .get("users/refreshToken", { withCredentials: true })
        .then((response) => {
          //this.$store.state.token = response.data.accessToken;
          instance.defaults.headers.common[
            "authorization"
          ] = `Bearer ${response.data.accessToken}`;
          localStorage.setItem("token", response.data.accessToken);
        })
        .catch((error) => {
          console.log("error:", error);
        });
      return instance(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default instance;
