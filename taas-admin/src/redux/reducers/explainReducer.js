
import * as actions from '../action'
import { explain } from '../../utils/utils'

const initialState = {
  explain
}

let enExplain = {}

Object.keys(explain).forEach(key => {
  enExplain[key] = key
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_ZH_EXPLAIN:
      return explain
    case actions.SET_EN_EXPLAIN:
      return {explain: enExplain}
    default:
      return state
  }
}

export default reducer