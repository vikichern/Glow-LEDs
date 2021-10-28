import {
	SETTING_LIST_REQUEST,
	SETTING_LIST_SUCCESS,
	SETTING_LIST_FAIL,
	SETTING_DETAILS_REQUEST,
	SETTING_DETAILS_SUCCESS,
	SETTING_DETAILS_FAIL,
	SETTING_SAVE_REQUEST,
	SETTING_SAVE_SUCCESS,
	SETTING_SAVE_FAIL,
	SETTING_DELETE_SUCCESS,
	SETTING_DELETE_FAIL,
	SETTING_DELETE_REQUEST,
	SHOW_SEARCH_BAR,
	HIDE_SEARCH_BAR
} from '../constants/settingConstants';
import axios from 'axios';

export const listSettings = (category = '', search = '', sortOrder = '') => async (
	dispatch: (arg0: { type: string; payload?: any }) => void,
	getState: () => { userLogin: { userInfo: any } }
) => {
	try {
		dispatch({ type: SETTING_LIST_REQUEST });
		const { userLogin: { userInfo } } = getState();
		const { data } = await axios.get(
			'/api/settings?category=' + category + '&search=' + search + '&sortOrder=' + sortOrder.toLowerCase(),
			{
				headers: {
					Authorization: 'Bearer ' + userInfo.access_token
				}
			}
		);
		dispatch({ type: SETTING_LIST_SUCCESS, payload: data });
	} catch (error) {
		console.log({ error });
		dispatch({ type: SETTING_LIST_FAIL, payload: error });
	}
};
export const show_search_bar = (show: boolean) => async (dispatch: (arg0: { type: string; payload?: any }) => void) => {
	try {
		if (show) {
			console.log('show_search_bar');
			dispatch({ type: SHOW_SEARCH_BAR, payload: show });
			console.log('hide_search_bar');
		} else {
			dispatch({ type: HIDE_SEARCH_BAR, payload: show });
		}
	} catch (error) {
		console.log({ error });
	}
};

// export const hide_search_bar = () => async (dispatch: (arg0: { type: string; payload?: any }) => void) => {
// 	console.log('hide_search_bar');
// 	try {
// 		dispatch({ type: HIDE_SEARCH_BAR });
// 	} catch (error) {
// 		console.log({ error });
// 	}
// };

export const saveSetting = (setting: any) => async (
	dispatch: (arg0: { type: string; payload: any }) => void,
	getState: () => { userLogin: { userInfo: any } }
) => {
	console.log({ settingActions: setting });
	try {
		dispatch({ type: SETTING_SAVE_REQUEST, payload: setting });
		const { userLogin: { userInfo } } = getState();
		if (!setting._id) {
			const { data } = await axios.post('/api/settings', setting, {
				headers: {
					Authorization: 'Bearer ' + userInfo.access_token
				}
			});
			dispatch({ type: SETTING_SAVE_SUCCESS, payload: data });
		} else {
			const { data } = await axios.put('/api/settings/' + setting._id, setting, {
				headers: {
					Authorization: 'Bearer ' + userInfo.access_token
				}
			});
			dispatch({ type: SETTING_SAVE_SUCCESS, payload: data });
		}
	} catch (error) {
		console.log({ error });
		dispatch({ type: SETTING_SAVE_FAIL, payload: error });
	}
};

export const detailsSetting = (pathname: string) => async (
	dispatch: (arg0: { type: string; payload: any }) => void,
	getState: () => { userLogin: { userInfo: any } }
) => {
	try {
		dispatch({ type: SETTING_DETAILS_REQUEST, payload: pathname });
		const { userLogin: { userInfo } } = getState();
		const { data } = await axios.get('/api/settings/' + pathname, {
			headers: {
				Authorization: 'Bearer ' + userInfo.access_token
			}
		});
		dispatch({ type: SETTING_DETAILS_SUCCESS, payload: data });
	} catch (error) {
		console.log({ error });
		dispatch({ type: SETTING_DETAILS_FAIL, payload: error });
	}
};

export const deleteSetting = (settingId: string) => async (
	dispatch: (arg0: { type: string; payload: any; success?: boolean }) => void,
	getState: () => { userLogin: { userInfo: any } }
) => {
	try {
		const { userLogin: { userInfo } } = getState();
		dispatch({ type: SETTING_DELETE_REQUEST, payload: settingId });
		const { data } = await axios.delete('/api/settings/' + settingId, {
			headers: {
				Authorization: 'Bearer ' + userInfo.access_token
			}
		});
		dispatch({ type: SETTING_DELETE_SUCCESS, payload: data, success: true });
	} catch (error) {
		console.log({ error });
		dispatch({ type: SETTING_DELETE_FAIL, payload: error });
	}
};
