import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

class TranslationView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { labelAndValue } = this.props;
        return (
            <div className="lang-trans-view flex">
                <div className="label">{labelAndValue?.label}</div>
                <div className="text" dangerouslySetInnerHTML={{ __html: labelAndValue?.value || 'NA' }}></div>
            </div>
        );
    }
}

export default TranslationView;
