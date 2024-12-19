import React, { Fragment } from "react"
import { connect } from 'react-redux';

import './Loader.css'

const Loader = ({ requestCount, ...props }) => (
  <Fragment>
    {requestCount ?
      <div className="loaderContainer"><p className="loader"></p></div> : null
    }
  </Fragment>
)

export default connect(state => ({
  requestCount: state.common_reducer.requestCount
}))(Loader);
