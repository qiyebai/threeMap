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
          img: require('../../assets/img/sdo.png'),
          url: 'http://192.168.30.20:8666',
          title: '数据安全岛sdo端',
          account: 'sdo',
          password: '2wsxVFR_',
        },
        {
          img: require('../../assets/img/sdo.png'),
          url: 'http://192.168.30.20:8888',
          title: '数据安全岛数据提供方端',
          account: 'lbs110',
          password: '2wsxVFR_',
        },
        {
          img: require('../../assets/img/soar.png'),
          url: 'http://192.168.30.151:8902/login',
          title: 'SOAR项目',
          account: 'admin',
          password: '2wsxVFR_',
        },
        {
          img: require('../../assets/img/AiSort.png'),
          url: 'http://192.168.30.167:7070/login',
          title: 'AiSort',
          account: 'admin',
          password: 'admin_123',
        },
        {
          img: require('../../assets/img/AiThink.png'),
          url: 'http://192.168.30.239:8081/login',
          title: 'AiThink',
          account: 'admin',
          password: '2wsxVFR_',
        },
        {
          img: require('../../assets/img/w11.png'),
          url: 'https://192.168.30.137/index.html#/login',
          title: 'W11',
          account: 'admin',
          password: '2wsxVFR_',
        },
        {
          img: require('../../assets/img/p.png'),
          url: 'http://10.50.1.221:8645/authLogic/login/staff/',
          title: '安恒信息统一认证平台',
          account: '个人私有账号',
          password: '个人私有密码',
        },
        {
          img: require('../../assets/img/hlb.png'),
          url: 'https://192.168.30.217:18902/index.html#/login',
          title: 'AiLPHA互联版',
          account: 'admin',
          password: '2wsxVFR_',
        },
        {
          img: require('../../assets/img/sj.png'),
          url: 'https://192.168.30.79:6969/#/login',
          title: '数据安全管控',
          account: 'demon',
          password: '13%&AHhz',
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
