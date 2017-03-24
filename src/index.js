import React from 'react';
import ReactDOM from 'react-dom';
import Search from './App';
import Info from './Info';
import MainPage from './Main';
import Header from './Header';
import Favorites from './Favorites'
import './App.css';
import { Router, Route, browserHistory } from 'react-router'

ReactDOM.render((
  <Router history={browserHistory}>
    <Route component={Header}>
      <Route path="/" component={MainPage}/>
      <Route path="/search" component={Search}/>
      <Route path="/artistInfo/:name/" component={Info}/>
      <Route path="/favorites" component={Favorites}/>
    </Route>
  </Router>
), document.getElementById('root'))
