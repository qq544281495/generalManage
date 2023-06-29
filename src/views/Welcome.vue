<template>
  <div class="welcome-wrapper">
    <div class="content">
      <div class="sub-title">欢迎体验</div>
      <div class="primary-title">通用后台管理系统</div>
      <div class="desc">—— Vue3.0+ElementPlus+Node+Mongo打造通用后台系统</div>
    </div>
    <div class="image">
      <img src="../assets/images/welcome.png" alt="welcome" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Welcome",
};
</script>

<style lang="scss" scoped>
.welcome-wrapper {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  .content {
    .sub-title {
      font-size: 30px;
      line-height: 40px;
      color: #333333;
    }
    .primary-title {
      font-size: 40px;
      line-height: 60px;
      color: #409eff;
      margin: 10px 0px;
    }
    .desc {
      text-align: right;
      font-size: 14px;
      line-height: 24px;
      color: #999999;
    }
  }
}
</style>
