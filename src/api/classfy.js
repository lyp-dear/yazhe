import axios from 'axios'
import { host } from './config'

export function ClassfyList(options) {

	//const url = '/admin/yazhe/cagegory/list';
	const url = 'http://www.argesz.com/yazhe/cagegory/list';
	
	return axios.post(url, options).then((res) => {
		return Promise.resolve(res)
	}).catch((res) => {　

	})
}


export function GoodsList(options) {
	const url = `${host}/index/goods`;
	return axios.post(url, options).then((res) => {
		return Promise.resolve(res)
	}).catch((res) => {　

	})
}