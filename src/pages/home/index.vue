<template>
  <div class="content">
    <div class="acount">
      <span class="title">欢迎来到THREEMAP</span>
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style scoped lang="less">
.content{
  display:flex;
  height: 100%;
  .acount{
    display:flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    z-index: 1;
    .title{
      font:bold 100px sans-serif;
      position: relative;
      --fill-color: #198CE6;
      display: block;
      text-decoration: none;
      text-transform: uppercase;
      -webkit-text-stroke: 2px var(--fill-color);
      background: linear-gradient(var(--fill-color) 0 100%) left/0 no-repeat;
      color: transparent;
      -webkit-background-clip: text;
      background-clip: text;
      transition: 1s linear;
      padding: 4px 0;
      cursor: pointer;
      &:hover{
        background-size: 100%;
      }
    }
  }
}
</style>
