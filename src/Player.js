import React, { Component } from 'react';
import Subheader from 'material-ui/Subheader';
import Slider from 'material-ui/Slider';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {format} from './storage'
import R from 'ramda'


class Player extends Component{
  constructor(){
    super()
    this.state={
      timer: '00:00',
      playing: false,
      progresSlider: 0,
      volumeSlider: 50,
      disabled: true
    }
  }

  componentWillReceiveProps(nextProps){
    const eq = R.equals(this.props, nextProps)
    if (!R.isEmpty(nextProps.song) && !eq) {
  //    this.refs.audio.play()
      this.setState({
        playing: true,
        disabled: false
      })

    this.refs.audio.load()
    }
  }

  componentWillMount() {
  this.interval = setInterval(() => {
      const time = this.refs.audio.currentTime
      if (time === this.refs.audio.duration) {
        this.setState({playing:false})
        this.props.next(this.props.index)
      }
      this.setState({
        timer: '00:' + format(time),
        progresSlider: time
      })
    },500)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  forward = (e,value) => {
    this.setState({progresSlider: value})
    this.refs.audio.currentTime = value
  }

  volume = (e,value) => {
    this.setState({volumeSlider: value})
    this.refs.audio.volume = value/100
  }

  play = () => {
    this.refs.audio.play()
    this.setState({
        playing: true
    })
  }

  next = () => {
    if (this.props.index !== this.props.count -1) {
      this.props.next(this.props.index)
    }
    else
    {
      this.refs.audio.currentTime = 0
      this.stop()
    }
  }

  previous = () => {
    if (this.props.index !== 0) {
      this.props.prev(this.props.index)
    }
    else {
      this.refs.audio.currentTime = 0
      this.stop()
    }
  }

  stop = () => {
    this.refs.audio.pause()
    this.setState({
      playing: false
    })
  }


  render() {
    const song = this.props.song
    var artist = song.artistName
    return(
      <MuiThemeProvider>
        <div className="player">
          <div className="song-info">
            <Subheader style={{height:5}}>{artist? ('Artist:' + artist) : ('')}</Subheader>
            <Subheader style={{height:5, marginTop:8}}>{song.trackName? ('Song:' + song.trackName + ' ' + this.state.timer) : ('')}</Subheader>
          </div>
          <div className="main-player">
            <div className="inline">
              <audio ref="audio" autoPlay="autoplay" id="audio" src={song.previewUrl} ></audio>
              <i className="material-icons" onClick={this.previous}>skip_previous</i>
              <i className="material-icons" onClick={this.next}>skip_next</i>
              {this.state.playing ? (
                <StopButton stop={this.stop}/>
              ) : (
                <StartButton play={this.play}/>
              )}
            </div>
            <div className="inline">
              <Slider
                style={{width: 300}}
                disabled={this.state.disabled}
                min={0}
                max={30}
                defaultValue={0}
                value={this.state.progresSlider}
                onChange={this.forward}
              />
            </div>
            <div className="inline" id="volume">
              <Slider
                style={{width: 100}}
                min={0}
                max={100}
                defaultValue={50}
                onChange={this.volume}
              />
            </div>
          </div>
        </div>
      </MuiThemeProvider>

    )
  }
}

const StopButton = (props) =>  <i onClick={props.stop} className="material-icons md-36">pause</i>

const StartButton = (props) => <i onClick={props.play} className="material-icons md-36">play_arrow</i>

export default Player
