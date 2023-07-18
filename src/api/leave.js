/**
 * 休假申请接口
 */
import request from "@/utils/request";
export default {
  // 获取休假列表
  getLeaveList(data) {
    return request.get("/leave/list", data);
  },
  // 申请 | 作废休假
  operateLeave(data) {
    return request.post("/leave/operate", data);
  },
  // 获取休假审批列表
  getRatifyList(data) {
    return request.get("/leave/ratify", data);
  },
  // 审批休假申请
  checkRatifyLeave(data) {
    return request.post("/leave/ratify/leave", data);
  },
};
