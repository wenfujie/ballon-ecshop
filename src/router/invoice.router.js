/*
 * createTime：2018/8/13
 * author：en.chen
 * description: 发票模块路由
 */



export default [{
        name: "invoiceType",
        path: '/invoice-type',
        component: () =>
            import('@/pages/invoice/invoice-type'),
        meta: {
            title: '发票'
        }
    },
    {
        name: "invoiceDetail",
        path: '/invoice-detail',
        component: () =>
            import('@/pages/invoice/invoice-detail'),
		meta: {
			title: '发票'
		}
    }
]