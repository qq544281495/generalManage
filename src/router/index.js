import { createRouter, createWebHashHistory } from "vue-router";

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
      {
        name: "User",
        path: "system/user",
        component: () => import("@/views/User.vue"),
        meta: {
          title: "用户管理",
        },
      },
      {
        name: "Menu",
        path: "system/menu",
        component: () => import("@/views/Menu.vue"),
        meta: {
          title: "菜单管理",
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
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

export default router;
