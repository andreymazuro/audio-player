import React, { Component } from 'react';
import Playlist from './Playlist'
import {price, remove} from './storage'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Player from './Player'

class Favorites extends Component{
  constructor(){
    super()
    this.state = {
      playlist: [],
      price: 0,
      current: {},
      currentIndex: -1
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

  playSong = (song,index) => (e) => {
    this.setState({
      current:song,
      currentIndex: index,
    })
  }

  nextSong = (index) => {
    this.setState({
      current: this.state.playlist[index + 1],
      currentIndex: this.state.currentIndex + 1
    })
  }

  prevSong = (index) => {
    this.setState({
      current: this.state.playlist[index - 1],
      currentIndex: this.state.currentIndex - 1
    })
  }


  render(){
    const playlist = this.state.playlist || []
    const current = this.state.current
    const currentIndex = this.state.currentIndex
    const favorites = this.state.playlist
    const currentId = this.state.current.trackId
    return(
      <MuiThemeProvider>
        <div style={{marginBottom:100}}>
          <Playlist songs={favorites} play={this.playSong} del={this.del} currentInd={currentIndex} currentId={currentId}/>
          <Player song={current} index={currentIndex} next={this.nextSong} prev={this.prevSong} count={playlist.length}/>
          <h3>Price {this.state.price}$</h3>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default Favorites
