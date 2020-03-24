import React, {Component} from 'react'
import {HashRouter, Route, Switch} from 'react-router-dom'
import Login from './login/loginForm'

class Index extends Component {
  componentDidMount(){
  }
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path='/auth/login' component={Login}/>
        </Switch>
      </HashRouter>
    )
  }
}

export default Index