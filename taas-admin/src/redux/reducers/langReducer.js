
import * as actions from '../action'

const initialState = {
  lang: 'zh_CN',
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_LANG_TYPE:
      return Object.assign({}, state, {
        lang: action.lang
      })
    default:
      return state
  }
}
export default reducer