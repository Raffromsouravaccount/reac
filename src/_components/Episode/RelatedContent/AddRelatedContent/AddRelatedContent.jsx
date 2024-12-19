import React, { Component } from 'react'
import { connect } from "react-redux";

import AssignAssets from '../../../Common/AssignAssets/AssignAssets';

//Actions
import { movieMgmtActions } from '../../../../_actions/movieMgmt.action';
import { collectionActions } from '../../../../_actions/collection.actions';

import filtersJson from "../../Schema/RelatedContent/SideFilter.json";
import { tvShowsActions } from '../../../../_actions/tvShows.action';

class AddRelatedContent extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let filterJson = {};
    if (this.props?.meta?.name) {
      filterJson = JSON.parse(JSON.stringify(filtersJson[this.props.meta.name]));
    }
    return (
      <AssignAssets
        {...this.props}
        pageClass={'relatedcontent-block related-block-content'}
        quickLinksPage={true}
        filtersJson={filterJson}
      />
    )
  }

}

const mapStateToProps = (state) => {
  let { moviesList } = state.movieMgmt_reducer;
  let { collectionList } = state.collection_reducer;
  let { tvShowsList } = state.tvShows_reducer;
  return { moviesList, collectionList, tvShowsList }
};

const mapDispatch = {
  getMovieList: movieMgmtActions.list_movie_action,
  getCollectionList: collectionActions.collection_list_action,
  getTVShows: tvShowsActions.list_tvshows_action
};

export default connect(mapStateToProps, mapDispatch)(AddRelatedContent)