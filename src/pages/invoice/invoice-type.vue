/*
* createTime：2018/8/13
* author：en.chen
* description:  发票类型选择
*/
<template>
	<div class="invoice-type">
		<div class="invoice-type-container">
			<!--发票类型选择 begin-->
			<div class="invoice-wrapper">
				<label>发票类型</label>
				<ul>
					<li v-for="(item,index) in invoiceList" :key="index">
						<span class="select-box" :class="{'checked' : invoiceType === item.dictCode}"></span>
						<input
								class="radioInput"
								type="radio"
								:value="item.dictCode"
								v-model="invoiceType"
						/>
						<p>{{item.dictName}}</p>
					</li>
				</ul>
			</div>
			<!--发票类型选择 end-->

			<!--发票抬头选择 begin-->
			<div class="invoice-wrapper">
				<label>发票抬头</label>
				<ul>
					<li v-for="(item,index) in invoiceTitleList" :key="index">
						<span class="select-box" :class="{'checked' : invoiceTitle === item.dictCode}"></span>
						<input class="radioInput"
							   type="radio"
							   :value="item.dictCode"
							   v-model="invoiceTitle"/>
						<p>{{item.dictName}}</p>
					</li>
				</ul>
			</div>
			<!--发票抬头选择 end-->
		</div>

		<!--发票内容 begin-->
		<div class="invoice-content">
			<!--发票抬头-公司 begin-->
			<ul class="company-title" v-if="invoiceTitle === 'D_INVTITLETYPE2'">
				<li>
					<div class="title">
						公司名称<span class="tip">*</span>
					</div>
					<div class="input-box">
						<input type="text"
							   placeholder="请输入公司名称"
							   v-model="companyName"
							   @focus="isKeyBoardHide = false"
							   @blur="isKeyBoardHide = true"
							   maxlength="20"
							   v-inputfix/>
						<!--<i class="iconfont icon-shanchuguanbi" @click="companyName = ''"></i>-->
					</div>
				</li>
				<li>
					<p class="title">
						纳税识别号
						<span class="tip">*</span>
					</p>
					<div class="input-box">
						<input type="text"
							   placeholder="请输入纳税人识别号"
							   v-model="taxpayerNum"
							   @focus="isKeyBoardHide = false"
							   @blur="isKeyBoardHide = true"
							   v-inputfix/>
						<!--<i class="iconfont icon-shanchuguanbi" @click="taxpayerNum = ''"></i>-->
					</div>
				</li>
			</ul>
			<!--发票抬头-公司 end-->

			<!--发票类型-纸质 begin-->
			<div class="address-box" v-if="invoiceType === 'D_INVOICE_COMMON'">
				<div class="address-title">
					<p class="fl">收货地址</p>
					<p @click="addAddress" class="add-btn">新增收货地址</p>
				</div>
				<ul class="address-list">
					<li v-for="(item,index) in addressList" :key="index">
						<div class="address-btn-box">
							<span class="select-box" :class="{ 'checked' : item.id === addrVal}"></span>
							<input
									class="radioInput"
									name="address-info"
									type="radio"
									:value="item.id"
									v-model="addrVal"
							/>
						</div>
						<div class="address-info">
							<div class="address-header">
								<span class="user-name">{{item.cargousrName}}</span>
								<span class="user-phone">{{item.cargoPhone}}</span>
							</div>
							<div class="address-msg">
								<span class="default-address" v-if="item.defaultFlag === 1">[默认地址]</span>
								{{item.destDesc +
								item.address}}
							</div>
						</div>
					</li>
				</ul>
			</div>
			<!--发票类型-纸质 end-->
		</div>
		<!--发票内容 end-->

		<!--底部按钮 begin-->
		<div class="common-bottom-btn" @click="putInvoice" v-show="isKeyBoardHide">
			<p class="btn-txt">提交</p>
		</div>
		<!--底部按钮 end-->
	</div>
