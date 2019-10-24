import Vue from 'vue'
import Router from 'vue-router'
import Storage from '../util/storage'
// import Show from '@/pages/goods/show'

// 登录模块 路由
import loginRouter from '@/router/login.router'
// 订单模块 路由
import orderRouter from '@/router/order.router'
// 会员模块  路由
import memberRouter from '@/router/member.router'
// 商品模块  路由
import goodsRouter from '@/router/goods.router'
// 商品模块  路由
import cartRouter from '@/router/cart.router'

// 售后服务模块路由
import adjusterRouter from '@/router/adjuster.router';

// 预约量体 路由
import volume from '@/router/volume.router'

// 测试  路由
import testRouter from '@/router/test.router'
// 发票  路由
import Invoice from '@/router/invoice.router'

//  优惠券路由
import Vouchers from '@/router/vouchers.router'

//  优惠券路由
import Merge from '@/router/merge.router'
import SessionStorage from "../util/sessionStorage";

Vue.use(Router)

const router = new Router({
    // mode: ' ',
    // base: '/ecshop/',
    routes: [
        { path: '/', redirect: '/login'},  // 默认路由跳转登陆
        // 登录模块
        ...loginRouter,
        // 订单模块
        ...orderRouter,
        // 会员模块
        ...memberRouter,
        // 商品模块
        ...goodsRouter,
        // 购物车模块
        ...cartRouter,
        // 售后服务模块
        ...adjusterRouter,
        // 预约量体模块
        ...volume,
        // 测试路由
        ...testRouter,
        // 发票路由
        ...Invoice,
        // 优惠券路由
        ...Vouchers,
            // 会员整合
            ...Merge
    ]
})


const ua = window.navigator.userAgent.toLowerCase()
const isIOS = /iphone|ipad|ipod/.test(ua);  // 是否是ios设备


router.beforeEach((to, from, next) => { /* 路由变化修改title */

	window.console.log('来源页面：',from.fullPath)
	window.console.log('即将跳转的页面：',to.fullPath)

    if (to.meta.title) {
        document.title = to.meta.title
    }

	if ((to.path === "/login") && (from.path !== "/")) {

		console.log('跳转登陆页面~')
		if(from.path !== '/off-shelves' && from.path !== '/login') {
			Storage.set("redirectPath", {'path': encodeURIComponent(from.fullPath)})
		}
		if(!!Storage.get('USER_INFO') && !!SessionStorage.get('ISLOGIN')) {
			let redirectPath = Storage.get('redirectPath')
			//  登陆成功后的跳转
			if (!!redirectPath) {
				Storage.remove('redirectPath')
				next(decodeURIComponent(redirectPath.path))
			} else {
				next('/index')
			}
		}else{
			// 静默登陆
			next()
		}
	}else if((to.path !== "/login") && (to.path !== "/orderShare") && (to.path !== "/clear")) {
		let userInfo = Storage.get('USER_INFO')
		if(!userInfo) {
			window.console.log('跳转授权登陆~')
			Storage.set("redirectPath", {'path': encodeURIComponent(to.fullPath)})
			next(false)
			window.location.replace(baseConstant.redirectUri)
			return
		}

		// 静默登陆
		if(userInfo && !SessionStorage.get('ISLOGIN')) {
			window.console.log('跳转静默登陆~')
			Storage.set("redirectPath", {'path': encodeURIComponent(to.fullPath)})
			let userInfo = Storage.get('USER_INFO')
			delete userInfo.usrId
			Storage.set('USER_INFO',userInfo)
			next('/login?checkLogin=true')
			return
		}

		if(to.path === '/member-center'){   // 需要绑定手机号才能跳转的页面
			isBindPhone().then(res=>{
				if(!res){
					next({name: 'phoneBind', params: {toUrl: to.fullPath}})
				}else{
					next()
				}
			})
		}else if(to.path === '/goods-detail'){
			// 跳转商品详情页之前判断商品是否上架
			if(!to.query.goodsCode) {
				next('/index')
			}else{
				if(from.path === '/off-shelves') {
					next('/index')
				}else{
					global.goodsIsShelves(to.query.goodsCode).then((res) => {
						if(!!res) {
							next()
						}else{
							next('/off-shelves')
						}
					},() => {
						next('/off-shelves')
					})
				}
			}
		}else{
			next()
		}
	}else{
		next()
	}
})

router.afterEach((to, from) => {
	//  苹果设备设置分享的网页路径
	if(isIOS) {
		let path = location.origin + (location.pathname + (location.hash ? '?from=singlemessage#' : '') + to.fullPath).replace('//', '/')
		console.log('分享地址',path)
	}
})


export default router