<template>
<div>
  <Menu :active-name="activeName" :open-names="openName" width="auto" class="left-menu" v-show="!collapsed" @on-select="selectChange" :accordion="true" ref="menu">
    <Submenu :name="items.id" v-for="(items,indexs) in menuList" :key="indexs">
        <template slot="title">
            <Icon :type="items.icon" />
            {{items.name}}
        </template>
      <MenuItem :to="item.url" :name="item.id" v-for="(item,index) in items.children" :key="index">{{item.name}}</MenuItem>
    </Submenu>
  </Menu>
  <div v-show="collapsed" class="menu-tips">
    <ul>
      <li v-for="(items,indexs) in menuList" :key="indexs">
        <!-- <Tooltip :content="items.name" placement="right" v-if="items">
          <Icon :type="items.icon" />
        </Tooltip> -->
        <Poptip trigger="hover" placement="right" class="poptip">
          <Icon :type="items.icon" />
          <div slot="content">
            <ul class="items">
              <li v-for="(item,index) in items.children" :class="activeName===item.id?'active':''" :key='index' @click="toPageRun(items,item)">{{item.name}}</li>
            </ul>
          </div>
        </Poptip>
      </li>
    </ul>
  </div>
</div>
</template>
<script>
import { menuList, breadCrumb } from '@/menu-map.js';

export default {
  props: {
    // menuList: {
    //   type: Array,
    //   default: () => [],
    // },
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeName: '',
      openName: [],
      data_breadcrumbList: [],
      menuList: menuList(this),
      breadCrumb: breadCrumb(this),
    };
  },
  mounted() {
    this.build();
  },
  methods: {
    toPageRun(parVal, itemVal) {
      this.activeName = itemVal.id;
      this.$router.push({
        path: itemVal.url,
      });
    },
    selectChange(value) {
      this.activeName = value;
    },
    getItemFromArr(arr, id) {
      return arr.find((obj) => obj.id === id);
    },
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
      this.crumbSearch = false;
      this.data_breadcrumbList = [];
      // 代码匹配函数
      this.getCrumb(this.menuList, routerPath);
      // 判断是否有配置children节点，有的话进行数组的拼接，没有则直接赋值
      this.openName = [this.data_breadcrumbList[0].id];
      this.activeName = this.data_breadcrumbList[1].id;
      this.$nextTick(() => {
        this.$refs.menu.updateOpened();
      });
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
    $route() {
      this.build();
    },
  },
};
</script>
<style lang="less" scoped>
.left-menu.ivu-menu-light.ivu-menu-vertical{
  background: none;
  color: rgba(255,255,255,0.65);
  /deep/ .ivu-menu-item-active:not(.ivu-menu-submenu){
    background: rgba(45,140,240,0.24);
    color: #fff;
  }
  /deep/ .ivu-menu-item{
    color: rgba(255,255,255,0.65);
    padding: 14px 24px 14px 52px !important;
    &:hover{
      color: #fff;
       background: rgba(45,140,240,0.24);
    }
  }
  /deep/ .ivu-menu-submenu-title:hover{
    color: #fff;
    background: rgba(45,140,240,0.24);
  }
  &.ivu-menu-light:after{
    content: none;
  }
}
.menu-tips{
  color: rgba(255,255,255,0.65);
  font-size: 18px;
  line-height: 42px;
  text-align: center;
  cursor: pointer;
  li:hover{
    color: #fff;
  }
}
.poptip{
  .items{
    color: #000;
    line-height: 30px;
    li:hover{
      color: #fff;
      background: rgb(45,140,240);
    }
    li.active{
      color: #fff;
      background: rgb(45,140,240);
    }
  }
}
</style>
