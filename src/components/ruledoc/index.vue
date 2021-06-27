<template>
  <div class="rule">
    <div class="title mt-20">{{props_title}}</div>
    <div class="desc mt-20">{{props_desc}}</div>
    <div class="tip mt-20" v-if="props_tip">
      <Icon type="ios-alert" color="#2d8cf0" size="16" />
      注意：{{props_tip}}
    </div>
    <div class="content mt-20">
      <div class="com-content"><slot></slot></div>
      <div class="code-content" v-show="data_open">
        <div class="code-desc mt-20">
          {{props_codeDesc}}
        </div>
        <pre>
          <code class="language-html">{{props_code}}</code>
        </pre>
      </div>
      <div class="trigger-content" @click="data_open = !data_open">
        <Icon size="22" :type="data_open ? 'md-arrow-dropup' : 'md-arrow-dropdown'" />
        <span class="text">{{data_open ? '隐藏代码' : '显示代码'}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import Prism from 'prismjs';

export default {
  name: 'ruledocument',
  props: {
    props_title: {
      type: String,
      default: '',
    },
    props_desc: {
      type: String,
      default: '',
    },
    props_codeDesc: {
      type: String,
      default: '',
    },
    props_tip: {
      type: String,
      default: '',
    },
    props_code: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      data_open: false,
    };
  },
  mounted() {
    Prism.highlightAll();
  },
};
</script>

<style lang="less" scoped>
.rule {
  margin-top: 40px;
}
.mt-20 {
  margin-top: 20px !important;
}
.title {
  font-size: 22px;
  font-weight: 400;
  color: #1f2f3d;
}
.desc {
  font-size: 14px;
  color: #5e6d82;
  line-height: 1.5em;
}
.tip {
  border: 1px solid #abdcff;
  background-color: #f0faff;
  padding: 8px 20px;
  i {
    margin-right: 5px;
  }
}
.content {
  border: 1px solid #ebebeb;
  background: #fafafa;
  .com-content {
    width: 100%;
    background: #fff;
    padding: 24px;
  }
  .code-content {
    border-top: 1px solid #eaeefb;
    .code-desc {
      padding: 20px;
      box-sizing: border-box;
      border: 1px solid #ebebeb;
      border-radius: 3px;
      font-size: 14px;
      line-height: 22px;
      color: #666;
      word-break: break-word;
      margin: 10px;
      background-color: #fff;
    }
  }
  .trigger-content {
    background: #fafafa;
    border-top: 1px solid #eaeefb;
    height: 44px;
    box-sizing: border-box;
    background-color: #fff;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    text-align: center;
    margin-top: -1px;
    color: #d3dce6;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    .text {
      transition: opacity 1s ease-in;
      display: none;
      opacity: 0;
      margin-left: 10px;
      font-size: 14px;
      font-weight: 500;
    }
    &:hover {
      color: #2d8cf0;
      background: #f9fafc;
      .text {
        display: inline-block;
        opacity: 1;
      }
    }
  }
  pre {
    margin: 0;
  }
  :not(pre) > code[class*="language-"], pre[class*="language-"] {
    background: #fafafa;
  }
  &:hover {
    box-shadow: 0 0 8px 0 rgba(232, 237, 250, .6), 0 2px 4px 0 rgba(232, 237, 250, .5);
  }
}
</style>
