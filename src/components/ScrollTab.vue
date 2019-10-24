/*
 * @Author: yongtian.hong
 * @Date: 2018-08-01 15:37:12
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-08 15:13:24
 * @Description: tab横向滚动组件
  */
 
<style lang="scss" scoped>
.tabWraper {
  width: 100%;
  padding: 0;
  margin: 0;
  background: #fff;
  overflow-x: hidden;
  border-bottom:computed(1) solid #E6E6E6;
  .content {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    .tabItem {
      display: flex;
      padding: computed(20) computed(30) computed(5) computed(30);
      font-size: computed(30);
      font-family: "PingFang-SC-Medium";
      color: #0d0e09;
      .text {
        padding: 0px 0px computed(10) 0px;
      }
    }
    .tabActive {
      position: relative;
      width: 120%;
      color: #2ba4f3;
      text-align: center;
    }
    .tabActive:after {
      content: "";
      position: absolute;
      left: 0px;
      top: 100%;
      height: 2px;
      border-radius: 1px;
      background-color: #2ba4f3;
      animation: line-animation 0.5s forwards;
    }
  }

  @keyframes line-animation {
    from {
      width: 10%;
    }
    to {
      width: 100%;
    }
  }
}
</style>
<template>
  <div class="tabWraper" ref="tabWraper">
    <ul class='content' ref="tabContent" :style="style[tabsAlign]">
      <li v-for="(item,$index) in data" @click=tab(item,$index) class="tabItem" :key='$index' ref="tabItem">
        <div class="text" :class="{'tabActive':sIndex===$index}">{{item[label]}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  name: "ScrollTab",
  props: {
    index: 0,
    data: {
      type: Array,
      default: null
    },
    tabClick: {
      type: Function,
      default: null
    },
    tabsAlign: {
      type: String,
      default: "left"
    },
    label: {
      type: String,
      default: "name"
    }
  },
  data() {
    return {
      sIndex: 0,
      style: {
        left: "justify-content:start;",
        center: "justify-content: center;",
        right: "justify-content: end;"
      }
    };
  },

  methods: {
    // 初始化滚动条
    initScroll() {
      let width = this.getChildrenWidth(this.$refs.tabContent);
      if (width >= window.innerWidth) {
        this.$refs.tabContent.style.width = width + "px";
      } else {
        this.$refs.tabContent.style.width = window.innerWidth + "px";
      }
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.tabWraper, {
          startX: 0,
          click: true,
          scrollX: true,
          scrollY: false,
          // preventDefault: false,
          eventPassthrough: "vertical"
        });
      } else {
        this.scroll.refresh();
      }
    },
    // 获取子节点总宽度
    getChildrenWidth(dom) {
      var children = dom.children;
      var childrenWidth = 0;
      // console.log("length", children.length);
      for (let i = 0; i < children.length; i++) {
        childrenWidth += children[i].clientWidth;
      }
      return childrenWidth;
    },
    // tab点击事件
    tab(item, $index) {
      this.sIndex = $index; //控制选中样式切换
      if (this.tabClick) {
        this.tabClick(item, $index);
      }
    },
    // 初始化选中状态
    initState() {
      this.sIndex = this.index ? this.index : 0;
    }
  },
  created() {
    this.$nextTick(() => {
      this.initScroll();
      this.initState();
      let $this = this;
      window.onresize = function() {
        $this.initScroll();
      };
    });
  }
};
</script>