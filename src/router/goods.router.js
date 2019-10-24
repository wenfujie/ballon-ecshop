/**
 *
 * @description:
 * @author: yating.sun
 * @createTime: 2018/5/29 11:00
 * @version: 1.0.0.0
 * @history:
 *    1、
 *    2、
 *
 */
export default [
    {
        path: '/goods/web-design',
        component: () =>
            import ('@/pages/goods/web-design'),
        meta: {
            title: '3D定制'
        }
    },
    {
        path: '/search',
        component: () =>
            import ('@/pages/search/search'),
        meta: {
            title: '商品搜索'
        }
    },
    // 商品详情
    {
        path: '/goods-detail',
        name: 'choosebuy-category-detail',
        component: () =>
            import ('@/pages/goods/choosebuy-category-detail'),
        meta: {
            title: '商品详情'
        }
    },
    // 单品搭配
    {
        path: '/collocate-design',
        name: 'collocate-design',
        component: () =>
            import ('@/pages/goods/collocate-design'),
        meta: {
            title: '单品搭配'
        }
    },
    // 品类导购
    {
        path: '/choosebuy-category/:className',
        name: 'choosebuy-category',
        component: () =>
            import ('@/pages/goods/choosebuy-category'),
        meta: {
            title: '品类导购'
        }
    },
    // 场景优选
    {
        path: '/choosebuy-scene',
        name: 'choosebuy-scene',
        component: () =>
            import ('@/pages/goods/choosebuy-scene'),
        meta: {
            title: '场景优选'
        }
    },
    // 场景优选(详细列表)
    {
        path: '/choosebuy-list',
        name: 'choosebuy-list',
        component: () =>
            import ('@/pages/goods/choosebuy-list'),
        meta: {
            title: '场景优选'
        }
    },
    // 商品分类
    {
        path: '/goods-sort',
        name: 'goods-sort',
        component: () =>
                import ('@/pages/goods/good-sort'),
        meta: {
            title: '分类'
        }
    },
    {
        path: '/goods-list',
        component: () =>
            import('@/pages/goods/goods-list'),
        meta: {
            title: '商品列表'
        }
    },
    // 商品下架
	{
		path: '/off-shelves',
		component: () =>
			import('@/pages/goods/off-shelves'),
		meta: {
			title: '商品未上架'
		}
	}
]
