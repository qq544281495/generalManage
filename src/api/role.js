/**
 * 角色接口
 */
import request from "@/utils/request";
export default {
  // 获取系统角色列表
  getAllRoleList(data) {
    return request.get("/roles/allList", data);
  },
  // 获取角色列表
  getRoleList(data) {
    return request.get("/roles/list", data);
  },
  // 创建 | 编辑 | 删除角色
  operateRole(data) {
    return request.post("/roles/operate", data);
  },
  // 更新角色权限
  updatePermission(data) {
    return request.post("/roles/update/permission", data);
  },
};
