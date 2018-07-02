<template>
	<transition name="slide">
		<div id="detail">
			<div v-transfer-dom>
				<previewer :list="imgList" ref="previewer" :options="options" @on-index-change="logIndexChange"></previewer>
			</div>
			<scroll class="detail-content">
				<div>
					<div class="banner">
						<mt-swipe :auto="4000">
							<mt-swipe-item v-for="(item,index) in detail.goodsAlbum" :key="index"><img  v-lazy="item.image_url" alt="" /></mt-swipe-item>
						</mt-swipe>
					</div>

					<div class="describe">
						<p>{{detail.goods_name}}</p>
						<p v-if="detail.vip_price != null"><span class="vip">￥{{detail.vip_price}}</span> <span>原价￥{{detail.price}}</span> <span>市场参考价￥{{detail.market_price}}</span></p>
						<p v-if="detail.vip_price == null"><span>￥{{detail.price}}</span><span>原价￥{{detail.price}}</span> <span>市场参考价￥{{detail.market_price}}</span></p>
					</div>
					<!--<div class="color-size">
					<mt-cell title="选择颜色尺码" is-link>
					</mt-cell>
				</div>-->
					<div class="line"></div>

					<div class="detail-text" id="detail-text" v-html="detail.remark" ref="detailImg" @click="show($event)"></div>

				</div>
			</scroll>

			<div class="flex-bottom">
				<div @click="routerCar">
					<div class="icon">
						<img src="./cart.png" />
						<span>{{count}}</span>
					</div>
				</div>
				<div @click="custom">立即定制</div>
				<div @click="addCart">加入购物车</div>
			</div>
			<mt-popup v-model="popupVisible" position="top" class="custom-popup">
				<custom @close="isPopupVisible" :data="detail" @add="getCustomization" ref="custom"></custom>
			</mt-popup>

			<mt-popup v-model="popupCart" position="bottom" class="cart-popup">
				<div class="cart-content">
					<div class="cart-top">
						<div class="goods-img"><img :src="cItem.picture||''" alt="" /></div>
						<div class="goods-info">
							<p>￥{{cItem.price||'请选择'}}</p>
							<p>商品编号: {{cItem.goods_id||'请选择'}}</p>
							<p>{{cItem.value||'--'}}{{cItem.price||'请选择'}}</p>
						</div>
						<div class="goods-close" @click="closeCart"></div>
					</div>
					<div class="color-content">
						<div class="color-title">颜色分类</div>
						<div class="color-info">
							<div :class="{'active': index === cIndex}" v-for="(item,index) in detail.goodsAndAttribute" @click="optionsSize(item,index)" :key="index">{{item.value}} + {{item.price}}</div>
						</div>
					</div>
				</div>
				<div class="cart-btn" @click="goCart(true)">加入购物车</div>
			</mt-popup>
		</div>
	</transition>

</template>

