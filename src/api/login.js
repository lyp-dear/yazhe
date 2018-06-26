import axios from 'axios'
import { host } from 'api/config'

//登录
export function GetUserInfo(openId) {
	const url = host + '/user/get';
	let options = {
		openId: openId
	}
	return axios.post(url, options).then((res) => {
		return Promise.resolve(res)
	}).catch((res) => {　

	})
}