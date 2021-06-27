<template>
  <div id="app">
    <router-view></router-view>
    <!-- <canvas id="myCanvas"></canvas> -->
  </div>
</template>

<script>
// import { init } from './views/index';

export default {
  name: 'App',
  data() {
    return {

    };
  },
  mounted() {
    this.$Message.config({
      duration: 2,
    });
    // init();
  },
};
</script>

<style lang="less">
#app {
  font-family: "pingfang-thin";
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
#myCanvas{
   width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
