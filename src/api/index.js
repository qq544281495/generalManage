import request from "@/utils/request";
import userPort from "./user";
import menuPort from "./menu";
import rolePort from "./role";
import deptPort from "./dept";
export default {
  // 通知数量
  noticeCount(data) {
    return request.get("/leave/count", data, { mock: true });
  },
  ...userPort,
  ...menuPort,
  ...rolePort,
  ...deptPort,
};
