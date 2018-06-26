<template>
	<div id="shoppingCart">
		<cart v-if="cartNull"></cart>
		<div v-if="isAndroid">
			<div class="purchase-list">
				<div class="purchase-info" v-for="(item,index) in carList" :key="index">
					<div>
						<label><input type="checkbox" v-model="item.isChecked"  @click="selected(item)"><span></span></label>
					</div>
					<div class="img"><img v-lazy="item.picture_url" alt="" /></div>
					<div class="info">
						<p>{{item.goods_name}}</p>
<!--						<p>颜色: 蓝色</p>
-->						<p>￥{{item.price}}</p>
						<!--<div class="size">
							<div @click="size(index)" v-for="(item,index) in sizeArray" :class="{'active': nowSize == index}">{{item}}</div>
						</div>-->
					</div>
					<div class="add-remove-btn">
						<div class="remove-btn" @click="del(item)"></div>
						<div class="add-btn">
							<a href="javascript:;" @click="removeNum(item,index)">-</a>
							<input type="text" v-model="item.num" />
							<a href="javascript:;" @click="addNum(item,index)">+</a>
						</div>
					</div>
				</div>
			</div>
			<div class="flex-btn">
				<div>
					<label><input type="checkbox" v-model="isCheckde" @click="all"><span class=""></span>全选</label>
				</div>
				<div>
					<p>合计 :<i>{{count.toFixed(2)}}</i></p>
					<p>已选 :{{piece}}件</p>
				</div>
				<div @click="placeOrder" :class="{'active': trueNum>=1}">下单</div>
			</div>
		</div>
		<div v-if="isiOS">
			<div class="purchase-list">
				<div class="purchase-info" v-for="(item,index) in carList" :key="index">
					<div @click="selected(item)">
						<label><input type="checkbox" v-model="item.isChecked"><span></span></label>
					</div>
					<div class="img"><img v-lazy="item.picture_url" alt="" /></div>
					<div class="info">
						<p>{{item.goods_name}}</p>
						<p>颜色: 蓝色</p>
						<p>￥{{item.price}}</p>
						<!--<div class="size">
							<div @click="size(index)" v-for="(item,index) in sizeArray" :class="{'active': nowSize == index}">{{item}}</div>
						</div>-->
					</div>
					<div class="add-remove-btn">
						<div class="remove-btn" @click="del(item)"></div>
						<div class="add-btn">
							<a href="javascript:;" @click="removeNum(item,index)">-</a>
							<input type="text" v-model="item.num" />
							<a href="javascript:;" @click="addNum(item,index)">+</a>
						</div>
					</div>
				</div>
			</div>
			<div class="flex-btn">
				<div @click="all">
					<label><input type="checkbox" v-model="isCheckde"><span class=""></span>全选</label>
				</div>
				<div>
					<p>合计 :<i>{{count.toFixed(2)}}</i></p>
					<p>已选 :{{piece}}件</p>
				</div>
				<div @click="placeOrder" :class="{'active': trueNum>=1}">下单</div>
			</div>
		</div>
	</div>

</template>

