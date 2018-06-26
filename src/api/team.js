import axios from 'axios'
import { host } from 'api/config'
export function Top(id){
	const url = `http://www.argesz.com/yazhe/mobile/user/team/parent`;
	let options = {
		parentId: id
	}
	console.log(options)
	return axios.post(url, options).then((res) => {
		return Promise.resolve(res)
	}).catch((res) => {　

	})
}

export function Bot(id){
	const url = `http://www.argesz.com/yazhe/mobile/user/team/son`;
	let options = {
		id: id,
		pageSize: 100
	}
	return axios.post(url, options).then((res) => {
		return Promise.resolve(res)
	}).catch((res) => {　

	})
}