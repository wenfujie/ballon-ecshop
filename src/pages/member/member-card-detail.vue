/*
* createTime：2018/8/3
* author：en.chen
* description: 会籍会员卡详情页面
*/
<template>
    <div>
        <!--会员卡头部背景 begin-->
        <div class="card-head">
            <div class="card-logo">
                <img src="../../assets/images/member/card-logo.png" />
            </div>
            <p class="card-name">{{cardData.cardLevelName}}</p>
        </div>
        <!--会员卡头部背景 end-->
        <!--会员卡内容 begin-->
        <div class="card-box">
            <div class="card-content"></div>
            <div class="term">
                <label>有效期：</label>
                <ul>
                    <li class="active">{{cardData.addEffTime}}</li>
                    <!--<li>三月</li>-->
                    <!--<li>六月</li>-->
                    <!--<li>一年</li>-->
                    <!--<li>三年</li>-->
                    <!--<li>五年</li>-->
                    <!--<li>永久</li>-->
                </ul>
            </div>
            <p class="card-price">会籍价格 {{cardData.cardAmount}}元</p>
            <div class="bottom-btn" @click="buyMemberCard">立即开通</div>
        </div>
        <!--会员卡内容 end-->
        <!--弹窗 begin-->
        <van-popup position="top" v-model="showPopup">
            <div class="pay-tip">
                <i class="iconfont icon-shanchuguanbi" @click="showPopup = false"></i>
                <h5>支付成功!</h5>
                <!--<p>系统将自动赠送1张50元，1张30元抵用劵到您的账户可到我的抵用劵页面查看。</p>-->
                <!--<a>前往查看＞</a>-->
            </div>
        </van-popup>
        <!--弹窗 end-->
    </div>
