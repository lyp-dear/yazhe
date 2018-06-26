<template>
	<div id="classifyList">

		<mt-navbar v-model="selected" @click.native="changeType">
			<mt-tab-item id="1">全定制</mt-tab-item>
			<mt-tab-item id="0">成衣&半定制</mt-tab-item>
			<mt-tab-item id="2">居家生活</mt-tab-item>
			<mt-tab-item id="3">特惠</mt-tab-item>
		</mt-navbar>
		<p class="no-data" v-show="!classfyList.length" style="line-height: 30px; text-align: center;">暂无数据 ...</p>
		<div class="goods">
			<scroll class="order-content" :data="classfyList">
				<div class="menu-wrapper">
					<ul>
						<li v-for="(item, index) in classfyList" :key="index" :class="{'active': index == activeIndex}" @click="nav(item,index)"> {{item.title}}</li>
					</ul>
				</div>
			</scroll>

			<div class="foods-wrapper">
				<scroll ref="scroll" class="wrapper" :data="list" :pullup="true" @scrollToEnd="loadJacketBottom">
					<div class="content">
						<div class="tab-container" v-for="(item,index) in classfyList" :key="index" v-show="index == selected">
							<list :data="list" @nextRouter="goDetail"></list>
							<div class="no-data" v-if="isData">别再拉了，我是有底线的</div>
						</div>
					</div>
				</scroll>
			</div>

		</div>
	</div>
</template>

<script>
	import { ClassfyList, GoodsList } from 'api/classfy'
	import { ERR_CODE } from 'api/config'
	import List from 'components/list/list'
	import NoData from 'base/noData/noData'
	import Scroll from 'base/scroll/scroll'
	import Tab from 'base/tab/tab'
	import TabItem from 'base/tab/tab-item'

	export default {
		data() {
			return {
				selected: "1",
				activeIndex: 0,

				classfyList: [],
				cagegory_id: '',
				type: '',

				jacketPage: 0,
				jacketAllLoaded: false,
				jacketLoading: true,
				jacketTopStatus: '',
				list: [],

				isData: false,

			}
		},
		methods: {
			changeType() {
				this.type = this.selected;
				this.jacketPage = 0;
				this.list = [];
				this.isData = false;
				this.getClassfyList();
			},
			getClassfyList() {
				let options = {
					type: Number(this.selected),
					pageSize: 100,
					currentPage: 0
				}
				ClassfyList(options).then(res => {
					if(res.data.code === ERR_CODE) {
						this.classfyList = res.data.data;
						if(res.data.data.length === 0)return;
						this.cagegory_id = res.data.data[0].cagegory_id;
						this.getJacket();
					}
				})
			},

			loadJacketBottom() {
				if(this.isData) {
					return;
				}
				this.jacketPage++;
				this.getJacket();
			},
			jacketTopChange(status) {
				this.jacketTopStatus = status;
			},
			getJacket() {
				let options = {
					pageSize: 10,
					currentPage: this.jacketPage,
					category_id: this.cagegory_id
				}
				if(this.type != '' && this.type != null) {
					options.type = this.type;
				}
				GoodsList(options).then(res => {
					if(res.data.code === ERR_CODE) {
						if(res.data.data === null) {
							this.isData = true;
							return;
						}
						this.list = this.list.concat(res.data.data);
					}
				})
			},

			nav(item, index) {
				this.cagegory_id = item.cagegory_id;
				this.jacketPage = 0;
				this.list = [];
				this.isData = false;
				this.activeIndex = index;
				this.getJacket();
			},
			goDetail(val) {
				this.$router.push({
					name: `detail`,
					query: {
						id: val.goods_id
					}
				})
			}
		},
		created() {
			if(this.$route.query.type != undefined){
			this.selected = this.$route.query.type + '';
			}else{
				this.selected = '1';
			}

			this.changeType();
		},
		mounted() {
		},
		components: {
			List,
			NoData,
			Scroll,
			TabItem,
			Tab

		}
	}
</script>

<style scoped>
	#classifyList {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
	}
	
	
	.goods {
		display: flex;
		position: absolute;
		top: 50px;
		bottom: 55px;
		width: 100%;
		overflow: hidden;
	}
	
	.menu-wrapper {
		flex: 0 0 90px;
		width: 90px;
		border-right: 1px solid #e1e1e1;
	}
	
	.menu-wrapper li {
		display: table;
		height: 50px;
		width: 100%;
		text-align: center;
		color: #999;
		font-size: 13px;
		line-height: 50px;
		border-left: 3px solid #fff;
		box-sizing: border-box;
	}
	
	.menu-wrapper li.active {
		color: #333;
		border-left: 3px solid #ff9701;
	}
	
	.foods-wrapper {
		flex: 1;
	}
	
	.tab-container {
		padding: 10px 15px 30px 15px;
	}
	
	.wrapper {
		height: 100%;
		overflow: hidden;
	}
	
	.clothes-list-info {
		padding: 10px 15px;
	}
</style>