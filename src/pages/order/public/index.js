/*
 * @Author: yongtian.hong
 * @Date: 2018-10-13 11:19:22
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-07-31 20:50:21
 * @Description: 订单相关页面公用方法
 */

import check from "@/util/check";

import * as orderApi from "@/api/service/order";

import { Dialog, Toast } from "vant";

// 取消订处理函数
async function cancelOrderHanler(vm) {
  return new Promise(async function (resolve, reject) {
    let userInfo = vm.Storage.get("USER_INFO");
    let params = {
      flag: 1,
      ctmUsrId: userInfo.usrId,
      billCodes: [vm.order.billCode]
    };
    let result = await vm.$put("order/cancelOrderWx", params);
    if (result.status === 200) {
      Toast("取消订单成功");
      resolve(200);
    } else {
      reject(result.status);
    }
  });
}


// 获取订单详情
export const getOrdInfo = async function (vm) {
  let params = {
    busContsCode: baseConstant.busContsCode,
    billCode: vm.$route.query.billCode
  }
  let order = await vm.$get("order/getWxOrderDetailInfo", params);
  vm.order = order.data;
  //判断是否存在配货单
  if (!check.isEmpty(order.data.packages)) {
    vm.packages = vm.order.packages;
    vm.pkg = vm.packages[0].data;
  } else {
    vm.pkg = order.data;
  }
  vm.pkg.ordStatusName = vm.order.ordStatusNames;
};

// 切换包裹
export const changePkg = async function (vm, pkg) {
  vm.pkg = pkg.data;
};

// 取消订单
export const cancelOrder = async function (vm) {
  const errMsg = {
    "880306416": "订单已取消,请勿重复取消!",
    "880306414": "订单不存在!"
  }
  return new Promise(function (resolve, reject) {
    Dialog.confirm({
      title: "取消订单",
      message: "您确定要取消订单吗？"
    }).then(
      () => {
        cancelOrderHanler(vm).then(
          res => {
            resolve(res);
          },
          err => {
            Toast(errMsg[err.errorCode])
            reject(err.errorCode == 880306416);
          }
        );
      },
    );
  });
};

// 订单 处理会员积分
//业务节点:businessNode订单结算（SETTLEMENT）、收货确认（RECEIPT_CONFIRM）、取消订单（ORDER_CANCEL）
export const handlePoints = async (billCode, businessNode) => {
  let params = {
    ownCompanyId: Storage.get("COMPANYID").company_id,
    companyId: Storage.get("COMPANYID").company_id,
    ctmUsrId: Storage.get("USER_INFO").usrId,
    usrId: Storage.get("USER_INFO").usrId,
    busContsCode: baseConstant.busContsCode,
    businessNode: businessNode,
    billCode: billCode
  };
  orderApi.handlePoints(params).then(
    res => {
      console.log("积分处理成功");
    },
    err => {
      console.log("积分处理失败");
    }
  );
};

// 签收订单(确认收货)
export const ordSignUp = async function (vm, cb) {
  return new Promise(async function (resolve, reject) {
    let userInfo = vm.Storage.get("USER_INFO");
    let params = {
      ctmUsrId: userInfo.usrId,
      usrId: userInfo.usrId,
      billCodes: [vm.order.billCode]
    };
    // [vm.order.billCode]
    // 判断订单是否存在售后单子
    let result = await orderApi.beforeSignUp(params);

    if (result === 500) {
      Toast("服务器接口错误,请稍后再试!");
      return;
    }
    let messages = {
      0: "请确认全部商品均已收到货?",
      1: "该订单存在正在售后的商品,请在售后完成后再进行确认收货!",
      2: "该订单存在正在售后的商品,确认售后后将自动撤销售后申请,是否继续?"
    };
    let btnName = {
      0: "确定",
      2: "继续"
    };
    if (result == 1) {
      Dialog.alert({
        message: messages[1]
      });
    } else {
      Dialog.confirm({
        message: messages[result],
        confirmButtonText: btnName[result]
      }).then(
        async sucess => {
          let res = await orderApi.signUp(params);
          if (res.status === 200) {
            Toast("确认收货成功");
            // handlePoints(vm.order.billCode, "RECEIPT_CONFIRM");
            resolve(200);
          } else {
            Toast("确认收货失败,请稍等再试");
            reject(res);
          }
        },
        fail => {
          Toast("您取消了确认收货");
        }
      );
    }
  });
};
