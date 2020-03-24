import React, {Component} from 'react'
import {HashRouter, Route, Switch} from 'react-router-dom'
import UserList from './list'
import Detail from './detail/index'

class Index extends Component {
  componentDidMount(){
  }
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path={`${this.props.match.path}/list`} component={UserList}/>
          <Route exact path={`${this.props.match.path}/detail/:id`} component={Detail}/>
        </Switch>
      </HashRouter>
    )
  }
}

export default Index