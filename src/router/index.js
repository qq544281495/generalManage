import { createRouter, createWebHashHistory } from "vue-router";
import storage from "@/utils/storage";
import api from "@/api";
import utils from "../utils/utils";

const modules = import.meta.glob("../views/*.vue");
const routes = [
  {
    name: "Home",
    path: "/",
    component: () => import("@/layout/Home.vue"),
    redirect: "/welcome",
    meta: {
      title: "首页",
    },
    children: [
      {
        name: "Welcome",
        path: "welcome",
        component: () => import("@/views/Welcome.vue"),
        meta: {
          title: "欢迎页",
        },
      },
    ],
  },
  {
    name: "Login",
    path: "/login",
    component: () => import("@/views/Login.vue"),
    meta: {
      title: "登录页",
    },
  },
  {
    name: "404",
    path: "/404",
    component: () => import("@/views/404.vue"),
    meta: {
      title: "页面不存在",
    },
  },
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

// 动态加载路由
async function loadRoutes() {
  let userInfo = storage.getItem("userInfo") || {};
  if (userInfo.token) {
    try {
      let { list } = await api.getPermissionList();
      let routes = utils.getPermissionRoute(list);
      routes.map((item) => {
        let url = `../views/${item.component}.vue`;
        item.component = modules[url];
        router.addRoute("Home", item);
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}

await loadRoutes();

// 路由前置守卫
router.beforeEach((to, from, next) => {
  if (router.hasRoute(to.name)) {
    document.title = to.meta.title;
    next();
  } else {
    document.title = to.meta.title;
    next("/404");
  }
});

export default router;
