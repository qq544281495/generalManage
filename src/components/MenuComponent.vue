<template>
  <template v-for="item in menu" :key="item._id">
    <el-sub-menu
      v-if="
        item.children &&
        item.children.length > 0 &&
        item.children[0].menuType == 1
      "
      :index="item._id"
    >
      <template #title>
        <el-icon><component :is="item.icon" /></el-icon>
        <span>{{ item.menuName }}</span>
      </template>
      <MenuComponent :menu="item.children" />
    </el-sub-menu>
    <el-menu-item v-else-if="item.menuType == 1" :index="item.path">{{
      item.menuName
    }}</el-menu-item>
  </template>
</template>

<script>
export default {
  name: "MenuComponent",
  props: {
    menu: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss" scoped></style>
