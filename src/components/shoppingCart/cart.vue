<template>
	<div id="shoppingCartNull">
		<div>
			<div class="icon"></div>
			<p>购物车还是空的</p>
			<p>快去挑几件喜欢的衣服吧~</p>
			<div class="go-stroll" @click="nav">去逛逛</div>
		</div>
	</div>
</template>

<script>
	export default {
		methods: {
			nav() {
				this.$router.push({
					path: '/index'
				});
			}
		}
	}
</script>

<style scoped>
	#shoppingCartNull {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 90%;
		text-align: center;
		font-size: 16px;
		color: #333;
	}
	
	.icon {
		width: 165px;
		height: 107px;
		background: url(./cart.png) no-repeat center center;
		background-size: 165px 107px;
		margin-bottom: 25px;
	}
	
	#shoppingCartNull p:nth-of-type(2) {
		font-size: 13px;
		color: #999;
		margin-top: 10px;
		margin-bottom: 25px;
	}
	
	.go-stroll {
		width: 150px;
		height: 30px;
		font-size: 14px;
		color: #fff;
		line-height: 30px;
		border-radius: 6px;
		background: #ff9701;
	}
</style>