import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Tabs, Tab} from 'material-ui/Tabs';
import {Link} from 'react-router'

class Header extends Component{
  render(){
    return(
    <div>
      <MuiThemeProvider>
        <Tabs
        tabItemContainerStyle={{position: "fixed", top:"0", zIndex:'30'}}
        >
          <Tab label="Home" containerElement={<Link to="/"/>} />
          <Tab label="Search" containerElement={<Link to="/search"/>} />
          <Tab containerElement={<Link to="/favorites"/>} label="Favorites" />
        </Tabs>
      </MuiThemeProvider>
    </div>
    )
  }
}

export default Header
