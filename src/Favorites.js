import React, { Component } from 'react';
import Playlist from './Playlist'
import {price, remove} from './storage'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class Favorites extends Component{
  constructor(){
    super()
    this.state = {
      playlist: [],
      price: 0
    }
  }

  componentDidMount() {
    this.checkPrice()
    const playlist = JSON.parse(localStorage.getItem('favourites')) || []
    this.setState({playlist: playlist})
  }

  checkPrice = () => {
    this.setState({price: price() })
  }

  del = (track) => (e) => {
    remove(track)
    const playlist = JSON.parse(localStorage.getItem('favourites')) || []
    this.setState({playlist: playlist})
    this.checkPrice()
  }

  playSong = (songs,index) => (e) => {
    this.props.play(songs, index)
  }

  render(){
    const playlist = this.state.playlist || []
    return(
      <MuiThemeProvider>
        <div style={{marginBottom:100, marginTop: 50}}>
          <Playlist songs={playlist} play={this.playSong} del={this.del} currentId={this.props.current.trackId}/>
          <h3>Price {this.state.price}$</h3>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default Favorites
