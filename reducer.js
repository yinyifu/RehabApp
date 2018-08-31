// load sound
import {SETTING_CHANGED} from './actionTypes'
export function setting(state, action) {
  
  if (typeof state === 'undefined') {
    return {}
  }

  //console.log(action);
  switch (action.type) {

    case SETTING_CHANGED:
      return Object.assign({}, state, {
        id: action.id,
        feedback: action.feedback
      });
    default:
      return state;
  }
}