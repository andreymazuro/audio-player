import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Tabs, Tab} from 'material-ui/Tabs';
import {Link} from 'react-router'

class Header extends Component{
  render(){
    return(
    <div>
      <MuiThemeProvider>
        <Tabs>
          <Tab label="Home" containerElement={<Link to="/"/>} />
          <Tab containerElement={<Link to="/favorites"/>} label="Favorites" />
        </Tabs>
      </MuiThemeProvider>
      {this.props.children}
    </div>
    )
  }
}

export default Header
