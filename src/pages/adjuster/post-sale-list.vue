<style lang='scss' scoped >
.wrap {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .title {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: computed(100);
        line-height: computed(100);
        font-size: computed(36);
        font-weight: bold;
        text-align: center;
        background-color: #fff;
    }
    .list-container {
        padding-top: computed(100);
        padding-bottom: computed(100);
        background-color: $color-white;
        width: 100%;
    }
    .phone-box {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    .iconfont {
        font-size: computed(36);
        margin-right: computed(20);
    }
    .split-line {
        width: 1px;
        height: 80%;
        background-color: #cccccc;
    }
    .bottom {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        // display: none;
        display: flex;
        font-size: computed(28);
        background-color: $color-white;
    }
}
</style>

<template>
    <div class="wrap">
        <div class="title">我的售后 ({{totalSaleList}})</div>
        <div class="list-container">
            <van-list v-model="showLoading" :finished="finished" @load="loadMoreData">
                <item-list
                    v-for="(item,index) in list"
                    :key="index"
                    :data="item"
                    :reload="getListData"
                ></item-list>
            </van-list>
        </div>

        <div class="bottom">
            <button class="w50 h100px bg-blue white" @click="customerService">
                <i class="iconfont icon-fuwuzhongxin"></i> 联系客服
            </button>
            <div class="split-line"></div>
            <a class="flex-center w50 h100px bg-blue white" href="tel:400-000-0000">
                <i class="iconfont icon-bodadianhua"></i>
                <div class="phone-box">
                    <div>拨打电话</div>
                    <div>400-000-0000</div>
                </div>
            </a>
        </div>
    </div>
</template>

<script>
import components from "./components";
import ysfService from "@/util/ysfService";
export default {
    components: components,
    data() {
        return {
            showLoading: true,
            finished: false,
            pageSize: 10,
            pageNum: 1,
            result: {},
            list: [],
            totalSaleList: 0
        };
    },
    methods: {
        // 合并请求参数
        getParams() {
            return {
                pageSize: this.pageSize,
                pageNum: this.pageNum
            };
        },
        //获取售后申请单列表
        async getListData() {
            this.pageNum = 1;
            this.result = await this.$get("postSale/getList", this.getParams());
            if (!this.result.data) {
                return false;
            } else {
                this.showLoading = false;
                this.list = this.result.data.list;
                this.totalSaleList = this.result.data.total;
            }
        },
        //上拉加载更多
        async loadMoreData() {
            if (this.finished) {
                return false;
            } else if (this.result.data.hasNextPage) {
                this.pageNum += 1;
                this.showLoading = true;
                this.result = await this.$get(
                    "postSale/getList",
                    this.getParams()
                );
                if (this.result) {
                    this.showLoading = false;
                    this.list = this.list.concat(this.result.data.list);
                }
            } else {
                this.finished = true;
                setTimeout(() => {
                    this.showLoading = false;
                }, 2000);
            }
        },
        customerService() {
            ysfService.wakeUp();
        }
    },
    created() {
        this.getListData();
    }
};
</script>