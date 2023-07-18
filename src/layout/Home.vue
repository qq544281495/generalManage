<template>
  <div class="layout">
    <div :class="['side-nav', isCollapse ? 'fold' : 'nofold']">
      <!-- 导航LOGO -->
      <div class="nav-logo">
        <img src="../assets/images/logo.png" alt="logo" />
        <div>通用后台管理</div>
      </div>
      <!-- 导航菜单 -->
      <el-menu
        background-color="#001529"
        :default-active="activeMenu"
        text-color="#fff"
        :collapse="isCollapse"
        class="nav-menu"
        router
      >
        <MenuComponent :menu="menuList" />
      </el-menu>
    </div>
    <div :class="['page-content', isCollapse ? 'fold' : 'nofold']">
      <div class="top-nav">
        <div class="nav-left">
          <div class="menu-fold" @click="toggle">
            <el-icon size="20px"><Fold /></el-icon>
          </div>
          <BreadCrumb />
        </div>
        <div>
          <!-- 消息通知 -->
          <el-badge
            :value="noticeCount"
            :hidden="noticeCount == 0"
            class="bell"
            @click="skipRatify"
            style="cursor: pointer"
          >
            <el-icon size="20px"><Bell /></el-icon>
          </el-badge>
          <!-- 用户信息 -->
          <el-popover placement="bottom" trigger="hover" :width="240">
            <template #reference>
              <span style="color: #409eff">{{ userInfo.userName }}</span>
            </template>
            <div style="display: flex; margin-bottom: 2px">
              <div style="width: 60px">用户名：</div>
              <div>{{ userInfo.userName }}</div>
            </div>
            <div style="display: flex; margin-bottom: 2px">
              <div style="width: 60px">邮箱：</div>
              <div>{{ userInfo.userEmail }}</div>
            </div>
            <div
              style="text-align: right; color: #409eff; cursor: pointer"
              @click="logout"
            >
              退出账号
            </div>
          </el-popover>
        </div>
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
import MenuComponent from "@/components/MenuComponent.vue";
import BreadCrumb from "@/components/BreadCrumb.vue";
export default {
  name: "handleBatchDeleteome",
  components: { MenuComponent, BreadCrumb },
  data() {
    return {
      isCollapse: false,
      userInfo: this.$store.state.user.userInfo,
      noticeCount: 0,
      menuList: [],
      activeMenu: location.hash.slice(1),
    };
  },
  methods: {
    async getPermissionList() {
      try {
        const { list, button } = await this.$api.getPermissionList();
        this.menuList = list;
        this.$store.commit("user/SET_USER_MENU", list);
        this.$store.commit("user/SET_USER_BUTTON", button);
      } catch (error) {
        throw new Error(error);
      }
    },
    async getNoticeCount() {
      try {
        const { total } = await this.$api.noticeCount();
        this.noticeCount = total;
      } catch (error) {
        throw new Error(error);
      }
    },
    skipRatify() {
      if (this.noticeCount) {
        this.$router.push({
          path: "/audit/ratify",
        });
      }
    },
    toggle() {
      this.isCollapse = !this.isCollapse;
    },
    logout() {
      this.$store.commit("user/SET_USER_INFO", {});
      this.$store.commit("user/SET_USER_MENU", []);
      this.$store.commit("user/SET_USER_BUTTON", []);
      this.$router.push({ path: "/login" });
    },
  },
  mounted() {
    this.getNoticeCount();
    this.getPermissionList();
  },
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
    color: #ffffff;
    overflow-y: auto;
    overflow-x: hidden;
    transition: all 0.5s;

    .nav-logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      white-space: nowrap;

      img {
        width: 32px;
        height: 32px;
        margin: 0px 16px;
      }
    }

    .nav-menu {
      height: calc(100vh - 50px);
      border-right: 0px;
    }

    &.fold {
      width: 64px;
    }

    &.nofold {
      width: 200px;
    }
  }
  .page-content {
    position: relative;
    transition: all 0.5s;
    .top-nav {
      display: flex;
      justify-content: space-between;
      height: 50px;
      line-height: 50px;
      border: 1px solid #dddddd;
      padding: 0px 20px;

      .nav-left {
        display: flex;
        align-items: center;

        .menu-fold {
          display: flex;
          align-items: center;
          margin-right: 10px;
        }
      }

      .bell {
        line-height: 20px;
        margin-right: 20px;
      }
    }

    .wrapper-box {
      background-color: #eeeeee;
      height: calc(100vh - 50px);
      padding: 20px;

      .wrapper-content {
        width: 100%;
        height: 100%;
      }
    }
    &.fold {
      margin-left: 64px;
    }

    &.nofold {
      margin-left: 200px;
    }
  }
}
</style>
