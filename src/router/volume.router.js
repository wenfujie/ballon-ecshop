/*
 * @Author: wxx 
 * @Date: 2019-08-05 10:38:13 
 * @Last Modified by: wxx
 * @Last Modified time: 2019-08-27 11:50:18
 */

export default [
    {
        path: '/amount-body',
        name: 'amount-body',
        component: () => import('@/pages/volume/amount-body'),
        meta: {
            title: '我的量体'
        }
    },
    {
        path: '/my-reserve',
        name: 'my-reserve',
        component: () => import('@/pages/volume/my-reserve'),
        meta: {
            title: '我的预约'
        }
    },
    {
        path: '/booking-quantity-body',
        name: 'booking-quantity-body',
        component: () => import('@/pages/volume/booking-quantity-body'),
        meta: {
            title: '预约量体'
        }
    },
    {
        path: '/reserve-detail',
        name: 'reserve-detail',
        component: () => import('@/pages/volume/reserve-detail'),
        meta: {
            title: '预约详情'
        }
    },
    {
        path: '/amount-body-detail',
        name: 'amount-body-detail',
        component: () => import('@/pages/volume/amount-body-detail'),
        meta: {
            title: '量体详情'
        }
    },
    {
        path: '/shop-address',
        name: 'shop-address',
        component: () => import('@/pages/volume/shop-address'),
        meta: {
            title: '选择门店'
        }
    },

]