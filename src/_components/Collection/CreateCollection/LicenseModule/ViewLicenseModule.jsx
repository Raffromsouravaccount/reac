import React, { Component } from "react";
import { connect } from "react-redux";

import { collectionActions } from '../../../../_actions/collection.actions';
import { constantText } from "../../../../_helpers/constants.text";
import { permissionObj } from "../../../../_helpers/permission";

import ButtonField from "../../../Common/ButtonField/ButtonField";
import InputField from "../../../Common/InputField/InputField";
import BadgeBox from "../../../Common/BadgeBox/BadgeBox";

// JSON
import Config from "../../../../Config/config";
import { apiCalls } from "../../../../_services/common.service";
import LicenseJSON from "../../Schema/LicenseModule.json";


import CountryRegionGrouping from "images/CountryRegionGrouping.svg";

class ViewLicenceModule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      JSONSchema: LicenseJSON?.manual_section,
      collectionId: this.props.collectionId,
      isMarkDone: false,
      licenceData: [],
      copyLicenseList: [],
      status: null,

      stage: { title: "Draft" },
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
    this.getLicenseDetails();
    this.getCollectionData()
  }

  getCollectionData = async() => {
    const { collectionId } = this.props;
    let response = await apiCalls(`${Config.collectionProperties}/${collectionId}`, 'GET', {});
    if (response) {
      let { contentState } = response;
      this.setState({ status: contentState?.title })
    }
  }

  async getLicenseDetails() {
    const { collectionId } = this.props;
    const requestedParams = {
      collectionId: collectionId
    };
    await this.props.getLicenceData(requestedParams);
  }

  componentWillReceiveProps(nextProps) {
    let localLicenseArray = [];
    if (nextProps.licenceData && nextProps.licenceData.data && nextProps.licenceData.data) {
      for (let itemIndex = 0; itemIndex < nextProps.licenceData.data.length; itemIndex++) {
        let template = nextProps.licenceData.data[itemIndex];
        let templateObject = {
          templateId: nextProps.licenceData.data.id,
          billingType: template.BillingType ? template.BillingType : "",
          businessType: template.BusinessType ? template.BusinessType : "",
          country:
            template.countriesId && template.countriesId.length > 0
              ? template.countriesId
              : [],
          platform:
            template.platformId && template.platformId.length > 0
              ? template.platformId
              : [],
          id: template.id ? template.id : "",
          currentStatus: template.status ? template.status : 1,
        };
        localLicenseArray.push(templateObject);
      }
      this.setState({
        licenceData: localLicenseArray,
        copyLicenseList: localLicenseArray,
      });
    } else {
      this.setState({
        licenceData: [],
      });
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
          this.applyFilterForCountry();
        }
      }
    );
  };

  applyFilterForCountry = () => {
    let { filters, copyLicenseList } = this.state;
    let { searchVal } = filters;
    const dataFilter = searchVal.length
      ? copyLicenseList.filter((item) => {
        let isAvailabe = false;
        item.country.forEach((con) => {
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
      licenceData: dataFilter,
    });
  };

  render() {
    const { licenceData, filters, collectionId, status } = this.state;
    const { searchVal } = filters;
    const { handleRoute } = this.props;
    const { canCreate } = permissionObj?.collections;
    let {canUpdate}= permissionObj?.collections?.licenceModule;
    return (
      <div className="whitebox">
        <div className="ccm-head flex align-items-center justify-content-between m-b-30">
            <div
              className="back-user-btn flex align-items-center"
              onClick={() => this.handleRoute("/dashboard")}
            >
              <div className="text">
                <strong>{constantText.license_text_details}</strong>
              </div>
            </div>
            <div className="status-head flex align-items-center">
              {status && <BadgeBox className="create-movie-stage" status={status} />}
              <div className="edit-btn">
                <ButtonField
                  disabled={!canUpdate()}
                  buttonText={constantText.edit_collection}
                  className="zee-btn-field zee-full MuiButton-containedPrimary"
                  onClick={() => canUpdate()? handleRoute(`/collection/edit/${collectionId}`): {}}
                />
              </div>
            </div>
        </div>

        <div className="col-12 p-b-10">
          <div className="user-head lice-head flex justify-content-between align-items-center">
            <div className="col-md-5 lice-search">
              <InputField
                name="searchVal"
                data-test="search-input-field"
                className="zee-input-field zee-input-h-40 m-b-0 auto-search"
                value={searchVal}
                onChange={(event) => this.handleSearch(event)}
                label={constantText.search_licence_text}
              />
            </div>
          </div>
          {licenceData.length > 0 ? (
            licenceData &&
            licenceData.map((license_item, index) => (
              <div
                key={index}
                className="lice-box flex justify-content-between">
                <div className="left-area">
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
                      {license_item ? license_item.businessType?.title : ""}
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
                      {license_item ? license_item.billingType?.title : ""}
                    </div>
                  </div>
                </div>
              </div>
            ))) : (
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
  let licenceData = state.collection_reducer.collectionLicence;
  return {
    licenceData
  };
};

const actionCreators = {
  getLicenceData: collectionActions.collection_get_license,
};

export default connect(mapStateToProps, actionCreators)(ViewLicenceModule);


