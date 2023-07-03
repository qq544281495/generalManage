/**
 * 部门接口
 */
import request from "@/utils/request";
export default {
  // 获取部门列表
  getDeptList(data) {
    return request.get("/dept/list", data);
  },
  // 创建 | 编辑 | 删除菜单
  operateDept(data) {
    return request.post("/dept/operate", data);
  },
};
