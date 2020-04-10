import { combineReducers } from 'redux'
import UserInfoReducer from './reducers/userInfoReducer'
import LangReducer from './reducers/langReducer'
import ExplainReducer from './reducers/explainReducer'

const Reducers= combineReducers({
  UserInfoReducer,
  LangReducer,
  ExplainReducer
})

export default Reducers