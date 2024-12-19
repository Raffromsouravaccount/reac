import React, { Component } from 'react'
import { connect } from "react-redux";
import { collectionActions } from '../../../../_actions/collection.actions';
import AssignAssets from '../../../Common/AssignAssets/AssignAssets';

import filterJson from "../../Schema/CollectionAssignment/SideFilter.json";

class AddCollections extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <AssignAssets
        {...this.props}
        pageClass="collection-assign-block collection-assign-block-content"
        quickLinksPage={true}
        filtersJson={JSON.parse(JSON.stringify(filterJson))}
      />
    )
  }

}
const mapStateToProps = (state) => {
  let { collectionList } = state.collection_reducer;
  return {
    collectionList
  }
};

const mapDispatch = {
  getCollectionList: collectionActions.collection_list_action
};

export default connect(mapStateToProps, mapDispatch)(AddCollections)