<template>
  <div class="error-manage">
    <img src="@/assets/images/404.png" alt="404" />
    <div class="back" @click="goBack">返回首页</div>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.push({
        path: "/",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.error-manage {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;

  img {
    width: auto;
    height: calc(100% - 240px);
  }

  .back {
    cursor: pointer;
    width: 200px;
    height: 40px;
    line-height: 40px;
    border-radius: 8px;
    text-align: center;
    color: #ffffff;
    background: #8ca8ff;
  }
}
</style>
