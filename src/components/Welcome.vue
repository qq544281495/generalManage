<template>
  <div>
    <h2>欢迎页面</h2>
    <el-button @click="skipLogin">登录账号</el-button>
  </div>
</template>

<script>
export default {
  name: "welcome",
  methods: {
    skipLogin() {
      this.$router.push({
        path: "/login",
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
