/*
 * @Author: yongtian.hong
 * @Date: 2018-08-07 17:43:39
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-08-07 17:44:18
 * @Description: 步骤条组件
 */

<style lang='scss' scoped>
.steps {
	display: flex;
	flex-direction: column;
	padding: computed(30);
	// margin: computed(30) 0;
	font-size: computed(24);
	font-family: 'PingFang SC';
	.step {
		flex: 1;
		display: flex;
		width: 100%;

		.step-time,
		.step-line {
			display: flex;
			flex-wrap: nowrap;
		}
		.step-time {
			width: 15%;
			text-align: center;
			padding: 0 computed(5);
			margin-bottom: computed(20);
		}
		.step-line {
			width: 5%;
			position: relative;
			.step-text {
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				left: 0%;
				right: 0;
				top: 0%;
				bottom: 0;
				z-index: 10;
				// transform: translateX(50%);
				width: computed(32);
				height: computed(32);
				border-radius: 50%;
				font-size: computed(20);
				color: #fff;
				background-color: #069a09;
			}
			.line {
				position: absolute;
				top: 0;
				left: 50%;
				margin-left: -5%;
				right: 0;
				bottom: 0;
				width: 1px;
				height: 100%;
				background-color: #cccccc;
			}
			.step-dot {
				position: absolute;
				left: 20%;
				right: 0;
				top: 0;
				bottom: 0;
				z-index: 10;
				width: computed(20);
				height: computed(20);
				border-radius: 50%;
				background-color: #cccccc;
			}
		}
		.step-content {
			width: 80%;
			line-height: 1.2;
			padding: 0 computed(10);
			margin-bottom: computed(10);
		}
		.finish {
			color: #069a09;
			.step-text {
				top: 0% !important;
			}
			.step-line {
				top: 10% !important;
				height: 90% !important;
			}
		}
		.start {
			color: #069a09;

			.step-line {
				top: 10% !important;
				height: 90% !important;
			}
		}
	}
}
</style>

<template>
	<div class="steps">
		<div class="step">
			<div class="step-time">18:00 08-08</div>
			<div class="step-line finish">
				<div class="line"></div>
				<div class="step-text">收</div>
			</div>
			<div class="step-content">
				[厦门市] 已签收，签收人是吴女士，若没有收到请联系9588600,感谢使用顺丰快递，期待为您再次服务.
			</div>
		</div>
		<div class="step finish">
			<div class="step-time">18:00 08-08</div>
			<div class="step-line ">
				<div class="line"></div>
				<div class="step-text">派</div>
			</div>
			<div class="step-content">
				您的快件由隔壁老王派送中。。
			</div>
		</div>
		<div class="step start">
			<div class="step-time">18:00 08-08</div>
			<div class="step-line">
				<div class="step-dot"></div>
			</div>
			<div class="step-content">
				商家正在打包出库
			</div>
		</div>

	</div>
</template>

<script>

export default {
	name: 'Steps',
	data() {
		return {}
	}
}
</script>