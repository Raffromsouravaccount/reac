import React, { Component } from 'react';
import { connect } from 'react-redux';
import ImageSetCreate from './ImageSetCreate/ImageSetCreate';
import ImageSets from './ImageSets/ImageSets';
import { history } from '../../../_helpers/history';

class Images extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pages: [{ name: 'createSet' }, { name: 'imageSets' }],
      selectedPage: 0,
      editSet: null,
      imageSets:null
    };
  }

  navToImageSet = (page, set,imageSets) => {
    if (set) {
      this.setState({ selectedPage: page, editSet: set ,imageSets});
    } else {
      this.setState({ selectedPage: page, editSet: null });
    }
  };
  handleRoute = route => {
    const { selectedTab } = this.props;
    history.push(route, { selectedTab: selectedTab });
  }
  
  render() {
    const { selectedPage, editSet,imageSets } = this.state;
    const { tvShowId, page, selectedTab, isViewMode, jsonData } = this.props;
    return (
      <div className="create-movie-image-section">
        {selectedPage == 0 &&
          <ImageSets {...this.props} isViewMode={isViewMode} navToEditMode={this.handleRoute} selectedTab={selectedTab}
            pageState={this.props.state} contentId={tvShowId} navToImageSet={this.navToImageSet}
            page={page} jsonData={jsonData}
          />
        }
        {selectedPage == 1 &&
          <ImageSetCreate {...this.props} contentId={tvShowId} navToImageSet={this.navToImageSet} page={page}
            editSet={editSet} imageSets={imageSets} jsonData={jsonData}
          />
        }
      </div>
    )
  }
}

export default Images;