<script>
	import wx from 'weixin-js-sdk'
	import { ERR_CODE } from 'api/config'
	import { Detail } from 'api/detail'
	import { AddCart, CartNumber } from 'api/cart'
	import { ShowToast } from 'common/js/loading-toast'
	import { UserInfo } from 'common/js/common'
	import { GetUserInfo } from 'api/login'
	import { getQueryString, GetQueryString } from 'common/js/common'
	import Custom from 'components/detail/Custom'
	import Scroll from 'base/scroll/scroll'
	import { Previewer, TransferDom } from 'vux'
	export default {
		directives: {
			TransferDom
		},
		data() {
			return {
				slide1: [],
				popupVisible: false,
				popupCart: false,
				detail: {},
				userInfo: {},
				count: 0,

				sizeId: '',
				customization: [],
				fabricNumber: '',

				goodsId: '',
				cIndex: 0,
				cItem: {},

				imgList: [],
				options: {
					getThumbBoundsFn(index) {
						// find thumbnail element
						let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
						// get window scroll Y
						let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
						// optionally get horizontal scroll
						// get position of element relative to viewport
						let rect = thumbnail.getBoundingClientRect()
						// w = width
						return {
							x: rect.left,
							y: rect.top + pageYScroll,
							w: rect.width
						}
						// Good guide on how to get element coordinates:
						// http://javascript.info/tutorial/coordinates
					}
				}
			}
		},
		methods: {
			logIndexChange(arg) {
			},
			show(e) {
				this.imgList.map((item,index) =>{
					if(item.src === e.target.getAttribute('src')){
						this.$refs.previewer.show(index)
						
					}
				})
			},
			getDetail() {
				if(this.goodsId === null) {
					this.$router.push({
						path: '/index'
					});
					return;
				}
				Detail(this.goodsId, this.userInfo.openId).then(res => {
					if(res.data.code === ERR_CODE) {
						this.detail = res.data.data;
						this.cItem = res.data.data.goodsAndAttribute[0];
						this.$nextTick(_ => {
							let data = this.$refs.detailImg.getElementsByTagName('img');
							Array.from(data).map((item, index) => {
								item.setAttribute('class', 'previewer-demo-img')
								let obj = {
									msrc: item.getAttribute('src'),
									src: item.getAttribute('src')
								}
								this.imgList.push(obj)
							})
						})
					}
				})
			},
			clickImg(e) {},
			getCartNumber() {
				let options = {
					openId: this.userInfo.openId,
				}
				CartNumber(options).then(res => {
					if(res.data.code === ERR_CODE) {
						this.$refs.custom.getMySize();
						this.count = res.data.data;
					}
				})
			},
			routerCar() {
				this.$router.push({
					path: '/shoppingCart'
				});
			},
			addCart() {
				this.popupCart = true;
			},
			goCart(isGood) {
				if(!this.cItem.goods_id && isGood) {
					ShowToast('请选择规格颜色');
					return;
				}
				let options = {
					goods_id: this.detail.goods_id,
					openId: this.userInfo.openId,
					num: 1,
					customization: this.customization,
					sizeId: this.sizeId,
					fabricNumber: this.fabricNumber,
					attribute: `${this.cItem.id}`

				};
				if(this.customization.length === 0) {
					options.customization = '';
				}
				if(this.sizeId === '') {
					options.sizeId = '';
				}
				AddCart(options).then(res => {
					if(res.data.code === ERR_CODE) {
						ShowToast('添加成功');
						this.count++;
					}
				})
			},
			closeCart() {
				this.popupCart = false;
			},
			optionsSize(item, index) {
				this.cIndex = index;
				this.cItem = item;
			},
			custom() {
				if(this.detail.goodsCustomized.length === 0) {
					ShowToast('此商品暂未添加定制内容');
					return;
				}
				this.popupVisible = true;
			},
			getCustomization(val) {
				this.sizeId = val[1];
				this.customization = val[0];
				this.fabricNumber = val[2];
				this.popupVisible = false;
				this.goCart(false);

			},
			isPopupVisible(val) {
				this.popupVisible = val;
			}
		},
		created() {
			this.goodsId = GetQueryString('id');
		},
		mounted() {
			this.userInfo = UserInfo();
			if(this.userInfo.openId === undefined) {
				this.userInfo = {};
				this.userInfo.openId = GetQueryString('openId');
				if(this.userInfo.openId == null) {
					window.location.href = 'http://www.argesz.com/yazhe/common/author?type=1';
					return;

				}
				GetUserInfo(this.userInfo.openId).then((res) => {
					if(res.data.code === ERR_CODE) {
						let data = res.data.data;
						data = JSON.stringify(data);
						sessionStorage.setItem('userInfo', data)
						this.userInfo = UserInfo();
						this.getDetail();
						this.getCartNumber();

					}
				})
				return;
			}
			this.$refs.custom.getMySize();
			this.getDetail();
			this.getCartNumber();
		},
		components: {
			Custom,
			Scroll,
			Previewer
		},
		watch: {
			$route(val) {
				if(val.name === 'detail') {
					this.getDetail();
					this.getCartNumber();
				}
			}
		},
	}
</script>

