<template>
  <div class="layout-root">
    <div class="content">
      <div class="left-menus" :style="{width:comMenuWidth+'px'}">
        <img src="./logo.png" class="logo"/>
        <leftMenu class="menu-item" :collapsed="collapsed"></leftMenu>
      </div>
      <div class="right-content" :style="{width:'calc(100% - '+comMenuWidth+'px'}">
        <div class="user-info ml-bg-card ">
          <div class="menu-control">
            <Tooltip :content="!collapsed?$t('Putitaway'):$t('open')">
              <Icon type="md-menu" @click="collapsed=!collapsed" :class="['put-way',collapsed?'active':'']"/>
            </Tooltip>
          </div>
          <!-- <div class="right-info">
            <Select v-model="language" @on-change="languageChange">
              <Option value="zh-CN">中文</Option>
              <Option value="en-US">English</Option>
            </Select>
            <ComLoginUserInfo></ComLoginUserInfo>
          </div> -->
        </div>
         <ComBottomBody/>
      </div>
    </div>
  </div>
</template>
<script>
import leftMenu from '../left-menu/index';
import ComBottomBody from '../bottom-body/index.vue';

export default {
  name: 'Layout',
  data() {
    return {
      collapsed: false,
      language: 'zh-CN',
    };
  },
  computed: {
    comMenuWidth() {
      if (this.collapsed) {
        return 64;
      }
      return 220;
    },
  },
  created() {
    this.language = localStorage.getItem('language') || 'zh-CN';
  },
  methods: {
    languageChange(value) {
      localStorage.setItem('language', value);
      window.location.reload();
    },
  },
  components: {
    leftMenu,
    ComBottomBody,
  },
};
</script>

<style lang="less" scoped>
.layout-root {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .content{
    display: flex;
    height: 100%;
    .left-menus{
      background: #131721;
      width: 60px;
      transition: width .2s;
      .menu-item{
        width: 100%;
        overflow-y: auto;
        height: calc(~"100% - 110px");;
      }
    }
    .right-content{
      width: 100%;
    }
  }
}
.user-info{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo{
  width: 100%;
  padding: 30px 40px 40px 20px;
}
.menu-control{
  padding: 20px 0 0 20px;
  height: 60px;
  .put-way{
    font-size: 18px;
    cursor: pointer;
    transition: transform .2s ease-in-out;
    &.active{
      transform: rotate(90deg);
    }
  }
}
.right-info{
  display: flex;
  width: 200px;
}
</style>


