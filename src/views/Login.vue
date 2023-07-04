<template>
  <div class="login-wrapper">
    <div class="content">
      <el-form ref="userForm" :model="user" status-icon :rules="rules">
        <div class="title">通用后台管理系统</div>
        <el-form-item prop="userName">
          <el-input
            type="text"
            size="large"
            prefix-icon="User"
            placeholder="请输入账号"
            v-model="user.userName"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            size="large"
            prefix-icon="View"
            placeholder="请输入密码"
            v-model="user.password"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-button"
            @click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import storage from "@/utils/storage";
import utils from "@/utils/utils";
const modules = import.meta.glob("../views/*.vue");
export default {
  name: "Login",
  data() {
    return {
      user: {
        userName: "",
        password: "",
      },
      rules: {
        userName: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    async login() {
      try {
        this.$refs.userForm.validate(async (valid) => {
          if (valid) {
            let { data } = await this.$api.login(this.user);
            this.$store.commit("user/SET_USER_INFO", data);
            await this.loadRoutes();
            this.$router.push({ path: "/welcome" });
          } else {
            return false;
          }
        });
      } catch (error) {
        throw new Error(error);
      }
    },
    async loadRoutes() {
      let userInfo = storage.getItem("userInfo") || {};
      if (userInfo.token) {
        try {
          let { list } = await this.$api.getPermissionList();
          let routes = utils.getPermissionRoute(list);
          routes.map((item) => {
            let url = `./${item.component}.vue`;
            item.component = modules[url];
            this.$router.addRoute("Home", item);
          });
        } catch (error) {
          throw new Error(error);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #f9fcff;

  .content {
    width: 500px;
    padding: 50px;
    background-color: #ffffff;
    border-radius: 4px;
    box-shadow: 0px 0px 10px 2px #c7c9cb;

    .title {
      font-size: 32px;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 30px;
    }

    .login-button {
      width: 100%;
      margin-top: 10px;
    }
  }
}
</style>
