<template>
	<div>
		<div class="no-data" v-if="isData">别再拉了，我是有底线的</div>
		<div class="mint-loadmore-bottom" v-if="noLoading">
			<span v-show="isStatus !== 'loading'" :class="{ 'is-rotate': isStatus === 'drop' }">↑</span>
			<span v-show="isStatus === 'loading'">
				 <mt-spinner type="snake" :size="20"></mt-spinner>
			</span>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			status: {
				type: String,
				default: ''
			},
			isData: {
				type: Boolean,
				default: false,
			},
			noLoading: {
				type: Boolean,
				default: true,
			}
		},
		data() {
			return {
				isStatus: '',
			}
		},
		watch: {
			status(val) {


				console.log(val);
				this.isStatus = val;
			}
		}
	}
</script>

<style scoped>
	.mint-loadmore-bottom span {
		display: inline-block;
		transition: .2s linear;
		vertical-align: middle
	}
	
	.mint-loadmore-bottom span.is-rotate {
		-webkit-transform: rotate(180deg);
		transform: rotate(180deg);
	}
	
	.no-data {
		color: #999;
		text-align: center;
		line-height: 40px;
	}
</style>