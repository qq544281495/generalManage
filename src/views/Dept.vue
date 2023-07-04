<template>
  <div class="role-manage">
    <!-- 查询 -->
    <el-form ref="query" :inline="true" :model="queryForm" class="query-from">
      <el-form-item label="部门名称:" prop="deptName">
        <el-input v-model="queryForm.deptName" placeholder="请输入部门名称" />
      </el-form-item>
      <el-form-item>
        <el-button v-limit="'/dept/query'" type="primary" @click="handleQuery"
          >查询</el-button
        >
        <el-button v-limit="'/dept/query'" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="base-table">
      <div class="action">
        <el-button
          v-limit="'/dept/create'"
          type="primary"
          @click="handleOpenDialog"
          >新增</el-button
        >
      </div>
      <el-table
        :data="deptList"
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
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              v-limit="'/dept/edit'"
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-limit="'/dept/delete'"
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
      v-model="deptDialog"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <el-form
        ref="deptForm"
        :model="deptForm"
        label-width="100px"
        :hide-required-asterisk="true"
        size="large"
        :rules="rules"
      >
        <el-form-item label="上级部门:" prop="parentId">
          <el-cascader
            v-model="deptForm.parentId"
            :options="treeList"
            :props="{ value: '_id', label: 'deptName', checkStrictly: true }"
            placeholder="请选择部门"
            clearable
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="部门名称:" prop="deptName">
          <el-input
            v-model="deptForm.deptName"
            placeholder="请输入部门名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="负责人:" prop="userName">
          <el-select
            v-model="deptForm.userName"
            placeholder="请选择负责人"
            style="width: 100%"
            @change="changeUser"
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="`${item.userId}/${item.userName}/${item.userEmail}`"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人邮箱:" prop="userEmail">
          <el-input
            v-model="deptForm.userEmail"
            placeholder="负责人邮箱"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确定</el-button>
          <el-button @click="handleClose">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import utils from "@/utils/utils";
export default {
  name: "Dept",
  data() {
    return {
      action: "",
      dialogTitle: "",
      deptDialog: false,
      deptList: [],
      treeList: [],
      userList: [],
      queryForm: {
        deptName: "",
      },
      columns: [
        {
          label: "部门名称",
          prop: "deptName",
        },
        {
          lable: "负责人",
          prop: "userName",
        },
        {
          label: "更新时间",
          prop: "updateTime",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
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
      deptForm: {
        parentId: [null],
        deptName: "",
        userId: "",
        userName: "",
        userEmail: "",
      },
      rules: {
        deptName: [
          {
            required: true,
            message: "请输入部门名称",
            trigger: "blur",
          },
        ],
        userName: [
          {
            required: true,
            message: "请选择部门负责人",
            trigger: "blur",
          },
        ],
        userEmail: [
          {
            required: true,
            message: "请选择部门负责人",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    async getUserList() {
      try {
        let { list } = await this.$api.getUserList();
        this.userList = list;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getTreeDeptList() {
      try {
        let { list } = await this.$api.getDeptList();
        this.treeList = list;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getDeptList() {
      try {
        let params = { ...this.queryForm };
        let { list } = await this.$api.getDeptList(params);
        this.deptList = list;
      } catch (error) {
        throw new Error(error);
      }
    },
    changeUser(value) {
      console.log(value);
      let info = value.split("/");
      this.deptForm.userId = info[0];
      this.deptForm.userName = info[1];
      this.deptForm.userEmail = info[2];
    },
    handleSubmit() {
      this.$refs.deptForm.validate(async (valid) => {
        if (valid) {
          try {
            let params = {
              action: this.action,
              ...this.deptForm,
            };
            let { info } = await this.$api.operateDept(params);
            this.$message.success(info);
            this.getDeptList();
            this.getTreeDeptList();
            this.handleClose();
          } catch (error) {
            throw new Error(error);
          }
        } else {
          return false;
        }
      });
    },
    handleClose() {
      this.$refs["deptForm"].resetFields();
      this.action = "";
      this.dialogTitle = "";
      this.deptDialog = false;
    },
    handleOpenDialog() {
      this.action = "create";
      this.dialogTitle = "创建部门";
      this.deptDialog = true;
    },
    handleEdit(item) {
      this.action = "edit";
      this.dialogTitle = "编辑部门";
      this.deptDialog = true;
      this.$nextTick(() => {
        Object.assign(this.deptForm, item);
      });
    },
    async handleDelete(_id) {
      try {
        this.action = "delete";
        let params = { _id, action: this.action };
        let { info } = await this.$api.operateDept(params);
        this.$message.success(info);
        this.getDeptList();
        this.getTreeDeptList();
      } catch (error) {
        throw new Error(error);
      }
    },
    handleQuery() {
      this.getDeptList();
    },
    handleReset() {
      this.$refs["query"].resetFields();
    },
  },
  mounted() {
    this.getDeptList();
    this.getUserList();
    this.getTreeDeptList();
  },
};
</script>

<style lang="scss" scoped></style>
