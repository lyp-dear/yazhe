<template>
	<div class="custom">
		<div class="custom-title">
			<h5>定制选项</h5>
			<span @click="closeCustom"></span>
		</div>
		<div class="size-list">
			<div class="size-list-info">
				<div class="title">身体尺寸选择（此商品会按照本尺寸进行制作）</div>
				<div class="add-size">
					<mt-button size="small" :plain="true" v-if="noSize" @click="addSize">
						<img src="./add.png" height="20" width="15" slot="icon" style="width: 20px !important;"> 添加尺寸
					</mt-button>
					<mt-button size="small" :plain="true" v-if="!noSize">
						{{defaultSize.title}}
					</mt-button>
				</div>
			</div>
			<div class="size-list-info" v-for="(item,listIndex) in data.goodsCustomized">
				<div class="title">{{item.name}}</div>
				<div class="icon">
					<div :class="{'active':index == indexArray[listIndex].index}" v-for="(info,index) in item.valueList" @click="clickSize(info,index,listIndex)">
						<div class="icon-box">
							<img :src="info.image" alt="" />
						</div>
						<p>{{info.name}}</p>
					</div>
				</div>
			</div>
			<div class="size-list-info">
				<div class="title">面料</div>
				<div class="m-input">
					<input type="text" placeholder="请输入面料编码   例如：58545855" v-model="fabricNumber"/>
				</div>
			</div>
			<!--<div class="size-list-info">
				<div class="title">数量</div>
				<div class="add-btn">
					<a href="javascript:;">-</a>
					<input type="text" />
					<a href="javascript:;">+</a>
				</div>
			</div>-->
		</div>
		<div class="custom-btn" @click="addCustomization">立即定制</div>
	</div>
</template>

<script>
	import { MySize } from 'api/size'
	import { ERR_CODE } from 'api/config'

	import { UserInfo } from 'common/js/common'

	export default {
		props: {
			data: {
				type: Object,
				defalut: {}
			}
		},
		data() {
			return {
				userInfo: '',
				noSize: false,
				defaultSize: '',
				indexArray: [],

				customization: [],
				fabricNumber:'',
			}
		},
		created() {
//			this.$nextTick(_ => {
//			console.log(2)
//				this.getMySize();
//			})
		},
		methods: {
			
			clickSize(item, index, listIndex) {
				this.indexArray[listIndex].index = index;
				if(this.indexArray[listIndex].index === index) {
					let obj = `${this.data.goodsCustomized[listIndex].id}:${this.data.goodsCustomized[listIndex].valueList[index].id}`;
					this.customization.push(obj);
				}

				//				if(listIndex === 0) {
				//					this.chest = item.value;
				//				}
				//				if(listIndex === 1) {
				//					this.shoulder = item.value;
				//				}
				//				if(listIndex === 2) {
				//					this.waist = item.value;
				//				}
				//				if(listIndex === 3) {
				//					this.back = item.value;
				//				}

			},
			addCustomization() {
				let str = '';
				this.customization.map((item, index) => {
					if(index === 0) {
						str = str + item;
					} else if(index >= 1) {
						str = str + ',' + item;
					}
				})
				this.$emit('add', [str, this.defaultSize.id,this.fabricNumber])
			},
			getMySize() {
				this.userInfo = UserInfo();
				MySize(this.userInfo.openId).then((res) => {
					if(res.data.code === ERR_CODE) {
						if(res.data.data.length === 0) {
							this.noSize = true;
							return;
						} else {
							////							this.noSize = false;
							////							for(let i = 0; i<res.data.data.length;i++){
							////								if(res.data.data[i].type === 1){
							////									this.title = res.data.data[i].title;
							//this.noSize = false;
							////								}
							////							}
							////							if(this.title === ''){
							////								this.title = res.data.data[0].title;
							////							}
							this.defaultSize = res.data.data[0];

						}
					}
				})
			},
			closeCustom() {
				this.$emit('close', false)
			},
			addSize() {
				this.$router.push({
					path: '/my-size'
				});
			}
		},
		watch: {
			data(val) {
				this.data = val;
				for(let i = 0; i < val.goodsCustomized.length; i++) {
					let obj = {
						index: -1
					}
					this.indexArray.push(obj);
				}
			}
		}
	}
</script>

<style scoped>
	img {
		height: 100%;
	}
	
	.custom-title {
		height: 40px;
		line-height: 40px;
		background: #4c3622;
		color: #fff;
		font-size: 14px;
		text-align: center;
	}
	
	.custom-title span {
		position: absolute;
		display: block;
		width: 14px;
		height: 14px;
		background: url(./close.png) no-repeat center center;
		right: 15px;
		top: 13px;
	}
	
	.size-list {
		padding: 0 20px 15px 15px;
		margin-top: 10px;
		background: #f5f5f5;
	}
	
	.add-size {
		margin-top: 10px;
		margin-left: 10px;
	}
	
	.size-list-info {
		border-bottom: 1px solid #e1e1e1;
		padding-bottom: 10px;
		padding-top: 15px;
	}
	.size-list-info:last-child{
		border: none;
	}
	.size-list-info .title {
		font-size: 13px;
		color: #999999;
		position: relative;
		padding-left: 10px;
		line-height: 15px;
	}
	
	.size-list-info .title:before {
		position: absolute;
		content: '';
		width: 3px;
		height: 15px;
		background: #ff9701;
		left: 0;
		top: -1px;
	}
	
	.icon {
		display: flex;
		flex-wrap: wrap;
		padding: 10px 0 0 10px;
	}
	
	.icon>div {
		flex: 0 0 90px;
		width: 90px;
		margin-right: 10px;
		margin-bottom: 10px;
		box-sizing: border-box;
		text-align: center;
	}
	.icon>div:nth-of-type(3n){
		margin-right: 0;
	}
	.icon p {
		color: #333333;
		font-size: 12px;
		margin-top: 7px;
	}
	
	.icon .icon-box {
		width: 100%;
		height: 67px;
	}
	
	.icon>div.active p {
		color: #ff9701;
	}
	
	.icon>div.active .icon-box {
		border: 1px solid #ff9701;
		position: relative;
	}
	
	.icon>div.active .icon-box:after {
		position: absolute;
		content: '';
		width: 11px;
		height: 11px;
		background: url('./active-icon.png') no-repeat center center;
		background-size: 11px 11px;
		bottom: 0;
		right: 0;
	}
	.m-input{
		width: 100%;
		height: 33px;
		box-sizing: border-box;
		margin-top: 10px;
		border: 1px solid #e1e1e1;
	}
	.m-input input{
		width: 100%;
		height: 100%;
		padding-left: 10px;
		box-sizing: border-box;
	}
	.add-btn {
		margin-top: 10px;
		margin-left: 10px;
	}
	
	.custom-btn {
		width: 150px;
		height: 30px;
		line-height: 30px;
		text-align: center;
		background: #4c3622;
		font-size: 14px;
		border-radius: 4px;
		color: #fff;
		margin: 25px auto;
	}
</style>