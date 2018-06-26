<template>
	<div id="my">
		<div class="banner" @click="edit">
			<div class="avatar" :class="classMap[userInfo.proportion]">
				<img :src="userInfo.headimgurl" alt="" />
			</div>
			<div class="name">{{userInfo.nickName}}</div>
		</div>
		<div class="my-order">
			<mt-cell title="我的订单" is-link value="查看全部" to="../myOrder">
			</mt-cell>
		</div>
		<div class="payment-btn">
			<router-link tag="div" to="../myOrder?selected=0">
				<div>
					<div class="icon"><img src="./paymentIcon1.png" alt="" /></div>
					<div>待付款</div>
				</div>
			</router-link>
			<router-link tag="div" to="../myOrder?selected=1">
				<div>
					<div class="icon"><img src="./paymentIcon2.png" alt="" /></div>
					<div>已付款</div>
				</div>
			</router-link>

		</div>
		<div class="address-size">
			<div class="nickname">
				<mt-cell title="昵称" class="cell" :value="userInfo.nickName">
				</mt-cell>
			</div>
			<div class="phone">
				<mt-cell title="电话" :value="userInfo.phone">
				</mt-cell>
			</div>
			<div class="liwu">
				<mt-cell title="邀请码" :value="userInfo.invitationCode">
				</mt-cell>
			</div>
			<div class="code">
				<mt-cell title="推荐码" :value="userInfo.referralCode">
				</mt-cell>
			</div>
		</div>
		<div class="address-size">
			<div class="size">
				<mt-cell title="我的尺寸" is-link to="../my-size">
				</mt-cell>
			</div>
			<div class="address">
				<mt-cell title="我的地址" is-link to="../my-address">
				</mt-cell>
			</div>
			<div class="nickname" style="border: 0;">
				<mt-cell title="上下级" is-link to="../team">
				</mt-cell>
			</div>
		</div>
		<keep-alive>
			<router-view></router-view>
		</keep-alive>
	</div>
</template>

<script>
	import { UserInfo } from 'common/js/common'
	export default {
		data() {
			return {
				userInfo: '',
				classMap:[],
			}
		},
		methods: {
			edit() {

			}
		},
		created() {
			this.userInfo = UserInfo();
      		this.classMap = ['prop0', 'prop1', 'prop02', 'prop3', 'prop4','prop5'];
			
			console.log(this.userInfo);
		}
	}
</script>

<style scoped>
	#my {
		height: 100%;
		padding-bottom: 40px;
		overflow: auto;
		background: #f5f5f5;
	}
	
	.banner {
		width: 100%;
		height: 125px;
		padding-top: 12px;
		box-sizing: border-box;
		background: url('./myBanner.jpg') no-repeat center center;
		background-size: contain;
	}
	
	.avatar {
		width: 70px;
		height: 70px;
		border-radius: 50%;
		background: #eeecea;
		margin: 0 auto;
		position: relative;
	}
	
	.avatar img {
		width: 70px;
		height: 70px;
		border-radius: 50%;
	}
	
	.avatar.prop0:before {
		content: "";
		width: 38px;
		height: 28px;
		position: absolute;
		background: url(./icon0.png) no-repeat center center;
		background-size: 38px 28px;
		right: -18px;
		bottom: 4px;
	}
	
	.avatar.prop1:before {
		content: "";
		width: 38px;
		height: 28px;
		position: absolute;
		background: url(./icon1.png) no-repeat center center;
		background-size: 38px 28px;
		right: -18px;
		bottom: 4px;
	}
	
	.avatar.prop2:before {
		content: "";
		width: 38px;
		height: 28px;
		position: absolute;
		background: url(./icon2.png) no-repeat center center;
		background-size: 38px 28px;
		right: -18px;
		bottom: 4px;
	}
	
	.avatar.prop3:before {
		content: "";
		width: 38px;
		height: 28px;
		position: absolute;
		background: url(./icon3.png) no-repeat center center;
		background-size: 38px 28px;
		right: -18px;
		bottom: 4px;
	}
	
	.avatar.prop4:before {
		content: "";
		width: 38px;
		height: 28px;
		position: absolute;
		background: url(./icon4.png) no-repeat center center;
		background-size: 38px 28px;
		right: -18px;
		bottom: 4px;
	}
	
	.avatar.prop5:before {
		content: "";
		width: 38px;
		height: 28px;
		position: absolute;
		background: url(./icon5.png) no-repeat center center;
		background-size: 38px 28px;
		right: -18px;
		bottom: 4px;
	}
	
	.name {
		color: #fff;
		text-align: center;
		font-size: 14px;
		margin-top: 7px;
	}
	
	.my-order {
		border-bottom: 1px solid #e1e1e1;
		color: #666 !important;
		font-size: 13px !important;
	}
	
	.payment-btn {
		display: flex;
		background: #fff;
		padding: 10px 0;
		font-size: 15px;
		color: #333;
	}
	
	.payment-btn>div {
		flex: 1;
		position: relative;
		text-align: center;
	}
	
	.payment-btn>div:nth-of-type(1):after {
		content: "";
		width: 1px;
		height: 31px;
		background: #2d2d2d;
		position: absolute;
		right: 0;
		top: 50%;
		margin-top: -15px;
	}
	
	.icon {
		width: 23px;
		height: 23px;
		margin: 0 auto 6px auto;
	}
	
	.address-size {
		padding-left: 15px;
		margin-top: 10px;
		background: #fff;
	}
	
	.address-size>div {
		padding-left: 17px;
		border-bottom: 1px solid #e1e1e1;
	}
	
	.nickname {
		background: url(person.png) no-repeat left center;
		background-size: 17px 18px;
	}
	
	.phone {
		background: url(phone.png) no-repeat left center;
		background-size: 17px 18px;
	}
	
	.liwu {
		background: url(liwu.png) no-repeat left center;
		background-size: 16px 16px;
	}
	
	.code {
		background: url(code.png) no-repeat left center;
		background-size: 16px 16px;
		border: none !important;
	}
	
	.address {
		background: url(adress-icon.png) no-repeat left center;
		background-size: 16px 21px;
	}
	.size {
		background: url(size-icon.png) no-repeat left center;
		background-size: 16px 21px;
	}
</style>