</template>
<script>
import { Popup, Toast } from "vant";
import Storage from "../../util/storage";
import { UserService, Payment } from "../../api/service";
export default {
    components: {
        "van-popup": Popup
    },
    data() {
        return {
            showPopup: false,
            code: "",
            cardData: {}, // 用于渲染页面
            cardInfo: {}, // 购买提供参数
            btnLock: false // 按钮锁
        };
    },
    methods: {
        //  卡券信息
        getCardInfo() {
            let data = {
                code: this.code || this.$route.query.code
            };
            UserService.getCardLevelDetail(data).then(res => {
                this.cardData = res;
            });
        },

        //  卡券促销
        getCardVouchers() {
            let data = {
                shopCode: Storage.get("properties").shopCode,
                busContsCode: baseConstant.busContsCode,
                cardLevelCode: this.code || this.$route.query.code
            };
            UserService.getCardVouchers(data).then(res => {
                this.cardInfo = res[0];
            });
        },

        //  购买会籍会员
        buyMemberCard() {
            if (this.btnLock === true) {
                return;
            }
            this.btnLock = true;
            let that = this;
            let data = {
                usrId: Storage.get("USER_INFO").usrId,
                companyId: Storage.get("USER_INFO").companyId,
                cardLevelCode: this.cardData.cardLevelCode,
                shopCode: Storage.get("properties").shopCode,
                valiDityTerm: this.cardInfo.validityTerm
            };
            UserService.buyCard(data).then(
                res => {
                    let orderData = {
                        usrId: Storage.get("USER_INFO").usrId,
                        paymentCode: "D_WEIXIN",
                        tradeTypeCode: "JSAPI",
                        paymentTypeCode: "D_FULL",
                        shopCode: Storage.get("properties").shopCode,
                        orderList: res,
                        orderType: "D_CARDORD",
                        openId: Storage.get("WECHAT_INFO").openid,
                        payAmount: this.cardInfo.price
                    };
                    Payment.payOrder(orderData)
                        .then(config => {
                            if (typeof WeixinJSBridge == "undefined") {
                                if (document.addEventListener) {
                                    document.addEventListener(
                                        "WeixinJSBridgeReady",
                                        onBridgeReady,
                                        false
                                    );
                                } else if (document.attachEvent) {
                                    document.attachEvent(
                                        "WeixinJSBridgeReady",
                                        onBridgeReady
                                    );
                                    document.attachEvent(
                                        "onWeixinJSBridgeReady",
                                        onBridgeReady
                                    );
                                }
                            } else {
                                if (config.code === "200") {
                                    let appid = "";
                                    let num1 = config.requestStr.indexOf(
                                        "<appid>"
                                    );
                                    let num2 = config.requestStr.indexOf(
                                        "</appid>"
                                    );
                                    if (
                                        config.requestStr.substring(
                                            num1 + 7,
                                            num2
                                        )
                                    ) {
                                        appid = config.requestStr
                                            .substring(num1 + 7, num2)
                                            .toString();
                                    } else {
                                        appid = "wx45b40e5b82bd74d2";
                                    }
                                    WeixinJSBridge.invoke(
                                        "getBrandWCPayRequest",
                                        {
                                            appId: appid, //公众号名称，由商户传入
                                            timeStamp: config.timeStamp, //时间戳，自1970年以来的秒数
                                            nonceStr: config.nonceStr, //随机串
                                            package: config.prepayId,
                                            signType: "MD5", //微信签名方式：
                                            paySign: config.paySign //微信签名
                                        },
                                        function(resp) {
                                            if (
                                                resp.err_msg ==
                                                "get_brand_wcpay_request:ok"
                                            ) {
                                                // 使用以上方式判断前端返回,微信团队郑重提示：
                                                //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                                                that.btnLock = false;
                                                Toast("购买成功~");
                                                that.showPopup = true;
                                            } else if (
                                                resp.err_msg ==
                                                "get_brand_wcpay_request:cancel"
                                            ) {
                                                // false
                                                // alert('取消');
                                                that.btnLock = false;
                                            } else {
                                                that.btnLock = false;
                                                alert("支付出错了");
                                            }
                                        }
                                    );
                                }
                            }
                        })
                        .then(() => {
                            that.btnLock = false;
                        });
                },
                err => {
                    this.btnLock = false;
                }
            );
        }
    },
    created() {
        this.code = this.$route.query.code || "";
        this.getCardInfo();
        this.getCardVouchers();
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.card-head {
    width: 100%;
    height: computed(300);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: #0d0e09;
}
.card-logo {
    width: computed(79);
    height: computed(94);
    overflow: hidden;
    img {
        display: block;
        width: 100%;
    }
}
.card-name {
    margin-top: computed(28);
    font-size: computed(36);
    line-height: computed(38);
    color: #cccccc;
    text-align: center;
}
.card-box {
    padding: computed(30);
    background: #f1f1f1;
    overflow: hidden;
}
.card-content {
    overflow: hidden;
}
.term {
    display: flex;
    font-size: computed(30);
    line-height: computed(60);
    color: #303030;
    label {
        width: computed(160);
        white-space: nowrap;
    }
    ul {
        position: relative;
        li {
            box-sizing: border-box;
            float: left;
            padding: 0 computed(30);
            border: solid computed(1) #cccccc;
            margin-right: computed(20);
            margin-bottom: computed(20);
        }
        li.active {
            border-color: #000;
        }
    }
    ul::after {
        content: "";
        display: table;
        clear: both;
    }
}
.card-price {
    margin-top: computed(10);
    font-size: computed(32);
    line-height: computed(36);
    color: #303030;
    font-weight: 500;
}
.bottom-btn {
    margin-top: computed(40);
    font-size: computed(32);
    line-height: computed(100);
    text-align: center;
    background: #2ba4f3;
    color: #ffffff;
}
.pay-tip {
    position: relative;
    height: computed(360);
    background: #ffffff;
    overflow: hidden;
    h5 {
        margin-top: computed(75);
        font-size: computed(36);
        line-height: computed(38);
        color: #0d0e09;
        text-align: center;
    }
    p {
        width: computed(600);
        margin: computed(35) auto;
        font-size: computed(28);
        line-height: computed(38);
        color: #666666;
        text-align: center;
    }
    a {
        display: block;
        margin-top: computed(70);
        font-size: computed(28);
        line-height: computed(30);
        color: #2ba4f3;
        text-align: center;
    }
    i {
        position: absolute;
        top: computed(30);
        right: computed(30);
        font-size: computed(38);
        line-height: computed(38);
        color: #999999;
        font-weight: bold;
    }
}
</style>
