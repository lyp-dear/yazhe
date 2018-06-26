<template>
	<div id="app">
		<router-view>
		</router-view>
		<div class="app-tabbar">
			<router-link tag="a" to="/index" class="index">
				<div class="icon"></div>
				<div class="label">首页</div>
			</router-link>
			<router-link tag="a" to="/classifyList" class="classify">
				<div class="icon"></div>
				<div class="label">分类</div>
			</router-link>
			<router-link tag="a" to="/shoppingCart" class="shoppingCart">
				<div class="icon"></div>
				<div class="label">购物车</div>
			</router-link>
			<router-link tag="a" to="/my" class="my">
				<div class="icon"></div>
				<div class="label">我的</div>
			</router-link>

		</div>
	</div>
</template>

<script>
	import 'common/css/rest.css'
	import wx from 'weixin-js-sdk'
	import { WxConfig } from 'api/wxapi'
	import { GetUserInfo } from 'api/login'
	import { ERR_CODE } from 'api/config'

	import { getQueryString, GetQueryString } from 'common/js/common'
	import { ShowToast, Loading } from 'common/js/loading-toast'

	export default {
		name: 'App',
		data() {
			return {
				selected: '',

				//openId: 'oKDYO1VIDO55MUMGVJyvu1DE9_fA',
//				openId: 'oKDYO1Ut6llB3R9qd4MHyy9F5Ous',
				openId: '',
			}
		},
		methods: {
			wxconfigInit() {
				WxConfig().then((res) => {
					let data = res.data;
					let options = res.data;
					options = JSON.stringify(options);
					localStorage.setItem('wxconfig', options)
					wx.config({
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: data.appid, // 必填，企业号的唯一标识，此处填写企业号corpid
						timestamp: data.timeStamp, // 必填，生成签名的时间戳
						nonceStr: data.nonce_str, // 必填，生成签名的随机串
						signature: data.sign, // 必填，签名，见附录1
						jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					});
				})
			},
			getUserInfo() {
				GetUserInfo(this.openId).then((res) => {
					console.log(res)
					if(res.data.code === ERR_CODE) {
						let data = res.data.data;
						data = JSON.stringify(data);
						sessionStorage.setItem('userInfo', data)
					}
				})
			}
		},
		mounted() {
			this.openId = getQueryString('openId');
			if(this.openId == null) {
				this.openId = GetQueryString('openId');
				if(this.openId == null) {
					window.location.href = 'http://www.argesz.com/yazhe/common/author?type=1';
				}
				return;
			}
			this.getUserInfo();
			this.selected = 'index';
			//this.wxconfigInit();

		},
//		watch: {
//			'$route' (val) {
//				if(val.fullPath == '/index') {
//					this.selected = 'index';
//				}
//				if(val.fullPath == '/shoppingCart') {
//					this.selected = 'shoppingCart';
//				}
//				if(val.fullPath == '/classify') {
//					this.selected = 'classify';
//				}
//				if(val.fullPath == '/my') {
//					this.selected = 'my';
//				}
//			}
//		}
	}
</script>

<style scoped>
	#app {
		height: 100%;
	}
	
	.app-tabbar {
		background-image: linear-gradient(180deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
		background-size: 100% 1px;
		background-repeat: no-repeat;
		background-position: top left;
		background-color: #fff;
		display: flex;
		right: 0;
		bottom: 0;
		left: 0;
		position: fixed;
		z-index: 1;
		text-align: center;
		border-top: 1px solid #e1e1e1;
	}
	
	.app-tabbar a {
		display: block;
		padding: 7px 0;
		flex: 1;
		text-decoration: none;
		color: #999;
	}
	
	.app-tabbar a .icon {
		width: 24px;
		height: 24px;
		margin: 0 auto 5px;
		background: url(./assets/icon1.png) no-repeat center center;
		background-size: 20px 20px;
	}
	
	.app-tabbar .classify .icon {
		background: url(./assets/icon2.png) no-repeat center center;
		background-size: 20px 20px;
	}
	
	.app-tabbar .shoppingCart .icon {
		background: url(./assets/icon3.png) no-repeat center center;
		background-size: 20px 20px;
	}
	
	.app-tabbar .my .icon {
		background: url(./assets/icon4.png) no-repeat center center;
		background-size: 20px 20px;
	}
	
	.app-tabbar a .label {
		color: inherit;
		font-size: 12px;
		line-height: 1;
	}
	
	.router-link-active.index .icon {
		background: url(./assets/icon1on.png) no-repeat center center;
		background-size: 20px 20px;
	}
	
	.router-link-active.classify .icon {
		background: url(./assets/icon2on.png) no-repeat center center;
		background-size: 20px 20px;
	}
	
	.router-link-active.shoppingCart .icon {
		background: url(./assets/icon3on.png) no-repeat center center;
		background-size: 20px 20px;
	}
	
	.router-link-active.my .icon {
		background: url(./assets/icon4on.png) no-repeat center center;
		background-size: 20px 20px;
	}
</style>