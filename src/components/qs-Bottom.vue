<template>
  <div :class="[type,size,position]">
    <slot></slot>
  </div>
</template>
<script>
  export default {
      name: 'Bottom',
      data () {
          return {
              msg: 'Welcome to Your Vue.js App'
          }
      },
      props: {
          'type': {
              type: String,
              default: 'default'
          },
          'size': {
              type: String,
              default: 'small'
          },
          'position': {
              type: String,
              default: 'relative'
          }
      }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  /*type属性*/
  .default {
    background: $blackcolor;
    border: 1px solid $blackcolor;
    color: #fff;
  }
  .primary {
    background: $maincolor;
    border: 1px solid $maincolor;
    color: #fff;
  }
  .secondary {
    border: 1px solid $maincolor;
    background: #fff;
    color: $blackcolor;
  }
  /*size 属性*/
  .full {
    width: 100%;
    height: computed(118);
    line-height: computed(118);
    font-size: computed(30);
  }
  .large {
    width: computed(690);
    height: computed(80);
    line-height: computed(80);
    font-size: computed(30);
    text-align: center;
    margin: 0 auto;
  }
  .small {
    width: computed(172);
    height: computed(74);
    line-height: computed(74);
    text-align: center;
    font-size: computed(20);
  }
  .normal {
    width: computed(240);
    height: computed(78);
    line-height: computed(78);
    font-size: computed(32);
    text-align: center;
  }
  /*position*/
  .fixed {
    position: fixed;
    bottom: 0;
    left: 0;
  }
  .relative {
    position: relative;
  }
</style>
