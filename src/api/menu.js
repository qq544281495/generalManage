/**
 * 菜单接口
 */
import request from "@/utils/request";
export default {
  // 获取菜单列表
  getMenuList(data) {
    return request.get("/menu/list", data);
  },
  // 创建 | 编辑 | 删除菜单
  operateMenu(data) {
    return request.post("/menu/operate", data);
  },
};
