/*
* @Author: zhibin.zhao
* @Date: 2018-10-17 15:41:10
* @LastEditors: zhibin.zhao
* @LastEditTime: 2018-10-17 18:33:08
* @Description: 订单商品评价页面
*/

<template>
    <div class="evaluate">
        <div class="main" v-for="(item, index) in goodsList" :key="index">
            <div class="main-box">
                <div class="product van-clearfix">
                    <div class="img">
                        <img :src="getImg(item.thumb, '150*150')" onerror="errImg(event)" />
                        <img
                            v-show="item.orderFlag==1"
                            class="customization"
                            src="@/assets/images/common/diy.png"
                        />
                    </div>
                    <div class="desc">
                        <p class="name">{{item.goodsName}}</p>
                        <p class="color">{{item.colorName}} /{{item.sizeName}}</p>
                        <!--<p class="price">￥{{item.salePrice}}</p>-->
                    </div>
                </div>
                <div class="rate">
                    <div class="item van-clearfix">
                        <div class="title">评分</div>
                        <div class="star">
                            <van-rate
                                v-model="item.commentScore"
                                :size="20"
                                :count="5"
                                color="#2ba4f3"
                                void-color="#ccc"
                            />
                        </div>
                        <div class="tip">{{commentScoreDesc[item.commentScore]}}</div>
                    </div>
                    <div class="item van-clearfix" v-show="item.orderFlag==1">
                        <div class="title">着装师评价</div>
                        <div class="star">
                            <van-rate
                                v-model="item.msrCommentScore"
                                :size="20"
                                :count="5"
                                color="#2ba4f3"
                                void-color="#ccc"
                            />
                        </div>
                        <div class="tip">{{msrCommentScoreDesc[item.msrCommentScore]}}</div>
                    </div>
                </div>
                <!-- 评价 -->
                <div class="content">
                    <div class="description">
                        <textarea
                            cols="100"
                            rows="1"
                            placeholder="点击输入评价内容"
                            v-model="item.reasonMemo"
                            maxlength="150"
                        ></textarea>
                        <!-- <span>{{item.reasonMemo?item.reasonMemo.length:0}}/100</span> -->
                    </div>
                </div>
                <upload-file v-model="goodsList[index].commentPictList"></upload-file>
            </div>
            <div class="gray"></div>
        </div>
        <debounce :time="1000" events="click">
            <button v-if="goodsList.length > 0" @click="submitEvaluate">提交</button>
        </debounce>
    </div>
</template>

<script>
import { Rate, Toast } from "vant";
import Storage from "@/util/storage";
import { Order } from "@/api/service";
import uploadFile from "@/components/uploadFile";
export default {
    name: "order-evaluate",
    data() {
        return {
            goodsList: [],
            commentScoreDesc: [
                "",
                "不合体",
                "不合体",
                "基本合体",
                "合体",
                "非常合体"
            ],
            msrCommentScoreDesc: [
                "",
                "不满意",
                "不满意",
                "一般",
                "满意",
                "非常满意"
            ]
        };
    },
    components: {
        "van-rate": Rate,
        uploadFile
    },
    methods: {
        getGoodsInfo() {
            let companyId = Storage.get("COMPANYID").company_id;
            // let userInfo = Storage.get('USER_INFO')
            let param = {
                busContsCode: baseConstant.busContsCode,
                usrId: "",
                companyId: companyId,
                ownCompanyId: companyId,
                billCode: this.$route.query.billCode
            };
            Order.getDetailInfo(param).then(res => {
                this.goodsList = this.getGoodsList(res.data.packages);
            });
        },
        submitEvaluate() {
            // 校验是否已存在评价
            let data = {
                billCode: this.$route.query.billCode,
                busContsCode: baseConstant.busContsCode
            };
            Order.getDetailInfo(data).then((res) => {
                if (res.allowCommentFlag === 1) {
                    this.$toast('该订单已存在评价');
                    return false;
                } else {
                    let companyId = Storage.get("COMPANYID").company_id;
                    let userInfo = Storage.get("USER_INFO");
                    let param = {
                        companyId: companyId,
                        usrId: userInfo.usrId,
                        model: {
                            anonymousFlag: 0, //1匿名
                            billCode: this.$route.query.billCode,
                            buscontsCode: baseConstant.busContsCode,
                            shopCode: Storage.get("properties").shopCode,
                            usrId: userInfo.usrId,
                            vipInfoHdId: userInfo.vipInfoId
                        }
                    };
                    let object = this.getEvaluate();

                    if (object.msg) {
                        Toast(object.msg);
                        return;
                    }

                    param.model.goodsCommentList = object.goodsCommentList;

                    Order.ordComment(param).then(res => {
                        console.log("评价完成", res); //成功返回1
                        //返回订单列表
                        if (this.fromPath === "/orderList") {
                            this.$router.go(-1);
                        } else {
                            this.$router.go(-2);
                        }
                    });
                }
            });
        },
        getEvaluate() {
            let goodsCommentList = [];
            let flag = 0;
            let msg = null;
            this.goodsList.forEach(function(item, index) {
                goodsCommentList.push({
                    commentMemo: item.reasonMemo, //备注
                    commentScore: item.commentScore, //商品评分
                    commentTypeCode: "D_MASPART", //D_MSR 量体师评价，D_MASPART商品评价
                    goodsCode: item.goodsCode,
                    rtlOrdDtId: item.saleOrdDtId, //订单明细ID，没件商品标识
                    commentPictList: item.commentPictList // 商品评价图片
                });
                msg = !item.commentScore && !msg ? "商品评分是必填项哦~" : msg;
                if (item.orderFlag == 1) {
                    msg =
                        !item.msrCommentScore && !msg
                            ? "量体师评分是必填项哦~"
                            : msg;
                    goodsCommentList[index].msrCommentScore =
                        item.msrCommentScore; //量体师评分
                }
            });
            return { msg: msg, goodsCommentList: goodsCommentList };
        },
        setStorage() {
            Storage.set("ordInfo", this.$route.params);
        },
        getGoodsList(packages) {
            let productList = [];
            packages.forEach(item => {
                productList = productList.concat(item.data.goodsList);
            });
            return productList;
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.fromPath = from.path;
        });
    },
    created() {
        this.setStorage();
    },
    mounted() {
        this.getGoodsInfo();
    }
};
</script>

