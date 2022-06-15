import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./index.css";
import store from "./store/index.js";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

//localStorage.removeItem("token");
console.log(localStorage.getItem("token"));

createApp(App).use(router).use(store).use(VueToast).mount("#app");
