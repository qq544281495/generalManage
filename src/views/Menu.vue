<template>
  <div class="menu-manage">
    <!-- 查询 -->
    <el-form ref="query" :inline="true" :model="queryForm" class="query-from">
      <el-form-item label="菜单名称:" prop="menuName">
        <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称" />
      </el-form-item>
      <el-form-item label="菜单状态:" prop="menuState">
        <el-select v-model="queryForm.menuState">
          <el-option value="" label="全部" />
          <el-option :value="1" label="启用" />
          <el-option :value="2" label="停用" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate">新增</el-button>
      </div>
      <el-table
        :data="menuList"
        row-key="_id"
        :tree-props="{ children: 'children' }"
        height="calc(100vh - 239px)"
      >
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width ? item.width : 'auto'"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="200px">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleAdd(scope.row)"
              >新增</el-button
            >
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row._id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      v-model="menuDialog"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
      @close="handleCancel"
    >
      <el-form
        ref="dialog"
        :model="menuForm"
        label-width="100px"
        :hide-required-asterisk="true"
        size="large"
        :rules="rules"
      >
        <el-form-item label="父级菜单:" prop="parentId">
          <el-cascader
            v-model="menuForm.parentId"
            :options="treeList"
            :props="{ value: '_id', label: 'menuName', checkStrictly: true }"
            placeholder="请选择父级菜单"
            clearable
          />
          <span style="padding: 0px 20px; color: #409eff"
            >默认为创建一级菜单</span
          >
        </el-form-item>
        <el-form-item label="菜单类型:" prop="menuType">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称:" prop="menuName">
          <el-input
            v-model="menuForm.menuName"
            placeholder="请输入菜单名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-show="menuForm.menuType == '2'"
          label="权限标识:"
          prop="menuCode"
        >
          <el-input
            v-model="menuForm.menuCode"
            placeholder="请输入权限标识"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="菜单图标:"
          prop="icon"
          v-show="menuForm.menuType == '1'"
        >
          <el-select
            v-model="menuForm.icon"
            placeholder="请选择菜单图标"
            style="width: 100%"
          >
            <el-option
              v-for="item in iconList"
              :key="item"
              :label="item"
              :value="item"
            >
              <div style="display: flex; align-items: center">
                <el-icon :size="20"><component :is="item" /></el-icon>
                <span style="font-size: 16px; padding: 2px 10px 0px">{{
                  item
                }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="路由地址:"
          prop="path"
          v-show="menuForm.menuType == '1'"
        >
          <el-input
            v-model="menuForm.path"
            placeholder="请输入路由地址"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="组件路径:"
          prop="component"
          v-show="menuForm.menuType == '1'"
        >
          <el-input
            v-model="menuForm.component"
            placeholder="请输入组件路径"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单状态:" prop="menuState">
          <el-radio-group v-model="menuForm.menuState">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleConfirm">确定</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import utils from "@/utils/utils";
export default {
  name: "Menu",
  data() {
    return {
      menuList: [],
      treeList: [],
      dialogTitle: "",
      action: "",
      menuDialog: false,
      columns: [
        {
          label: "菜单名称",
          prop: "menuName",
          width: "200px",
        },
        {
          label: "图标",
          prop: "icon",
          width: "100px",
        },
        {
          label: "菜单类型",
          prop: "menuType",
          formatter(row, column, value) {
            return {
              1: "菜单",
              2: "按钮",
            }[value];
          },
        },
        {
          label: "权限标识",
          prop: "menuCode",
          width: "120px",
        },
        {
          label: "路由地址",
          prop: "path",
          width: "140px",
        },
        {
          label: "组件路径",
          prop: "component",
          width: "140px",
        },
        {
          label: "菜单状态",
          prop: "menuState",
          formatter(row, column, value) {
            return {
              1: "启用",
              2: "停用",
            }[value];
          },
        },
        {
          label: "创建时间",
          prop: "createTime",
          width: "200px",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
        },
      ],
      iconList: [
        "House",
        "Position",
        "Star",
        "Setting",
        "User",
        "Message",
        "FolderOpened",
        "Location",
      ],
      queryForm: {
        menuName: "",
        menuState: "",
      },
      menuForm: {
        parentId: [null],
        menuType: 1,
        menuName: "",
        icon: "",
        path: "",
        component: "",
        menuState: 1,
      },
      rules: {
        menuName: [
          {
            required: true,
            message: "请输入菜单名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 8,
            message: "请输入2-8个字符的菜单名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    async getMenuList() {
      try {
        let { list } = await this.$api.getMenuList(this.queryForm);
        this.menuList = list;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getTreeList() {
      try {
        let { list } = await this.$api.getMenuList();
        this.treeList = list;
      } catch (error) {
        throw new Error(error);
      }
    },
    handleQuery() {
      this.getMenuList();
    },
    handleReset() {
      this.$refs["query"].resetFields();
    },
    handleCreate() {
      this.action = "create";
      this.dialogTitle = "新增菜单";
      this.menuDialog = true;
    },
    handleAdd(value) {
      this.action = "create";
      this.dialogTitle = "新增菜单";
      this.menuForm.parentId = [...value.parentId, value._id].filter(
        (item) => item
      );
      this.menuDialog = true;
    },
    handleEdit(value) {
      this.action = "edit";
      this.dialogTitle = "编辑菜单";
      this.menuDialog = true;
      this.$nextTick(() => {
        Object.assign(this.menuForm, value);
      });
    },
    async handleDelete(_id) {
      try {
        this.action = "delete";
        let params = { action: this.action, _id };
        let { info } = await this.$api.operateMenu(params);
        this.$message.success(info);
        this.getMenuList();
      } catch (error) {
        throw new Error(error);
      }
    },
    handleConfirm() {
      this.$refs.dialog.validate(async (valid) => {
        if (valid) {
          try {
            let { action, menuForm } = this;
            let params = { ...menuForm, action };
            let { info } = await this.$api.operateMenu(params);
            this.$message.success(info);
            this.handleCancel();
            this.getMenuList();
          } catch (error) {
            throw new Error(error);
          }
        } else {
          return false;
        }
      });
    },
    handleCancel() {
      this.dialogTitle = "";
      this.menuDialog = false;
      this.$refs["dialog"].resetFields();
    },
  },
  mounted() {
    this.getMenuList();
    this.getTreeList();
  },
};
</script>

<style lang="scss" scoped></style>
