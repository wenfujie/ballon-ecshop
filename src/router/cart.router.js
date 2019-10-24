/*
 * createTime：2018/7/12
 * author：en.chen
 * description: 购物车路由
 */

export default [{
    path: '/shopping-cart',
    component: () =>
        import ('@/pages/cart/shopping-cart'),
    meta: {
        title: '购物车'
    }
}]