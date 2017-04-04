import React, {Component} from 'react'
import Header from './Header'
import Player from './Player'
import {transform} from './storage'

class Main extends Component{
  constructor(){
    super()
    this.state={
      currentIndex: '',
      current: {},
      songs: []
    }
  }

  nextSong = (index) => {
    this.setState({current: this.state.songs[index + 1],
      currentIndex: this.state.currentIndex + 1
    })
  }

  prevSong = (index) => {
    this.setState({current: this.state.songs[index - 1],
      currentIndex: this.state.currentIndex - 1
    })
  }

  play = (songs, index) => {
    this.setState({
      songs: songs,
      current: songs[index],
      currentIndex: index
    })
  }

  render(){
    var song = {}
    if (this.state.current.trackId) {
      var song = this.state.current
    } else {
      var song = transform(this.state.current)
    }
    return(
      <div>
        <Header />
        <Player song={song} index={this.state.currentIndex} next={this.nextSong} prev={this.prevSong} count={this.state.songs.length} />
        {this.props.children && React.cloneElement(this.props.children,{
          play: this.play,
          current: this.state.current
        })}
      </div>
    )
  }
}

export default Main
