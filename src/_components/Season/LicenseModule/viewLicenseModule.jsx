import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { movieMgmtActions } from '../../../_actions/movieMgmt.action';

import { constantText } from "../../../_helpers/constants.text";

import ButtonField from '../../Common/ButtonField/ButtonField';
import InputField from '../../Common/InputField/InputField';
import ViewDetails from "../../Common/ViewDetail/ViewDetails";

import PublishIcon from "images/publish-icon.svg";

class ViewLicenceModule extends Component {
    constructor(props) {
        super(props);
        const { licenseJSON } = props;
        this.state = {
            JSONSchema: licenseJSON || [],
            contentId: this.props.contentId,
            isMarkDone: false,
            licenceList: [],
            copyLicenseList: [],
            filters: {
                searchVal: "", sort: "", country: []
            },
            isLocked: false,
            lockedBy: "",
            showModel: false
        }
    }

    componentDidMount() {
        const { contentId, language } = this.props;
        const requestedParams = {
            contentId: contentId,
            language: language
        }
        this.props.getLicenceData(requestedParams);
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.licenseList != nextProps.licenseList) {
            let localLicenseArray = [];
            if (nextProps.licenseList && nextProps.licenseList.data && nextProps.licenseList.data.contentData) {
                for (let itemIndex = 0; itemIndex < nextProps.licenseList.data.contentData.licence.length; itemIndex++) {
                    for (let templateIndex = 0; templateIndex < nextProps.licenseList.data.contentData.licence[itemIndex].template.length; templateIndex++) {
                        let template = nextProps.licenseList.data.contentData.licence[itemIndex].template[templateIndex];
                        let templateObject = {
                            templateId: nextProps.licenseList.data.contentData.licence[itemIndex].uuid,
                            billingType: template.billingType ? template.billingType : {},
                            businessType: template.businessType ? template.businessType : {},
                            country: (template.country && template.country.length > 0) ? template.country : [],
                            fromDate: template.fromDate ? template.fromDate : "",
                            platform: (template.platform && template.platform.length > 0) ? template.platform : [],
                            reason: template.reason ? template.reason : "",
                            toDate: template.toDate ? template.toDate : "",
                            tvodTier: template.tvodTier ? template.tvodTier : {},
                            uuid: template.uuid ? template.uuid : "",
                            currentStatus: template.currentStatus ? template.currentStatus : 'Active',
                            dateCreated: nextProps.licenseList.data.contentData.licence[itemIndex].dateCreated ? nextProps.licenseList.data.contentData.licence[itemIndex].dateCreated : ""
                        }
                        localLicenseArray.push(templateObject)
                    }
                }
                this.setState({
                    licenceList: localLicenseArray,
                    copyLicenseList: localLicenseArray
                })
            }
        }
    }

    handleSearch = (event) => {
        let { filters } = this.state;
        let { name, value } = event?.target;
        this.setState({
            filters: {
                ...filters,
                [name]: value
            }
        }, () => {
            if (name == "searchVal") {
                this.applyFilter();
            }
        });
    }

    applyFilter = () => {
        let { filters, copyLicenseList } = this.state;
        let { searchVal } = filters;
        let filteredLicense = searchVal ? copyLicenseList.filter(template => template.country.filter(countryItem => countryItem.DisplayName.toLowerCase().includes(searchVal.toLowerCase())).length) : copyLicenseList;
        this.setState({
            licenceList: filteredLicense
        })
    }

    render() {
        const { JSONSchema, filters, contentId } = this.state;
        const { searchVal } = filters;
        const { handleRoute } = this.props;
        return (
            <div className="whitebox">
                <div className="ccm-head flex align-items-center justify-content-between m-b-30">
                    <Fragment>
                        <div
                            data-test="handleRoute-method"
                            className="back-user-btn flex align-items-center"
                            onClick={() => handleRoute("/dashboard")}
                        >
                        <div className="text"><strong>{constantText.license_text_details}</strong></div>
                            
                        </div>
                        <div className="status-head flex align-items-center">
                            <div className="cm-publish-text p-r-20">{constantText.tvShow_status_text}</div>
                            <div className="publish flex">
                                <PublishIcon className="publish-icon" /> {constantText.publish_text}
                            </div>
                            <div className="edit-btn">
                                <ButtonField
                                    buttonText={constantText.tv_show_text.edit}
                                    className="zee-btn-field zee-full MuiButton-containedPrimary"
                                    onClick={() => handleRoute(`/tvshow/edit/${contentId}`)}
                                />
                            </div>
                        </div>
                    </Fragment>
                </div>

                <div className="col-12 p-b-10">
                    <div className="user-head lice-head flex justify-content-between align-items-center">
                        <div className="col-md-5 lice-search">
                            <InputField
                                data-test="handleSearch-input"
                                name="searchVal"
                                className="zee-input-field zee-input-h-40 m-b-0"
                                value={searchVal}
                                onChange={this.handleSearch}
                                label={constantText.search_licence_text}
                            />
                        </div>
                    </div>
                    <div className="showForm-tab">
                        <div className="show-f-wrap col-12">
                            <ViewDetails allData={JSONSchema?.manual_section} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    var licenseList = state.movieMgmt_reducer.licenseRecords;
    return {
        licenseList
    }
}

const actionCreators = {
    getLicenceData: movieMgmtActions.list_license_action
}

export default connect(mapStateToProps, actionCreators)(ViewLicenceModule);