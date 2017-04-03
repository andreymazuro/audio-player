import React, { Component } from 'react';
import {convert, getImages, check, checked} from './storage'
import fetchJsonp from 'fetch-jsonp'
import R from 'ramda'
import {GridList, GridTile} from 'material-ui/GridList';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Link} from 'react-router'
import Player from './Player'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import Snackbar from 'material-ui/Snackbar';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
    marginBottom: 50
  },
  titleStyle: {
    color: 'white',
  },
};

const customContentStyle = {
  width: '75%',
  maxWidth: 'none',
};


class Info extends Component{
  constructor(){
    super();
    this.state={
      artistInfo: '',
      image: '',
      albums: [],
      open: false,
      similar: [],
      tracks:[],
      current: {},
      currentIndex: -1,
      openBot: false
    }
  }


  componentWillReceiveProps(nextProps){
    if (this.props.params.name !== nextProps.params.name) {
      this.getInfo(nextProps.params.name)
    }
    window.scrollTo(0, 0)
  }

  nextSong = (index) => {
    this.setState({current: this.state.tracks[index + 1],
      currentIndex: this.state.currentIndex + 1
    })
  }

  prevSong = (index) => {
    this.setState({current: this.state.tracks[index - 1],
      currentIndex: this.state.currentIndex - 1
    })
  }


  getInfo = (name) => {
    var url = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${name}&api_key=f6a8bf9ddddbea49fb6e81d04516b6b6&format=json`
    fetch(url)
    .then(response => response.json())
    .then(res => this.setState({
      artistInfo: res.artist.bio,
      image: res.artist.image[4],
      similar: res.artist.similar.artist
      })
    )
    .catch(er => console.log(er))

    fetchJsonp(`https://itunes.apple.com/search?term=${name}`)
    .then(response => response.json())
    .then(res => this.getAlbums(res))
    .catch(er => console.log(er))
  }

  componentDidMount() {
    this.getInfo(this.props.params.name)
  }

  getAlbums = (res) => {
    const id = res.results[0].artistId
    this.setState({tracks: res.results})
    var url = `https://itunes.apple.com/lookup?id=${id}&entity=album`
    fetchJsonp(url)
    .then(response => response.json())
    .then(res => this.setState({albums: res.results}))
    .catch(er => console.log(er))
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  cellClicked = (rowNumber, columnId,e) => {
    if (columnId !== 1) {
      this.setState({
        current:this.state.tracks[rowNumber],
        currentIndex: rowNumber
      })
    }
  }

  add = (track) => (e, isInputChecked) => {
    if (isInputChecked) {
      this.setState({openBot: true})
    }
    checked(track, isInputChecked)
  }

  handleRequestClose = () => {
    this.setState({
      openBot: false,
    });
  };

  render(){
    const tracks = R.take(10, this.state.tracks);
    const similarArtists = this.state.similar
    const similarImages = getImages(this.state.similar)
    const albums = R.drop(1, this.state.albums)
    const info = convert(this.state.artistInfo.summary)
    const fullInfo = convert(this.state.artistInfo.content)
    const img = this.state.image["#text"]
    const current = this.state.current
    const currentIndex = this.state.currentIndex
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={this.handleClose}
      />,
    ];

    return(
      <MuiThemeProvider>
        <div>
          <Player song={current} index={currentIndex} next={this.nextSong} prev={this.prevSong} count={tracks.length} />
          <div className="info-main">
            <div className="left-side">
              <img style={{marginTop:10, width:300, height:300, marginLeft: 20}} alt={"Main"} src={img}/>
            </div>
            <div className="right-side">
              <h3>{this.props.params.name}</h3>
              <p>{info}</p>
              <div>
                <RaisedButton label="More info" secondary={true} onTouchTap={this.handleOpen} />
                <Dialog
                  title="Full biography:"
                  actions={actions}
                  modal={false}
                  contentStyle={customContentStyle}
                  open={this.state.open}
                  onRequestClose={this.handleClose}
                  autoScrollBodyContent={true}
                >
                  {fullInfo}
                </Dialog>
              </div>
            </div>
          </div>
          <p>Albums:</p>
          <div style={styles.root}>
          <GridList style={styles.gridList} cellHeight={150} cols={2.2}>
            {albums.map((album) => (
              <a target="_blank" key={album.collectionId} href={`${album.collectionViewUrl}`} >
              <GridTile
                key={album.collectionId}
                title={album.collectionName}
                subtitle={<span>Price: <b>{album.collectionPrice}$</b></span>}
              >
                <img src={album.artworkUrl100} alt={album.collectionId}/>
              </GridTile>
              </a>
            ))}
          </GridList>
          </div>
          <Table
            height={400}
            style={{width: 70, margin: '0 auto'}}
            onCellClick={this.cellClicked}
          >
    {/*      <TableHeader>
            <TableRow>
              <TableHeaderColumn style={{width:1}}></TableHeaderColumn>
              <TableHeaderColumn style={{width:100}}>Song</TableHeaderColumn>
              <TableHeaderColumn style={{width:130}}>Artist</TableHeaderColumn>
              <TableHeaderColumn style={{width:100}}>Price</TableHeaderColumn>
            </TableRow>
          </TableHeader>  */}
            <TableBody
            displayRowCheckbox={false}
            >
            {tracks.map((item,index) =>
            <TableRow key={index}>
                <TableRowColumn style={{width:50}}>
                  <Checkbox
                    checkedIcon={<ActionFavorite />}
                    uncheckedIcon={<ActionFavoriteBorder />}
                    style={styles.checkbox}
                    defaultChecked={check(item)}
                    onCheck={this.add(item)}
                  />
                </TableRowColumn>
                <TableRowColumn style={{width:100}}>{item.trackName}</TableRowColumn>
                <TableRowColumn style={{width:130}}>{this.props.params.name}</TableRowColumn>
                <TableRowColumn style={{width:100}}>{item.trackPrice}$</TableRowColumn>
                {(current.trackId === item.trackId)? (
                <TableRowColumn style={{width:30}}><i className="material-icons">volume_up</i></TableRowColumn>
              ) : (<TableRowColumn style={{width:30}}></TableRowColumn>)}
            </TableRow>
              )}
            </TableBody>
          </Table>
          <div>
            <h3>Recomendations:</h3>
            <div style={styles.root}>
              <GridList style={styles.gridList} cols={2.2}>
                {similarArtists.map((artist,index) => (
                  <Link key={index} to={`/artistInfo/${artist.name}/`}>
                  <GridTile
                    key={similarImages[index]}
                    title={artist.name}
                    titleStyle={styles.titleStyle}
                    >
                    <img src={similarImages[index]} alt={artist.name}/>
                  </GridTile>
                  </Link>
                ))}
              </GridList>
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
    )
  }
}

export default Info
