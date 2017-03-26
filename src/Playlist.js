import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import React, { Component } from 'react';
import {ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import {Link} from 'react-router'

const SortableItem = SortableElement(({value, ind, play, current, del}) => (
  <div>
  {(value.trackId !== current)? (
    <ListItem
      style={{zIndex:20}}
      onDoubleClick={play(value,ind)}
      primaryText={value.trackName}
      secondaryText={value.artistName}
      leftAvatar={<Link to={`/artistInfo/${value.artistName}/`}><Avatar size={40} src={value.artworkUrl100} style={{marginTop:5}}/></Link>}
      rightIcon={<i className="material-icons close" onClick={del(value)}>close</i>}
    />
    ) : (
    <ListItem
      style={{zIndex:20}}
      onDoubleClick={play(value,ind)}
      primaryText={value.trackName}
      secondaryText={value.artistName}
      leftAvatar={<Link to={`/artistInfo/${value.artistName}/`}><Avatar size={40} src={value.artworkUrl100} style={{marginTop:5}}/></Link>}
      rightIcon={
        <div>
          <i className="material-icons close" onClick={del(value)}>close</i>
          <i className="material-icons">volume_up</i>
        </div>
      }
    />)
  }
  </div>
))

const SortableList = SortableContainer(({items, play, current, del}) => {
    return (
        <ul>
            {items.map((item, index) =>
                <SortableItem key={`item-${index}`} index={index} del={del} ind={index} value={item} play={play} current={current}/>
            )}
        </ul>
    );
});

class Playlist extends Component {
    constructor(){
      super();
      this.state={
        items: [],
        currentId: ''
      }
    }


    componentWillReceiveProps(nextProps){
      this.setState({currentId: nextProps.currentId})
      if (this.props.songs !== nextProps.songs) {
        const playlist = nextProps.songs
        this.setState({items: playlist})
      }
    }

    onSortEnd = ({oldIndex, newIndex}) => {
      localStorage.setItem('favourites', JSON.stringify(arrayMove(this.state.items, oldIndex, newIndex)));
        this.setState({
            items: arrayMove(this.state.items, oldIndex, newIndex)
        });
    };
    render() {
    const  current = this.state.currentId
        return (
            <SortableList helperClass='sortableHelper' items={this.state.items} onSortEnd={this.onSortEnd} distance={1} play={this.props.play} del={this.props.del} current={current}/>
        )
    }
}


export default Playlist
