/**
 * 用户接口
 */
import request from "@/utils/request";
export default {
  // 登录接口
  login(data) {
    return request.post("/users/login", data);
  },
  // 获取用户权限列表
  getPermissionList(data) {
    return request.get("/users/getPermissionList", data);
  },
  // 获取用户列表
  getUserList(data) {
    return request.get("/users/list", data);
  },
  // 删除用户
  deleteUser(data) {
    return request.post("/users/delete", data);
  },
  // 新增/编辑用户
  operateUser(data) {
    return request.post("/users/operate", data);
  },
};
