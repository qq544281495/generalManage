<template>
  <div class="role-manage">
    <!-- 查询 -->
    <el-form ref="query" :inline="true" :model="queryForm" class="query-from">
      <el-form-item label="我的审批:" prop="applyState">
        <el-select v-model="queryForm.checkState">
          <el-option
            v-for="item in ratifyStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery" v-limit="'/ratify/query'"
          >查询</el-button
        >
        <el-button @click="handleReset" v-limit="'/ratify/query'"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <div class="base-table">
      <el-table :data="ratifyList" height="calc(100vh - 219px)">
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
            <el-button
              v-if="
                scope.row.curAuditUserName == userInfo.userName &&
                (scope.row.applyState == 1 || scope.row.applyState == 2)
              "
              type="primary"
              @click="handleCheck(scope.row)"
              v-limit="'/ratify/check'"
              >审批</el-button
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
    <el-dialog v-model="ratifyDialog" title="休假审批" width="600px">
      <el-form
        ref="dialogForm"
        :model="ratifyForm"
        label-width="100px"
        size="large"
        :rules="rules"
        :hide-required-asterisk="true"
      >
        <el-form-item label="申请人:">{{
          ratifyForm.applyUser.userName
        }}</el-form-item>
        <el-form-item label="休假类型:">{{
          getApplyType(ratifyForm.applyType)
        }}</el-form-item>
        <el-form-item label="休假时间:">{{
          getLeaveTime(ratifyForm.startTime, ratifyForm.endTime)
        }}</el-form-item>
        <el-form-item label="休假时长:">{{
          ratifyForm.leaveTime
        }}</el-form-item>
        <el-form-item label="休假原因:">{{ ratifyForm.reasons }}</el-form-item>
        <el-form-item label="审批状态:">{{
          getApplyState(ratifyForm.applyType)
        }}</el-form-item>
        <el-form-item label="当前审批人:">{{
          ratifyForm.curAuditUserName
        }}</el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入审核备注"
            v-model="ratifyForm.remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="checkLeave('succeed')"
            >通过</el-button
          >
          <el-button type="danger" @click="checkLeave('fail')">驳回</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import utils from "@/utils/utils";
export default {
  name: "Ratify",
  data() {
    return {
      userInfo: this.$store.state.user.userInfo,
      action: "",
      ratifyDialog: false,
      ratifyForm: {
        remark: "",
      },
      ratifyList: [],
      queryForm: {
        checkState: 0,
      },
      ratifyStatus: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "待审批",
          value: 0,
        },
        {
          label: "审批通过",
          value: 1,
        },
        {
          label: "审批拒绝",
          value: 2,
        },
      ],
      page: {
        total: 0,
        pageSize: 10,
        pageNumber: 1,
      },
      columns: [
        {
          label: "单号",
          prop: "orderNo",
          width: "120px",
        },
        {
          label: "申请人",
          prop: "applyUser.userName",
        },
        {
          label: "休假时间",
          prop: "",
          formatter(row) {
            return `${utils.formateDate(
              new Date(row.startTime)
            )}${utils.formateDate(new Date(row.endTime))}`;
          },
          width: "170px",
        },
        {
          label: "休假时长",
          prop: "leaveTime",
        },
        {
          label: "休假类型",
          prop: "applyType",
          formatter: (row, column, value) => {
            return {
              1: "事假",
              2: "调休",
              3: "年假",
            }[value];
          },
        },
        {
          label: "休假原因",
          prop: "reasons",
        },
        {
          label: "申请时间",
          prop: "createTime",
          formatter(row, column, value) {
            return utils.formateDate(new Date(value));
          },
          width: "170px",
        },
        {
          label: "审批人",
          prop: "auditUsers",
          width: "170px",
        },
        {
          label: "当前审批人",
          prop: "curAuditUserName",
          width: "100px",
        },
        {
          label: "我的审批",
          prop: "auditFlows",
          formatter: (row) => {
            let userName = this.userInfo.userName;
            let current = row.auditFlows.filter(
              (item) => item.userName == userName
            );
            let value = current[0].checkState;
            return {
              0: "待审批",
              1: "审批通过",
              2: "审批拒绝",
            }[value];
          },
        },
        {
          label: "审批状态",
          prop: "applyState",
          formatter: (row, column, value) => {
            return {
              1: "待审批",
              2: "审批中",
              3: "审批拒绝",
              4: "审批通过",
              5: "作废",
            }[value];
          },
        },
      ],
      rules: {
        remark: [
          {
            required: true,
            message: "请输入审批备注",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    async getRatifyList() {
      let params = { ...this.queryForm, ...this.page };
      let { list, page } = await this.$api.getRatifyList(params);
      this.ratifyList = list;
      this.page.total = page.total;
    },
    checkLeave(index) {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          this.action = index;
          let params = { action: this.action, ...this.ratifyForm };
          let { info } = await this.$api.checkRatifyLeave(params);
          this.$message.success(info);
          this.ratifyDialog = false;
          await this.getRatifyList();
          await this.getNoticeCount();
        } else {
          return false;
        }
      });
    },
    async getNoticeCount() {
      try {
        const { total } = await this.$api.noticeCount();
        console.log(total);
        this.$store.commit("user/SET_Notice_Count", total);
      } catch (error) {
        throw new Error(error);
      }
    },
    handleCheck(item) {
      Object.assign(this.ratifyForm, item);
      this.ratifyDialog = true;
    },
    getApplyState(index) {
      let state = "";
      switch (index) {
        case 1:
          state = "待审批";
          break;
        case 2:
          state = "审批中";
          break;
        case 3:
          state = "审批拒绝";
          break;
        case 4:
          state = "审批通过";
          break;
        case 5:
          state = "作废";
          break;
      }
      return state;
    },
    getApplyType(index) {
      let type = "";
      switch (index) {
        case 1:
          type = "事假";
          break;
        case 2:
          type = "调休";
          break;
        case 3:
          type = "年假";
          break;
      }
      return type;
    },
    getLeaveTime(startTime, endTime) {
      return `${utils.formateDate(new Date(startTime))} 到 ${utils.formateDate(
        new Date(endTime)
      )}`;
    },
    handleQuery() {
      this.getRatifyList();
    },
    handleReset() {
      this.$refs["query"].resetFields();
    },
    // 切换页码
    handleCurrentChange(value) {
      this.page.pageNumber = value;
      this.getRatifyList();
    },
  },
  mounted() {
    this.getRatifyList();
  },
};
</script>

<style lang="scss" scoped></style>
