<template>
	<div class="login" :key="timeStap">
		<van-popup v-model="loading">
			<van-loading color="white"/>
		</van-popup>
	</div>
</template>
<style>
</style>
<script>
	import {Login, Base, Cms, UserService, Vouchers} from "../../api/service";
	import Storage from "../../util/storage";
	import SessionStorage from "../../util/sessionStorage";
	import {Popup, Loading} from "vant";

	export default {
		components: {
			"van-popup": Popup,
			"van-loading": Loading
		},
		data() {
			return {
				userInfo: {},
				loading: true,
				timeStap: new Date().getTime()
			};
		},
		methods: {
			// 微信登陆步骤1，传递url提取code
			wechatUserLogin() {
				let loginData = {
					wxUUID: Storage.get("properties").wxUnionid,
					redirectUri: baseConstant.redirectUri,
					scope: 2
				};

				// 静默登陆重定向链接地址，新增checkLogin标识检验
				if(this.$route.query.checkLogin) {
					console.log('静默登陆')
					loginData.redirectUri = baseConstant.redirectUri + '&checkLogin=true'
				}

				Login.wechatLogin(loginData).then(
					res => {
						window.location.replace(res.url)
					},
					err => {
						alert("page-login-err" + err);
					}
				);
			},

			//  微信登陆步骤2，获取微信用户信息
			getWechatInfo() {
				let url =
					window.location.search.substr(1) || window.location.hash.split("?")[1];
				if (url) {
					let code = getQueryVariable(url, "code");
					if (!!SessionStorage.get("LOGINCODE")) {
						let loginCode = SessionStorage.get("LOGINCODE").loginCode;
						if (code === loginCode) {
							SessionStorage.remove("LOGINCODE");
							this.$router.replace("/login");
						}
					} else {
						// window.alert('wechat-code' + code)
						let data = {
							code: code,
							wxUUID: Storage.get("properties").wxUnionid
						};
						Login.wechatInfo(data).then(
							res => {
								// alert('微信信息' + JSON.stringify(res))
								if(!res.wxResp || res.success === -1) {
									//  代表code被使用过
//									this.$router.replace("/login")
									window.location.replace(baseConstant.redirectUri)
								}else{
									this.userLogin(res.wxResp);
									Storage.set('Wechat_info', res.wxResp)
									SessionStorage.set("ISLOGIN", {isLogin: true});
									SessionStorage.set("LOGINCODE", {loginCode: code});
								}
							},
							err => {
								alert("page-member-center-微信登陆" + err);
							}
						);
					}
				}
			},

			//  联合登陆
			userLogin(WechatInfo) {
				// let WechatInfo = Storage.get('Wechat_info')
				// alert(JSON.stringify(WechatInfo))
				Storage.set("WECHAT_INFO", WechatInfo);
				// let userSex = ((WechatInfo.sex == 1) ? 'D_MALE' : 'D_FEMALE')
				let userSex = "";
				if (WechatInfo.sex == 1) {
					userSex = "D_MALE";
				} else if (WechatInfo.sex == 2) {
					userSex = "D_FEMALE";
				}
				let loginData = {
					companyId: Storage.get("COMPANYID").company_id,
					shopId: Storage.get("properties").shopId,
					busContsCode: global.baseConstant.busContsCode,
					unionId: WechatInfo.unionid,
					openId: WechatInfo.openid,
					signUpTypeCode: baseConstant.signUpTypeCode,
					usrName: WechatInfo.nickname,
					url: WechatInfo.headimgurl,
					sex: userSex
				};
				// alert('联合登陆传参' + JSON.stringify(loginData))
				Login.userInfo(loginData)
					.then(
						async res => {
							console.log(res.usrId);
							// alert('联合登陆用户信息' + JSON.stringify(res))
							let usrInfo = await this.getUserDetailInfo(res.vipInfoId);
							res.mobilePhone = usrInfo.mobilePhone;
							res.cardNo == usrInfo.cardNo;
							Storage.set("USER_INFO", res);

							Storage.set("CARDNO", {
								cardNo: usrInfo.cardNo
							});

							//  登陆送券（存在usrId且绑定过手机号的用户）
							if (!!usrInfo.usrId && !!usrInfo.mobilePhone) {
								Vouchers.sendCardCoupons({
									usrId: res.usrId || "",
									shopId: Storage.get("properties").shopId,
									vipInfoHdId: res.vipInfoHdId || ""
								});
							}
						},
						err => {
							alert("page-member-center-联合登陆" + err);
						}
					)
					.then(() => {
						this.getDefaultTemplate();
					});
			},

			//  登陆
			login() {
				// 通过url中是否存在code选择登陆流程
				let urlParams = "";
				let code = "";
				try {
					urlParams =
						window.location.search.substr(1) ||
						window.location.hash.split("?")[1];
				} catch (e) {
				}
				try {
					code = getQueryVariable(urlParams, "code");
				} catch (e) {
				}
				console.log("code", code);
				if (!!code) {
					this.getWechatInfo();
				} else {
					this.wechatUserLogin();
				}
			},

			//  获取千人千面模板编号
			getDefaultTemplate() {
				let data = {
					busContsCode: baseConstant.busContsCode
				};
				Cms.getUsrCmsTemplate(data)
					.then(res => {
						//                    alert('获取千人千面模板编号' + JSON.stringify(res))
						Storage.set("TEMPLATE_INFO", res[0]);
					})
					.then(() => {
						if(!!Storage.get('USER_INFO') && !!SessionStorage.get('ISLOGIN')) {
							let redirectPath = Storage.get("redirectPath");
							//  登陆成功后的跳转
							if (!!redirectPath) {
								Storage.remove("redirectPath");
								if (decodeURIComponent(redirectPath.path).indexOf("login") === -1) {
									this.$router.replace(decodeURIComponent(redirectPath.path));
								} else {
									this.$router.replace("/index");
								}
							} else {
								this.$router.replace("/index");
							}
						}else{
							this.login()
						}
					});
			},

			// 获取用户信息
			getUserDetailInfo(id) {
				return UserService.getUserInfo({vipInfoHdId: id}).then(res => {
					return res;
				});
			}
		},
		created() {
			let path = window.location.href;
			if (path.indexOf("path") != -1) {
				Storage.set("redirectPath", {path: path.split("path=")[1]});
			}
			getBaseParams().then(res=>{
				if(!res) {
					this.loading = false
					return
				}
				this.getDefaultTemplate()
			})
			/* let properties = Storage.get("properties");
			if (!properties || !properties.ossOpenUrl) {
				getBaseParams().then(res=>{
					if(!!Storage.get('USER_INFO') && !!SessionStorage.get('ISLOGIN')) {
						this.getDefaultTemplate()
					}else{
						this.login();
					}
				})
			} else {
				if(!!Storage.get('USER_INFO') && !!Storage.get('TEMPLATE_INFO') && !!SessionStorage.get('ISLOGIN')) {
					let redirectPath = Storage.get("redirectPath");
					//  登陆成功后的跳转
					if (!!redirectPath) {
						Storage.remove("redirectPath");
						if (decodeURIComponent(redirectPath.path).indexOf("login") === -1) {
							this.$router.replace(decodeURIComponent(redirectPath.path));
						} else {
							this.$router.replace("/index");
						}
					}else{
						this.$router.replace("/index")
					}
				}else{
					this.login();
				}
			} */
		},
		watch: {
			'$route' (to,from) {
				this.timeStap = new Date().getTime()
			}
		}
	};
</script>
