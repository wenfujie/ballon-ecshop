/*
* createTime：2018/8/2
* author：en.chen
* description:  会员权益
*/
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.benefit {
    overflow: hidden;
    // height: 100%;
    .benefit-box {
        height: computed(240);
    }
    .card {
        display: flex;
        margin: computed(30);
        height: computed(202);
        -webkit-border-radius: computed(16);
        -moz-border-radius: computed(16);
        border-radius: computed(16);
        background: #bcba78;
        justify-content: center;
        align-items: center;
        position: relative;
        font-size: computed(40);
        line-height: computed(42);
        color: #ffffff;
    }
    .isNowMember {
        font-size: computed(24);
        position: absolute;
        margin: computed(-55) 0 0 computed(-270);
    }
    .member-name {
        margin: computed(15) 0 0 computed(5);
        // width: computed(200);
        text-align: center;
        p:nth-of-type(1) {
            font-size: computed(40);
            font-weight: bold;
            line-height: computed(48);
        }
        p:nth-of-type(2) {
            font-size: computed(24);
        }
    }
    .look-detail {
        position: absolute;
        font-size: computed(28);
        margin: computed(50) 0 0 computed(250);
    }
    .add-card {
        color: #2ba4f3;
        font-size: computed(24);
        float: right;
        margin-right: computed(40);
    }
    .empty-box {
        text-align: center;
        margin-top: computed(80);
    }
}
</style>
<template>
    <div class="benefit">
        <div class="benefit-box" v-for="(item,index) in cardBenefit" :key="index">
            <div
                class="card"
                :style="{background:'url('+getImg(item.vipCardImage, '690*202') +') no-repeat center','background-size': '100% 100%'}"
                @click="details(item)"
            >
                <p v-if="StorageVipId==item.vipInfoHdId&&status>0" class="isNowMember">当前账号</p>
                <p v-if="StorageVipId!=item.vipInfoHdId&&status>0" class="isNowMember">其他账号</p>
                <div class="member-name">
                    <p>{{item.vipLevelName}}</p>
                    <p>{{item.vipMobilePhone}}</p>
                </div>
                <div class="look-detail">
                    查看详情
                    <i class="iconfont icon-youfan"></i>
                </div>
            </div>
            <!--    v-if="item.isSynctowx === 0 && item.toWxCardFlag !== 0 && item.wxId !== null" -->
            <!-- <u class="add-card" @click="getWechatConfig()">加入微信卡包</u> -->
        </div>
        <!-- 与需求沟通先隐藏入口 -->
        <!--<div class="tip" @click="goCardList">-->
        <!--<span class="benefit-icon"></span>-->
        <!--<span>购买会籍会员卡，享受会员特权</span>-->
        <!--<i class="right-arrow iconfont icon-youfan"></i>-->
        <!--</div>-->
        <!-- 会员卡为空时，提示 -->
        <div class="empty-box" v-show="showEmpty==true">暂无会员卡~</div>
    </div>
</template>
<script>
import Storage from "../../util/storage";
import { UserService, Vouchers, Order } from "../../api/service";
import wx from "weixin-js-sdk";
export default {
    data() {
        return {
            StorageVipId: "",
            cardBenefit: [],
            vipId: "",
            showEmpty: false,
            status: "" //判断当前是否又会员整合
        };
    },
    methods: {
        // //  获取会员权益
        getBenefit() {
            this.StorageVipId = Storage.get("USER_INFO").vipInfoId;
            let data = {
                vipInfoHdId: this.StorageVipId,
                shopCode: Storage.get("properties").shopCode
            };
            UserService.getMemCardLevelList(data).then(res => {
                this.cardBenefit = res;
                if (this.cardBenefit.length == 0 || !this.cardBenefit) {
                    this.showEmpty = true;
                }
            });
        },
        //  跳转会籍会员卡列表页面
        details(item) {
            if (item.lable && item.lable.indexOf("&nbsp") != -1) {
                item.lable = item.lable.replace(/&nbsp;/g, "");
            }
            this.$router.push({
                path: "/benefit-detail",
                name: "benefit-detail",
                params: {
                    vipInfoHdId: item.vipInfoHdId,
                    vipLevelName: item.vipLevelName,
                    vipMobilePhone: item.vipMobilePhone,
                    lable: item.lable,
                    expireDate: item.expireDate,
                    vipCardImage: item.vipCardImage
                }
            });
        },

        //  拉取微信卡券信息
        getWechatConfig(item) {
            if (item.expiringFlag === 0) {
                return;
            }
            let data = {
                card_id: item.wxId, //卡券weixinId,
                code: item.cardNo,
                isNeedOpenid: 0,
                openId: Storage.get("WECHAT_INFO").openid,
                wxuuid:
                    baseConstant.wxUnionid ||
                    Storage.get("properties").wxUnionid
            };
            Vouchers.getWxconfig(data).then(res => {
                let url = window.location.href.split("#")[0];
                let wxData = {
                    wxUUID:
                        baseConstant.wxUnionid ||
                        Storage.get("properties").wxUnionid,
                    unAuthorizedUrl: encodeURIComponent(url)
                };
                Order.getWxSignature(wxData).then(config => {
                    this.wxInit(config, item.wxId, res);
                });
            });
        },

        //  微信加入卡券
        wxInit(config, cardId, cardConfig) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: config.appId, // 必填，公众号的唯一标识
                timestamp: config.timeStamp, // 必填，生成签名的时间戳
                nonceStr: config.nonceStr, // 必填，生成签名的随机串
                signature: config.signature, // 必填，签名
                jsApiList: ["addCard"] // 必填，需要使用的JS接口列表
            });
            wx.ready(function() {
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                wx.addCard({
                    cardList: [
                        {
                            cardId: cardId,
                            cardExt: JSON.stringify(cardConfig)
                        }
                    ], // 需要添加的卡券列表
                    success: function(res) {
                        Toast("添加成功~");
                        var cardList = res.cardList; // 添加的卡券列表信息
                    }
                });
            });
        }
    },
    created() {
        this.getBenefit();
        this.status = Storage.get("USER_INFO").relationAccountLength; //获取会员整合的长度
    }
};
</script>
