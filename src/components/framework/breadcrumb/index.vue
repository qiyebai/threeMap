<template>
  <div class="breadcrumb-root">
    <Breadcrumb>
      <BreadcrumbItem v-for="(item, index) in data_breadcrumbList"
      :key="`breadcrumb-${index}`" :to="item.to"
      >{{ item.name }}</BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>

<script>
import { menuList, breadCrumb } from '@/menu-map.js';

export default {
  name: 'ComBreadCrumb',
  data() {
    return {
      data_breadcrumbList: [],
      menuList: menuList(this),
      breadCrumb: breadCrumb(this),
    };
  },
  mounted() {
    this.build();
  },
  methods: {
    build() {
      const _config = this.breadCrumb[this.$route.path];
      // 获取是否有父url，没有的话直接取自己的url进行匹配
      let routerPath;
      if (_config) {
        routerPath = _config.parentUrl || this.$route.path;
      } else {
        routerPath = this.$route.path;
      }
      // 初始化面包屑数据
      this.data_breadcrumbList = [];
      this.crumbSearch = false;
      // 代码匹配函数
      this.getCrumb(this.menuList, routerPath);
      // 判断是否有配置children节点，有的话进行数组的拼接，没有则直接赋值
      if (_config && _config.childrenCrumb) {
        this.data_breadcrumbList = [...this.data_breadcrumbList, ..._config.childrenCrumb];
      }
    },
    getCrumb(data, routerPath) {
      if (this.crumbSearch) {
        return false;
      }
      data.forEach((item) => {
        // 判断是否已经完成匹配
        if (this.crumbSearch) {
          return false;
        }
        // 匹配相同的时候
        if (item.url.split('?')[0] === routerPath) {
          this.data_breadcrumbList.push({
            id: item.id,
            name: item.name,
            key: item.key,
            url: item.url,
          });
          this.crumbSearch = true;
          return false;
        }
        // 匹配未完成，如果存在submenu则递归submenu，并且保存父类的数据
        if (item.children) {
          this.data_breadcrumbList.push({
            id: item.id,
            name: item.name,
            key: item.key,
            url: item.url,
          });
          this.getCrumb(item.children, routerPath);
        }
      });
      // 匹配未完成，但是本次循环结束
      if (!this.crumbSearch) {
        this.data_breadcrumbList.pop();
      }
    },
  },
  watch: {
    '$route.path': {
      handler() {
        this.build();
      },
    },
  },
};
</script>

<style lang="less" scoped>
// .breadcrumb-root {
//   height: @breadcrumb-height;
//   padding-left: 8px;
//   display: flex;
//   align-items: center;
//   background: #f1f2f5;
// }
</style>
