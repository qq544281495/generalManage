import request from "@/utils/request";
export default {
  // 登录接口
  login(data) {
    return request.post("/users/login", data);
  },
  // 通知数量
  noticeCount(data) {
    return request.get("/leave/count", data);
  },
  // 菜单列表
  getMenuList(data) {
    return request.get("/menu/list", data);
  },
};