<style scoped>
	#detail {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background: #fff;
		z-index: 999999;
		overflow: auto;
	}
	
	#detail {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background: #fff;
		z-index: 3;
	}
	
	.detail-content {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
	}
	
	.banner {
		width: 100%;
		height: 300px;
	}
	
	.banner img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	
	.describe {
		padding: 10px 15px;
		border-bottom: 1px solid #e1e1e1;
		font-size: 18px;
		color: #333;
	}
	
	.describe p:nth-of-type(1) {
		line-height: 24px;
	}
	
	.describe>p:nth-of-type(2) {
		margin-top: 14px;
		font-size: 20px;
		color: #ff9701;
	}
	
	.describe>p:nth-of-type(2) span {
		display: inline-block;
		position: relative;
	}
	
	.describe>p:nth-of-type(2) span.vip {
		margin-right: 30px;
	}
	
	.describe>p:nth-of-type(2) span.vip:nth-of-type(1):after {
		content: '';
		width: 27px;
		height: 10px;
		background: url(./vip-icon.png) no-repeat center center;
		position: absolute;
		right: -30px;
		top: -3px;
		background-size: 27px 10px;
	}
	
	.describe>p:nth-of-type(2) span:nth-of-type(2) {
		color: #666;
		font-size: 7px;
		margin: 0 4px;
	}
	
	.describe>p:nth-of-type(2) span:nth-of-type(3) {
		color: #999;
		font-size: 7px;
	}
	
	.detail-text {
		padding: 10px;
		padding-bottom: 100px;
	}
	
	.flex-bottom {
		position: fixed;
		width: 100%;
		bottom: 0;
		left: 0;
		background: #fff;
		border-top: 1px solid #e1e1e1;
		height: 45px;
		display: flex;
		line-height: 45px;
		text-align: center;
		color: #fff;
	}
	
	.flex-bottom>div:nth-of-type(1) {
		width: 55px;
	}
	
	.flex-bottom .icon {
		width: 25px;
		height: 22px;
		margin: 6px auto 0;
		position: relative;
	}
	
	.flex-bottom .icon span {
		position: absolute;
		width: 15px;
		height: 15px;
		border-radius: 50%;
		display: block;
		left: 16px;
		top: 4px;
		font-size: 10px;
		color: #fff;
		text-align: center;
		line-height: 15px;
		background: #ff9702;
	}
	
	.flex-bottom>div:nth-of-type(2) {
		width: 160px;
		background: #ff9702;
	}
	
	.flex-bottom>div:nth-of-type(3) {
		width: 160px;
		background: #4c3622;
	}
	
	.custom-popup {
		width: 85%;
		height: 85%;
		overflow: scroll;
		background: #f5f5f5;
	}
	
	.cart-popup {
		width: 100%;
		height: 85%;
		box-sizing: border-box;
		background: #fff;
	}
	
	.cart-content {
		padding: 0 20px 0 10px;
	}
	
	.cart-top {
		display: flex;
	}
	
	.cart-top .goods-img {
		flex: 0 0 120px;
		width: 120px;
		height: 120px;
		padding: 6px;
		box-sizing: border-box;
		background: #fff;
		border: 1px solid #e1e1e1;
		border-radius: 4px;
		overflow: hidden;
		margin-top: -35px;
	}
	
	.cart-top .goods-img img {
		width: 108px;
		height: 108px;
		margin: 0 auto;
	}
	
	.cart-top .goods-info {
		flex: 1;
		margin-top: 15px;
		margin-left: 14px;
		font-size: 13px;
		color: #333;
	}
	
	.cart-top .goods-info>p:nth-of-type(1) {
		font-size: 15px;
		color: #ff9702;
	}
	
	.cart-top .goods-info>p:nth-of-type(1),
	.cart-top .goods-info>p:nth-of-type(2) {
		margin-bottom: 10px;
	}
	
	.cart-top .goods-close {
		flex: 0 0 14px;
		width: 14px;
		height: 15px;
		margin-top: 15px;
		background: url(./close-goods.png) no-repeat center center;
		background-size: 14px 15px;
	}
	
	.color-content {
		margin-top: 25px;
	}
	
	.color-title {
		font-size: 14px;
		color: #333;
		position: relative;
		padding-left: 10px;
		line-height: 15px;
		margin-bottom: 13PX;
	}
	
	.color-title:before {
		position: absolute;
		content: '';
		width: 3px;
		height: 15px;
		background: #ff9701;
		left: 0;
		top: -1px;
	}
	
	.color-info {
		margin: 0 10px;
		padding-bottom: 15px;
		border-bottom: 1px solid #e1e1e1;
	}
	
	
	.color-info>div {
		padding: 8px 8px;
		text-align: center;
		border-radius: 10px;
		color: #333;
		background: #f5f5f5;
		font-size: 12px;
		margin-bottom: 10px;
		width: fit-content;
	}
	
	.color-info>div.active {
		color: #fff;
		background: #ff9701;
	}
	
	.cart-btn {
		width: 100%;
		height: 45px;
		text-align: center;
		line-height: 45px;
		color: #fff;
		background: #ff9702;
		position: fixed;
		bottom: 0;
	}
</style>