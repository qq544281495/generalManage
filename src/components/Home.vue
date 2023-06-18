<template>
  <div class="layout">
    <div class="side-nav"></div>
    <div class="page-content">
      <div class="top-nav">
        <div>面包屑</div>
        <div>用户信息</div>
      </div>
      <div class="wrapper-box">
        <div class="wrapper-content">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
};
</script>

<style lang="scss" scoped>
.layout {
  position: relative;
  .side-nav {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    overflow-y: auto;
    transition: width 0.5s;
  }
  .page-content {
    position: relative;
    margin-left: 200px;
    .top-nav {
      display: flex;
      justify-content: space-between;
      height: 50px;
      line-height: 50px;
      border: 1px solid #dddddd;
      padding: 0px 20px;
    }

    .wrapper-box {
      background-color: #eeeeee;
      height: calc(100vh - 50px);
      padding: 20px;

      .wrapper-content {
        width: 100%;
        height: 100%;
        background-color: #ffffff;
      }
    }
  }
}
</style>
