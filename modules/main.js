import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link , hashHistory } from 'react-router'
import Home from './home'
import App from './app'

render((
  <Router history={hashHistory}>
        <Route path="/" component={App} >
                <Route path="/home" component={Home} />
        </Route>
  </Router>
), document.getElementById('app'))
