import React from 'react';
import ReactDOM from 'react-dom';
import Main from './App';
import Info from './Info';
import Header from './Header';
import Favorites from './Favorites'
import './App.css';
import { Router, Route, browserHistory } from 'react-router'

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={Header}>
      <Route path="/home" component={Main}/>
      <Route path="/artistInfo/:name/" component={Info}/>
      <Route path="/favorites" component={Favorites}/>
    </Route>
  </Router>
), document.getElementById('root'))
