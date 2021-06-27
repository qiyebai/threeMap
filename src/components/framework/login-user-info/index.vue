<template>
  <div class="login-user-info-root">
    <Poptip placement="bottom-end" trigger="hover">
      <h3 class="name">{{ data_loginUserInfo.name }}</h3>
      <div slot="content">
        <ul class="ul-list" @click="onListClick">
          <li class="li-item" v-for="(item, index) in data_loginUserInfo.menus"
            :key="`list-item-${index}`" :data-id="item.id">{{ item.name }}</li>
        </ul>
      </div>
    </Poptip>
  </div>
</template>

<script>
export default {
  name: 'LoginUserInfo',
  data() {
    return {
      data_loginUserInfo: {
        name: 'admin',
        menus: [
          {
            id: 'about',
            name: this.$t('about'),
            url: '/about',
          },
          {
            id: 'logout',
            name: this.$t('Logout'),
            url: '/logout',
          },
        ],
      },
    };
  },
  methods: {
    onListClick(ev) {
      const { id } = ev.target.dataset;
      if (id === 'logout') {
        // 调用登出接口

        // 跳转到登录页
        this.$router.push({
          path: '/login',
        });
      } else if (id === 'about') {
        this.$Modal.info({
          title: this.$t('about'),
          content: '详情 版本号之类',
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.login-user-info-root {
  min-width: 100px;
  padding: 0 24px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  cursor: pointer;
  @{deep} .name {
    width: 100%;
    height: 100%;
    line-height: 20px;
  }
  @{deep} .ul-list {
    color: black;
    .li-item {
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      &:hover{
        background: #131721;
        color: #fff;
      }
    }
  }
}
</style>
