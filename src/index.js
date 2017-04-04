import React from 'react';
import ReactDOM from 'react-dom';
import Search from './Search';
import Info from './Info';
import Main from './Main';
import Home from './Home'
import Favorites from './Favorites'
import './App.css';
import { Router, Route, browserHistory } from 'react-router'

ReactDOM.render((
  <Router history={browserHistory}>
    <Route component={Main}>
      <Route path="/" component={Home}/>
      <Route path="/search" component={Search}/>
      <Route path="/artistInfo/:name/" component={Info}/>
      <Route path="/favorites" component={Favorites}/>
    </Route>
  </Router>
), document.getElementById('root'))
