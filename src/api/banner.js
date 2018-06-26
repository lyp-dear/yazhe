import axios from 'axios'
import { host } from 'api/config'

export function BannerList() {
	const url = host + '/index/banner';
	return axios.post(url).then((res) => {
		return Promise.resolve(res)
	}).catch((res) => {　

	})
}