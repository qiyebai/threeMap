<template>
  <div class="bottom-body-root">
    <!-- {{$t('crumbs')}}  -->
    <ComBreadcrumb v-if="isShowBreadcrumb" />
    <!-- <div
      class="body-wrapper ml-bg-card "
      :style="{
        height: isShowBreadcrumb ? 'calc(100% - 32px)' : '100%',
        'overflow': 'auto',
      }"
    > -->
    <div class="body-wrapper ml-bg-card ">
      <router-view class="padding-wapper"></router-view>
    </div>
  </div>
</template>

<script>
import ComBreadcrumb from '../breadcrumb/index.vue';

export default {
  name: 'BottomBody',
  components: {
    ComBreadcrumb,
  },
  computed: {
    isShowBreadcrumb() {
      // 如果路由页部位 Home 页面则展示面包屑
      return this.$route.name !== 'Home';
    },
  },
};
</script>

<style lang="less" scoped>
.bottom-body-root {
  position: relative;
  height: calc(~"100% - 60px");
  @{deep} .ivu-card-body {
    height: 100%;
  }
  .body-wrapper {
    // margin: 0 16px;
    // padding-bottom: 30px;
    position: absolute;
    left: 16px;
    right: 16px;
    top: 44px;
    bottom: 10px;
    overflow: auto
  }
}
.padding-wapper{
 padding: 16px 24px;
}
</style>
