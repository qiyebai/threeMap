<template>
  <div class='block-content'>
    <Row :gutter="40">
      <Col span="6" v-for="(p,i) in dataSource" :key="i">
        <div class="item">
          <div class="img-box">
            <img :src="p.img" alt="">
            <div class="throw-content" @click="openUrl(p.url)">
              <div>账户名：{{p.account}}</div>
              <div><span style="padding-right:10px;">密</span> 码：{{p.password}}</div>
            </div>
          </div>
          <div class="title">{{p.title}}</div>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'BlockItem',
  props: {
    dataSource: Array,
  },
  methods: {
    openUrl(url) {
      window.open(url);
    },
  },
  created() {},
};
</script>
<style lang='less' scoped>
.block-content {
  .item {
    margin-bottom: 20px;
    cursor: pointer;
    .img-box {
      width: 100%;
      height: 220px;
      border-radius: 5px;
      position: relative;
      overflow: hidden;
      box-shadow: 0px 0px 20px 0px rgba(145, 157, 246, 0.2);
      img {
        width: 100%;
        height: 100%;
      }
      .throw-content {
        width: 100%;
        height: 100%;
        position: absolute;
        background: rgba(0, 0, 0, 0.5);
        cursor: pointer;
        top: 220px;
        left: 0;
        transition: all 0.3s;
        color: #fff;
        div {
          padding-left: 150px;
          &:first-child {
            padding-top: 70px;
            padding-bottom: 20px;
          }
        }
      }
      &:hover {
        .throw-content {
          top: 0;
        }
      }
    }
    .title {
      height: 50px;
      line-height: 50px;
      overflow: hidden;
      text-align: center;
      color: #fff;
    }
    &:hover {
      .title {
        color: #0091f2;
      }
    }
  }
}
</style>
