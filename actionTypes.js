export const SETTING_CHANGED = "SETTING_CHANGED"
import { createStore } from 'redux'
import { setting } from './reducer'
export var store = createStore(setting, settingChng("none", {}));

/*export function createStoreFrom(initialState){
	store = createStore(setting, initialState);
}*/

//console.log(store.getState());

export function SettingChanged(id, feedback) {
	//console.log(feedback);
	store.dispatch(settingChng(id, feedback));
}

function settingChng(id, feedback){
	return {
	  type: SETTING_CHANGED,
	  feedback: feedback,
	  id: id
	}
}