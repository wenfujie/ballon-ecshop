
/**
 *
 * @description:会员模块
 * @author: yating.sun
 * @createTime: 2018/5/28 15:03
 * @version: 1.0.0.0
 * @history:
 *    1、
 *    2、
 *
 */
export default [{
    path: '/member-center',
    name: 'member-center',
    component: () =>
        import('@/pages/member/member-center'),
    meta: {
        title: '账户'
    }
}, {
    path: '/show',
    name: 'show',
    component: () =>
        import('@/pages/show/show'),
    meta: {
        title: '首页'
    }
}, {
    path: '/index',
    name: 'index',
    component: () =>
        import('@/pages/index/index'),
    meta: {
        title: '首页',
        keepAlive: true  // 页面缓存
    }
}, {
    path: '/member/member-information',
    component: () =>
        import('@/pages/member/member-information'),
    meta: {
        title: '个人信息'
    }
}, {
    path: '/phone-bind',
    name: 'phoneBind',
    component: () =>
        import('@/pages/member/phone-bind'),
    meta: {
        title: '手机号绑定'
    }
}, {
    path: '/phone-change',
    component: () =>
        import('@/pages/member/phone-change'),
    meta: {
        title: '更换手机号'
    }
}, {
    name: "addressList",
    path: '/address-list',
    component: () =>
        import('@/pages/address/address-list'),
    meta: {
        title: '地址列表'
    }
}, {
    path: '/address-detail',
    component: () =>
        import('@/pages/address/address-detail'),
    meta: {
        title: '地址详情'
    }
}, {
    path: '/member-benefit',
    component: () =>
        import('@/pages/member/member-benefit'),
    meta: {
        title: '会员权益'
    }
},
{
    path: '/benefit-detail',
    name: 'benefit-detail',
    component: () =>
        import('@/pages/member/benefit-detail'),
    meta: {
        title: '权益详情'
    }
},
{
    path: '/member-card-list',
    component: () =>
        import('@/pages/member/member-card-list'),
    meta: {
        title: '会籍会员'
    }
}, {
    path: '/member-card-detail',
    component: () =>
        import('@/pages/member/member-card-detail'),
    meta: {
        title: '会籍会员'
    }
}, {
    path: '/footprint',
    component: () =>
        import('@/pages/member/member-footprint'),
    meta: {
        title: '我的足迹'
    }
}, {
    name: 'my-vouchers',
    path: '/my-vouchers',
    component: () =>
        import('@/pages/member/my-vouchers'),
    meta: {
        title: '我的抵用券'
    }
}, {
    path: '/my-dream-list',
    component: () =>
        import('@/pages/member/my-dream-list'),
    meta: {
        title: '我的收藏'
    }
}, {
    path: '/purchase-list',
    component: () =>
        import('@/pages/member/purchase-list'),
    meta: {
        title: '消费记录'
    }
},
{
    path: '/member-integrate',
    component: () =>
        import('@/pages/member/member-integrate'),
    meta: {
        title: '账号整合'
    }
},
{
    path: '/member-point',
    component: () =>
        import('@/pages/member/member-point'),
    meta: {
        title: '我的积分'
    }
},
{
    path: '/add-evaluate',
    name: 'addEvaluate',
    component: () => import('@/pages/member/add-evaluate'),
    meta: {
        title: '追加评价'
    }
},
]
