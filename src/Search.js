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
import TextField from 'material-ui/TextField';
import {darkBlack} from 'material-ui/styles/colors';
import {Link} from 'react-router'
import Snackbar from 'material-ui/Snackbar';
injectTapEventPlugin();



class Search extends Component {
  constructor(){
    super()
    this.state = {
      tracks: [],
      artist: '',
      track: '',
      price: '',
      openBot: false
    }
  }


  playSong = (song,index) => (e) => {
    this.props.play(this.state.tracks, index)
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
  }

  handleRequestClose = () => {
    this.setState({
      openBot: false,
    });
  };

  stopPropog = (e) => {
    e.stopPropagation();
  }

  render() {
    const tracks = this.state.tracks || []
    var id = this.props.current.trackId
    return (
      <MuiThemeProvider>
        <div>
          <div>
            <TextField
              ref="song"
              onChange={this.update}
              defaultValue=""
              floatingLabelText="Song:"
              style={{width: '80%', marginTop: 50}}
            />
            <div style={{height:20}}>
              <List style={{marginBottom:90}}>
                {tracks.map((track,index) =>
                  <div key={index}>
                    <ListItem
                      onClick={this.playSong(track, index)}
                      primaryText={<p>Track: {track.trackName}</p>}
                      secondaryText={
                        <p>
                          <span style={{color: darkBlack, marginBottom: 10}}>Artist: {track.artistName}</span><br />
                                      Price: {track.trackPrice}$
                        </p>
                                    }
                      secondaryTextLines={2}
                      leftAvatar={<div onClick={this.stopPropog}>
                                    <Link to={`/artistInfo/${track.artistName}/`}><Avatar size={40} src={track.artworkUrl100} style={{marginTop:5, zIndex: 100}}/></Link>
                                  </div>
                                 }
                      rightIcon={
                        <div onClick={this.stopPropog}>
                          <Checkbox
                            checkedIcon={<ActionFavorite />}
                            uncheckedIcon={<ActionFavoriteBorder />}
                            defaultChecked={check(track)}
                            onCheck={this.add(track)}
                            style={{marginTop:20}}
                          />
                                  {(id == track.trackId) ? (
                                     <i className="material-icons">volume_up</i>) : (null)}
                        </div>
                      }
                    />
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

export default Search
