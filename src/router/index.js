import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const Index = resolve => require(['components/index/index.vue'], resolve);
const Detail = resolve => require(['components/detail/detail.vue'], resolve);
const ClassifyList = resolve => require(['components/classify/classifyList.vue'], resolve);
const ShoppingCart = resolve => require(['components/shoppingCart/shoppingCart.vue'], resolve);
const PlaceOrder = resolve => require(['components/placeOrder/placeOrder.vue'], resolve);
const My = resolve => require(['components/my/my.vue'], resolve);
const MySize = resolve => require(['components/mySize/mySize.vue'], resolve);
const MyOrder = resolve => require(['components/myOrder/myOrder.vue'], resolve);
const Team = resolve => require(['components/team/team.vue'], resolve);
const MyAddress = resolve => require(['components/myAddress/myAddress.vue'], resolve);
const MyUpper = resolve => require(['components/myUpper/myUpper.vue'], resolve);
//const ShoppingCartNull = resolve => require(['components/shoppingCart/shoppingCartNull.vue'], resolve);

export default new Router({
	routes: [{
		path: '/',
		name: 'index',
		component: Index
	}, {
		path: '/index',
		component: Index
	}, {
		path: '/detail',
		name: 'detail',
		component: Detail
	}, {
		path: '/classifyList',
		component: ClassifyList,
	}, {
		path: '/shoppingCart',
		component: ShoppingCart
	}, {
		path: '/my',
		component: My
	}, {
		path: '/my-size',
		component: MySize
	}, {
		path: '/my-address',
		component: MyAddress
	}, {
		path: '/my-upper',
		component: MyUpper
	}, {
		path: '/myOrder',
		component: MyOrder

	}, {
		path: '/team',
		component: Team

	}, {
		path: '/placeOrder',
		name: 'placeOrder',
		component: PlaceOrder
	}]
})