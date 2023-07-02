import request from "@/utils/request";
import userPort from "./user";
import menuPort from "./menu";
import rolePort from "./role";
export default {
  // 登录接口
  login(data) {
    return request.post("/users/login", data);
  },
  // 通知数量
  noticeCount(data) {
    return request.get("/leave/count", data, { mock: true });
  },
  // 获取部门列表
  getDeptList(data) {
    return request.get("/dept/list", data);
  },
  ...userPort,
  ...menuPort,
  ...rolePort,
};
