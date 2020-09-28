import {
	DEVICE_LIST_REQUEST,
	DEVICE_LIST_SUCCESS,
	DEVICE_LIST_FAIL,
	DEVICE_DETAILS_REQUEST,
	DEVICE_DETAILS_SUCCESS,
	DEVICE_DETAILS_FAIL,
	DEVICE_SAVE_REQUEST,
	DEVICE_SAVE_SUCCESS,
	DEVICE_SAVE_FAIL,
	DEVICE_DELETE_SUCCESS,
	DEVICE_DELETE_FAIL,
	DEVICE_DELETE_REQUEST
} from '../constants/deviceConstants';
import axios from 'axios';

export const listDevices = (category = '', searchKeyword = '', sortOrder = '') => async (
	dispatch: (arg0: { type: string; payload?: any }) => void
) => {
	try {
		console.log({ listDevices: 'listDevices' });
		dispatch({ type: DEVICE_LIST_REQUEST });
		const { data } = await axios.get(
			'/api/devices?category=' +
				category +
				'&searchKeyword=' +
				searchKeyword +
				'&sortOrder=' +
				sortOrder.toLowerCase()
		);
		console.log({ listDevices: data });
		dispatch({ type: DEVICE_LIST_SUCCESS, payload: data });
	} catch (error) {
		dispatch({ type: DEVICE_LIST_FAIL, payload: error.message });
	}
};

export const saveDevice = (device: {
	_id: string;
	device_name?: string;
	application?: number;
	url?: string;
	place_of_purchase?: string;
	date_of_purchase?: string;
	category?: string;
	card?: number;
	amount?: string;
}) => async (
	dispatch: (arg0: { type: string; payload: any }) => void,
	getState: () => { userLogin: { userInfo: any } }
) => {
	console.log({ deviceActions: device });
	try {
		dispatch({ type: DEVICE_SAVE_REQUEST, payload: device });
		const { userLogin: { userInfo } } = getState();
		if (!device._id) {
			const { data } = await axios.post('/api/devices', device, {
				headers: {
					Authorization: 'Bearer ' + userInfo.token
				}
			});
			dispatch({ type: DEVICE_SAVE_SUCCESS, payload: data });
		} else {
			const { data } = await axios.put('/api/devices/' + device._id, device, {
				headers: {
					Authorization: 'Bearer ' + userInfo.token
				}
			});
			dispatch({ type: DEVICE_SAVE_SUCCESS, payload: data });
		}
	} catch (error) {
		dispatch({ type: DEVICE_SAVE_FAIL, payload: error.message });
	}
};

export const detailsDevice = (id: string) => async (dispatch: (arg0: { type: string; payload: any }) => void) => {
	try {
		console.log({ listDevices: 'listDevices' });
		dispatch({ type: DEVICE_DETAILS_REQUEST, payload: id });
		const { data } = await axios.get('/api/devices/' + id);
		dispatch({ type: DEVICE_DETAILS_SUCCESS, payload: data });
	} catch (error) {
		dispatch({ type: DEVICE_DETAILS_FAIL, payload: error.message });
	}
};

export const deleteDevice = (deviceId: string) => async (
	dispatch: (arg0: { type: string; payload: any; success?: boolean }) => void,
	getState: () => { userLogin: { userInfo: any } }
) => {
	try {
		const { userLogin: { userInfo } } = getState();
		dispatch({ type: DEVICE_DELETE_REQUEST, payload: deviceId });
		const { data } = await axios.delete('/api/devices/' + deviceId, {
			headers: {
				Authorization: 'Bearer ' + userInfo.token
			}
		});
		dispatch({ type: DEVICE_DELETE_SUCCESS, payload: data, success: true });
	} catch (error) {
		dispatch({ type: DEVICE_DELETE_FAIL, payload: error.message });
	}
};
