/*
 * @Author: yongtian.hong
 * @Date: 2018-08-03 13:49:34
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-14 17:31:55
 * @Description: 订单信息组件
 */

<style lang='scss' scoped>
.orderInfo {
  padding-top: computed(30);
  // // padding: computed(30);
  // border-bottom: solid 1px #e6e6e6;
  background: #fff;
  // margin-bottom: computed(100);
  .title {
    text-align: center;
    color: #0d0e09;
    padding: computed(30) 0px;
    font-size: computed(36);
    font-family: "PingFang-SC-Bold";
    font-weight: 600;
  }
  .body {
    color: #0d0e09;
    padding: 0 computed(30);
    margin-bottom: computed(10);
    .item {
      background: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: computed(30);
      font-size: computed(28);
      .left {
        width: 20%;
        text-align: right;
        font-size: computed(28);
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
      }

      .right {
        width: 80%;
        text-align: left;
        font-size: computed(28);
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: rgba(13, 14, 9, 1);
        padding-left: computed(30);
      }
      .status-text {
        color: #2ba4f3;
      }
    }
    .total {
      border-top: computed(1) solid rgba(230, 230, 230, 1);
      padding: computed(20) computed(0);
      margin-bottom: 0;
      .left,
      .right {
        color: #2ba4f3;
      }
    }
  }
  // 开发票
  .get-invoice {
    border-top: computed(10) solid #edf0f7;
    font-size: computed(28);
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    justify-content: space-between;
    margin-top: computed(10);
    padding: computed(30);
    margin-bottom: computed(10);
  }
}
.interval {
  letter-spacing: computed(8);
}
.four-interval {
  letter-spacing: computed(1);
}
</style>
  
<template>
  <div class="orderInfo">
    <!-- <div class="fs36B mgTb30 text-center">订单信息</div> -->
    <div class="body">
      <div class="item">
        <div class="left four-interval">订单编号:</div>
        <div class="right">{{data.billCode||'暂无单号'}}</div>
      </div>
      <div class="item">
        <div class="left four-interval">下单日期:</div>
        <div class="right">{{data.ordTime}}</div>
      </div>
      <div class="item">
        <div class="left status-text four-interval">订单状态:</div>
        <div class="right status-text">{{data.ordStatusNames}}</div>
      </div>

      <!-- 会员卡、折扣券、优惠券金额为0，要显示这些字段 -->
      <!-- 促销优惠、其他折让为0时，才不显示促销优惠、其他折让 -->
      <div class="item">
        <div class="left four-interval">商品总额:</div>
        <div class="right">￥{{data.amountPart}}</div>
      </div>

      <div class="item four-interval" v-if="accountList.length>1">
        <div class="left">来源账号:</div>
        <div class="right">{{orgrinAccout}}</div>
      </div>
      <div class="item">
        <div class="left interval">会员卡:</div>
        <div class="right">-￥{{data.amountVipcard || 0}}</div>
      </div>
      <div class="item">
        <div class="left interval">折扣券:</div>
        <div class="right">-￥{{data.amountDiscard || 0}}</div>
      </div>
      <div class="item">
        <div class="left interval">优惠劵:</div>
        <div class="right">-￥{{data.amountCoupon || 0}}</div>
      </div>
      <div class="item" v-if="data.amountPm && data.amountPm!==0  ">
        <div class="left four-interval">促销优惠:</div>
        <div class="right">-￥{{data.amountPm}}</div>
      </div>
      <div class="item" v-if="data.amountOthDisc && data.amountOthDisc!==0  ">
        <div class="left four-interval">其他折让:</div>
        <div class="right">-￥{{data.amountOthDisc}}</div>
      </div>

      <div class="item">
        <div class="left">运&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;费:</div>
        <div class="right">￥{{data.amountTrans}}</div>
      </div>
      <div class="item" v-if="data.amountPoint!=0">
        <div class="left four-interval">使用积分:</div>
        <div class="right">-￥{{data.amountPoint}}</div>
      </div>
      <div class="item total">
        <div class="left four-interval">实付金额:</div>
        <div class="right">￥{{data.amountNeedPay|Fix2}}</div>
      </div>
    </div>

    <div
      class="get-invoice flex-row"
      v-if="ticketBtnName &&  ticketBtnName=='查看发票'"
      @click="openTicket(ticketBtnName)"
    >
      <p>{{data.invoiceDetail.typeName}}</p>
      <p>
        {{data.invoiceDetail.invoiceCode?'公司':'个人'}}
        <i class="iconfont fs30 icon-youfan"></i>
      </p>
    </div>

    <div
      class="get-invoice flex-row"
      @click="openTicket(ticketBtnName)"
      v-else-if="ticketBtnName &&  ticketBtnName=='开发票'"
    >
      <p>未开发票</p>
      <p>
        <i class="iconfont fs30 icon-youfan"></i>
      </p>
    </div>
  </div>
</template>
  
