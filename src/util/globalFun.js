
/**
 * createTime: 2018/10/23 19:21
 * author: zhibin.zhao
 * description:
 */
import Vue from 'vue'
//  图片请求过滤器
import filters from './filters'
import { Base, Goods, UserService, Login, Vouchers } from '@/api/service'
import Storage from "./storage"
import { Toast } from 'vant';
import SessionStorage from "./sessionStorage";

global.getImg = function (e, imageSize = '') {
	return filters.imgFilter(e, imageSize)
}

global.getVideo = function (e) {
	return filters.videoFilter(e)
}

// 获取分享图片
Vue.prototype.getShareImg = function (fileUrl, cpmpanyId) {
	return filters.getShareImg(fileUrl, cpmpanyId)
}

//  图片破损或错误时返回
global.errImg = function (e) {
	e.target.src = require("../assets/images/no-image.jpg")
}

// 跳转路由
global.goToPath = function (path, params) {
	this.$router.push({
		path: path,
		params: params
	});
}

//跳转商品详情页
global.jumpProductDetail = function (item) {
	if (item.orderFlag === 0) {
		global.goToPath('/goods-detail?goodsCode=' + item.goodsCode)
	} else {
		global.goToPath('/goods/web-design?goodsCode=' + item.goodsCode)
	}
}

// 验证手机号
global.isPhone = function (phone) {
	let reg = /^1(((5[0-35-9][0-9])|(7([0678])[0-9])|([3489][0-9]{2}))[0-9]{7})$/
	return reg.test(phone)
}

// 全局判断用户是否已经绑定手机号，没有则跳转绑定
global.isBindPhone = async function () {
	if(!!Storage.get('USER_INFO').mobilePhone && !!SessionStorage.get('ISLOGIN')) {
		return true
	}else{
		return UserService.getWxVipInfo({
			busContsCode: baseConstant.busContsCode,
			shopId: Storage.get("USER_INFO").shopId
		}).then((res) => {
			//  未绑定手机号的情况下优先跳转绑定手机号页面
			if (!res.phone || res.phone === null) {
				return false
			}
			return true
		});
	}
}

global.sendCardCoupons = function () {
	let usrInfo = Storage.get('USER_INFO')
	if (!!usrInfo && !!usrInfo.usrId && !!usrInfo.mobilePhone) {
		Vouchers.sendCardCoupons({
			usrId: usrInfo.usrId || '',
			shopId: Storage.get('properties').shopId,
			vipInfoHdId: usrInfo.vipInfoId || ''
		})
	}
}

//  截取url中search所带参数的值
global.getQueryVariable = function (url, variable) {
	var vars = url.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return ('');
}

// 图片上传 参数为File类型
global.uploadImg = function (file) {
	let param = new FormData()
	param.append('companyId', Storage.get('COMPANYID').company_id);
	param.append("usrId", Storage.get("USER_INFO").usrId);
	// param.append('file', convertBase64UrlToBlob(file.replace(/^data:image\/(png|jpg|jpeg);base64,/,"")), "file1.png")
	param.append("file", file, file.name)
	return Base.imgUpload(param).then((res) => {
		return res
	}, function (err) {
		return err
	})
}
// 图片上传 参数为File类型 返回上传图片详情
global.uploadImgDetail = function (file) {
	let param = new FormData();
	param.append("companyId", Storage.get("COMPANYID").company_id);
	param.append("usrId", Storage.get("USER_INFO").usrId);
	// param.append('file', convertBase64UrlToBlob(file.replace(/^data:image\/(png|jpg|jpeg);base64,/,"")), "file1.png")
	param.append("file", file, file.name);
	return Base.imgUploadDetail(param).then(
		res => {
			return res;
		},
		err => {
			return err;
		}
	);
};
// base64 转file类型
global.convertBase64UrlToBlob = function (urlData) {
	var bytes = window.atob(urlData); //去掉url的头，并转换为byte
	// 处理异常,将ascii码小于0的转换为大于0
	var ab = new ArrayBuffer(bytes.length);
	var ia = new Uint8Array(ab);
	for (var i = 0; i < bytes.length; i++) {
		ia[i] = bytes.charCodeAt(i);
	}
	return new Blob([ab], { type: 'image/png' });
}

// 判断用户信息是否存在，不存在跳转登陆
global.isAuthorize = function (path, _this) {
	if (!Storage.get('USER_INFO')) {
		window.location.href = window.location.href.split('?')[0] + '#/login?path=' + path
	} else {
		_this.$router.push(path)
	}
}

// 获取properties，在项目初始化时候请求，在每次登录时更新
global.getBaseParams = function () {
    let webAddr = window.location.origin
    // if(webAddr.indexOf("localhost")) webAddr = "http://qsuat.qishon.com"
    // let webAddr = "http://ballon.qishon.com"
    return Base.getBaseParams({webAddr: webAddr}).then(res=>{
		if(!res.companyId){
            Storage.clear()
            window.sessionStorage.clear()
            return false
        }
        baseConstant.busContsCode = res.platformCode
        Storage.set('COMPANYID', {company_id: res.companyId})
        Storage.set('properties', {
			wxUnionid: res.mpUuid,
            shopId: res.dptId,
            shopCode: res.dptCode,
            busContsCode: res.platformCode,
            ossOpenUrl: res.ossOpenUrl
        })
		global.baseConstant.ossOpenUrl = res.ossOpenUrl
		return true
    })
}

// 商品是否下架
Vue.prototype.isShelve = function (goodsCode) {
	let params = {
		ownCompanyId: Storage.get("COMPANYID").company_id,
		goodsCode: goodsCode,
		buscontsCode: baseConstant.busContsCode
	}
	return Goods.isShelves(params).then((res) => {
		return res ? true : false;
	})
}

