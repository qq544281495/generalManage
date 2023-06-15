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
};
</script>

<style lang="scss" scoped></style>
