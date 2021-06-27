<template>
  <div class="page-layout">
    <div class="menu-box">
      <div class="logo-box">
        <img :src="logo" class="logo-image" alt="">
      </div>
      <div class="tab">
        <div class="item" v-for="(p,i) in menu" :key="i" @click="tabChange(i)" :class="{'active':tabIndex === i}">{{p}}</div>
      </div>
    </div>
    <div class="content-box">
      <PublicFoundation v-if="tabIndex === 0"></PublicFoundation>
      <ProjectPresentation v-if="tabIndex === 1"></ProjectPresentation>
    </div>
  </div>
</template>

<script>
import ProjectPresentation from '../projectPresentation/index';
import PublicFoundation from '../publicFoundation/index';

export default {
  name: 'PageLayout',
  components: {
    ProjectPresentation,
    PublicFoundation,
  },
  data() {
    return {
      logo: require('../../assets/logo.png'),
      menu: ['公共基础', '项目展示'],
      tabIndex: 0,
    };
  },
  methods: {
    tabChange(i) {
      this.tabIndex = i;
    },
  },
};
</script>

<style lang="less" scoped>
.page-layout {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #0b0b23;
  .menu-box {
    position: relative;
    z-index: 901;
    display: flex;
    .logo-box {
      height: 60px;
      width: 130px;
      padding-left: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      .logo-image {
        width: 100%;
        // filter: invert(100%);
      }
    }
    .tab {
      color: #ffffff;
      display: flex;
      align-items: center;
      margin-left: 60px;
      .item {
        padding: 0 40px;
        cursor: pointer;
        &:hover {
          color: #0091f2;
        }
        &.active {
          color: #0091f2;
        }
      }
    }
  }
  .content-box {
    height: calc(100% - 60px);
    height: 100%;
    width: 100%;
    padding: 30px;
    overflow: auto;
  }
}
</style>

