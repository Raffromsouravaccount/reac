import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
// actions
import { videoMgmtActions } from "../../../_actions/videoMgmt.action";
//Helper Files
import Config from "../../../Config/config";
import moment from "moment";
import { constantText } from "../../../_helpers/constants.text";
import { permissionObj } from "../../../_helpers/permission";

import ButtonField from "../../Common/ButtonField/ButtonField";
import InputField from "../../Common/InputField/InputField";

// Icon
import CountryRegionGrouping from "images/CountryRegionGrouping.svg";
import BadgeBox from "../../Common/BadgeBox/BadgeBox";

class ViewLicenceModule extends Component {
  constructor(props) {
    super(props);
    let { jsonData } = props;
    this.state = {
      JSONSchema: jsonData,
      videoId: this.props.videoId,
      isMarkDone: false,
      licenceList: [],
      copyLicenseList: [],
      filters: {
        searchVal: "",
        sort: "",
        country: [],
      },
      isLocked: false,
      lockedBy: "",
      showModel: false,
    };
  }

  componentDidMount() {
    const requestedParams = {
      contentId: this.state.videoId,
    };
    this.props.getLicenceData(requestedParams);
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props?.licenseList != nextProps.licenseList) {
      let localLicenseArray = [];

      if (nextProps.licenseList && nextProps.licenseList.data) {
        for (
          let itemIndex = 0;
          itemIndex < nextProps.licenseList.data?.license?.length;
          itemIndex++
        ) {
          let template = nextProps.licenseList.data.license[itemIndex];

          let templateObject = {
            templateId: nextProps.licenseList.data.id,
            billingType: template.BillingType ? template.BillingType.title : "",
            businessType: template.BusinessType
              ? template.BusinessType.title
              : "",
            country:
              template.countriesId && template.countriesId.length > 0
                ? template.countriesId
                : [],
            fromDate: template.validFrom ? template.validFrom : "",
            platform:
              template.platformId && template.platformId.length > 0
                ? template.platformId
                : [],
            reason: template.reason ? template.reason : "",
            toDate: template.validUntil ? template.validUntil : "",
            tvodTier: template.TVODTier ? template.TVODTier.title : "",
            id: template.id ? template.id : "",
            currentStatus: template.status ? template.status : "Active",
            createdBy: template.createdBy ? template.createdBy : "",
            updatedBy: template.updatedBy ? template.updatedBy : "",
            updatedByEmail: template.updatedByEmail
              ? template.updatedByEmail
              : "",
            dateCreated: template.createdOn ? template.createdOn : "",
            setName:template?.setName?template?.setName :"",
            contentAgeRating:template?.contentAgeRating ? template?.contentAgeRating:""
          };
          localLicenseArray.push(templateObject);
        }
        this.setState({
          licenceList: localLicenseArray,
          copyLicenseList: localLicenseArray,
        });
      }
    }
  };

  handleSearch = (event) => {
    let { filters } = this.state;
    let { name, value } = event.target;
    this.setState(
      {
        filters: {
          ...filters,
          [name]: value,
        },
      },
      () => {
        if (name == "searchVal") {
          this.applyFilter();
        }
      }
    );
  };

  applyFilter = () => {
    let { filters, copyLicenseList } = this.state;
    let { searchVal } = filters;
    const dataFilter = searchVal.length
      ? copyLicenseList.filter((item) => {
          let isAvailabe = false;
          item?.country?.forEach((con) => {
            con.forEach((list) => {
              if (
                String(list.title)
                  .toLowerCase()
                  .includes(String(searchVal).toLowerCase())
              ) {
                isAvailabe = true;
              }
            });
          });
          return isAvailabe;
        })
      : copyLicenseList;

    this.setState({
      licenceList: dataFilter,
    });
  };

  render() {
    const { licenceList, filters, videoId } = this.state;
    const { searchVal } = filters;
    const { handleRoute ,stage} = this.props;
    return (
      <div className="whitebox">
        <div className="ccm-head flex align-items-center justify-content-between m-b-30">
          <Fragment>
            <div
              className="back-user-btn flex align-items-center"
              onClick={() => this.handleRoute("/dashboard")}
            >
              <div className="text">
                <strong>{constantText.license_text_details}</strong>
              </div>
            </div>
            <div className="status-head flex align-items-center">
         
                  {stage?.title && (
                    <BadgeBox
                      className="create-movie-stage"
                      status={stage.title}
                    />
                  )}
      
              <div className="edit-btn">
                <ButtonField
                  disabled={!permissionObj?.videos?.licenceModule?.canUpdate()}
                  buttonText={constantText.edit_video_text}
                  className="zee-btn-field zee-full MuiButton-containedPrimary"
                  onClick={() => handleRoute(`${Config.videoEdit}${videoId}`)}
                />
              </div>
            </div>
          </Fragment>
        </div>

        <div className="col-12 p-b-10">
          <div className="user-head lice-head flex justify-content-between align-items-center">
            <div className="col-md-5 lice-search">
              <InputField
                name="searchVal"
                className="zee-input-field zee-input-h-40 m-b-0 auto-search"
                value={searchVal}
                onChange={this.handleSearch}
                label={constantText.search_licence_text}
              />
            </div>
          </div>
          {licenceList.length > 0 ? (
            licenceList &&
            licenceList.map((license_item, index) => (
              <div
                key={index}
                className="lice-box flex justify-content-between"
              > <div className="lice-title-head">{license_item?.setName?license_item?.setName:""}</div>
                <div className="left-area">
                  <div className="text-data row">
                    <div className="col-md-12 col-lg-6 flex">
                      <div className="label">
                        {constantText.licensing_from_text}
                      </div>
                      <div className="text">
                      {license_item?.fromDate ? moment(license_item.fromDate).format(constantText.date_format_for_created_uodated_by) : ""}
                      </div>
                    </div>
                    <div className="col-md-12 col-lg-6 flex">
                      <div className="label">
                        {constantText.licensing_to_text}
                      </div>
                      <div className="text">
                      {license_item?.toDate ? moment( license_item.toDate).format(constantText.date_format_for_created_uodated_by) : ""}                     
                      </div>
                    </div>
                  </div>
                  <div className="text-data flex">
                    <div className="label">
                      {constantText.licensing_country_text}
                    </div>
                    <div key={index} className="text">
                      {license_item &&
                        license_item?.country
                          ?.map((item, index) =>
                            item[0] ? item[0]?.title : ""
                          )
                          .join(", ")}
                    </div>
                  </div>
                  <div className="text-data flex">
                    <div className="label">{constantText.business_type}</div>
                    <div className="text">
                      {license_item ? license_item.businessType : ""}
                    </div>
                  </div>
                  <div className="text-data flex">
                      <div className="label">{constantText.content_age_rating}</div>
                      <div className="text">
                        {license_item ? license_item?.contentAgeRating?.title : ""}
                      </div>
                    </div>

                  <div className="text-data flex">
                    <div className="label">{constantText.license_platform}</div>
                    <div className="text" key={index}>
                      {license_item &&
                        license_item?.platform
                          ?.map((platform_item, index) =>
                            platform_item[0] ? platform_item[0].title : ""
                          )
                          .join(", ")}
                    </div>
                  </div>
                  <div className="text-data flex">
                    <div className="label">{constantText.billing_type}</div>
                    <div className="text">
                      {license_item ? license_item.billingType : ""}
                    </div>
                  </div>
                  <div className="text-data flex">
                    <div className="label">{constantText.tvod_tier_text}</div>
                    <div className="text">
                      {license_item ? license_item.tvodTier : ""}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-lice-box flex align-items-center justify-content-center">
              <div className="flex align-items-center">
                <CountryRegionGrouping />
                {constantText.create_license_message_text}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  var licenseList = state.videoMgmt_reducer.licenseRecords;
  return {
    licenseList,
  };
};

const actionCreators = {
  getLicenceData: videoMgmtActions.list_license_action,
};

export default connect(mapStateToProps, actionCreators)(ViewLicenceModule);
