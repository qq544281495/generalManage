import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import request from "./utils/request";
import storage from "./utils/storage";
import api from "./api";
import store from "./store";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";

const app = createApp(App);
// 自定义指令
app.directive("limit", {
  beforeMount: (el, binding) => {
    let userButton = storage.getItem("userButton");
    let value = binding.value;
    let hasPermission = userButton.includes(value);
    if (!hasPermission) {
      el.style = "display:none";
      setTimeout(() => {
        el.parentNode.removeChild(el);
      }, 0);
    }
  },
});
app.config.globalProperties.$request = request;
app.config.globalProperties.$storage = storage;
app.config.globalProperties.$api = api;
app.config.globalProperties.$message = ElMessage;
app.use(router).use(store).use(ElementPlus, { locale: zhCn }).mount("#app");
// 引入所有element icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
