<style lang='scss' >
.scrollView {
  width: 100%;
  height: 100%;
  flex: 1;
  overflow: hidden;
  .content {
    width: 100%;
    min-height: 100%;
  }
}
</style>

<template>
  <div class="scrollView" ref="scrollview">
    <div class="content" ref="content">
      <slot />
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  name: "ScrollView",
  props: {
    options: {
      type: Object,
      default: null
    }
  },
  data() {
    return {};
  },
  methods: {
    initScroll() {
      if (!this.scroll) {
        let options = {
          preventDefault: false,
          bounce: false,
          probeType: 3
        };
        // 合并用户配置
        options = this.options ? Object.assign(this.options, options) : options;
        this.scroll = new BScroll(this.$refs.scrollview, options);
        this.scroll.on("scrollStart", () => {
          setTimeout(() => {
            this.scroll.options.preventDefault = true;
            // console.log("ScrollStart", this.scroll.options.preventDefault);
            this.scroll.refresh();
          }, 0);
        });
        this.scroll.on("scrollEnd", () => {
          this.scroll.options.preventDefault = false;
          this.scroll.refresh();
          // console.log("scrollEnd", this.scroll.options.preventDefault);
        });
      } else {
        this.scroll.refresh();
      }
    },
    getChildrenHeight(dom) {
      var children = dom.children;
      var childrenHeight = 0;
      for (var i = 0; i < children.length; i++) {
        childrenHeight += children[i].offsetHeight;
      }
      return childrenHeight;
    }
  },
  created() {
    this.$nextTick(() => {
      this.initScroll();
    });
  },
  mounted() {}
};
</script>