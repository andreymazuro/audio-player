import React, { Component } from 'react';
import fetchJsonp from 'fetch-jsonp'
import {checked, check} from './storage'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Checkbox from 'material-ui/Checkbox';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import Player from './Player'
import TextField from 'material-ui/TextField';
import {darkBlack} from 'material-ui/styles/colors';
import {Link} from 'react-router'
import Snackbar from 'material-ui/Snackbar';
injectTapEventPlugin();



class Main extends Component {
  constructor(){
    super()
    this.state = {
      tracks: [],
      current: {},
      currentIndex: -1,
      artist: '',
      track: '',
      price: '',
      openBot: false
    }
  }

  playSong = (song,index) => (e) => {
    this.setState({
      current:song,
      currentIndex: index,
    })
  }

  nextSong = (index) => {
    this.setState({
      current: this.state.tracks[index + 1],
      currentIndex: this.state.currentIndex + 1
    })
  }

  prevSong = (index) => {
    this.setState({
      current: this.state.tracks[index - 1],
      currentIndex: this.state.currentIndex - 1
    })
  }

  findSong = (track) => {
    var url = `https://itunes.apple.com/search?term=${track}&entity=song&limit=10`
    fetchJsonp(url)
    .then(response => response.json())
    .then(res => this.setState({tracks: res.results}))
    .catch(er => console.log(er))
  }

  add = (track) => (e, isInputChecked) => {
    if (isInputChecked) {
      this.setState({openBot: true})
    }
    checked(track, isInputChecked)
  }

  update = (e) => {
    const track = this.refs.song.getValue()
    this.findSong(track)
    this.setState({currentIndex: -1})
  }

  handleRequestClose = () => {
    this.setState({
      openBot: false,
    });
  };

  render() {
    const tracks = this.state.tracks || []
    const current = this.state.current
    const currentIndex = this.state.currentIndex
    return (
      <MuiThemeProvider>
        <div>
          <div>
            <Player song={current} index={currentIndex} next={this.nextSong} prev={this.prevSong} count={tracks.length}/>
            <TextField
              ref="song"
              onChange={this.update}
              defaultValue=""
              floatingLabelText="Song:"
              style={{width: 500}}
            />
            <div style={{height:20}}>
              <List style={{marginBottom:90}}>
              {tracks.map((track,index) =>
                <div key={index} onDoubleClick={this.playSong(track, index)}>
                  {(this.state.currentIndex !== index)? (
                  <ListItem
                    primaryText={<p>Track: {track.trackName}</p>}
                    secondaryText={
                      <p>
                        <span style={{color: darkBlack, marginBottom: 10}}>Artist: {track.artistName}</span><br />
                        Price: {track.trackPrice}$
                      </p>
                    }
                    secondaryTextLines={2}
                    leftAvatar={<Link to={`/artistInfo/${track.artistName}/`}><Avatar size={55} src={track.artworkUrl100} style={{marginTop:18}}/></Link>}
                    rightIcon={<Checkbox
                                  defaultChecked={check(track)}
                                  onCheck={this.add(track)}
                                  checkedIcon={<ActionFavorite />}
                                  uncheckedIcon={<ActionFavoriteBorder />}
                                />}
                  />
                      ) : (
                  <ListItem
                    primaryText={<p>Name: {track.trackName}</p>}
                    secondaryText={
                      <p>
                        <span style={{color: darkBlack, marginBottom: 10}}>Artist: {track.artistName}</span><br />
                        Price: {track.trackPrice}$
                      </p>
                    }
                    secondaryTextLines={2}
                    rightIcon={<div>
                                  <Checkbox
                                    defaultChecked={check(track)}
                                    onCheck={this.add(track)}
                                    checkedIcon={<ActionFavorite />}
                                    uncheckedIcon={<ActionFavoriteBorder />}
                                  />
                                  <i className="material-icons">volume_up</i>
                                </div>
                    }
                    leftAvatar={<Avatar size={55} src={track.artworkUrl100}   style={{marginTop:18}}/>}
                  />
                  )}
                </div>
                )}
              </List>
            </div>
          </div>
          <Snackbar
            open={this.state.openBot}
            message="Track added to your playlist"
            autoHideDuration={1500}
            onRequestClose={this.handleRequestClose}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main
