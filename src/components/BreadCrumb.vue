<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item
      v-for="item of breadList"
      :key="item.path"
      :to="{ path: item.path }"
      >{{ item.meta.title }}</el-breadcrumb-item
    >
  </el-breadcrumb>
</template>

<script>
export default {
  name: "BreadCrumb",
  computed: {
    breadList() {
      return this.$route.matched;
    },
  },
};
</script>

<style lang="scss" scoped></style>