<script>
import { canSetInvoice } from "@/api/service/invoice";

import { Order, Adjuster, UserService } from "@/api/service";
import check from "@/util/check";
import { Dialog } from "vant";
import Storage from "@/util/storage";
export default {
  name: "OrderInfo",
  props: {
    data: {}
  },
  data() {
    return {
      accountList:[],
      orgrinAccout: ""
    };
  },
  methods: {
    async initState() {
      this.orgrinAccout = await this.getAccountList();
      console.log(this.orgrinAccout,'orgrinAccoutorgrinAccout')
    },
    // 手机号部分隐藏处理
    phoneNumHandle(phoneNumber) {
      return (phoneNumber + "").replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2");
    },
    //获取关联账户列表
    async getAccountList() {
      let accountList = await UserService.getRelationAccountList();
  
      this.accountList=accountList
      console.log(accountList,'accountListaccountListaccountList')
      let vipId = this.Storage.get("USER_INFO").vipInfoId;
      let currentAccount = accountList.filter(account => {
        if (account.id == vipId) return account;
      })[0];
      currentAccount.mobilePhone = this.phoneNumHandle(
        currentAccount.mobilePhone
      );
      console.log("currentAccount", currentAccount);
      return currentAccount.mobilePhone;
    },
    //查看发票
    toViewInvoice() {
      this.$router.push({
        name: "invoiceDetail",
        query: {
          billCode: this.data.billCode,
          isAllowOpenTicket: this.data.ordStatusCodes == "D_ORDCANCEL" ? false : true,                              isAllowOpenTicketStatus: this.data.isAllowOpenTicket
        }
      });
    },
    // 开发票
    toOpenTicket() {
      const toOpenTicket = this.judgeAfterSaleOrdStatus();
      if (!toOpenTicket) return;
      this.$router.push({
        name: "invoiceType",
        query: {
          billCode: this.data.billCode
        }
      });
    },
    // 跳转开发票/查看发票详情
    openTicket(name) {
      switch (name) {
        case "查看发票":
          this.toViewInvoice();
          break;
        case "开发票":
          this.toOpenTicket();
          break;
      }
    },
    //判断订单关联的售后单数量以及状态
    judgeAfterSaleOrdStatus() {
      let toOpenTicket = false;
      // 未确认的售后申请单数量
      const unconfirm_num = this.data.afterSalesInfo.unconfirmNum;
      // 处理中的售后申请单数量
      const handling_num = this.data.afterSalesInfo.handlingNum;
      // 订单关联的售后申请单数量
      const totalNum = this.data.afterSalesInfo.totalNum;
      //售后单号
      const applyCode = this.data.afterSalesInfo.applyCode;

      if (handling_num > 0) {
        Dialog.confirm({
          message: "有进行中的售后申请,暂时无法开票,请等待售后完成!",
          confirmButtonText: "前去查看",
          cancelButtonText: "关闭"
        })
          .then(() => {
            if (totalNum === 1) {
              this.$router.push({
                name: "postSaleDetail",
                params: {
                  reapplycode: applyCode
                }
              });
            } else {
              this.$router.push({
                name: "postSaleList"
              });
            }
            // on confirm
          })
          .catch(() => {
            // on cancel
          });
      } else if (unconfirm_num > 0) {
        Dialog.confirm({
          message: "该订单有未被处理的售后单,暂时无法开票,要去取消售后单吗?",
          confirmButtonText: "去取消",
          cancelButtonText: "不了"
        })
          .then(() => {
            if (totalNum === 1) {
              this.$router.push({
                name: "postSaleDetail",
                params: {
                  reapplycode: applyCode
                }
              });
            } else {
              this.$router.push({
                name: "postSaleList"
              });
            }
          })
          .catch(() => {
            // on cancel
          });
      } else {
        // 没有未处理或者处理中的售后单,允许去开票
        toOpenTicket = true;
      }
      return toOpenTicket;
    }
  },
  filters: {
    vipAccountHandle: function(str) {
      return (str + "").replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2");
    }
  },
  created() {
    this.$nextTick(() => {
      this.initState();
    });
  },
  watch: {
    data: function(val) {
      console.log(val, "valvalval");
      this.initState();
    }
  },
  computed: {
    //发票信息
    invoiceInfo: function() {
      if (check.isEmpty(this.data.invoiceDetail)) {
        return "无";
      } else {
        return (
          this.data.invoiceDetail.title + " " + this.data.invoiceDetail.typeName
        );
      }
    },
    //判断是否允许开发票
    ticketBtnName: function() {
      console.log(this.data.invoiceDetail, "this.data.invoiceDetail");
      if (!check.isEmpty(this.data.invoiceDetail)) return "查看发票";
      let amount = this.data.actualAmount - this.data.amountTrans;
      if (this.data.isAllowOpenTicket == 1 && amount > 0) {
        return "开发票";
      } else {
        return null;
      }
    }
  }
};
</script>