<script>
	import 'common/css/radio.css'
	import { ERR_CODE } from 'api/config'
	import { CartList, DeteleCart } from 'api/cart'
	import Cart from 'components/shoppingCart/cart'
	import { ShowToast } from 'common/js/loading-toast'
	import { UserInfo } from 'common/js/common'
	import { MessageBox } from 'mint-ui';
	export default {
		data() {
			return {
				cartNull: false,
				value: [],
				value1: ' ',
				isCheckde: false,

				sizeArray: ['默认尺寸', '更换定制'],
				nowSize: null,

				userInfo: '',
				carList: [],
				checkedArray: [],

				count: 0,
				piece: 0,

				nowPiece: 0,
				nowCount: 0,

				list: [],
				goodsList: [],
				trueNum: 0,
				isAndroid: false,
				isiOS: false
			}
		},
		methods: {
			getCartList() {
				let options = {
					openId: this.userInfo.openId
				}
				CartList(options).then(res => {
					if(res.data.code === ERR_CODE) {
						if(res.data.data === null) {
							this.cartNull = true;
						} else {
							this.cartNull = false;
						}
						for(let i = 0; i < res.data.data.length; i++) {
							res.data.data[i].isChecked = false;
						}
						this.carList = res.data.data;
					}
				}).catch(res => {
				})
			},
			selected(item) {
				if(item.isChecked) {
					item.isChecked = false;
					this.trueNum--;
					let price = Number(item.price * item.num);
					this.piece = Number(this.piece - item.num);
					this.count = Number(this.count - price);
					for(let i = 0; i < this.goodsList.length; i++) {
						if(this.goodsList[i].id === item.id) {
							this.goodsList.splice(i, 1);
						}
					}
					this.isCheckde = false;
				} else {
					item.isChecked = true;
						this.trueNum = 0;
					let price = Number(item.price * item.num);
					this.piece = Number(this.piece + item.num);
					this.count = Number(this.count + price);
					this.nowPiece = this.price;
					this.nowCount = this.count;
					for(let i = 0; i < this.carList.length; i++) {
						if(this.carList[i].isChecked) {
							this.trueNum++;
						}
					}
					console.log(this.trueNum)
					if(this.trueNum === this.carList.length) {
						
						this.isCheckde = true;
					}
					let obj = {
						id: item.id,
						goods_num: item.num,
						goods_price: item.price,
						goods_id: item.goods_id,
					}
					this.goodsList.push(obj);
				}
				return;
			},
			all(e) {
				if(this.isCheckde) {
					this.isCheckde = false;
					this.goodsList = [];
					this.trueNum = 0;
					this.count = 0;
					this.piece = 0;
					for(let i = 0; i < this.carList.length; i++) {
						this.carList[i].isChecked = false;

					}
					return;

				} else {
					this.isCheckde = true;
					this.goodsList = [];
					this.count = 0;
					this.piece = 0;
					this.trueNum = this.carList.length;
					for(let i = 0; i < this.carList.length; i++) {

						this.carList[i].isChecked = true;
						const price = Number(this.carList[i].price * this.carList[i].num);

						this.count = Number(this.count + price);

						this.nowCount = this.count;

						this.piece = Number(this.piece + this.carList[i].num);

						let obj = {
							id: this.carList[i].id,
							goods_num: this.carList[i].num,
							goods_price: this.carList[i].price,
							goods_id: this.carList[i].goods_id,
						}
						this.goodsList.push(obj);

					}
					return;
				}

			},
			removeNum(item) {
				if(item.num === 1) {
					return;
				}
				item.num--;
				this.piece--;
				this.count = Number(this.count - item.price);

				for(let i = 0; i < this.goodsList.length; i++) {
					if(this.goodsList[i].id === item.id) {
						this.goodsList[i].goods_num = item.num;
					}
				}
			},
			addNum(item) {
				if(!item.isChecked) return;
				item.num++;
				let price = Number(item.price * (item.num - 1));
				this.piece = this.piece + 1;
				this.count = Number(this.nowCount + price);
				for(let i = 0; i < this.goodsList.length; i++) {
					if(this.goodsList[i].id === item.id) {
						this.goodsList[i].goods_num = item.num;
					}
				}

			},
			size(index) {
				if(index == (this.sizeArray.length - 1)) {
					return;
				}
				this.nowSize = index;
			},
			del(item) {
				MessageBox.confirm('确定删除此件商品吗?').then(action => {
					let options = {
						id: item.id
					}
					DeteleCart(options).then(res => {
						if(res.data.code === ERR_CODE) {
							ShowToast('刪除商品成功')
							this.getCartList();

						}
					})
				}).catch((res) => {})
			},
			placeOrder() {
				if(this.trueNum <= 0) {
					ShowToast('请选择商品')
					return;
				}
				let obj = {
					goodsList: JSON.stringify(this.goodsList),
					count: this.count,
					piece: this.piece,
					list: []
				}
				var list = [];
				for(let i = 0; i < this.carList.length; i++) {
					if(this.carList[i].isChecked) {
						list.push(this.carList[i])
						obj.list.push(this.carList[i])

					}
				}
				this.$router.push({
					name: 'placeOrder',
					params: {
						goodsList: JSON.stringify(this.goodsList),
						count: this.count,
						piece: this.piece,
						list: list
					}
				})
			}
		},
		created() {},
		mounted() {
			this.userInfo = UserInfo();
			this.getCartList();

			var u = navigator.userAgent;
			this.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
			this.isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		},
		components: {
			Cart
		},
	}
