import axios from 'axios'
import { host } from 'api/config'
export function Detail(goods_id,openId) {
	const url = host + '/goods/detail';
	return axios.post(url,{
		goods_id:goods_id,
		openId:openId
	}).then((res) => {
		return Promise.resolve(res)
	}).catch((res) => {　

	})
}