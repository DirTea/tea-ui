import { createApp } from "vue";
import "./style.css";

import { vTransition } from "@/directives/transition/TeaTransition.ts";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import App from "./App.vue";

const app = createApp(App);
app.directive("transition", vTransition);
app.use(ElementPlus);
app.mount("#app");

window.appContext = app._context;
