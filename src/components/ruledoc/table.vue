<template>
  <div>
    <div class="title">{{props_type}}</div>
    <Table
      border
      :columns="data_column"
      :data="props_data" />
  </div>
</template>

<script>
import Config from '@/config.js';

export default {
  name: 'comTable',
  props: {
    // 表格类型，可选值有：Attributes、Events、Methods、Slots，也可以自定义，若传入的为可选值之外的值，则需要传入表格表头列表
    props_type: {
      type: String,
      default: 'Attributes',
    },
    // 表头数组，当type自定义时，需要传该项
    props_column: {
      type: Array,
      default: () => [],
    },
    props_data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      data_column: Config[`${this.props_type}Column`] || this.props_column,
    };
  },
};
</script>

<style lang="less" scoped>
.title {
  font-weight: 400;
  color: #1f2f3d;
  margin: 55px 0 20px;
  font-size: 22px;
}
</style>
