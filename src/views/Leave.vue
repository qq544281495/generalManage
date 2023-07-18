<template>
  <div class="role-manage">
    <!-- 查询 -->
    <el-form ref="query" :inline="true" :model="queryForm" class="query-from">
      <el-form-item label="审批状态:" prop="applyState">
        <el-select v-model="queryForm.applyState">
          <el-option
            v-for="item in stateList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery" v-limit="'/leave/query'"
          >查询</el-button
        >
        <el-button @click="handleReset" v-limit="'/leave/query'"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <div class="base-table">
      <div class="action">
        <el-button
          type="primary"
          @click="handleOpenLeave"
          v-limit="'/leave/apply'"
          >申请休假</el-button
        >
      </div>
      <el-table :data="leaveList" height="calc(100vh - 292px)">
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
            <el-button @click="handleCheck(scope.row)" v-limit="'/leave/check'"
              >查看</el-button
            >
            <el-button
              v-if="scope.row.applyState != 5"
              type="danger"
              @click="handleDelete(scope.row._id)"
              v-limit="'/leave/delete'"
              >作废</el-button
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
      v-model="leaveDialog"
      title="申请休假"
      width="600px"
      :close-on-click-modal="false"
      @close="handleCancel"
    >
      <el-form
        ref="dialog"
        :model="leaveForm"
        label-width="100px"
        :hide-required-asterisk="true"
        size="large"
        :rules="rules"
      >
        <el-form-item label="休假类型:" prop="applyType">
          <el-select
            v-model="leaveForm.applyType"
            placeholder="请选择休假类型"
            style="width: 100%"
          >
            <el-option label="事假" :value="1"></el-option>
            <el-option label="调休" :value="2"></el-option>
            <el-option label="年假" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="休假时间:">
          <el-row>
            <el-col :span="11">
              <el-form-item prop="startTime">
                <el-date-picker
                  v-model="leaveForm.startTime"
                  type="datetime"
                  placeholder="请选择开始日期"
                  :default-time="new Date(2000, 1, 1, 9, 0, 0)"
                  :disabledDate="disabledDate"
                  @change="handleChangeDate()"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="text-align: center">——</el-col>
            <el-col :span="11">
              <el-form-item prop="endTime">
                <el-date-picker
                  v-model="leaveForm.endTime"
                  type="datetime"
                  placeholder="请选择结束日期"
                  :default-time="new Date(2000, 1, 1, 18, 0, 0)"
                  :disabledDate="disabledDate"
                  @change="handleChangeDate()"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="休假时长:" prop="leaveTime">{{
          leaveForm.leaveTime
        }}</el-form-item>
        <el-form-item label="休假原因" prop="reasons">
          <el-input
            resize="none"
            type="textarea"
            :row="4"
            placeholder="请输入休假原因"
            v-model="leaveForm.reasons"
            autosize
          >
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleConfirm">确定</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="checkDialog"
      title="查看休假"
      width="600px"
      @close="handleCancelCheck"
    >
      <el-form
        ref="check"
        :model="checkForm"
        label-width="100px"
        :hide-required-asterisk="true"
        size="large"
      >
        <el-steps
          v-if="checkForm.applyState != 5"
          style="width: 100%"
          :active="checkForm.applyState"
          align-center
          finish-status="success"
        >
          <el-step title="待审批" />
          <el-step title="审批中" />
          <el-step title="审批通过/拒绝" />
        </el-steps>
        <el-steps
          v-if="checkForm.applyState == 5"
          style="width: 100%"
          :active="1"
          align-center
          finish-status="error"
        >
          <el-step title="作废" />
        </el-steps>
        <el-form-item
          style="margin-bottom: 0px"
          label="休假类型:"
          prop="applyType"
          >{{ getApplyType(checkForm.applyType) }}</el-form-item
        >
        <el-form-item
          style="margin-bottom: 0px"
          label="休假时间:"
          prop="leaveDate"
          >{{ checkForm.leaveDate }}</el-form-item
        >
        <el-form-item
          style="margin-bottom: 0px"
          label="休假时长:"
          prop="leaveTime"
          >{{ checkForm.leaveTime }}</el-form-item
        >
        <el-form-item
          style="margin-bottom: 0px"
          label="休假原因:"
          prop="reasons"
          >{{ checkForm.reasons }}</el-form-item
        >
        <el-form-item
          style="margin-bottom: 0px"
          label="审批状态:"
          prop="applyState"
          >{{ getApplyState(checkForm.applyState) }}</el-form-item
        >
        <el-form-item
          style="margin-bottom: 0px"
          label="审批人:"
          prop="auditUsers"
          >{{ checkForm.auditUsers }}</el-form-item
        >
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import utils from "@/utils/utils";
export default {
  name: "Leave",
  data() {
    return {
      action: "",
      leaveDialog: false,
      checkDialog: false,
      leaveForm: {
        applyType: "",
        startTime: "",
        endTime: "",
        leaveTime: "",
        reasons: "",
      },
      checkForm: {},
      queryForm: {
        applyState: "",
      },
      stateList: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "待审批",
          value: 1,
        },
        {
          label: "审批中",
          value: 2,
        },
        {
          label: "审批拒绝",
          value: 3,
        },
        {
          label: "审批通过",
          value: 4,
        },
        {
          label: "作废",
          value: 5,
        },
      ],
      leaveList: [],
      columns: [
        {
          label: "单号",
          prop: "orderNo",
          width: "120px",
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
      page: {
        total: 0,
        pageSize: 10,
        pageNumber: 1,
      },
      rules: {
        applyType: [
          {
            required: true,
            message: "请选择休假类型",
            trigger: "blur",
          },
        ],
        startTime: [
          {
            required: true,
            message: "请选择休假开始时间",
            trigger: "blur",
          },
        ],
        endTime: [
          {
            required: true,
            message: "请选择休假结束时间",
            trigger: "blur",
          },
        ],
        reasons: [
          {
            required: true,
            message: "请输入休假原因",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    disabledDate(time) {
      return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
    },
    async getLeaveList() {
      let params = { ...this.queryForm, ...this.page };
      let { list, page } = await this.$api.getLeaveList(params);
      this.leaveList = list;
      this.page.total = page.total;
    },
    handleOpenLeave() {
      this.action = "create";
      this.leaveDialog = true;
    },
    handleConfirm() {
      this.$refs.dialog.validate(async (valid) => {
        if (valid) {
          let params = { action: this.action, ...this.leaveForm };
          let { info } = await this.$api.operateLeave(params);
          this.$message.success(info);
          this.handleCancel();
          this.getLeaveList();
        } else {
          return false;
        }
      });
    },
    handleChangeDate() {
      let { startTime, endTime } = this.leaveForm;
      if (startTime && endTime) {
        let start = new Date(startTime).getTime();
        let end = new Date(endTime).getTime();
        if (start <= end) {
          let hours = (end - start) / 1000 / 60 / 60;
          if (hours >= 9) {
            let day = (hours = (hours - 9) / 24) + 1;
            let decimals = Number(`0.${day.toString().split(".")[1]}`);
            if (decimals) {
              day = Number(day.toString().split(".")[0]);
              day = decimals > 0.625 ? day + 1 : day;
            }
            this.leaveForm.leaveTime = `${day}天`;
          } else {
            this.leaveForm.leaveTime = `${hours}小时`;
          }
        } else {
          this.$message.error("休假开始时间不能晚于结束时间");
          this.leaveForm.leaveTime = "0天";
          this.leaveForm.startTime = "";
          this.leaveForm.endTime = "";
        }
      }
    },
    handleCancelCheck() {
      this.checkDialog = false;
      this.checkForm = {};
    },
    handleCancel() {
      this.leaveDialog = false;
      this.$refs["dialog"].resetFields();
    },
    handleCheck(item) {
      this.checkDialog = true;
      item["leaveDate"] = `${utils.formateDate(
        new Date(item.startTime)
      )} 到 ${utils.formateDate(new Date(item.endTime))}`;
      this.$nextTick(() => {
        Object.assign(this.checkForm, item);
      });
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
    async handleDelete(_id) {
      this.action = "delete";
      let params = { _id, action: this.action };
      let { info } = await this.$api.operateLeave(params);
      this.$message.success(info);
      this.getLeaveList();
    },
    handleQuery() {
      this.getLeaveList();
    },
    handleReset() {
      this.$refs["query"].resetFields();
    },
    // 切换页码
    handleCurrentChange(value) {
      this.page.pageNumber = value;
      this.getLeaveList();
    },
  },
  mounted() {
    this.getLeaveList();
  },
};
</script>

<style lang="scss" scoped></style>
