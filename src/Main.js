import React, {Component} from 'react'
import {getInfo} from './storage'
import fetchJsonp from 'fetch-jsonp'
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import R from 'ramda'

class MainPage extends Component{
  constructor(){
    super()
    this.state={
      topSongs:[],
      topAlbums: [],
      links: []
    }
  }


  componentDidMount() {
    var url = 'https://itunes.apple.com/us/rss/topsongs/genre=6/json'
    fetchJsonp(url)
    .then(response => response.json())
    .then(res => this.setState({topSongs: res.feed.entry}))

    fetchJsonp('https://itunes.apple.com/hk/rss/topalbums/limit=10/json')
    .then(response => response.json())
    .then(res => this.setState({topAlbums: res.feed.entry}))
    .then(this.getLinks)
  }

  getLinks = () => {
    var link = x => x.link.attributes.href;
    const links =  R.map(link, this.state.topAlbums);
    this.setState({links})
  }

  clicked = (e) =>{
    var win = window.open(`${this.state.links[this._imageGallery.getCurrentIndex()]}`, '_blank');
  }

  render(){
    const topAlbums = this.state.topAlbums
    const images = getInfo(topAlbums)

    return(
      <div>
          <ImageGallery
            ref={i => this._imageGallery = i}
            items={images}
            slideInterval={8000}
            autoPlay={true}
            showPlayButton={false}
            showFullscreenButton={false}
            onClick={this.clicked}
          />
      </div>
    )
  }

}

export default MainPage