// 商品是否未上架
global.goodsIsShelves = async function (goodsCode) {

	console.log('全局调用商品是否上架~')

	let params = {
		ownCompanyId: Storage.get("COMPANYID").company_id,
		goodsCode: goodsCode,
		buscontsCode: baseConstant.busContsCode
	}
	return Goods.isShelves(params).then((res) => {
		return !!res ? true : false;
	},() => {
		return false
	})
}

/**
 * @action vant toast的loading提示
 * @params
 *  msg：内容；
 *  duration：展示时长；
 *  loadingType：加载图标类型,可选值为 spinner；
 *  mask：是否显示背景蒙层；
 *  forbidClick：是否禁止背景点击；
 * @use
 * html: <van-toast id="van-toast" />
 * js:
 * global.toastLoading();// 开启
 * global.toastLoading(false);// 关闭
 *
 */
global.toastLoading = function (msg = '加载中...', duration = 0, loadingType = 'circular', mask = false, forbidClick = true) {
	if (arguments.length === 1 && !arguments[0]) {
		Toast.clear();
	} else {
		Toast.loading({
			message: msg,
			duration: duration,
			loadingType: loadingType,
			mask: mask,
			forbidClick: forbidClick
		});
	}
}

// 联合登录
global.combineLogin = function () {
	let WechatInfo = Storage.get("WECHAT_INFO");
	let userSex = "";
	if (WechatInfo.sex === 1) {
		userSex = "D_MALE";
	} else if (WechatInfo.sex === 2) {
		userSex = "D_FEMALE";
	}
	let loginData = {
		companyId: Storage.get("COMPANYID").company_id,
		shopId: Storage.get("properties").shopId,
		busContsCode: baseConstant.busContsCode,
		unionId: WechatInfo.unionid,
		openId: WechatInfo.openid,
		signUpTypeCode: baseConstant.signUpTypeCode,
		usrName: WechatInfo.nickname,
		url: WechatInfo.headimgurl,
		sex: userSex
	};
	return Login.userInfo(loginData).then(
		res => {
			let usrInfo = Storage.get("USER_INFO");
			usrInfo = Object.assign(usrInfo, res);
			Storage.set("USER_INFO", usrInfo);
			Toast("绑定手机号成功~");

			//  登陆送券（存在usrId且绑定过手机号的用户）
			if (!!res.usrId && !!res.mobilePhone) {
				Vouchers.sendCardCoupons({
					usrId: res.usrId || "",
					shopId: Storage.get("properties").shopId,
					vipInfoHdId: res.vipInfoHdId || ""
				});
			}
			return true
		},
		() => {
			return false
		}
	);
}

/** 更新已整合用户长度 **/
global.updateRelationAccountLength = function () {
	// 增加缓存变量(会员整合用户长度)
	UserService.getRelationAccountList().then(res => {
		let userInfo = Storage.get("USER_INFO");
		userInfo.relationAccountLength = res.length ? res.length - 1 : 0;
		Storage.set("USER_INFO", userInfo);
	})
}

/**
 * 对象去重
 *  利用对象访问属性的方法，判断对象中是否存在key
 * @param listData
 * @param key
 * @returns {Array}
 */
global.objCombine = function (listData, key) {
	let result = []
	let obj = {}
	for (let i = 0; i < listData.length; i++) {
		if (!obj[listData[i][key]]) {
			result.push(listData[i])
			obj[listData[i][key]] = true
		}
	}

	return result
}

/**
 * 赠品sku排序
 * @param field 根据哪个字段名排序
 * @returns {Function}
 */
global.compare = function (field) {
	return function (obj1, obj2) {
		let val1 = obj1[field]
		let val2 = obj2[field]
		if (val1 < val2) { // 倒序
			return -1
		} else if (val1 > val2) {
			return 1
		} else {
			return 0
		}
	}
}


global.filterInput = function (val) {
	if (!val) return
	// 这里过滤的是特殊字符
	return val.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\.]/g, "");
}

global.filterPhone = function (val) {
	if (!val) return
	// 这里过滤的是特殊字符
	return val.replace(/[^0-9]/g, '');
}

// 四舍五入函数
global.numberRound = function (val) {
	if (!val) val = 0
	val = Number(val)
	let numFlag = true
	if (val < 0) {
		val = Math.abs(val)
		numFlag = false
	}
	let times = Math.pow(10, 2)
	let res = val * times + 0.5;
	res = parseInt(res, 10) / times;
	if (!numFlag) res = -(res)
	return res
}

/**
 * @param allDistrictFlag 是否在区列展示全部选项
 * cityData处理：处理成elementUI 中Cascader 级联选择器可使用数据
 */
global.c_disposeCityData = function (cityData, allDistrictFlag = false) {
	let arr = [];
	for (let sKey in cityData.province_list) { // 省
		arr.push({
			value: sKey,
			label: cityData.province_list[sKey],
			children: []
		})
		let item = arr[arr.length - 1];
		for (let cKey in cityData.city_list) { // 市
			let cKey2 = cKey.substring(0, 2);
			if (item.value.substring(0, 2) === cKey2) {
				let cKey4 = cKey.substring(0, 4);
				item.children.push({
					value: cKey,
					label: cityData.city_list[cKey],
					children: []
				})
				for (let qKey in cityData.county_list) { // 区
					let qKey4 = qKey.substring(0, 4);
					if (cKey.substring(0, 4) === qKey4) {
						item.children[item.children.length - 1].children.push({
							value: qKey,
							label: cityData.county_list[qKey]
						})
					}
				}
				if (item.children[item.children.length - 1].children.length > 0 && allDistrictFlag) {
					item.children[item.children.length - 1].children.unshift({
						value: '',
						label: '全部'
					});
				}
			}
		}
	}
	return arr;
}