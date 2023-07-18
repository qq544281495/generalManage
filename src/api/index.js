import request from "@/utils/request";
import userPort from "./user";
import menuPort from "./menu";
import rolePort from "./role";
import deptPort from "./dept";
import leavePort from "./leave";
export default {
  ...userPort,
  ...menuPort,
  ...rolePort,
  ...deptPort,
  ...leavePort,
};
