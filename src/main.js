import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import FastClick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import { ShowToast, Loading } from 'common/js/loading-toast'
//import vConsole from 'vconsole';
import { Button, Cell, Navbar, Tabbar, TabItem, TabContainer, TabContainerItem, Loadmore, Swipe, SwipeItem, Checklist, MessageBox, Popup, Field, Picker, Spinner, InfiniteScroll, Indicator } from 'mint-ui'
Vue.config.productionTip = false
Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)
Vue.component(Navbar.name, Navbar);
Vue.component(Tabbar.name, Tabbar)
Vue.component(TabItem.name, TabItem)
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
Vue.component(Loadmore.name, Loadmore);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Checklist.name, Checklist);
Vue.component(Popup.name, Popup);
Vue.component(Field.name, Field);
Vue.component(Picker.name, Picker);
Vue.component(Spinner.name, Spinner);
Vue.use(InfiniteScroll);

Vue.use(VueLazyload, {
  loading: require('./assets/loading.gif')
})
FastClick.attach(document.body)

axios.interceptors.request.use(function(config) {
	Loading();
	return config;
}, function(error) {});

axios.interceptors.response.use(function(response) {
	Loading(true);
	if(response.config.url === 'http://www.argesz.com/yazhe/common/wxpay/unifiedorder') {
		return response;

	}
	if(response.data.code != 0) {
		ShowToast(response.data.msg)
	}
	return response;
}, function(error) {
	Loading(true);
	ShowToast('网络错误,请稍候!')
	// 对响应错误做点什么
});
/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	render: h => h(App)
})