<template>
  <div class="role-manage">
    <!-- 查询 -->
    <el-form ref="query" :inline="true" :model="queryForm" class="query-from">
      <el-form-item label="角色名称:" prop="roleName">
        <el-input v-model="queryForm.roleName" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item>
        <el-button v-limit="'/role/query'" type="primary" @click="handleQuery"
          >查询</el-button
        >
        <el-button v-limit="'/role/query'" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="base-table">
      <div class="action">
        <el-button v-limit="'/role/create'" type="primary" @click="handleCreate"
          >新增</el-button
        >
      </div>
      <el-table :data="roleList" height="calc(100vh - 292px)">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width ? item.width : 'auto'"
          :formatter="item.formatter"
        />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              v-limit="'/role/edit'"
              type="primary"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-limit="'/role/permission'"
              type="primary"
              @click="handleOpenPrivilege(scope.row)"
              >设置权限</el-button
            >
            <el-button
              v-limit="'/role/delete'"
              type="danger"
              @click="handleDelete(scope.row._id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="page.total"
        :page-size="page.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 创建角色弹窗 -->
    <el-dialog
      v-model="operateDialog"
      :title="operateTitle"
      width="600px"
      :close-on-click-modal="false"
      @close="handleCancel"
    >
      <el-form
        ref="operateForm"
        :model="operateForm"
        label-width="100px"
        :hide-required-asterisk="true"
        size="large"
        :rules="rules"
      >
        <el-form-item label="角色名称：" prop="roleName">
          <el-input
            v-model="operateForm.roleName"
            placeholder="请输入角色名称："
          ></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input
            v-model="operateForm.remark"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleOperateRole">确定</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑权限弹窗 -->
    <el-dialog
      v-model="privilegeDialog"
      title="设置权限"
      width="600px"
      :close-on-click-modal="false"
      @close="handleCancelPrivilege"
    >
      <el-form
        ref="privilegeForm"
        :model="privilegeForm"
        label-width="100px"
        :hide-required-asterisk="true"
        size="large"
        :rules="rules"
      >
        <el-form-item label="角色名称：" prop="roleName">
          <span>{{ privilegeForm.roleName }}</span>
        </el-form-item>
        <el-form-item label="选择权限：">
          <el-tree
            ref="privilegeTree"
            :data="menuList"
            show-checkbox
            node-key="_id"
            :props="{ label: 'menuName' }"
            default-expand-all
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleSubmitPrivilege"
            >确定</el-button
          >
          <el-button @click="handleCancelPrivilege">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import utils from "@/utils/utils";
export default {
  name: "Role",
  data() {
    return {
      action: "",
      operateTitle: "",
      actionMap: {},
      operateDialog: false,
      privilegeDialog: false,
      operateForm: {
        roleName: "",
        remark: "",
      },
      privilegeForm: {
        _id: "",
        roleName: "",
      },
      roleList: [],
      menuList: [],
      columns: [
        {
          label: "角色名称",
          prop: "roleName",
        },
        {
          label: "备注",
          prop: "remark",
        },
        {
          label: "权限列表",
          prop: "permissionList",
          formatter: (row, column, value) => {
            let names = [];
            let list = value.halfCheckedKeys || [];
            list.map((key) => {
              if (key && this.actionMap[key]) {
                names.push(this.actionMap[key]);
              }
            });
            return names.join(",");
          },
        },
        {
          label: "创建时间",
          prop: "createTime",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
        },
      ],
      queryForm: {
        roleName: "",
      },
      page: {
        total: 0,
        pageSize: 10,
        pageNumber: 1,
      },
      rules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    async getMenuList() {
      try {
        let { list } = await this.$api.getMenuList();
        this.menuList = list;
        let mapList = JSON.parse(JSON.stringify(list));
        this.getActionMap(mapList);
      } catch (error) {
        throw new Error(error);
      }
    },
    async getRoleList() {
      try {
        let params = { ...this.queryForm, ...this.page };
        let { list, page } = await this.$api.getRoleList(params);
        this.page.total = page.total;
        this.roleList = list;
      } catch (error) {
        throw new Error(error);
      }
    },
    handleOperateRole() {
      this.$refs.operateForm.validate(async (valid) => {
        if (valid) {
          try {
            let params = {
              action: this.action,
              ...this.operateForm,
            };
            let { info } = await this.$api.operateRole(params);
            this.$message.success(info);
            this.handleCancel();
            this.getRoleList();
          } catch (error) {
            throw new Error(error);
          }
        } else {
          return false;
        }
      });
    },

    handleCreate() {
      this.action = "create";
      this.operateTitle = "创建角色";
      this.operateDialog = true;
    },
    handleOpenPrivilege(value) {
      this.privilegeForm._id = value._id;
      this.privilegeForm.roleName = value.roleName;
      let { checkedKeys } = value.permissionList;
      this.privilegeDialog = true;
      this.$nextTick(() => {
        this.$refs.privilegeTree.setCheckedKeys(checkedKeys);
      });
      this.getRoleList();
    },
    handleEdit(value) {
      this.action = "edit";
      this.operateTitle = "编辑角色";
      this.operateDialog = true;
      this.$nextTick(() => {
        Object.assign(this.operateForm, value);
      });
    },
    handleCancel() {
      this.$refs["operateForm"].resetFields();
      this.operateTitle = "";
      this.operateDialog = false;
    },
    async handleSubmitPrivilege() {
      try {
        // 获取权限树中选中的节点
        let nodes = this.$refs.privilegeTree.getCheckedNodes();
        // 获取权限树中半选中的节点
        let halfNodes = this.$refs.privilegeTree.getHalfCheckedNodes();
        let checkedKeys = [];
        let parentKeys = [];
        let halfKeys = [];
        nodes.map((item) => {
          if (!item.children) {
            checkedKeys.push(item._id);
          } else {
            parentKeys.push(item._id);
          }
        });
        halfNodes.map((item) => {
          halfKeys.push(item._id);
        });
        let params = {
          _id: this.privilegeForm._id,
          permissionList: {
            checkedKeys,
            halfCheckedKeys: parentKeys.concat(halfKeys),
          },
        };
        let { info } = await this.$api.updatePermission(params);
        this.privilegeDialog = false;
        this.$message.success(info);
        this.getRoleList();
      } catch (error) {
        throw new Error(error);
      }
    },
    handleCancelPrivilege() {
      this.privilegeDialog = false;
    },
    handleQuery() {
      this.getRoleList();
    },
    handleReset() {
      this.$refs["query"].resetFields();
    },
    async handleDelete(_id) {
      try {
        this.action = "delete";
        let params = { action: this.action, _id };
        let { info } = await this.$api.operateRole(params);
        this.$message.success(info);
        this.getRoleList();
      } catch (error) {
        throw new Error(error);
      }
    },
    // 切换页码
    handleCurrentChange(value) {
      this.page.pageNumber = value;
      this.getRoleList();
    },
    // 权限字典映射
    getActionMap(list) {
      let actionMap = {};
      const deep = (array) => {
        while (array.length) {
          let item = array.pop();
          if (item.children && item.action) {
            actionMap[item._id] = item.menuName;
          }
          if (item.children && !item.action) {
            deep(item.children);
          }
        }
      };
      deep(list);
      this.actionMap = actionMap;
    },
  },
  mounted() {
    this.getRoleList();
    this.getMenuList();
  },
};
</script>

<style lang="scss" scoped></style>