<style lang="scss" type="text/scss" scoped>
.evaluate {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: computed(100);
    // padding: 0 computed(30);
    box-sizing: border-box;
    .main {
        flex: 1;
        .main-box {
            padding: computed(30) computed(30) 0 computed(30);
        }
        .product {
            width: 100%;
            .img {
                width: computed(150);
                height: computed(150);
                position: relative;
                float: left;
                img {
                    width: 100%;
                    height: 100%;
                }
                .customization {
                    width: computed(150);
                    height: computed(36);
                    position: absolute;
                    top: 0;
                    display: none;
                }
            }
            .desc {
                display: inline-block;
                margin: computed(10) 0 0 computed(20);
                float: left;
                font-size: computed(28);
                width: 75%;
                .name {
                    width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                .price {
                    margin-top: computed(40);
                }
                .color {
                    font-size: $font-common;
                    color: $text-regular;
                    margin-top: computed(45);
                }
            }
        }
        .rate {
            width: 70%;
            .item {
                width: 100%;
                margin-top: computed(30);
                .title {
                    width: computed(70);
                    float: left;
                    font-size: computed(28);
                    color: #333333;
                    margin-top: computed(2);
                }
                .star {
                    float: left;
                    margin-top: computed(-4);
                    // margin: 0 computed(30) 0 computed(10);
                }
                .tip {
                    float: left;
                    font-size: computed(30);
                    color: #999;
                    margin-top: computed(2);
                }
            }
        }
        .textarea {
            width: 100%;
            margin-top: computed(55);
            textarea {
                width: 100%;
                height: computed(136);
                color: #cccccc;
                font-size: computed(24);
            }
        }
        .content {
            display: flex;
            flex-direction: column;
            padding: computed(10) 0;
            .description {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                // align-items: center;
                padding: computed(5) 0;
                color: #cccccc;
                font-size: computed(28);
                font-family: "PingFang-SC-Medium";
                // border: solid 1px #999999;
                textarea {
                    min-height: 60px;
                    flex: 1;
                    outline: 0;
                    border: 0;
                    color: #cccccc;
                    margin-right: computed(10);
                    // padding: computed(20) 0;
                }
                // textarea::placeholder {
                //     // font-weight: normal;
                //     // font-family: "PingFang-SC-Medium";
                //     color: #cccccc;
                // }
            }
        }
        .gray {
            width: 100%;
            height: computed(10);
            background: #edf0f7;
        }
    }
    button {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: computed(100);
        line-height: computed(100);
        z-index: 99;
        background: #2ba4f3;
        color: $color-white;
        text-align: center;
        font-size: $font-regular;
    }
    .main::not(:last-child) {
        border-bottom: 1px solid #e6e6e6;
    }
}
</style>
