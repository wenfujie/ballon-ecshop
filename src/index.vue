<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"/>
  </div>
</template>
<script>
import Storage from './util/storage'
export default {
  name: "Index",
  data() {
    return {
      bgColor: "#fff"
    };
  },
  created() {
    let that = this;
    this.resizeTimer = false;
    window.onresize = () => {
      return (() => {
        if (!this.resizeTimer) {
          this.resizeTimer = true;
          setWin();
          setTimeout(function() {
            that.resizeTimer = false;
          }, 400);
        }
      })();
    };
    setWin();
  },
  methods: {}
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "assets/font/iconfont.css";
@import "assets/scss/base.scss";
@import "assets/scss/common.scss";
@import "assets/scss/resetUI.scss";
html,
body {
  width: 100%;
  height: 100%;
  #app {
    width: 100%;
    height: 100%;

  }
}
</style>
