/*
 * @Author: yongtian.hong
 * @Date: 2018-08-03 17:13:03
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-09-26 14:42:08
 * @Description: 商品订单列表组件
 */
 <style lang='scss'  scoped>
.list-box {
    color: #0d0e09;
    font-family: "PingFang-SC-Medium", "PingFang-SC-Bold";
    margin-top: computed(10);
    padding: 0;
    padding-bottom: computed(1);
    background-color: #edf0f7;
    .title {
        text-align: center;
        color: #0d0e09;
        font-size: computed(36);
        background-color: #fff;
    }
}
</style>

 <template>
    <div class="list-box" v-if="pkg.goodsList">
        <!-- <div class="title fs32B">商品清单 ({{pkg.goodsList.length}})</div> -->
        <good v-for="(good,index) in goodList" :order="order" :data="good" :key="index"></good>
    </div>
</template>

 <script>
import good from "./Good";
import check from "@/util/check";
export default {
    name: "GoodList",
    components: {
        good
    },
    props: {
        pkg: null,
        order: {}
    },
    computed: {
        goodList: function() {
            if (check.isEmpty(this.pkg)) return [];
            let list = this.pkg.goodsList;
            list.forEach(element => {
                element.nodeCode = this.pkg.nodeCode;
                element.sourceCode = this.order.sourceCode;
                element.shopCode = this.order.shopCode;
                element.ordStatusCode = this.order.ordStatusCodes;
            });
            return list;
        }
    },
    mounted(){
        console.log(this.order,'orderorderorderorderorder')
    }
};
</script>
