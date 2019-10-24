/*
* createTime：2019/7/15
* author：en.chen
* description:  商品未上架
*/
<template>
	<div class="off-shelves-page">
		<div class="content">
			<div class="off-shelves-img">
				<img v-lazy="offShelvesImg" alt="商品未上架">
			</div>
			<p class="tip">抱歉，该商品还未上架</p>
		</div>
		<div class="btn-group">
			<div class="back-btn btn" @click="back">上一页 (<span>{{time}}s</span>)</div>
			<div class="index-btn btn" @click="toIndex">回到首页</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				offShelvesImg: require('../../assets/images/goods/off-shelves.png'),  // 灾备图片
				time: 3,  //倒计时时间
				timer: null  //倒计时定时器
			}
		},
		created() {
		},
		mounted() {
			this.navBack()
		},
		methods: {

			// 返回倒计时
			navBack() {
				this.timer = window.setInterval(() => {
					if (--this.time <= 0) {
						window.clearInterval(this.timer)
						// 定制商品页面跳过来的要回退两页
						if (this.$route.query.page === 'web-design') {
							this.$router.go(-2)
						} else {

							console.log('页面历史记录数量',window.history.length)

							if(window.history.length <= 1) {
								// 未上架页面作为唯一路由
								this.$router.replace('/index')
							}else{
								console.log('返回上一页')
								this.$router.go(-1)
							}
						}
					}
				}, 1000)
			},

			// 返回上一页
			back() {
				if (this.timer) window.clearInterval(this.timer)
				// 定制商品页面跳过来的要回退两页
				if (this.$route.query.page === 'web-design') {
					this.$router.go(-2)
				} else {
					if(window.history.length <= 1) {
						// 未上架页面作为唯一路由
						this.$router.replace('/index')
					}else{
						console.log('返回上一页')
						this.$router.go(-1)
					}
				}
			},

			// 返回首页
			toIndex() {
				if (this.timer) window.clearInterval(this.timer)
				this.$router.replace('/index')
			}
		},
		beforeDestroy() {
			if (this.timer) window.clearInterval(this.timer)
		}
	}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/scss" lang="scss" scoped>
	.off-shelves-page {
		position: relative;
		overflow: hidden;
		.content{
			overflow: hidden;
			.off-shelves-img{
				width: computed(202);
				height: computed(162);
				margin: computed(143) auto computed(75) auto;
				img{
					display: block;
					width: 100%;
					height: 100%;
				}
			}
			.tip{
				font-size: computed(32);
				line-height: computed(36);
				color: #999999;
				text-align: center;
			}
		}
		.btn-group{
			margin-top: computed(85);
			overflow: hidden;
			display: flex;
			justify-content: center;
			align-items: center;
			.btn{
				width: computed(200);
				height: computed(100);
				font-size: computed(32);
				line-height: computed(100);
				text-align: center;
				color: #ffffff;
				overflow: hidden;
			}
			.back-btn{
				background: #808080;
			}
			.index-btn{
				margin-left: computed(30);
				background: #2BA4F3;
			}
		}
	}
</style>