</template>
<script>
	import Storage from "../../util/storage";
	import {UserService, Invoice} from "@/api/service";
	import {Toast} from "vant";

	export default {
		data() {
			return {
				fromPage: "",
				storageData: {},
				invoiceList: [], // 发票类型
				invoiceTitleList: [], //发票抬头
				invoiceType: "",
				invoiceTitle: "",
				companyName: "",
				taxpayerNum: "",
				addressList: [],
				addrVal: "",
				btnLock: false,
				isKeyBoardHide: true
			};
		},
		methods: {
			//  获取发票类型
			getInvoiceType() {
				let data = {
					type: "D_INVOICETYPE"
				};
				Invoice.getInvoiceType(data).then(res => {
					this.invoiceList = res;
				});
			},

			//  获取发票抬头
			getInvoiceTitleType() {
				let data = {
					type: "D_INVTITLETYPE"
				};
				Invoice.getInvoiceType(data).then(res => {
					this.invoiceTitleList = res;
				});
			},

			//  获取收货地址列表
			getAddrList() {
				let data = {
					vipUsrId: Storage.get("USER_INFO").usrId,
					pageNum: 1
				};
				UserService.getAddrList(data).then(
					res => {
						this.addressList = res.list;
					},
					err => {
					}
				);
			},

			//  提交发票申请
			putInvoice() {
				if (!!this.btnLock) return;
				this.btnLock = true;
				if (!this.invoiceType || !this.invoiceTitle) {
					Toast("请先完善开票信息~");
					this.btnLock = false;
					return;
				}
				let data = {
					ctmUsrId: Storage.get("USER_INFO").usrId,
					cookieId: Storage.get("USER_INFO").usrId,
					invoiceTypeCode: this.invoiceType,
					invoiceTitle: this.invoiceTitle
				};
				//  判断发票类型
				if (this.invoiceType === "D_INVOICE_ELC") {
					//  类型为电子发票
					if (this.invoiceTitle === "D_INVTITLETYPE1") {
						//  个人电子发票参数不变
					} else if (this.invoiceTitle === "D_INVTITLETYPE2") {
						//  公司电子发票必填公司名称、纳税识别号
						if (!this.companyName || !this.taxpayerNum) {
							this.btnLock = false;
							Toast("请完善开票信息~");
							return;
						} else {
							//  提交参数修改
							data.invoiceCompany = this.companyName;
							data.invoiceTaxAlias = this.taxpayerNum;
						}
					}
				} else if (this.invoiceType === "D_INVOICE_COMMON") {
					//  类型为纸质发票
					if (this.invoiceTitle === "D_INVTITLETYPE1") {
						//  个人纸质发票必填收货地址
						if (this.addrVal === "") {
							Toast("请完善开票信息");
							this.btnLock = false;
							return;
						} else {
							//  选中的地址区code作为提交参数
							this.addressList.forEach(item => {
								if (item.id === this.addrVal) {
									data.invoiceAddrId = item.id;
								}
							});
						}
					} else if (this.invoiceTitle === "D_INVTITLETYPE2") {
						//  公司电子发票必填公司名称、纳税识别号、收货地址
						if (
							!this.companyName ||
							!this.taxpayerNum ||
							!this.addrVal
						) {
							Toast("请完善开票信息~");
							this.btnLock = false;
							return;
						} else {
							//  选中的地址区code作为提交参数
							this.addressList.forEach(item => {
								if (item.id === this.addrVal) {
									data.invoiceAddrId = item.id;
								}
							});
							//  提交参数修改
							data.invoiceCompany = this.companyName;
							data.invoiceTaxAlias = this.taxpayerNum;
						}
					}
				}
				console.log("putData", data);

				//  判断纳税识别号
				if (!!data.invoiceTaxAlias) {
					if (data.invoiceTaxAlias.length < 6) {
						Toast("请填写正确的纳税识别号~");
						this.btnLock = false;
						return;
					}
				}

				//  判断来源页面
				if (this.fromPage === "settlement") {
					//  储存信息并返回订单结算页面
					let invoiceData = {};
					this.invoiceList.forEach(item => {
						if (item.dictCode === this.invoiceType) {
							invoiceData.type = item.dictName;
						}
					});
					this.invoiceTitleList.forEach(item => {
						if (item.dictCode === this.invoiceTitle) {
							invoiceData.title = item.dictName;
						}
					});
					invoiceData.data = data;
					this.btnLock = false;
					console.log(invoiceData);
					Storage.set("invoiceData", invoiceData);
					window.history.go(-1);
				} else {
					let billCode = this.$route.query.billCode;
					let params = Object.assign(data, {
						billCode: billCode
					});

					Invoice.putInvoice(params).then(
						invoice => {
							console.log("invoice", invoice);
							Toast("发票提交成功");
							setTimeout(() => {
								this.btnLock = false;
								this.$router.go(-1);
							}, 1000);
						},
						err => {
							Toast("发票提交失败");
							this.btnLock = false;
						}
					);
				}
			},

			//  获取缓存
			getPage() {
				this.storageData = Storage.get("invoiceData") || {};
				if (this.storageData.type) {
					this.invoiceType = this.storageData.data.invoiceTypeCode;
					this.invoiceTitle = this.storageData.data.invoiceTitle;
					this.addrVal = this.storageData.data.invoiceAddrId || "";
					this.companyName = this.storageData.data.invoiceCompany || "";
					this.taxpayerNum = this.storageData.data.invoiceTaxAlias || "";
				}
			},

			// 新增收货地址
			addAddress() {
				let data = {
					ctmUsrId: Storage.get("USER_INFO").usrId,
					cookieId: Storage.get("USER_INFO").usrId,
					invoiceTypeCode: this.invoiceType,
					invoiceTitle: this.invoiceTitle
				}
				let invoiceData = {};
				this.invoiceList.forEach(item => {
					if (item.dictCode === this.invoiceType) {
						invoiceData.type = item.dictName;
					}
				});
				this.invoiceTitleList.forEach(item => {
					if (item.dictCode === this.invoiceTitle) {
						invoiceData.title = item.dictName;
					}
				});
				invoiceData.data = data;
				Storage.set("invoiceData", invoiceData)
				this.$router.push('/address-detail?fromPage=invoice')
			}
		},
		created() {
			this.getInvoiceType();
			this.getInvoiceTitleType();
			this.getAddrList();
		},
		mounted() {
			this.fromPage = this.$route.query.fromPage || "";
			this.getPage();
		},
		watch: {
			//  纳税识别号数字和英文的正则过滤
			taxpayerNum: function () {
				this.taxpayerNum = this.taxpayerNum.replace(/[\W]/g, "");
				if (this.taxpayerNum.length > 20)
					this.taxpayerNum = this.taxpayerNum.slice(0, 20);
			}
		}
	};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="text/scss">
	.invoice-type {
		position: relative;
		background-color: #EDF0F7;
		height: 100%;

		.invoice-type-container{
			width: 100%;
			background-color: white;
			margin-bottom: computed(10);

			.invoice-wrapper {
				display: flex;
				font-size: computed(32);
				height: computed(86);
				line-height: computed(86);
				color: #333333;
				margin: 0 computed(30);
				border-bottom: 1px solid rgba(204, 204, 204, 0.30);

				&:last-child{
					border-bottom: none;
				}

				label {
					width: computed(200);
					color: #999999;
				}

				ul {
					position: relative;

					li {
						float: left;
						width: computed(200);
						margin-right: computed(30);
						position: relative;

						.select-box {
							display: block;
							box-sizing: border-box;
							margin-right: computed(20);
							width: computed(30);
							height: computed(30);
							position: relative;
							top: computed(30);
							border: 1px solid #2ba4f3;
							font-size: computed(30);
							line-height: computed(30);
							float: left;
						}

						.checked::after {
							position: absolute;
							content: "";
							width: computed(16);
							height: computed(16);
							left: 50%;
							top: 50%;
							background: #2ba4f3;
							overflow: hidden;
							transform: translate(-50%, -50%);
						}

						.radioInput {
							position: absolute;
							width: computed(32);
							height: computed(32);
							top: 0;
							left: 0;
							opacity: 0;
						}
					}
					li::after {
						content: "";
						clear: both;
						display: table;
					}
				}
				ul::after {
					content: "";
					display: table;
					clear: both;
				}
			}
		}

		.invoice-content {
			background-color: #EEF1F7;

			.company-title {
				margin-bottom: computed(10);
				background-color: white;
				li {
					position: relative;
					height:computed(86);
					display: flex;
					flex-direction: row;
					align-items: center;
					padding: 0;
					margin: 0 computed(30);
					border-bottom: 1px solid rgba(204, 204, 204, 0.30);
					&:last-child{
						border-bottom: none;
					}

					.title {
						width: computed(200);
						font-size: computed(32);
						line-height: computed(34);
						color: #999999;

						.tip {
							margin-left: computed(5);
							font-size: computed(20);
							color: #d80000;
						}
					}
					.input-box {
						flex: 1;
						position: relative;

						input {
							box-sizing: border-box;
							display: block;
							width: 100%;
							height: computed(70);
							padding: 0 computed(16);
							border: none;
							font-size: computed(30);
							line-height: computed(70);
							color: #666666;
							/* 解决ios版微信浏览器的边框和阴影*/
							border-radius: 0;
							box-shadow: 0 0 0 rgba(0, 0, 0, 0);
							-webkit-appearance: none;
							&::-webkit-input-placeholder{ /*WebKit browsers*/
								color: #CCCCCC
							}
							&::-moz-input-placeholder{ /*Mozilla Firefox*/
								color: #CCCCCC
							}
							&::-ms-input-placeholder{ /*Internet Explorer*/
								color: #CCCCCC
							}
						}

						i {
							font-size: computed(30);
							line-height: computed(30);
							color: #999999;
							position: absolute;
							right: computed(30);
							top: computed(20);
						}
					}
				}
			}
			.address-box {
				background-color: white;
				padding: computed(30) computed(30) computed(120) computed(30);

				.address-title {
					font-size: computed(32);
					line-height: computed(34);
					color: #999999;
					&::after {
						content: "";
						display: table;
						clear: both;
					}
					.add-btn {
						float: right;
						font-size: computed(28);
						color: #2ba4f3;
						text-decoration: underline;
					}
				}
				.address-list li {
					display: flex;
					margin-top: computed(50);

					.address-btn-box {
						width: computed(30);
						margin-right: computed(30);
						position: relative;
						top: computed(4);
					}

					.address-info {
						width: 100%;
					}

					.select-box {
						display: block;
						box-sizing: border-box;
						margin-right: computed(20);
						width: computed(28);
						height: computed(28);
						position: relative;
						border: 1px solid #2ba4f3;
						font-size: computed(30);
						line-height: computed(30);
					}

					.checked::after {
						position: absolute;
						content: "";
						width: computed(16);
						height: computed(16);
						left: 50%;
						top: 50%;
						background: #2ba4f3;
						overflow: hidden;
						transform: translate(-50%, -50%);
					}

					.radioInput {
						position: absolute;
						width: computed(32);
						height: computed(32);
						top: 0;
						left: 0;
						opacity: 0;
					}

					.address-header {
						padding-bottom: computed(24);
						font-size: computed(30);
						line-height: computed(32);
						color: #000;
					}

					.address-header::after {
						content: "";
						clear: both;
						display: table;
					}

					.user-name {
						float: left;
						overflow: hidden;
						font-weight: bold;
					}

					.user-phone {
						margin-left: computed(50);
						float: left;
						font-weight: bold;
					}

					.default-address {
						color: #d80000;
						margin-right: computed(10);
					}

					.address-msg {
						font-size: computed(28);
						line-height: computed(40);
					}
				}
			}
		}
		.common-bottom-btn{
			height:computed(100) !important;
			p {
				margin: 0 !important;
			}
		}
	}
</style>
