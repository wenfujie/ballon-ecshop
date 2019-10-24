/**
 *
 * @description: axios二次封装
 * @author: junyong.hong
 * @createTime: 2018/5/23
 * @version: 1.0.0.0
 * @history:
 *    1、
 *    2、
 *
 */
import axios from 'axios'
import Storage from './storage.js'
import tokenManager from "./token-manager" // 全局参数

//  请求超时时间
axios.defaults.timeout = 20000

//  请求基本路径
axios.defaults.baseURL = baseConstant.serverUrl


/**
 * 返回状态判断(添加请求拦截器)
 */
axios.interceptors.request.use(config => {
	// todo 空字段过滤
	return config
}, err => {
	return Promise.reject(err)
})

/**
 * 返回状态判断(添加响应拦截器)
 */
axios.interceptors.response.use((response) => {
	let resStr = JSON.stringify(response)
	if (resStr.indexOf('invalid_token') !== -1 || response.data.statusCode === 401) {  // token过期
		Storage.remove('TOKENINFO')
		tokenManager.getCilentToken('invalid')
		window.location.reload()
		return
	}
	if (!!response.data && !!response.data.statusCode && response.data.statusCode !== 200) {
		return Promise.reject(response.data)
	} else {
		return response.data
	}
}, err => {
	return Promise.reject(err)
})

const http = {
	/**
	 * get请求方法
	 * 调用：
	 *  var params = { id: id }
	 *  this.$get('url', params).then((response) => {  })
	 * @param url 地址
	 * @param params 参数
	 * @returns {Promise}
	 */
	get: async function (url, params = {}) {
		let token = await tokenManager.getCilentToken()
		let company = Storage.get('COMPANYID')
		let userInfo = Storage.get('USER_INFO')
		try {
			if (company !== null) {
				params.ownCompanyId = company.company_id
				params.companyId = company.company_id
			}
			if (userInfo !== null) {
				params.usrId = !!userInfo.usrId ? userInfo.usrId : 1
				// todo 提交时打开以下注释
				if(!params.vipInfoHdId) params.vipInfoHdId = userInfo.vipInfoId ? userInfo.vipInfoId : null
			}
		} catch (e) {
		}
		return axios.get(url, {
			params: params,
			headers: {
				Authorization: 'Bearer ' + token,
				ownCompanyId: params.ownCompanyId,
				'Cache-Control': 'no-cache',
				'Pragma': 'no-cache',
			}
		})

	},
	/**
	 * post请求方法
	 * 调用：
	 *  var data = { id: id }
	 *  this.$post('url', data).then((response) => {  })
	 * @param url 地址
	 * @param data 参数
	 * @returns {Promise}
	 */
	post: async function (url, data = {}) {
		let token = await tokenManager.getCilentToken()
		let company = Storage.get('COMPANYID')
		let userInfo = Storage.get('USER_INFO')
		try {
			if (company !== null) {
				data.ownCompanyId = company.company_id
				data.companyId = company.company_id
			}
			if (userInfo !== null) {
				data.usrId = !!userInfo.usrId ? userInfo.usrId : 1
				data.vipInfoHdId = userInfo.vipInfoId ? userInfo.vipInfoId : null
			}
		} catch (e) {
		}
		return axios.post(url, data, {
			headers: {
				Authorization: 'Bearer ' + token,
				ownCompanyId: data.ownCompanyId,
			}
		}).then((res) => {
			return res
		})
	},
	/**
	 * put请求方法
	 * 调用：
	 *
	 *  this.$put(url, data).then((response) => {  })
	 * @param url 地址
	 * @param data 参数
	 * @returns {Promise}
	 */
	put: async function (url, data = {}) {
		let token = await tokenManager.getCilentToken()
		let company = Storage.get('COMPANYID')
		let userInfo = Storage.get('USER_INFO')
		try {
			if (company !== null) {
				data.ownCompanyId = company.company_id
				data.companyId = company.company_id
			}
			if (userInfo !== null) {
				data.usrId = !!userInfo.usrId ? userInfo.usrId : 1
				data.vipInfoHdId = userInfo.vipInfoId ? userInfo.vipInfoId : null
			}
		} catch (e) {
		}
		console.log('put请求参数', data)
		return axios.put(url, data, {
			headers: {
				Authorization: 'Bearer ' + token,
				ownCompanyId: data.ownCompanyId,
			}
		}).then((res) => {
			return res
		})
	},
	/**
	 * delete请求方法
	 * @param url 地址
	 * @param params 参数
	 * @returns {Promise}
	 */
	delete: async function (url, params = {}) {
		let token = await tokenManager.getCilentToken()
		let company = Storage.get('COMPANYID')
		let userInfo = Storage.get('USER_INFO')
		try {
			if (company !== null) {
				params.ownCompanyId = company.company_id
				params.companyId = company.company_id
			}
			if (userInfo !== null) {
				params.usrId = !!userInfo.usrId ? userInfo.usrId : 1
				params.vipInfoHdId = userInfo.vipInfoId ? userInfo.vipInfoId : null
			}
		} catch (e) {
		}
		return axios.delete(url, {
			params: params,
			headers: {
				Authorization: 'Bearer ' + token,
				ownCompanyId: params.ownCompanyId,
			}
		}).then((res) => {
			return res
		})
	},

	//  合并请求
	requestAll(...fn) {
		return axios.all(...fn)
	}
}

export default http