/*
 * createTime：2018/8/18
 * author：en.chen
 * description: 优惠券模块路由
 */
export default [{
    path: '/vouchers-list',
    name: 'vouchers-list',
    component: () =>
        import ('@/pages/vouchers/vouchers-list'),
    meta: {
        title: '领券'
    }
}]