<template>
  <div class="tab flex-row">
    <div class="flex-row" v-for="(item,index) in tabList" :key="index">
      <div class="flex-row" :class="{'tab-active':tabIndex==index}" @click="clickTab(index)">
        <p>{{item.name}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import Storage from "../../../util/storage";
export default {
  props: ["tabList", "active"],
  data() {
    return {
      tabIndex: this.active
    };
  },
  methods: {
    clickTab(index) {
      this.tabIndex = index;
      this.$emit("howWay", this.tabIndex);
      this.$emit("getEvent", 0, this.tabIndex, 1);
      this.$emit("getScroll");
    },
  
  },
  mounted(){
  
  }
};
</script>
<style lang="scss" scoped>
.tab {
  background: #fff;
  justify-content: space-around;
  position: fixed;
  top:0;
  z-index: 2;
  width: 100%;
  div {
    width: 33%;
    div {
      width: auto;
      p {
        font-size: computed(30);
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: #333333;
        line-height: computed(88);
      }
    }
    .tab-active {
      border-bottom: computed(3) solid #2ba4f3;
      p {
        color: #2ba4f3 !important;
        line-height: computed(85);
      }
    }
  }
}
</style>
