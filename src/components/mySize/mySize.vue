<template>
	<transition name="slide">

		<div id="my-size">
			<no-size v-if="noSize"></no-size>
			<div class="size-list">
				<div class="size-list-info" v-for="(item,index) in sizeList">
					<div class="name-edit">
						<div class="name">
							<span>{{item.title}}</span>
							<span v-if="item.type == 1">默认</span>
							<span v-if="item.type != 1" @click="defaultSize(item)">设为默认</span>

						</div>
						<div class="edit">
							<span @click="remove(item)">删除</span>
							<span @click="edit(item)">编辑</span>
						</div>
					</div>
					<div class="user-item">
						<div v-for="(info,key) in JSON.parse(item.body)">{{key}}:{{info}}</div>
					</div>
				</div>
			</div>
			<mt-popup v-model="popupVisible" position="right" :modal="false" class="mint-popup-1">
				<new-size @close="isPopupVisible" :data="defalutList" :size="sizeArray" :sizeData="data" ref="newSize"></new-size>
			</mt-popup>
			<div class="new-size" @click="newSize(false)">新建尺寸</div>
		</div>
	</transition>
</template>

<script>
	import { ERR_CODE } from 'api/config'
	import { MySize, Remove, SizeConfigByModel, SizeConfig } from 'api/size'
	import { UserInfo } from 'common/js/common'
	import { ShowToast } from 'common/js/loading-toast'
	import NoSize from 'components/mySize/noSize'
	import NewSize from 'components/mySize/newSize'
	import { MessageBox } from 'mint-ui';
	export default {
		data() {
			return {
				userInfo: '',
				noSize: false,
				popupVisible: false,

				sizeList: [],

				defalutList: [],
				sizeArray:[],
				data: {}
			}
		},
		methods: {
			getMySize() {
				MySize(this.userInfo.openId).then((res) => {
					if(res.data.code === ERR_CODE) {
						if(res.data.data.length === 0) {
							this.noSize = true;
						} else {
							this.noSize = false;
						}
						this.sizeList = res.data.data;

					}
				})
			},
			newSize(isEdit) {
				if(!isEdit){
					this.data= {}
				}
				SizeConfigByModel().then(res => {
					if(res.data.code === ERR_CODE) {
						this.popupVisible = true;
						this.sizeArray = res.data.data;
					}
				})
				SizeConfig().then((res) => {
					if(res.data.code === ERR_CODE) {
						this.popupVisible = true;
						this.defalutList = res.data.data;
					}
				})
			},
			defaultSize(item) {
				MessageBox.confirm('确定要设该尺寸为默认尺寸?').then(action => {
					let options = {
						id: item.id,
						type: 1,
					}
					Remove(options).then(res => {
						if(res.data.code === ERR_CODE) {
							ShowToast('设为默认尺寸成功');
							this.getMySize();
						}
					})

				}).catch(res => {

				});
			},
			edit(item){
				this.data = item;
				this.newSize(true);
				
			},
			remove(item) {
				MessageBox.confirm('确定要删除该尺寸?').then(action => {
					let options = {
						id: item.id,
						status: 1,
					}
					Remove(options).then(res => {
						if(res.data.code === ERR_CODE) {
							ShowToast('删除尺寸成功');
							this.getMySize();
						}
					})

				}).catch(res => {

				});
			},
			isPopupVisible(data) {
				this.popupVisible = data;
				this.getMySize();
			},
		},
		created() {
			this.userInfo = UserInfo();
			this.getMySize();
		},
		components: {
			NoSize,
			NewSize
		}
	}
</script>

<style scoped>
	#my-size {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		background: #f5f5f5;
		z-index: 2;
	}
	
	.size-list {
		padding-top: 10px;
	}
	
	.size-list-info {
		padding: 15px 0 15px 15px;
		background: #fff;
		margin-bottom: 10px;
	}
	
	.name-edit {
		display: flex;
		font-size: 10px;
		align-items: center;
		justify-content: center;
		padding-bottom: 12px;
		border-bottom: 1px solid #e1e1e1;
	}
	
	.name-edit>div {
		flex: 1;
	}
	
	.name>span:nth-of-type(1) {
		font-size: 13px;
		color: #333333;
	}
	
	.name>span:nth-of-type(2) {
		display: inline-block;
		height: 12px;
		border: 1px solid #ff9701;
		text-align: center;
		line-height: 14px;
		border-radius: 2px;
	}
	
	.edit {
		text-align: right;
	}
	
	.edit>span {
		display: inline-block;
		width: 38px;
		height: 19px;
		text-align: center;
		line-height: 19px;
		color: #4c3622;
		border: 1px solid #4c3622;
		border-radius: 2px;
		margin-right: 15px;
	}
	
	.edit>span:nth-of-type(2) {
		border: 1px solid #4c3622;
		background: #4c3622;
		color: #fff;
	}
	
	.user-item {
		display: flex;
		font-size: 12px;
		color: #666;
		flex-wrap: wrap;
		padding: 10px 15px 10px 0;
	}
	
	.user-item>div {
		flex: 0 0 82px;
		width: 82px;
		margin-right: 38px;
		margin-bottom: 10px;
	}
	.user-item>div:nth-of-type(3n){
		margin-right: 0;
	}
	.new-size {
		position: fixed;
		z-index: 3;
		width: 100%;
		height: 40px;
		line-height: 40px;
		background: #4c3622;
		color: #fff;
		bottom: 0;
		text-align: center;
	}
	
	.mint-popup-1 {
		width: 100%;
		height: 100%;
		overflow: scroll;
		background: #f5f5f5;
	}
</style>