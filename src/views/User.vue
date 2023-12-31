<template>
  <div class="user-manage">
    <el-form
      ref="queryForm"
      :inline="true"
      :model="userQuery"
      class="query-from"
    >
      <el-form-item label="用户ID:" prop="userId">
        <el-input v-model="userQuery.userId" placeholder="请输入用户ID" />
      </el-form-item>
      <el-form-item label="用户名:" prop="userName">
        <el-input v-model="userQuery.userName" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="状态:" prop="state">
        <el-select v-model="userQuery.state">
          <el-option :value="0" label="所有" />
          <el-option :value="1" label="在职" />
          <el-option :value="2" label="离职" />
          <el-option :value="3" label="试用期" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-limit="'/user/query'" type="primary" @click="handleQuery"
          >查询</el-button
        >
        <el-button v-limit="'/user/query'" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="base-table">
      <div class="action">
        <el-button v-limit="'/user/create'" type="primary" @click="handleCreate"
          >新增</el-button
        >
        <el-button
          v-limit="'/user/batchRemove'"
          type="danger"
          @click="handleBatchDelete"
          >批量删除</el-button
        >
      </div>
      <el-table
        :data="userData"
        @selection-change="handleSelectionChange"
        height="calc(100vh - 292px)"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in userTable"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width ? item.width : 'auto'"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="200px">
          <template #default="scope">
            <el-button
              v-limit="'/user/edit'"
              type="primary"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-limit="'/user/delete'"
              type="danger"
              @click="handleDelete(scope.row)"
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
    <el-dialog
      v-model="userDialog"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
      @close="handleCancel"
    >
      <el-form
        ref="dialogForm"
        :model="userForm"
        label-width="100px"
        :hide-required-asterisk="true"
        size="large"
        :rules="rules"
      >
        <el-form-item label="用户名：" prop="userName">
          <el-input
            v-model="userForm.userName"
            placeholder="请输入用户名"
            :disabled="operate == 'edit'"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="userEmail">
          <el-input
            v-model="userForm.userEmail"
            placeholder="请输入邮箱"
            :disabled="operate == 'edit'"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile">
          <el-input
            v-model="userForm.mobile"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="岗位：" prop="job">
          <el-input v-model="userForm.job" placeholder="请输入岗位"></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="state">
          <el-select v-model="userForm.state" style="width: 100%">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色：" prop="roleList">
          <el-select
            v-model="userForm.roleList"
            style="width: 100%"
            placeholder="请选择系统角色"
            multiple
          >
            <el-option
              v-for="item in roleList"
              :key="item._id"
              :label="item.roleName"
              :value="item._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门：" prop="deptId">
          <el-cascader
            v-model="userForm.deptId"
            placeholder="请选择所属部门"
            :options="deptList"
            :props="{ value: '_id', label: 'deptName', checkStrictly: true }"
            clearable
            style="width: 100%"
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleOperateUser">确定</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import utils from "@/utils/utils";
export default {
  name: "User",
  data() {
    return {
      userData: [],
      selectUsers: [],
      roleList: [],
      deptList: [],
      userDialog: false,
      operate: "add",
      dialogTitle: "",
      page: {
        total: 0,
        pageSize: 10,
        pageNumber: 1,
      },
      userQuery: {
        userId: "",
        userName: "",
        state: 0,
      },
      userTable: [
        {
          label: "用户ID",
          prop: "userId",
        },
        {
          label: "用户名",
          prop: "userName",
        },
        {
          label: "用户邮箱",
          prop: "userEmail",
          width: "160px",
        },
        {
          label: "用户角色",
          prop: "role",
          formatter(row, column, value) {
            return {
              0: "管理员",
              1: "普通用户",
            }[value];
          },
        },
        {
          label: "用户状态",
          prop: "state",
          formatter(row, column, value) {
            return {
              0: "所有",
              1: "在职",
              2: "离职",
              3: "试用期",
            }[value];
          },
        },
        {
          label: "职位",
          prop: "job",
          width: "100px",
        },
        {
          label: "注册时间",
          prop: "createTime",
          width: "200px",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
        },
        {
          label: "最后登录时间",
          prop: "lastLoginTime",
          width: "200px",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
        },
      ],
      userForm: {
        userName: "",
        userEmail: "",
        mobile: "",
        job: "",
        state: 1,
        roleList: [],
        deptId: [],
      },
      rules: {
        userName: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        userEmail: [
          {
            required: true,
            message: "请输入用户邮箱",
            trigger: "blur",
          },
          {
            pattern: /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/,
            message: "请输入正确的邮箱",
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
          {
            pattern: /^1[3|4|5|7|8|9][0-9]{9}$/,
            message: "请输入正确的手机号",
            trigger: "blur",
          },
        ],
        job: [
          {
            required: true,
            message: "请输入工作岗位",
            trigger: "blur",
          },
        ],
        roleList: [
          {
            required: true,
            message: "请输入系统角色",
            trigger: "blur",
          },
        ],
        deptId: [
          {
            required: true,
            message: "请选择所属部门",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 添加/编辑用户
    handleOperateUser() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          try {
            let data = {
              action: this.operate,
              ...this.userForm,
            };
            let { info } = await this.$api.operateUser(data);
            this.$message.success(info);
            this.getUserList();
            this.handleCancel();
          } catch (error) {
            throw new Error(error);
          }
        } else {
          return false;
        }
      });
    },
    // 关闭用户弹窗
    handleCancel() {
      this.dialogTitle = "";
      this.userDialog = false;
      this.$refs["dialogForm"].resetFields();
    },
    // 新增用户弹窗
    handleCreate() {
      this.dialogTitle = "新增用户";
      this.operate = "add";
      this.userDialog = true;
    },
    // 获取用户列表
    async getUserList() {
      try {
        let params = { ...this.userQuery, ...this.page };
        const { page, list } = await this.$api.getUserList(params);
        this.page.total = page.total;
        this.userData = list;
      } catch (error) {
        throw new Error(error);
      }
    },
    // 查询
    handleQuery() {
      this.getUserList();
    },
    // 重置表单
    handleReset() {
      this.$refs["queryForm"].resetFields();
    },
    // 切换页码
    handleCurrentChange(value) {
      this.page.pageNumber = value;
      this.getUserList();
    },
    // 选择用户
    handleSelectionChange(value) {
      this.selectUsers = value;
    },
    // 编辑用户
    handleEdit(value) {
      this.dialogTitle = "编辑用户";
      this.operate = "edit";
      this.userDialog = true;
      // 使用$nextTick等弹窗渲染完毕后赋值，避免赋值被当作初始值
      this.$nextTick(() => {
        Object.assign(this.userForm, value);
      });
    },
    // 删除用户
    async handleDelete(value) {
      try {
        let params = {
          userIds: [value.userId],
        };
        let { nModified } = await this.$api.deleteUser(params);
        if (nModified >= 1) {
          this.$message.success("用户删除成功");
          this.getUserList();
        } else {
          this.$message.error("删除失败，请稍后重试");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    // 批量删除用户
    async handleBatchDelete() {
      try {
        if (this.selectUsers.length > 0) {
          let params = {
            userIds: [],
          };
          this.selectUsers.map((item) => {
            params.userIds.push(item.userId);
          });
          let { nModified } = await this.$api.deleteUser(params);
          if (nModified >= 1) {
            this.$message.success(`用户删除成功，共删除${nModified}条用户数据`);
            this.getUserList();
          } else {
            this.$message.error("删除失败，请稍后重试");
          }
        } else {
          this.$message.warning("请选择需要删除的用户");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    // 获取角色列表
    async getAllRoleList() {
      try {
        let { list } = await this.$api.getAllRoleList();
        this.roleList = list;
      } catch (error) {
        throw new Error(error);
      }
    },
    // 获取部门列表
    async getDeptList() {
      try {
        let { list } = await this.$api.getDeptList();
        this.deptList = list;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  mounted() {
    this.getUserList();
    this.getAllRoleList();
    this.getDeptList();
  },
};
</script>

<style lang="scss" scoped></style>
