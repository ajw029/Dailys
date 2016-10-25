import React, {Component} from 'react';
import classNames from 'classnames';
/* Redux */
import {connect} from 'react-redux';

/*
var BookmarkComponent = React.createClass({
  getInitialState: function () {
    return {showDeleteButton: true,
            showDeleteConf: false,
            selectValue: 'none'};
  },

  favoriteClick: function() {
    mixpanel.track("Favorite Click");
    var body = {};
    body.bookmarx_id=this.props.id;
    $.ajax({
          url: '/api/staraction',
          dataType: 'json',
          cache: false,
          type: 'post',
          data: body,
          timeout: 5000,
          success: function(data) {
            this.props.favBookmark(this.props.id)

          }.bind(this),
          error: function(xhr, status, err) {
            //timeout or connection refused
            if(status == "timeout" || xhr.readyState == 0) {
              //window.location = '/';
            }
            this.props.favBookmarkErr();
          }.bind(this)
        });
  },
  deleteBookmark: function() {
    mixpanel.track("Delete bookmark");
    var body = {};
    body.bookmarx_id=this.props.id
    $.ajax({
          url: '/api/delete',
          dataType: 'json',
          cache: false,
          type: 'post',
          data: body,
          timeout: 5000,
          success: function(data) {
            this.props.deleteBookmark(this.props.id);

          }.bind(this),
          error: function(xhr, status, err) {
            //timeout or connection refused
            if(status == "timeout" || xhr.readyState == 0) {
              //window.location = '/';
            }
            this.props.deleteBookmarkErr();
          }.bind(this)
        });
  },
  openLink: function() {
    mixpanel.track("Open Link");
    var body = {};
    body.bookmarx_id=this.props.id;
    $.ajax({
          url: '/api/click',
          dataType: 'json',
          cache: false,
          type: 'get',
          timeout: 5000,
          success: function(data) {
          }.bind(this),
          error: function(xhr, status, err) {
            //timeout or connection refused
            if(status == "timeout" || xhr.readyState == 0) {
              //window.location = '/';
            }
          }.bind(this)
        });
        var redirectURL = this.props.url;
        if (redirectURL.indexOf('https://') > -1 || redirectURL.indexOf('http://')>-1){

        }
        else {
          redirectURL='http://'+ redirectURL;
        }
        window.location = redirectURL;
        mixpanel.track(redirectURL);
  },
  showDelete: function() {
    this.setState({showDeleteButton: false,
                   showDeleteConf: true});
  },
  closeDeleteConf: function() {
    this.setState({showDeleteButton: true,
                   showDeleteConf: false});
  },
  render: function() {
    var favButton;
    if (this.props.favorite) {
      favButton = <button type="button" onClick={this.favoriteClick} className="fab favorite"><img src="/img/ic_star_white_48dp_2x.png" alt="star"></img></button>;
    }
    else {
      favButton = <button type="button" onClick={this.favoriteClick} className="fab"><img src="/img/ic_star_white_48dp_2x.png" alt="star"></img></button>;
    }
    return (
      <li>
        <div className="bookmark">
          <a onClick={this.openLink}>
            <h2>{this.props.name}</h2>
            <h3>{this.props.url}</h3>
          </a>
          <ToggleDisplay show={this.state.showDeleteButton}>
            <button className="closeButton" onClick={this.showDelete}><img src="/img/ic_close_black_48dp_2x.png"  alt="x"></img></button>
          </ToggleDisplay>
          <ToggleDisplay show={this.state.showDeleteConf}>
            <div className="deleteConfirmationContainer">
              <label>Delete?</label>
              <button className="confDelete deleteButton" onClick={this.deleteBookmark}>Yes</button>
              <button className="confDelete cancelButton" onClick={this.closeDeleteConf}>No</button>
            </div>
          </ToggleDisplay>

          <div className="card__action-bar">
          {favButton}
            <Link to={'/app/editmybookmark/'+ this.props.id} className="card__button">EDIT</Link>
          </div>
        </div>
      </li>
    )
  }
});
*/

const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = (dispatch => {
  return {

  }
});


class BookmarxContainerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValue: ''
    }
  }

  render = () => {
    // var bookmarkNodes = this.props.myBookmarks.map(function(bookmark) {
    //   return (
    //     <BookmarkComponent
    //              name={bookmark.name}
    //              description={bookmark.description}
    //              folder_id={bookmark.folder_id}
    //              favorite={bookmark.favorite}
    //              url={bookmark.url}
    //              key={bookmark.id}
    //              id={bookmark.id}
    //              favBookmark={this.props.favBookmark}
    //              deleteBookmark={this.props.deleteBookmark}
    //              favBookmarkErr={this.props.favBookmarkErr}
    //              deleteBookmarkErr={this.props.deleteBookmarkErr}
    //              />
    //   );
    // }.bind(this));

    return (
      <div className="slide">
        <div className="folderContent">
          <div>
            <div className="bookmark sortContainer">
              <div className="folderSearchBar">
                <span>Sort: </span>
                <select name="ordering" onChange={this.updateSelectValue} value={this.state.selectValue}>
                  <option value="none">None</option>
                  <option value="asc">A-Z</option>
                  <option value="desc">Z-A</option>
                </select>
                <input type="button" onClick={this.sort} value="Sort"></input>
              </div>
            </div>
          </div>

          <ul>

          </ul>
        </div>
      </div>
    );
  }
};

export default connect(mapStateToProps,mapDispatchToProps)(BookmarxContainerComponent);
