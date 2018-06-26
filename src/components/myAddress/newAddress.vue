<template>
	<div id="new-address-container">
		<div class="close" @click="close"></div>
		<mt-field label="姓名" placeholder="请输入收件人姓名" v-model="username"></mt-field>
		<mt-field label="手机号" placeholder="请输入收件人电话" type="number" v-model="phone"></mt-field>
		<mt-field label="选择省市区" placeholder="请选择省市区" v-model="city" :readonly="true" @click.native="selectCity"></mt-field>
		<mt-field label="详细地址" placeholder="请输入详细地址" v-model="detailAddress"></mt-field>
		<div class="flex-bottom">
			<div class="default-address">
				<label><input type="checkbox" v-model="isCheckde"><span></span> 设置为默认地址</label>
			</div>
			<div class="success-add" @click="add">完成新增</div>
		</div>

		<mt-popup v-model="popupVisible" position="bottom" class="city-popup">
			<div class="cancle-confrim">
				<div @click="cancle">取消</div>
				<div @click="confrim">确定</div>
			</div>
			<mt-picker :slots="myAddressSlots" @change="onMyAddressChange"></mt-picker>
		</mt-popup>

	</div>
</template>

<script>
	import 'common/css/radio.css'
	import myaddress from 'common/json/pca.json'

	import { ERR_CODE } from 'api/config'
	import { UserInfo } from 'common/js/common'

	import { AddAddress, DefalutAddress } from 'api/address'

	import { MessageBox } from 'mint-ui';
	import { ShowToast } from 'common/js/loading-toast'

	export default {
		props: {
			data: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				userInfo: '',
				username: '',
				phone: '',
				city: '',
				detailAddress: '',
				myAddressSlots: [{
						flex: 1,
						defaultIndex: 1,
						values: Object.keys(myaddress), //省份数组
						className: 'slot1',
						textAlign: 'center'
					}, {
						divider: true,
						content: '-',
						className: 'slot2'
					}, {
						flex: 1,
						values: [],
						className: 'slot3',
						textAlign: 'center'
					},
					{
						divider: true,
						content: '-',
						className: 'slot4'
					},
					{
						flex: 1,
						values: [],
						className: 'slot5',
						textAlign: 'center'
					}
				],
				myAddressProvince: '省',
				myAddressCity: '市',
				myAddresscounty: '区/县',
				popupVisible: false,
				isCheckde: false,
			}
		},
		methods: {
			close() {
				this.username = '';
				this.phone = '';
				this.myAddressProvince = '';
				this.myAddressCity = '';
				this.myAddresscounty = '';
				this.detailAddress = '';
				this.city = '';
				this.isCheckde = false;
				this.$emit("close", false);
			},
			onMyAddressChange(picker, values) {
				if(myaddress[values[0]]) { //这个判断类似于v-if的效果（可以不加，但是vue会报错，很不爽）
					picker.setSlotValues(1, Object.keys(myaddress[values[0]])); // Object.keys()会返回一个数组，当前省的数组
					picker.setSlotValues(2, myaddress[values[0]][values[1]]); // 区/县数据就是一个数组
					this.myAddressProvince = values[0];
					this.myAddressCity = values[1];
					this.myAddresscounty = values[2];
				}
			},
			selectCity() {
				this.popupVisible = true;
			},
			cancle() {
				this.popupVisible = false;
			},
			confrim() {
				this.popupVisible = false;
				this.city = this.myAddressProvince + ' ' + this.myAddressCity + ' ' + this.myAddresscounty;
			},
			add() {
				if(this.userInfo === '') {
					this.userInfo = UserInfo();
				}
				if(this.username === '') {
					MessageBox('提示', '请输入用户姓名');
					return;
				}
				if(this.phone === '') {
					MessageBox('提示', '请输入用户手机号');
					return;
				}
				if(this.city === '') {
					MessageBox('提示', '请选择省市区');
					return;
				}
				if(this.detailAddress === '') {
					MessageBox('提示', '请输入详细地址');
					return;
				}
				let options = {
					openId: this.userInfo.openId,
					name: this.username,
					phone: this.phone,
					province: this.myAddressProvince,
					city: this.myAddressCity,
					area: this.myAddresscounty,
					address: this.detailAddress
				}
				if(this.isCheckde) {
					options.type = 1;
				} else {
					options.type = 0;
				}
				if(!this.data.id) {
					AddAddress(options).then(res => {
						if(res.data.code === ERR_CODE) {
							ShowToast('添加地址成功!');
							this.$emit("close", false);
							this.username = '';
							this.phone = '';
							this.myAddressProvince = '';
							this.myAddressCity = '';
							this.myAddresscounty = '';
							this.detailAddress = '';
							this.city = '';
							this.isCheckde = false;
						}
					})
				} else {
					options.id = this.data.id;
					DefalutAddress(options).then(res => {
						if(res.data.code === ERR_CODE) {
							ShowToast('更新地址成功!');
							this.$emit("close", false);
							this.username = '';
							this.phone = '';
							this.myAddressProvince = '';
							this.myAddressCity = '';
							this.myAddresscounty = '';
							this.detailAddress = '';
							this.city = '';
							this.isCheckde = false;
						}
					})
				}

			},
		},
		mounted() {
			this.$nextTick(() => { //vue里面全部加载好了再执行的函数  （类似于setTimeout）
				this.myAddressSlots[0].defaultIndex = 0
				// 这里的值需要和 data里面 defaultIndex 的值不一样才能够初始化
				//因为我没有看过源码（我猜测是因为数据没有改变，不会触发更新）
			});
		},
		watch: {
			data(val) {
				this.data = val;
				this.username = val.name;
				this.phone = val.phone;
				this.myAddressProvince = val.province;
				this.myAddressCity = val.city;
				this.myAddresscounty = val.area;
				this.detailAddress = val.address;
				this.city = this.myAddressProvince + ' ' + this.myAddressCity + ' ' + this.myAddresscounty;
				if(val.type === 1) {
					this.isCheckde = true;
				} else {
					this.isCheckde = false;
				}
			}
		}
	}
</script>

<style scoped>
	#new-address-container {
		margin-top: 10px;
	}
	
	.city-popup {
		width: 100%;
	}
	
	.cancle-confrim {
		display: flex;
		text-align: right;
		padding: 10px;
	}
	
	.cancle-confrim>div {
		flex: 1;
	}
	
	.cancle-confrim>div:nth-of-type(1) {
		text-align: left;
	}
	
	.default-address {
		text-align: center;
	}
	
	.default-address label {
		font-size: 13px !important;
	}
	
	.success-add {
		width: 90%;
		height: 36px;
		line-height: 36px;
		font-size: 14px;
		border-radius: 4px;
		margin: 20px auto;
		text-align: center;
		background: #4c3622;
		color: #fff;
	}
	
	.flex-bottom {
		position: absolute;
		width: 100%;
		bottom: 20px;
	}
	
	.close {
		width: 38px;
		height: 35px;
		background: url(../../assets/close.png) no-repeat center center;
		background-size: 38px 35px;
		position: absolute;
		right: 0;
		z-index: 9999;
		top: 0;
	}
</style>