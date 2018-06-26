<template>
	<transition name="slide">

		<div id="team">
			<mt-navbar v-model="selected" @click.native="select">
				<mt-tab-item id="1">我的上级</mt-tab-item>
				<mt-tab-item id="2">我的下级</mt-tab-item>
			</mt-navbar>
			<mt-tab-container v-model="selected">
				<mt-tab-container-item id="1">
					<ul class="list top">
						<li>
							<span>Q1</span>{{top.nickName}}
							<div class="bot-content">
								<ul>
									<li>
										<div>头像</div>
										<div class="icon"><img :src="top.headimgurl" alt="" /></div>
									</li>
									<li>
										<div>姓名</div>
										<div>{{top.nickName}}</div>
									</li>
									<li>
										<div>电话</div>
										<div>{{top.phone}}</div>
									</li>
								</ul>
							</div>
						</li>
					</ul>
				</mt-tab-container-item>
				<mt-tab-container-item id="2">
					<ul class="list bot">
						<li v-for="(item,index) in botArray" @click="show(index)" :class="{'active': oIndex == index}">
							<span>Q{{index+1}}</span>{{item.nickName}}
							<div class="bot-content" v-show="oIndex == index">
								<ul>
									<li>
										<div>头像</div>
										<div class="icon"><img :src="item.headimgurl" alt="" /></div>
									</li>
									<li>
										<div>姓名</div>
										<div>{{item.nickName}}</div>
									</li>
									<li>
										<div>电话</div>
										<div>{{item.phone}}</div>
									</li>
								</ul>
							</div>
						</li>
					</ul>
				</mt-tab-container-item>
			</mt-tab-container>
		</div>
	</transition>

</template>

<script>
	import { Top, Bot } from 'api/team'
	import { ShowToast } from 'common/js/loading-toast'
	import { UserInfo } from 'common/js/common'

	export default {
		data() {
			return {
				top: {},
				isBot: false,
				botArray: [],
				oIndex: -1,
				selected: "1",
				userInfo: {}
			}
		},
		methods: {
			select() {
				if(this.isBot) return;
				if(this.selected == '2') {
					Bot(this.userInfo.parentId).then(res => {
						console.log(res);
						if(res.data.code === 0) {
							this.isBot = true;
							for(let i = 0; i < res.data.data.length; i++) {
								this.botArray = res.data.data;
							}
						}
					}).catch(res => {})

				}
			},
			show(index) {
				this.oIndex = index;
			}
		},
		mounted() {
			this.userInfo = UserInfo();
			Top(this.userInfo.parentId).then(res => {
				console.log(res)
				if(res.data.code === 0) {
					this.top = res.data.data;
				}
			}).catch(res => {

			})
		}
	}
</script>

<style scoped>
	#team {
		width: 100%;
		height: 100%;
		background: #fff;
		z-index: 9999;
		overflow: scroll;
		position: fixed;
		top: 0;
	}
	
	.list>li {
		height: auto;
		line-height: 34px;
		border-bottom: 1px solid #e1e1e1;
		padding: 0 15px;
		color: #333;
		font-size: 16px;
		position: relative;
	}
	
	.list.bot>li {
		height: 34px;
	}
	
	.list.bot>li.active {
		height: auto;
	}
	
	.list>li::after {
		position: absolute;
		content: "";
		width: 15px;
		height: 8px;
		background: url('../../assets/throw-bot.png') no-repeat center center;
		background-size: 15px 8px;
		right: 15px;
		top: 10px;
	}
	
	.list.top>li::after {
		background: url('../../assets/top.png') no-repeat center center;
		background-size: 15px 8px;
		right: 15px;
		top: 10px;
	}
	
	.list.bot>li.active::after {
		background: url('../../assets/top.png') no-repeat center center;
		background-size: 15px 8px;
	}
	
	.list>li>span {
		color: #ff9702;
	}
	
	.bot-content>ul li {
		height: 40px;
		line-height: 40px;
		display: flex;
		color: #666;
		font-size: 13px;
		margin: 0 15px 0 22px;
		border-bottom: 1px solid #E1E1E1;
	}
	
	.bot-content>ul li:nth-of-type(1) {
		border-top: 1px solid #e1e1e1;
	}
	
	.bot-content>ul li:nth-of-type(3) {
		border-bottom: none;
	}
	
	.bot-content>ul li>div:nth-of-type(1) {
		flex: 1;
	}
	
	.icon {
		flex: 0 0 30px;
		width: 30px;
		height: 30px;
		border-radius: 100%;
		overflow: hidden;
		text-align: right;
		margin-top: 4px;
	}
	
	.icon img {
		display: inline-block;
	}
</style>