
import * as actions from '../action'

const userInfo = window.localStorage.getItem('userInfo')
const initialState = {
  userInfo: userInfo ? JSON.parse(userInfo) : {},
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SAVE_USER_INFO:
      return Object.assign({}, state, {
        userInfo: action.userInfo
      })
    case actions.DELETE_USER_INFO:
      return Object.assign({}, state, {
        userInfo: {}
      })
    default:
      return state
  }
}
export default reducer