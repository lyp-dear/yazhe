<template>
	<transition name="slide">
		<div id="my-order">
			<no-order v-if="noOrder"></no-order>
			<div class="order-list">
				<div class="tab">
					<mt-navbar v-model="selected" :fixed="true" @click.native="isPay">
						<mt-tab-item id="null">全部</mt-tab-item>
						<mt-tab-item id="0">待付款</mt-tab-item>
						<mt-tab-item id="1">已付款</mt-tab-item>
					</mt-navbar>
				</div>

				<scroll class="order-content" :data="orderList">
					<div class="order-list-info">
						<div class="order-info" v-for="(item,index) in orderList" :key="index">
							<div class="order-number">
								<div>订单编号：{{item.order_number}}</div>
								<div v-if="item.is_pay == 1">交易成功</div>
								<div v-if="item.is_pay == 0">待支付</div>
							</div>
							<div class="commodity-info">
								<div class="icon" v-for="(info,infoIndex) in item.goodsList" :key="infoIndex"><img  width="57" height="64" v-lazy="info.picture_url" alt="" /></div>
								<!--<div class="name">
								<p>GENANX</p>
								<p>冬季男士插色休闲长袖夹克外套</p>
								<p>颜色：条纹蓝</p>
							</div>
							<div class="money">
								<p>￥388</p>
								<p>X1</p>
							</div>-->
							</div>
							<div class="commodity-money">
								<div>合计 :￥{{item.pay_price}}</div>
								<div v-if="item.is_pay == 0" @click="pay(item)">付款</div>
							</div>
						</div>
					</div>
				</scroll>

			</div>
		</div>
	</transition>

</template>

<script>
	import wx from 'weixin-js-sdk'

	import { ERR_CODE } from 'api/config'
	import { OrderList } from 'api/order'
	import { WxConfig } from 'api/wxapi'
	import { UserInfo } from 'common/js/common'
	import { ShowToast, Loading } from 'common/js/loading-toast'
	import { GetQueryString } from 'common/js/common'
	import Scroll from 'base/scroll/scroll'
	import NoOrder from 'components/myOrder/noOrder'
	export default {
		data() {
			return {
				noOrder: false,
				selected: 'null',
				currentPage: -1,
				userInfo: '',
				loading: false,

				orderList: [],
			}
		},
		methods: {
			getOrderList() {
				this.orderList = [];

				let options = {
					userId: this.userInfo.id,
					is_pay: this.selected,
					currentPage: 0,
					pageSize: 100
				}
				OrderList(options).then(res => {
					if(res.data.code === ERR_CODE) {
						if(res.data.data.length === 0) {
							this.noOrder = true;
						} else {
							this.noOrder = false;
						}
						for(let i = 0; i < res.data.data.length; i++) {
							this.orderList.push(res.data.data[i]);
						}
					}
				})
			},
			isPay() {
				//	this.currentPage = -1;
				this.getOrderList();
			},
			loadMore() {

			},
			pay(item) {
				let options = {
					openid: this.userInfo.openId,
					out_trade_no: item.order_number,
					total_fee: item.pay_price
				}
				let that = this;
				WxConfig(options).then((res) => {
					console.log(res)
					let data = res.data;
					let options = res.data;
					wx.config({
						debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: data.appid, // 必填，企业号的唯一标识，此处填写企业号corpid
						timestamp: data.timeStamp, // 必填，生成签名的时间戳
						nonceStr: data.nonce_str, // 必填，生成签名的随机串
						signature: data.paySign, // 必填，签名，见附录1
						jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					});
					wx.ready(function() {
						that.addCart(data);
						// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
					});
					wx.error(function(res) {
						console.log(res)
						// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
					});
				})
			},
			addCart(data) {
				Loading();
				//				let wxconfig = window.localStorage.getItem('wxconfig');
				//				wxconfig = wxconfig ? JSON.parse(wxconfig) : '';
				wx.chooseWXPay({
					timestamp: data.timeStamp, // 支付签名时间戳
					nonceStr: data.nonce_str, // 支付签名随机串，不长于32 位
					package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
					signType: "MD5", // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
					paySign: data.paySign, // 支付签名
					success: function(res) {
						console.log(res)
						Loading(true);
						//支付成功
						ShowToast('支付成功');

					},
					cancel: function(res) {
						console.log(res)
						Loading(true);
						ShowToast('取消支付');

						//支付取消
					},
					fail: function(res) {
						Loading(true);
						ShowToast('支付失败');
						console.log(res)
					}
				});
			},
		},
		created() {
			this.userInfo = UserInfo();
			if(GetQueryString('selected') === '0') {
				this.selected = '0';
			}
			if(GetQueryString('selected') === '1') {
				this.selected = '1';
			}
			this.getOrderList();

		},
		components: {
			NoOrder,
			Scroll
		}
	}
</script>

<style scoped>
	#my-order {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background: #f5f5f5;
		z-index: 3;
	}
	
	.order-content {
		position: absolute;
		top: 50px;
		bottom: 0;
		width: 100%;
	}
	
	.tab {
		height: 50px;
	}
	
	.order-info {
		padding: 0 15px 5px;
		position: relative;
		background: #fff;
	}
	
	.order-info:after {
		content: "";
		width: 100%;
		height: 10px;
		background: #f5f5f5;
		position: absolute;
		bottom: -5px;
		left: 0;
	}
	
	.order-number {
		border-bottom: 1px solid #e1e1e1;
		display: flex;
		color: #666;
		font-size: 12px;
		line-height: 30px;
	}
	
	.order-number>div {
		flex: 1;
	}
	
	.order-number>div:nth-of-type(2) {
		flex: 0 0 60px;
		width: 60px;
		color: #ff9702;
		font-size: 13px;
		text-align: right;
	}
	
	.commodity-info {
		flex-wrap: wrap;
	}
	
	.commodity-info .icon {
		margin-bottom: 10px;
		margin-right: 10px;
	}
	.commodity-info .icon img{
		object-fit: cover;
	}
	.commodity-info .icon:nth-of-type(5n) {
		margin-right: 0;
	}
	
	.commodity-money {
		display: flex;
		text-align: right;
		justify-content: flex-end;
		color: #ff9702;
		font-size: 14px;
		line-height: 30px;
		padding: 5px 0;
	}
	
	.commodity-money>div:nth-of-type(2) {
		flex: 0 0 80px;
		width: 80px;
		height: 30px;
		background: #4c3622;
		text-align: center;
		color: #fff;
		border-radius: 4px;
		margin-left: 10px;
	}
</style>