</script>

<style scoped>
	#shoppingCart {
		height: 100%;
		background: #f5f5f5;
	}
	
	.purchase-list {
		background: #f5f5f5;
		padding-bottom: 100px;
	}
	
	.purchase-info {
		display: flex;
		padding: 10px 15px;
		margin-bottom: 10px;
		background: #fff;
	}
	
	.purchase-info>div:nth-of-type(1) {
		flex: 0 0 17px;
		width: 17px;
		line-height: 64px;
		text-align: left;
	}
	
	.img {
		flex: 0 0 57px;
		width: 57px;
		height: 64px;
		border: 1px solid #e1e1e1;
		background: #ebeaef;
		line-height: 64px;
		margin: 0 15px 0 10px;
	}
	
	.img img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	
	.info {
		flex: 1;
		color: #333333;
		font-size: 14px;
	}
	
	.info p:nth-of-type(2) {
		font-size: 10px;
		line-height: 28px;
		color: #999999;
	}
	
	.info p:nth-of-type(3) {
		font-size: 13px;
		color: #ff9702;
		margin-bottom: 9px;
	}
	
	.size {
		display: flex;
		flex-wrap: wrap;
	}
	
	.size>div {
		flex: 0 0 81px;
		width: 82px;
		height: 21px;
		text-align: center;
		line-height: 23px;
		font-size: 10px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		border: 1px solid #2d2d2d;
		border-radius: 2px;
		margin-right: 10px;
		margin-bottom: 10px;
	}
	
	.size>div.active {
		background: #4c3622;
		color: #fff;
	}
	
	.add-remove-btn {
		text-align: right;
	}
	
	.remove-btn {
		width: 14px;
		height: 14px;
		display: inline-block;
		background: url(./del-icon.png) no-repeat center center;
		background-size: 14px 14px;
	}
	
	.flex-btn {
		width: 100%;
		height: 44px;
		padding-left: 15px;
		box-sizing: border-box;
		right: 0;
		bottom: 56px;
		left: 0;
		background: #fff;
		position: fixed;
		z-index: 1;
		border-top: 1px solid #e1e1e1;
		display: flex;
	}
	
	.flex-btn>div:nth-of-type(1) {
		flex: 0 0 60px;
		width: 60px;
		line-height: 44px;
		margin-right: 100px;
	}
	
	.flex-btn>div:nth-of-type(2) {
		flex: 1;
		color: #333;
		font-size: 13px;
		margin-top: 8px;
		line-height: 16px;
	}
	
	.flex-btn>div:nth-of-type(2) i {
		color: #ff9702;
		font-style: normal;
	}
	
	.flex-btn>div:nth-of-type(3) {
		flex: 0 0 95px;
		width: 95px;
		height: 44px;
		text-align: center;
		background: #e1e1e1;
		line-height: 44px;
		font-size: 15px;
		color: #fff;
	}
	
	.flex-btn>div:nth-of-type(3).active {
		background: #ff9702;
	}
	
	.flex-btn span {
		margin-right: 10px;
	}
</style>