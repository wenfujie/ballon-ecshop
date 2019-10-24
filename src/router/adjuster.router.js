/*
 * @Author: yongtian.hong
 * @Date: 2018-08-09 09:07:55
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-16 13:51:33
 * @Description: 售后服务路由
 */
export default [{
    name: "postSaleList",
    path: "/postSaleList",
    meta: {
      title: '售后申请单列表'
    },
    component: () =>
      import("@/pages/adjuster/post-sale-list")
  },
  {
    name: "postSaleApply",
    path: "/postSaleApply",
    meta: {
      title: '售后申请'
    },
    component: () =>
      import("@/pages/adjuster/post-sale-apply")
  },
  {
    name: "postSaleDetail",
    path: "/postSaleDetail",
    meta: {
      title: '售后详情'
    },
    component: () =>
      import("@/pages/adjuster/post-sale-detail")
  },

];