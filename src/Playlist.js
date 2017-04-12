import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import React, { Component } from 'react';
import {ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import {Link} from 'react-router'

const SortableItem = SortableElement(({value, ind, play, current, del, items,stopProp}) => (
  <div>
    <ListItem
      style={{zIndex:20}}
      onClick={play(items,ind)}
      primaryText={value.trackName}
      secondaryText={value.artistName}
      leftAvatar={<div onClick={stopProp}>
                    <Link to={`/artistInfo/${value.artistName}/`}><Avatar size={40} src={value.artworkUrl100} style={{marginTop:5}}/></Link>
                  </div>
                 }
      rightIconButton={
        <div>
        {(value.trackId == current)? (<i className="material-icons">volume_up</i>) : null}
          <i className="material-icons close" onClick={del(value)}>close</i>
        </div>
      }
    />
  </div>
))

const SortableList = SortableContainer(({items, play, current, del,stopProp}) => {
    return (
        <ul>
            {items.map((item, index) =>
                <SortableItem key={`item-${index}`} index={index} items={items} del={del} ind={index} value={item} play={play} current={current} stopProp={stopProp}/>
            )}
        </ul>
    );
});

class Playlist extends Component {
    constructor(){
      super();
      this.state={
        items: []
      }
    }


    componentWillReceiveProps(nextProps){
      if (this.props.songs !== nextProps.songs) {
        const playlist = nextProps.songs
        this.setState({items: playlist})
      }
    }

    stopPropog = (e) => {
      e.stopPropagation();
    }

    onSortEnd = ({oldIndex, newIndex}) => {
      localStorage.setItem('favourites', JSON.stringify(arrayMove(this.state.items, oldIndex, newIndex)));
        this.setState({
            items: arrayMove(this.state.items, oldIndex, newIndex)
        });
    };

    render() {
    const  current = this.props.currentId
        return (
            <SortableList helperClass='sortableHelper' items={this.state.items} stopProp={this.stopPropog} onSortEnd={this.onSortEnd} distance={1} play={this.props.play} del={this.props.del} current={current}/>
        )
    }
}


export default Playlist
