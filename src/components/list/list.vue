<template>
	<div id="list">
		<div class="clothes-container clearfloat">
			<div v-for="(item,index) in data" :key="index" @click="goDetail(item)">
				<div class="clothes-item">
					<div class="img-box">
						<img  v-lazy="item.picture_url" alt="" />
					</div>
					<p>{{item.goods_name}}</p>
					<p>￥{{item.price}}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			data: {
				type: Array,
				defalut: []
			}
		},
		data() {
			return {

			}
		},
		methods:{
			goDetail(item){
				this.$emit('nextRouter',item)
			}
		}
	}
</script>

<style scoped>
	.clothes-container{
		display: flex;
		flex-wrap: wrap; 
	}
	.clothes-container>div {
		flex: 0 0 50%;
		width: 50%;
		height: auto;
		box-sizing: border-box;
		font-size: 12px;
		color: #ff9701;
	}
	
	.clothes-container>div:nth-of-type(odd) {
		padding-right: 7px;
	}
	
	.clothes-container>div:nth-of-type(even) {
		padding-left: 7px;
	}
	
	.clothes-item {
		margin-bottom: 8px;
		padding-bottom: 8px;
		box-shadow: 1px 3px 5px 0px #eee;
	}
	
	.clothes-item p {
		margin: 0 7px;
	}
	
	.clothes-item p:nth-of-type(1) {
		color: #2d2d2d;
		margin: 6px 7px;
		font-size: 14px;
	}
</style>