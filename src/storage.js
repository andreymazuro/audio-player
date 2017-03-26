import R from 'ramda'

export const format = (date) => {
  var newDate = date.toString().substring(0,2)
  if (newDate[0] === '0') {
    return '00'
  }
  if (newDate[1] === '.') {
    return '0' + newDate[0]
  }
  else
  {
    return newDate
  }
}

export const checked = (track, isInputChecked) => {
  if (isInputChecked) {
    var oldFavourites = JSON.parse(localStorage.getItem('favourites')) || []
    var newFavourites = R.prepend(track, oldFavourites);
    localStorage.setItem('favourites', JSON.stringify(newFavourites));
  }
  else
  {
    var oldFav = JSON.parse(localStorage.getItem('favourites'))
    var newFav = R.without([track], oldFav)
    localStorage.setItem('favourites', JSON.stringify(newFav));
  }
}

export const check = (track) => {
  var exists = false
  var favourites = JSON.parse(localStorage.getItem('favourites')) || []
  if (track.id) {
    favourites.map(item => {
      if (item.trackId == track.id.attributes['im:id']) {
        exists = true
      }
    })
  } else {
    favourites.map(item => {
      if (item.trackId == track.trackId) {
        exists = true
      }
    })
  }
  return exists
}

export const remove = (track) => {
  var oldFavourites = JSON.parse(localStorage.getItem('favourites')) || []
  var newFavourites = R.without([track], oldFavourites);
  localStorage.setItem('favourites', JSON.stringify(newFavourites));
}

export const price = () => {
  var oldFavourites = JSON.parse(localStorage.getItem('favourites')) || []
  var sum = oldFavourites.reduce((acc, current) =>
     acc + current.trackPrice
  ,0)
  return sum.toFixed(2)
}

export const convert = (song) => {
  if (song === '') {
    return ''
  }
  else
  {
    return (song + '').split('<a')[0]
  }
}

export const getImages = (artists) => {
  var image = x => x.image[4]['#text'];
  var res = R.map(image, artists);
  return res
}

export const getInfo = (images) => {
  var info = x => R.assoc('original', x['im:image'][2].label, {thumbnail: x['im:image'][2].label})
  return R.map(info, images)
}

export const transform = (song) => {
  if (song['im:name']) {
    const newObj = {trackName: song['im:name'].label, artistName: song['im:artist'].label, previewUrl: song.link[1].attributes.href, trackId: song.id.attributes['im:id'], artworkUrl100: song['im:image'][2].label}
    return newObj
  } else {
    return {}
  }
}
