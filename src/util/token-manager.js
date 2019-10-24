/*
* createTime：2018/9/6
* author：en.chen
* description: 获取token
*/

import Storage from './storage.js'
import axios from 'axios'

const TokenManager =  {

	//  获取游客模式token
	async getCilentToken(status) {
		if(!!Storage.get('TOKENINFO')) {
			return Storage.get('TOKENINFO').access_token
		}else{
			let res = await axios.post('token/getCilentToken', {})
			console.log('获取token请求回参:',res)
			if(!!res) {
				let tokenInfo = res
				Storage.set('TOKENINFO',tokenInfo,6660)
				if(!!status && status ==='invalid') {
					console.log('token过期,获取token成功,重新刷新页面')
					window.location.reload()
				}else{
					return tokenInfo.access_token
				}
			}else{
				if(!!status && status ==='invalid'){
					console.log('token过期,获取token为空,重新刷新页面')
					window.location.reload()
				}
			}
		}
	},

}

export default TokenManager
