/*
 * @Author: yongtian.hong
 * @Date: 2018-08-03 16:44:40
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-08-03 17:09:52
 * @Description: 备货进度组件
 */
 <style lang='scss' scoped>
.prepare {
  background: #fff;
  color: #0d0e09;
  padding: computed(15) computed(30);
  .title {
    font-size: computed(36);
    text-align: center;
    margin-bottom: computed(20);
  }
  .content {
    font-size: computed(30);
    margin-bottom: computed(30);
  }
 
}
</style>
 
 <template>
  <div class='prepare' v-if='pkg.shippingWayCode==="mdzq"&&step>=4'>
    <div class="title fs32B">备货进度</div>
  
    <div class="content" v-if="step==4"><b>[ 备货完成 ]</b> 请抓紧时间到 <span class="blue">{{dptName}}</span>提货</div>
    <div class="content" v-if="step==5"><b>[ 已提货 ]</b> 已于{{pkg.nodeTime}} 提货 </div>
   
  </div>
</template>
 
 <script>
export default {
  name: "Prepare",
  props: {
    pkg: {}
  },
  data() {
    return {
      message: "海天",
      people: ""
    };
  },
  methods: {},
  computed: {
    step: function() {
      return this.pkg.nodeCode;
    },
    dptName: function() {
      if (this.pkg.dptName) {
        return "【" + this.pkg.dptName + " 】";
      } else {
        return null;
      }
    }
  }
};
</script>
