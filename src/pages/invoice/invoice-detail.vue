/*
* createTime：2018/8/13
* author：en.chen
* description:  发票详情
*/
<template>
    <div class="invoice-detail">
        <!--发票状态 begin-->
        <h5 class="status">状态：{{invoiceInfo.invStateName}}</h5>
        <!--发票状态 end-->

        <!--发票详情 begin-->
        <div class="invoice-wrapper">
            <label class="invoice-label">发票类型</label>
            <div class="invoice-content">
                <p>{{invoiceInfo.invTypeName}}</p>
            </div>
        </div>
        <div class="invoice-wrapper">
            <label class="invoice-label">发票抬头</label>
            <div class="invoice-content">
                <p>{{invoiceInfo.invoiceTitle}}</p>
            </div>
        </div>
        <div class="invoice-wrapper" v-if="invoiceInfo.titleType === 'D_INVTITLETYPE2' ">
            <label class="invoice-label">纳税识别号</label>
            <div class="invoice-content">
                <p>{{invoiceInfo.invoiceCode}}</p>
            </div>
        </div>
        <div v-if="showDownImg && !!invoiceInfo.nnJpgUrl" class="invoice-wrapper">
            <label class="invoice-label">下载方式1：</label>
            <div class="invoice-content" @click="downLoadInvoice">
                <div class="download-btn">下载电子发票</div>
            </div>
        </div>
        <div v-if="showDownImg && !!invoiceInfo.nnJpgUrl" class="invoice-wrapper">
            <label class="invoice-label">下载方式2：</label>
            <div class="invoice-content download2">
                <div class="download-btn" v-copy="invoiceInfo.nnJpgUrl">复制链接</div>
                <p class="copy-link">复制链接并在浏览器中打开下载</p>
            </div>
        </div>
        <!--发票详情 end-->

        <!--收货地址 begin-->
        <div class="invoice-wrapper" v-if="invoiceInfo.invType === 'D_INVOICE_COMMON'">
            <label class="invoice-label">收货地址</label>
            <div class="invoice-content">
                <p>
                    {{invoiceInfo.receiver}}
                    <span class="phone">{{invoiceInfo.cargoName}}</span>
                </p>
                <p class="address-info">{{invoiceInfo.receiverCombo}}</p>
            </div>
        </div>
        <!--收货地址 end-->

        <!-- 物流信息 begin -->
        <div class="invoice-wrapper" v-if="invoiceInfo.invType === 'D_INVOICE_COMMON' && invoiceInfo.isSendWithOrd !== 1">
            <label class="invoice-label">物流信息</label>
            <div class="invoice-content">
                <p>{{invoiceInfo.shipCompanyName || '暂无更多信息'}} {{invoiceInfo.invShipCode || ''}}</p>
            </div>
        </div>
        <!-- 物流信息 end -->

        <!--物流信息 begin-->
        <logis :data="logis" v-if="invoiceInfo.isSendWithOrd !== 1"></logis>

        <!--物流单提示 begin-->
        <P
            class="tip"
            v-if="invoiceInfo.isSendWithOrd === 1&&invoiceInfo.invType === 'D_INVOICE_COMMON'&&invoiceInfo.invStateCode === 'D_INV_TRICKT'"
        >温馨提示：发票已与订单商品一同寄出</P>
        <!--物流单提示 end-->

        <!--取消按钮 begin-->
        <div v-if="staticBtn" class="common-bottom-btn">
            <p @click="clickStaticBtn()" class="btn-txt">{{staticBtn}}</p>
        </div>
    </div>
    <!--物流信息 end-->
</template>
<script>
import { Step, Steps, Dialog, Toast } from "vant";
import { Invoice } from "../../api/service";
import Storage from "../../util/storage";
import logis from "@/components/logis";

