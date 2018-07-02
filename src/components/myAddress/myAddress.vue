<template>
	<transition name="slide">
		<div id="my-address">
			<no-address v-if="noAddress"></no-address>
			<div class="size-list">
				<div class="size-list-info" v-for="(item,index) in addressList" :key="index">
					<div class="name-edit">
						<div class="name">
							<span>{{item.name}}</span>
							<span v-if="item.type === 1">默认</span>
							<span v-if="item.type === 0" @click="defalut(item)">设为默认</span>

						</div>
						<div class="edit">
							<span @click="remove(item)">删除</span>
							<span @click="edit(item)">编辑</span>
						</div>
					</div>
					<div class="user-item">
						<p>电话: {{item.phone}}</p>
						<p>地址: {{item.province}}{{item.city}}{{item.area}}{{item.address}}</p>
					</div>
				</div>
			</div>
			<mt-popup v-model="popupVisible" position="right" :modal="false" class="mint-popup-1">
				<new-address @close="isPopupVisible" :data="addressData"></new-address>
			</mt-popup>
			<div class="new-size" @click="newSize">新建地址</div>
		</div>
	</transition>
</template>

<script>
	import { ERR_CODE } from 'api/config'
	import { AddressList, DeleteAddress, DefalutAddress } from 'api/address'
	import { UserInfo } from 'common/js/common'
	import { ShowToast } from 'common/js/loading-toast'

	import NoAddress from 'components/myAddress/noAddress'
	import NewAddress from 'components/myAddress/newAddress'
	import { MessageBox } from 'mint-ui';

	export default {
		data() {
			return {
				userInfo: '',
				noAddress: false,
				popupVisible: false,

				addressList: [],
				
				addressData:{},
			}
		},
		methods: {
			edit(item){
				this.popupVisible = true;
				this.addressData = item;
			},
			remove(item) {
				MessageBox.confirm('确定要删除该地址?').then(action => {
					let options = {
						id: item.id,
						status: 1,
					}
					DeleteAddress(options).then(res => {
						if(res.data.code === ERR_CODE) {
							ShowToast('删除地址成功');
							this.getAddressList();
						}
					})

				}).catch(res => {

				})
			},
			defalut(item) {
				MessageBox.confirm('确定要设该地址为默认地址?').then(action => {
					let options = {
						id: item.id,
						type: 1,
					}
					DefalutAddress(options).then(res => {
						if(res.data.code === ERR_CODE) {
							ShowToast('更改默认地址成功');
							this.getAddressList();
						}
					})

				}).catch(res => {

				})
			},
			getAddressList() {
				AddressList(this.userInfo.openId).then(res => {
					if(res.data.code === ERR_CODE) {
						if(res.data.data.length === 0){
							this.noAddress = true;
						}else{
							this.noAddress = false;
							
						}
						this.addressList = res.data.data;
					}
				}).catch(res => {

				})
			},
			newSize() {
				this.popupVisible = true;
			},
			isPopupVisible(data) {
				this.getAddressList();
				this.popupVisible = data;
			},
		},
		created() {
			this.userInfo = UserInfo();
			this.getAddressList();
		},
		components: {
			NoAddress,
			NewAddress
		}
	}
</script>

<style scoped>
	#my-address {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		background: #f5f5f5;
		z-index: 2;
		overflow: scroll;
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
		font-size: 12px;
		color: #666;
		flex-wrap: wrap;
		padding: 10px 15px 0 0;
	}
	
	.user-item p:nth-of-type(2) {
		margin-top: 10px;
	}
	
	.new-size {
		position: absolute;
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
		background: #f5f5f5;
	}
</style>