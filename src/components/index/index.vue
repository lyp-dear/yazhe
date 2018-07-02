<template>

	<div id="index">
		<scroll ref="scroll" class="wrapper" :noData="isData" :data="list" :pullup="true" @scrollToEnd="getGoodList">
			<div>
				<div class="banner">
					<mt-swipe :auto="4000">
						<mt-swipe-item @click.native="bannerDetail(item)" v-for="(item,index) in bannerList" :key="index"><img  v-lazy="item.image" alt="" /></mt-swipe-item>
					</mt-swipe>
				</div>
				<div class="line"></div>
				<div class="customized">
					<router-link tag="div" :to="{path:'classifyList',query:{type:1}}">
						<div class="all-customized">
							<img src="./all.jpg" alt="" />
						</div>
					</router-link>
					<div class="semi-customized">
						<router-link tag="div" :to="{path:'classifyList',query:{type:0}}">
							<div class="semi-customized-top">
								<img src="./yifu1.jpg" alt="" />
							</div>
						</router-link>
						<div class="semi-customized-bot">
							<router-link tag="div" :to="{path:'classifyList',query:{type:2}}">
								<div>
									<img src="./yifu2.jpg" alt="" />
								</div>
							</router-link>
							<router-link tag="div" :to="{path:'classifyList',query:{type:3}}">

								<div>
									<img src="./yifu3.jpg" alt="" />
								</div>
							</router-link>
						</div>
					</div>
				</div>
				<div class="line"></div>
				<div class="clothes-list">
					<div class="title"><span>火爆热销</span></div>
					<div class="clothes-list-info">
						<list :data="list" @nextRouter="goDetail"></list>
						<div class="no-data" v-if="isData">别再拉了，我是有底线的</div>
					</div>
				</div>
			</div>

		</scroll>
		<router-view></router-view>

	</div>
</template>

<script>
	import { Indicator } from 'mint-ui';
	import List from 'components/list/list'
	import NoData from 'base/noData/noData'
	import Scroll from 'base/scroll/scroll'

	import { BannerList } from 'api/banner'
	import { GoodsList } from 'api/goods'
	import { ERR_CODE } from 'api/config'

	export default {
		data() {
			return {
				list: [],
				topStatus: '',
				allLoaded: false,
				loading: true,
				bannerList: [],

				currentPage: -1,
				isData: false,
				// ...
			};
		},
		methods: {
			getBannerList() {
				BannerList().then((res) => {

					if(res.data.code === ERR_CODE) {
						this.bannerList = res.data.data
					} else {
						ShowToast(res.data.msg)
					}
				}).catch((res) => {

				})
			},
			bannerDetail(item) {
				this.$router.push({
					name: `detail`,
					query: {
						id: item.link
					}
				})
			},

			getGoodList() {
				if(this.isData) {
					return;
				}
				this.currentPage++;
				GoodsList(this.currentPage).then((res) => {
					console.log(res)
					if(res.data.code === ERR_CODE) {
						if(res.data.data === null) {
							this.isData = true;
							return;
						}
						this.list = this.list.concat(res.data.data);
					}
				})
			},
			goDetail(val) {
				this.$router.push({
					name: `detail`,
					query: {
						id: val.goods_id
					}
				})
			},
		},
		created() {
			this.getBannerList();
			this.getGoodList();
		},
		components: {
			List,
			NoData,
			Scroll
		},
	};
</script>

<style scoped>
	#index {
		position: fixed;
		width: 100%;
		top: 0;
		bottom: 56px;
	}
	
	.wrapper {
		height: 100%;
		overflow: hidden;
	}
	
	.clothes-list-info {
		padding: 10px 15px;
	}
	
	.banner {
		height: 200px;
	}
	
	.banner img {
		object-fit: cover;
	}
	
	.customized {
		display: flex;
		background: #f5f5f5;
	}
	
	.all-customized {
		flex: 0 0 140px;
		width: 140px;
		height: 225px;
		margin: 0 8px 0 11px;
	}
	
	.all-customized img {
		width: 100%;
		height: 100%;
	}
	
	.all-customized p:nth-of-type(1) {
		font-size: 15px;
		color: #2d2d2d;
		margin-bottom: 10px;
	}
	
	.all-customized p:nth-of-type(3) {
		width: 92px;
		height: 133px;
		margin: 8px auto 0 auto;
	}
	
	.semi-customized {
		flex: 1;
		margin-right: 11px;
	}
	
	.semi-customized-top {
		width: 100%;
		height: 106px;
	}
	.semi-customized-top img,.semi-customized-bot img{
		height: 100%;
	}
	.semi-customized-bot {
		display: flex;
		font-size: 13px;
		text-align: center;
		margin-top: 12px;
	}
	
	.semi-customized-bot>div {
		flex: 1;
		height: 110px;
	}
	
	.semi-customized-bot>div:nth-of-type(1) {
		margin-right: 8px;
	}
	
	.title {
		height: 42px;
		line-height: 42px;
		font-size: 14px;
		text-align: center;
		border-bottom: 1px solid #e1e1e1;
	}
	
	.title span {
		position: relative;
	}
	
	.title span:after {
		content: "";
		position: absolute;
		width: 20px;
		height: 1px;
		background: #333;
		top: 50%;
		right: -30px;
	}
	
	.title span:before {
		content: "";
		position: absolute;
		width: 20px;
		height: 1px;
		background: #333;
		top: 50%;
		left: -30px;
	}
</style>