export default {
    components: {
        "van-steps": Steps,
        "van-step": Step,
        logis
    },
    data() {
        return {
            billCode: "", //订单号
            invoiceInfo: {}, //发票详情,
            logis: {},
            showContent: false,
            showDownImg: false,
            staticBtn: "",
			isAllowOpenTicketStatus: ''
        };
    },
    methods: {
        initState() {
            switch (this.invoiceInfo.invStateName) {
                case "未审核":
                    this.staticBtn = "取消";
                    break;
                case "已同意":
                    if (this.invoiceInfo.invTypeName === "普通发票") {
                        this.showDownImg = false;
                    }
                    this.showContent = true;
                    break;
                case "已拒绝":
                    break;
                case "已开票":
                    this.showContent = true;
                    console.log("已开票");

                    // 电子发票，显示下载按钮
                    if (
                        this.invoiceInfo.invTypeName === "电子发票" &&
                        this.invoiceInfo.invStateName === "已开票"
                    ) {
                        this.showDownImg = true;
                    }

                    break;
                case "已取消":
                    this.staticBtn = this.$route.query.isAllowOpenTicket
                        ? "重新申请"
                        : null;

                    break;
            }
        },
        //  获取发票详情
        getDetail() {
            let data = {
                cookieId: Storage.get("USER_INFO").cookieId,
                ctmUsrId: Storage.get("USER_INFO").usrId,
                billCode: this.billCode || this.$route.query.billCode
            };
            Invoice.getDetail(data).then(res => {
                this.invoiceInfo = res;
                if (
                    this.invoiceInfo.invType === "D_INVOICE_COMMON" &&
                    this.invoiceInfo.isSendWithOrd === 0
                ) {
                    this.logis = {
                        shippingWayCode: "kdps", //快递配送方式
                        expressCode: res.shipCompanyCode, //快递运营商代码编号，如YTO(圆通)
                        expressNo: res.invShipCode //快递单号
                    };
                }
                this.initState();
                console.log("vodetail", res);
            });
        },
        /**
         * 取消发票
         */
        clickStaticBtn() {
            let flag = this.staticBtn;
            if (flag === "取消") {
                Dialog.confirm({
                    title: "取消发票",
                    message: "您确定要取消发票吗？"
                }).then(
                    () => {
                        let data = {
                            billCode:
                                this.billCode || this.$route.query.billCode
                        };
                        Invoice.cancelInvoice(data).then(res => {
                            this.staticBtn = "重新申请";
                            this.invoiceInfo.invStateName = "已取消";
                        });
                    },
                    () => {
                        Toast("您取消了操作~");
                    }
                );
            } else if (flag === "重新申请") {
            	if(!!this.$route.query.isAllowOpenTicketStatus) {
					this.$router.push({
						name: "invoiceType",
						query: {
							billCode: this.billCode
						}
					});
                }else{
            		Toast('暂时无法申请发票~')
                    return
                }
            }
        },

        //  下载发票
        downLoadInvoice() {
            let url = this.invoiceInfo.nnJpgUrl;
            //				window.open(url)
            window.location.href = url;
        }
    },
    created() {
        this.billCode = this.$route.query.billCode || "";
        this.isAllowOpenTicketStatus = this.$route.query.isAllowOpenTicketStatus || ''
        this.getDetail();
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/scss">
.invoice-detail {
    overflow: hidden;
    padding: 0 computed(30);
    position: relative;
    //   padding-bottom: computed(180);
    .status {
        margin-top: computed(58);
        font-size: computed(36);
        line-height: computed(38);
        text-align: center;
        color: #2ba4f3;
    }
    .invoice-wrapper {
        display: flex;
        margin-top: computed(50);
        font-size: computed(32);
        line-height: computed(40);
        color: #0d0e09;
        .invoice-label {
            width: computed(200);
            font-weight: bold;
        }
        .invoice-content {
            box-sizing: border-box;
            width: calc(100% - #{computed(200)});
            padding-left: computed(5);
            word-break: break-all;
            &.download2 {
                height: auto;
            }
            .phone {
                margin-left: computed(36);
            }
            .address-info {
                margin-top: computed(4);
                line-height: computed(46);
            }
            .download-btn {
                width: computed(220);
                height: computed(76);
                line-height: computed(76);
                text-align: center;
                color: #ffffff;
                background: #2ba4f3;
                position: relative;
                top: computed(-18);
            }
        }
    }
    .logistics {
        margin-top: computed(50);
        border-top: solid 1px #cccccc;
    }
    .logistics-box {
        margin-top: computed(50);
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .time {
            width: computed(80);
            font-size: computed(24);
            line-height: computed(26);
            color: #0d0e09;
        }
        .dot {
            width: computed(28);
            height: computed(28);
            margin: 0 computed(18);
            background: #cccccc;
            border-radius: computed(28);
        }
        h3 {
            width: computed(500);
            font-size: computed(28);
            line-height: computed(40);
        }
    }
    .van-step--process .dot {
        background: #2ba4f3;
    }
}
.tip {
    margin-top: computed(50);
    font-size: computed(32);
    line-height: computed(34);
    color: #d80000;
}
</style>
