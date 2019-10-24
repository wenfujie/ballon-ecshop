/**
 *
 * @description:
 * @author: junyong.hong
 * @createTime: 2018/5/25
 * @version: 1.0.0.0
 * @history:
 *    1、
 *    2、
 *
 */

export default [{
        name: "orderList",
        path: '/orderList',
        meta: {
            title: '订单列表'
        },
        component: () =>
            import('@/pages/order/order-list'),
    },
    {
        name: "waitShip",
        path: '/waitShip',
        meta: {
            title: '订单详情'
        },
        component: () =>
            import('@/pages/order/wait-ship'),

    }, {
        name: "orderClosed",
        path: '/orderClosed',
        meta: {
            title: '订单详情'
        },
        component: () =>
            import('@/pages/order/order-closed'),

    },
    {
        name: "tradFinish",
        path: '/tradFinish',
        meta: {
            title: '订单详情'
        },
        component: () =>
            import('@/pages/order/trad-finish'),
    },
    {
        name: "waitEvaluate",
        path: '/waitEvaluate',
        meta: {
            title: '订单详情'
        },
        component: () =>
            import('@/pages/order/wait-evaluate'),

    },
    {
        name: "waitPickup",
        path: '/waitPickup',
        meta: {
            title: '订单详情'
        },
        component: () =>
            import('@/pages/order/wait-pick-up'),

    },
    {
        name: "waitRecieve",
        path: '/waitRecieve',
        meta: {
            title: '订单详情'
        },
        component: () =>
            import('@/pages/order/wait-recieve'),

    },
    {
        name: "waitPay",
        path: '/waitPay',
        meta: {
            title: '订单详情'
        },
        component: () =>
            import('@/pages/order/wait-pay'),

    }, {
        name: "orderShare",
        path: '/orderShare',
        meta: {
            title: '订单分享'
        },
        component: () =>
            import('@/pages/order/orderShared'),

    }, {
        path: '/order-settlement',
        component: () =>
            import('@/pages/order/settlement.vue'),
        meta: {
            title: '订单结算'
        }
    }, {
        name: "orderEvaluate",
        path: '/orderEvaluate',
        component: () =>
            import('@/pages/order/order-evaluate.vue'),
        meta: {
            title: '订单商品评价'
        }
    }
]