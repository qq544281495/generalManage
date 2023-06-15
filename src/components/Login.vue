<template>
  <div>
    <h2>登录页面</h2>
    <el-button @click="skipWelcome">返回欢迎页面</el-button>
  </div>
</template>

<script>
export default {
  name: "login",
  methods: {
    skipWelcome() {
      this.$router.push({
        path: "/welcome",
      });
    },
  },
  mounted() {
    // this.$request({
    //   url: "/login",
    //   method: "get",
    // }).then((response) => {
    //   console.log(response);
    // });
    this.$request.get("/login").then((response) => {
      console.log(response);
    });
  },
};
</script>

<style lang="scss" scoped></style>
