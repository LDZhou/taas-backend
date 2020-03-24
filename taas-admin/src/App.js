import React, { Component } from 'react'
import { Route, HashRouter } from 'react-router-dom'
import './App.css'
import 'braft-editor/dist/index.css'
import AppRoute from './route'

class App extends Component {
  render() {
    return (
      <HashRouter>
          <Route path='/' component={AppRoute}/>
      </HashRouter>
    )
  }
}

export default App