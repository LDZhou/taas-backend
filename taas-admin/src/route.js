import React, {Component} from 'react'
import {Route, Switch, HashRouter} from 'react-router-dom'
import './App.css'
import Homepage from './components/homepage'
import Auth from './components/auth/index'
import {checkLogin} from './utils/utils'

class AppRoute extends Component {
  
  componentDidMount () {
    checkLogin(this)
  }
  
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route path='/auth' component={Auth}/>
          <Route path='/app' component={Homepage}/>
        </Switch>
      </HashRouter>
    )
  }
}

export default AppRoute