import axios from 'axios'
import { host } from 'api/config'

export function AddAddress(options) {
	const url = host + '/user/address/insert';
	return axios.post(url, options).then((res) => {
		return Promise.resolve(res)
	}).catch((res) => {　

	})
}

export function AddressList(openId) {
	const url = host + '/user/address/list';
	let options = {
		openId: openId
	}
	return axios.post(url, options).then((res) => {
		return Promise.resolve(res)
	}).catch((res) => {　

	})
}
export function DeleteAddress(options) {
	const url = host + '/user/address/update';
	return axios.post(url, options).then((res) => {
		return Promise.resolve(res)
	}).catch((res) => {　

	})
}

export function DefalutAddress(options) {
	const url = host + '/user/address/update';
	return axios.post(url, options).then((res) => {
		return Promise.resolve(res)
	}).catch((res) => {　

	})

}