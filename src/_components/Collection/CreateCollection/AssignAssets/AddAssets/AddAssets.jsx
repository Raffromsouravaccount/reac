import React, { Component } from 'react'
import { connect } from "react-redux";

import AssignAssets from '../../../../Common/AssignAssets/AssignAssets';

//Actions
import { collectionActions } from '../../../../../_actions/collection.actions';

import filtersJson from "../../../Schema/AssignAssets/SideFilter.json";

class AddAssets extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let filterJson = {};
    if (this.props?.meta?.name) {
      filterJson = JSON.parse(JSON.stringify(filtersJson[this.props?.meta?.name]));
    }
    return (
      <AssignAssets
        {...this.props}
        quickLinksPage={false}
        filtersJson={filterJson}
      />
    )
  }

}

const mapStateToProps = (state) => {
  let { collectionList } = state.collection_reducer;
  return { collectionList }
};

const mapDispatch = {
  getCollectionList: collectionActions.collection_list_action
};

export default connect(mapStateToProps, mapDispatch)(AddAssets)