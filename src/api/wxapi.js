import axios from 'axios'
import { host } from 'api/config'

export function WxConfig(options) {
	const url = 'http://www.argesz.com/yazhe/common/wxpay/unifiedorder';
	//const url = 'admin/yazhe/common/wxpay/unifiedorder';
	
	return axios.post(url,options).then((res) => {
		return Promise.resolve(res)
	})
}