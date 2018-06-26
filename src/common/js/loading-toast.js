import { Toast } from 'mint-ui';
import { Indicator } from 'mint-ui';

export function ShowToast(msg) {
	Toast({
		message: msg,
		position: 'bottom',
		duration: 3000
	});
}

export function Loading(isClose) {
	if(isClose) {
		Indicator.close();
		return;
	}
	Indicator.open('加载中...');

}