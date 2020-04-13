
import * as actions from '../action'
import { explain as exp } from '../../utils/utils'

const initialState = {
  explain: exp
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_ZH_EXPLAIN:
      return Object.assign({}, state, {
        explain: action.explain
      })
    case actions.SET_EN_EXPLAIN:
      let enExplain = {}
      Object.keys(action.explain).forEach(key => {
        enExplain[key] = key
      })
      return {explain: enExplain}
    default:
      return state
  }
}

export default reducer