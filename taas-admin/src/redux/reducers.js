import { combineReducers } from 'redux'
import UserInfoReducer from './reducers/userInfoReducer'
// import ReduceReducer from './reducers/reduceReducer'

const Reducers= combineReducers({
  UserInfoReducer,
    // ReduceReducer
})

export default Reducers