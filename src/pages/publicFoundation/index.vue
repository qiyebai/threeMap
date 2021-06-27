<template>
  <div class='project-presentation'>
    <BlockItem :dataSource="list"></BlockItem>
  </div>
</template>

<script>
import BlockItem from '../../components/blockItem/index.vue';

export default {
  name: 'ProjectPresentation',
  components: {
    BlockItem,
  },
  data() {
    return {
      list: [
        {
          img: require('../../assets/img/ml.png'),
          url: 'http://10.50.2.33:9002/#/login',
          title: '马良',
          account: '个人私有账号',
          password: '个人私有密码',
        },
        {
          img: require('../../assets/img/moling.png'),
          url: 'http://10.50.2.33:9007/#/home',
          title: '魔灵UI',
          account: '暂无此功能',
          password: '暂无此功能',
        },
        {
          img: require('../../assets/img/ui.png'),
          url: 'http://10.50.2.33:9078/#/',
          title: '图表UI',
          account: '暂无此功能',
          password: '暂无此功能',
        },
      ],
    };
  },
  methods: {},
  created() {},
};
</script>
<style lang='less' scoped>
.project-presentation {
}
</style>
