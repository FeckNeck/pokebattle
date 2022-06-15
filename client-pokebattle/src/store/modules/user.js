import instance from "../../api/api";

const state = () => ({
  status: "",
  token: localStorage.getItem("token") || "",
});

const getters = {
  isLoggedIn: (state) => !!state.token,
};

const mutations = {
  setStatus(state, status) {
    state.status = status;
  },
  logUser: function (state, token) {
    state.token = token;
  },
};

const actions = {
  createAccount: ({ commit }, userInfos) => {
    return new Promise((resolve, reject) => {
      instance
        .post("/users/register", userInfos)
        .then(function (response) {
          commit("setStatus", "registered");
          resolve(response);
        })
        .catch(function (error) {
          commit("setStatus", "error_register");
          reject(error);
        });
    });
  },
  login: ({ commit }, userInfos) => {
    return new Promise((resolve, reject) => {
      instance
        .post("/users/login", userInfos, { withCredentials: true })
        .then(function (response) {
          console.log("response:", response);
          commit("setStatus", "logged");
          commit("logUser", response.data.accessToken);
          instance.defaults.headers.common[
            "authorization"
          ] = `Bearer ${response.data.accessToken}`;
          localStorage.setItem("token", response.data.accessToken);
          resolve(response);
        })
        .catch(function (error) {
          console.log("error:", error);
          commit("setStatus", "error_login");
          reject(error);
        });
    });
  },
  account() {
    instance
      .get("/users/account", { withCredentials: true })
      .then(function (response) {
        console.log("response:", response);
      })
      .catch(function (error) {
        console.log("error:", error);
      });
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
