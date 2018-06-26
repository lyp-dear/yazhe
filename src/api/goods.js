import axios from 'axios'
import { host } from 'api/config'

export function GoodsList(currentPage) {
	const url = `${host}/index/goods`;
	let options = {
		pageSize: 10,
		currentPage: currentPage,
	}
	return axios.post(url, options).then((res) => {
		return Promise.resolve(res)
	}).catch((res) => {　

	})
}

