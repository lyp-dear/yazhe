import axios from 'axios'
import { host } from 'api/config'

export function AddCart(options) {
	const url = `${host}/goods/shopcar/insert`;
	return axios.post(url, options).then((res) => {
		return Promise.resolve(res)
	}).catch((res) => {　

	})

}

export function CartNumber(options) {
	const url = `${host}/goods/shopcar/count`;
	return axios.post(url, options).then((res) => {
		return Promise.resolve(res)
	}).catch((res) => {　

	})
}

export function CartList(options) {
	const url = `${host}/goods/shopcar/list`;
	return axios.post(url, options).then((res) => {
		return Promise.resolve(res)
	}).catch((res) => {　

	})
}

export function DeteleCart(options) {
	const url = `${host}/goods/shopcar/update`;
	return axios.post(url, options).then((res) => {
		return Promise.resolve(res)
	}).catch((res) => {　

	})
}