import React, {Component} from 'react'
import {getInfo, checked, check} from './storage'
import fetchJsonp from 'fetch-jsonp'
import ImageGallery from 'react-image-gallery';
import Checkbox from 'material-ui/Checkbox';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import "react-image-gallery/styles/css/image-gallery.css";
import R from 'ramda'
import Snackbar from 'material-ui/Snackbar';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


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

class Home extends Component{
  constructor(){
    super()
    this.state={
      topSongs:[],
      topAlbums: [],
      links: [],
      openBot: false,
      value: 1
    }
  }


  componentDidMount() {
    var url = 'https://itunes.apple.com/us/rss/topsongs/limit=15/json'
    fetchJsonp(url)
    .then(response => response.json())
    .then(res => this.setState({topSongs: res.feed.entry}))

    fetchJsonp('https://itunes.apple.com/us/rss/topalbums/limit=15/json')
    .then(response => response.json())
    .then(res => this.setState({topAlbums: res.feed.entry}))
    .then(this.getLinks)
  }

  fetchSongs = (genre) => {
    var url = `https://itunes.apple.com/us/rss/topsongs/limit=15/genre=${genre}/json`
    fetchJsonp(url)
    .then(response => response.json())
    .then(res => this.setState({topSongs: res.feed.entry}))
  }

  getLinks = () => {
    var link = x => x.link.attributes.href;
    const links =  R.map(link, this.state.topAlbums);
    this.setState({links})
  }

  clicked = (e) =>{
    window.open(`${this.state.links[this._imageGallery.getCurrentIndex()]}`, '_blank');
  }

  add = (track) => (e, isInputChecked) => {
    if (isInputChecked) {
      this.setState({openBot: true})
    }
    const id = track.id.attributes['im:id']
    fetchJsonp(`https://itunes.apple.com/lookup?id=${id}`)
    .then(response => response.json())
    .then(res => checked(res.results[0], isInputChecked))
  }

  cellClicked = (rowNumber, columnId,e) => {
    if (columnId !== 1) {
      this.props.play(this.state.topSongs, rowNumber)
    }
  }

  handleRequestClose = () => {
    this.setState({
      openBot: false,
    })
  }

  handleChange = (event, index, value) => {
    this.setState({value});
    this.fetchSongs(value)
  }


  render(){
    const topAlbums = this.state.topAlbums
    const images = getInfo(topAlbums)
    const tracks = this.state.topSongs
    var id = ''
    if (this.props.current.id) {
      var id = this.props.current.id.attributes['im:id']
    }
    return(
      <MuiThemeProvider>
        <div style={{marginTop: 50}}>
            <ImageGallery
              ref={i => this._imageGallery = i}
              items={images}
              slideInterval={8000}
              autoPlay={true}
              showPlayButton={false}
              showFullscreenButton={false}
              onClick={this.clicked}
            />
            <SelectField
              floatingLabelText="Genre"
              value={this.state.value}
              onChange={this.handleChange}
            >
              <MenuItem value={1} primaryText="All" />
              <MenuItem value={20} primaryText="Alternative" />
              <MenuItem value={5} primaryText="Classical" />
              <MenuItem value={6} primaryText="Country" />
              <MenuItem value={17} primaryText="Dance" />
              <MenuItem value={7} primaryText="Electronic" />
              <MenuItem value={18} primaryText="Hip-Hop/Rap" />
              <MenuItem value={11} primaryText="Jazz" />
              <MenuItem value={14} primaryText="Pop" />
              <MenuItem value={15} primaryText="R&B/Soul" />
              <MenuItem value={16} primaryText="Soundtrack" />
              <MenuItem value={23} primaryText="Vocal" />
            </SelectField>
            <Table
              height={500}
              style={{width: 70, margin: '0 auto'}}
              onCellClick={this.cellClicked}
            >
      {/*      <TableHeader>
              <TableRow>
                <TableHeaderColumn style={{width:20}}>Song</TableHeaderColumn>
                <TableHeaderColumn style={{width:20}}>Song</TableHeaderColumn>
                <TableHeaderColumn style={{width:20}}>Artist</TableHeaderColumn>
                <TableHeaderColumn style={{width:20}}>Price</TableHeaderColumn>
              </TableRow>
            </TableHeader> */}
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
                  <TableRowColumn style={{width:100}}>{item['im:name'].label}</TableRowColumn>
                  <TableRowColumn style={{width:130}}>{item['im:artist'].label}</TableRowColumn>
                  <TableRowColumn style={{width:100}}>{item['im:price'].label}$</TableRowColumn>
                  {(id === item.id.attributes['im:id'])? (
                  <TableRowColumn style={{width:30}}><i className="material-icons">volume_up</i></TableRowColumn>
                ) : (<TableRowColumn style={{width:30}}></TableRowColumn>)}
              </TableRow>
                )}
              </TableBody>
            </Table>
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

export default Home
