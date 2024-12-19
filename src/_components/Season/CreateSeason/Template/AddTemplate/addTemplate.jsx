import React, { Component } from "react";
import BadgeBox from "../../../../Common/BadgeBox/BadgeBox";
import ButtonField from "../../../../Common/ButtonField/ButtonField";
import { breadCrumbs } from "./breadCrumbs";
import { constantText } from "../../../../../_helpers/constants.text";
import { apiCalls } from "../../../../../_services/common.service";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import FormRender from "../../../../Common/FormHelper/FormRender";
import { isValidatedForm } from "../../../../Common/FormHelper/FormValidSetter";
//Common Component
import LeftTab from "../../../../Common/LeftTab/CommonLeftTab";
import InlineLoader from "../../../../Common/InlineLoader/InlineLoader";
import checkValidity from "../../../../Common/FormHelper/FieldValidator";
import BreadCrumbs from "../../../../Common/BreadCrumbs/BreadCrumbs";
import { CommonModel } from "../../../../Common/Model/CommonModel";
import { history, seasonBreadcrumbUrls } from "../../../../../_helpers/history";

//Images
import AngleLeftArrow from "images/angle-left-arrow.svg";
import jsonForm from "../../../Schema/SeasonTemplate/episodeTemplate.json";
import Config from "../../../../../Config/config";

class AddTemplate extends Component {
  constructor(props) {
    super();
    let { state } = props;
    let filterKey = state
      ? state == "quick-filing"
        ? "quickFiling"
        : "singleLanding"
      : "main";
    this.state = {
      tvShowState: filterKey,
      showTitle: "",
      JSONSchema: [],
      selectedTab: 0,
      showModal: false,
      isLoading: null,
      externalId: null,
      isValidForm: false,
      modalError: '',
      contentType: '',
      isUpdate: false,
      editTemplate: false,
      leftTab: [],
      sideTabResponse: [],
      selectedTabId: ''
    };
  }
  async componentDidMount() {
    let { seasonId, id } = this.props?.match?.params
    await this.getEpisodeProperties(seasonId, id)
    await this.generateTab()
    this.setState({
      SeasonId: seasonId,
      isLoading: true,
      manualJsonSchema: JSON.parse(JSON.stringify((jsonForm))).templateContent,
      globalFields: JSON.parse(JSON.stringify((jsonForm))).globalFields
    }, () => {
      this.changeTitleField(0);
    });


  }
  generateTab = async () => {
    let url = `${Config.masterContentSubType}?status=all`
    const response = await apiCalls(url, "Get", {}, null, false)
    const responseArr = []
    response?.forEach(masterData => {
      const responseObj = {}
      if (masterData.isApplicableForTemplate == 1) {
        responseObj.masterData
        responseArr.push(masterData)
      }
    })
    let tabArr = []
    for (let tabData of responseArr) {
      let responseObj = {}
      responseObj = {
        label: tabData?.title,
        permissionKey: "tvShows",
        permissionSubKey: "contentPropertiesModule",
        permissionName: "canUpdate",
        sectionName: tabData?.title,
        id: tabData?.id,
        main: true,
        singleLanding: true,
        quickFiling: true,
        isDone: false,
        isLocked: false,
        lockedBy: ""
      }
      tabArr.push(responseObj)
    }
    let { filterKey } = this.state
    this.setState({
      leftTab: tabArr?.filter((data) => data) || [], sideTabResponse: tabArr
    })
  }
  handleTab = (event, selected) => {
    const { sideTabResponse, selectedTab } = this.state
    if(selectedTab !== selected){
      this.setState(
        {
          selectedTab: selected,
          manualJsonSchema: JSON.parse(JSON.stringify((jsonForm))).templateContent,
          globalFields: this.state.globalFields,
          selectedTabId: sideTabResponse[selected]?.id
        },
        () => {
          this.changeTitleField(selected);
          this.checkFormValid(JSON.parse(JSON.stringify((jsonForm))).templateContent);
        }
      );
    }
  };

  changeTitleField = (selectedTab) => {
    let { contentType, SeasonId, sideTabResponse } = this?.state
    contentType = contentType.toLowerCase();
    let tabLabel = sideTabResponse[selectedTab]?.label?.toLowerCase();
    let selectAssetTitle = contentType == 'original' ? constantText.tvSeasonAssetType.original[tabLabel] : constantText.tvSeasonAssetType.tvShow[tabLabel];

    if (!(!!selectAssetTitle)) { selectAssetTitle = constantText.tvSeasonAssetType.default[0]; }
    this.setState({
      showTitle: selectAssetTitle,
      isLoading: true,
      selectedTabId: sideTabResponse[selectedTab]?.id
    }, () => this.getTemplateDetails(SeasonId));
  };
  InputChanger = (event, elemIndex) => {
    const copyJSON = [...this.state?.manualJsonSchema];
    const updatedElement = copyJSON[elemIndex];
      if (updatedElement) {
        updatedElement.value =
          updatedElement.type === "textEditor"
            ? event.target.value?.replace(/(<([^>]+)>)/gi, "") ? event.target.value : event.target.value.replace(/(<([^>]+)>)/gi, "")
            : event.target.value;
             //check validity
              const { isValid, errorText } = checkValidity(
                updatedElement?.value,
                updatedElement?.validation
              );
              updatedElement.valid = isValid;
              updatedElement.errorText = errorText;
      }
    this.setState({
      manualJsonSchema: copyJSON,
    }, () => {
      this.checkFormValid(JSON.parse(JSON.stringify(copyJSON)));
    });
  };
  checkFormValid = (copyJSON) => {
    const { formValidity } = isValidatedForm(copyJSON);
    this.setState({
      isValidForm : formValidity
    });
  }
  goBack = () => {
    this.props.history?.goBack();
  }
  setSelectDataArr = (res, index) => {
    const copyJSON = [...this.state?.manualJsonSchema];
    const updatedElement = copyJSON[index];
    if (updatedElement?.name === "country") {
      const GroupName = [];
      res?.forEach((group) => {
        group?.countries?.forEach((item) => {
          const obj = { ...item };
          obj.group = group?.title;
          GroupName.push(obj);
        });
      });
      updatedElement.data = GroupName || [];
    } else {
      if (updatedElement) updatedElement.data = res || [];
    }
    this.setState({ manualJsonSchema: copyJSON });
  };

  getEpisodeProperties = async (SeasonId, tvShowId) => {
    let url = `${Config.season.seasonProperties}/${SeasonId}?tvShowId=${tvShowId}`
    const response = await apiCalls(url, "Get", {}, null, false)
    let contentType = response?.subtype?.value ? response?.subtype?.value?.title : 'Original'
    this.setState({ contentType: contentType, externalId: response?.externalId?.value });

  }

  getTemplateDetails = async (seasonId) => {
    const copyJSON = this.state.manualJsonSchema;
    const subtypeId = this.state?.selectedTabId
    let url = `${Config.episode.episodeTemplate}/${subtypeId}/${seasonId}`
    const response = await apiCalls(url, "Get", {}, null, false)
    if (response) {
      copyJSON.forEach(template => {
        const value = response[template?.name];
        const value2 = response['mapCollectionId']
        template.value =
          template.type === "dropdownAsync"
            ? value === ""
              ? null
              : value
            : value || "";
        template.touched = 0;
      })
      this.setState({ isLoading : false, editTemplate: true, manualJsonSchema: copyJSON })
      this.checkFormValid(JSON.parse(JSON.stringify(copyJSON)));
    } else {
      this.setState({  isLoading : false, editTemplate: false, manualJsonSchema: copyJSON })
    }
  }

  saveTemplate = async (title) => {
    const { manualJsonSchema, selectedTabId, editTemplate, selectedTab } = this.state
    const { formValidity, validatedForm } = isValidatedForm(manualJsonSchema);
    if (formValidity) {
      let postData = {}
      const mapContentID = []
      postData.title = title
      manualJsonSchema.forEach(template => {
        if (template?.name === "mapCollectionId") {
          let mapID = (template?.value)
          mapID?.forEach(mapTemplateID => {
            mapContentID.push(mapTemplateID?.id)
          })
          postData.mapCollectionId = mapContentID

        } else {
          postData[template.name] = template.value
        }
      })
      postData.subtypeId = selectedTabId
      postData.seasonId = this.state.SeasonId
      const response = await apiCalls(Config.episode.episodeTemplate, "post", postData, null, true, false, this.props.autoSaveError);
      if (response) {
        this.changeTitleField(selectedTab)
        this.setState({ showModal: true, isUpdate: editTemplate, modalError: false });
      } else {
        this.setState({ showModal: true, isUpdate: editTemplate, manualJsonSchema: this.state.manualJsonSchema, modalError: response ? false : true });
      }
    } else {
      this.setState({ manualJsonSchema: validatedForm });
    }
  }

  closeCommonModel = () => {
    this.setState({ showModal: false, selectedTab: this.state.selectedTab })
  }

  handleRoute = (route) => {
    history.push(route);
  };

  handleSearchableInput = async (value, index) => {
    let { manualJsonSchema } = this.state;
    // in backend it also include external id with searchString data
    let newArr = []
    let url = `collection?searchStringOrExternalId=${value}`
    let response = (await apiCalls(url, "GET", {})) || [];
    response?.rows?.forEach(item => {
      let obj = {};
      obj.externalId = item?.externalId;
      obj.id = item?.id
      obj.title = `${item?.title} (${item?.externalId})`;
      newArr.push(obj);
    })

    manualJsonSchema[index]["data"] = newArr;
    this.setState((prevState) => ({ manualJsonSchema }));
  };

  render() {
    let url = "/edit";
    let contentId = this.props?.match?.params?.seasonId;
    const { path, match } = this.props;
    if (path?.includes("/tvshow/view")) {
      url = "/view";
    }
    if (path?.includes("/tvshow/quick/edit")) {
      url = "/quick/edit";
    }
    if (path?.includes("/tvshow/single/edit/")) {
      url = "/single/edit";
    }
    let {
      leftTab,
      selectedTab,
      manualJsonSchema,
      globalFields,
      isLoading,
      isValidForm,
      showTitle,
      contentType,
      showModal,
      externalId,
      modalError,
      editTemplate,
      isUpdate
    } = this.state;
    let globalIndex = 1,
      stage = "Draft";
    let { tvShowUrl, seasonUrl } = seasonBreadcrumbUrls(location)
    let modalMessage = modalError ? "Unable to Create Template" : isUpdate ? "Template Updated Successfully!" : "Template Created Successfully!";
    return (
      <div className="d-wrap c-n">
        <BreadCrumbs
          className=""
          links={breadCrumbs.links(tvShowUrl, seasonUrl, match?.params?.id, contentId)}
          typography={breadCrumbs?.typography}
        />
        <div className="profile-head flex align-items-center justify-content-between">
          <div className="back-user-btn auto-back-btn">
            <span id="handle-route-button"   onClick={() => this.props.history?.goBack()}>
              <AngleLeftArrow />
            </span>
            <strong>
              <span>{constantText.tvShowsConstant.template}</span>
            </strong>
          </div>
          {externalId &&
            <div className="head-external-id">
              <span className="text">{constantText.external_id_text}</span>
              <span className="num">{externalId}</span>
            </div>
          }
        </div>

        <div className="col-3-box">
          <div className="row gutter-minus-10">
            <div className="col-md-4 col-lg-3 col-xl-2 gutter-10 left-section">
              <div className="whitebox">
                <LeftTab
                  className="leftTab-widget"
                  orientation="vertical"
                  variant="scrollable"
                  options={leftTab}
                  selectedTab={selectedTab}
                  showIcon={true}
                  Icon1={RadioButtonCheckedIcon}
                  Icon2={CheckCircleIcon}
                  Icon3={RadioButtonUncheckedIcon}
                  handleChange={this.handleTab}
                />
              </div>
            </div>

            <div className="col-md-8 col-lg-9 col-xl-10 gutter-10 mid-section ">
              <div className="whitebox">
                <div className="ccm-head flex align-items-center justify-content-between">
                  <h4 className={"capital"}>{leftTab[selectedTab]?.label}</h4>
                </div>
                <div className="col-12 p-b-30">
                <form>
                <div className={"text-center"}>
                <InlineLoader
                      show={isLoading || isLoading === null}
                    />
                </div>
                {(isLoading === false) && <div className="row">
                    <div className="col-md-12 m-b-20">
                      <span className="Create-License">
                        {constantText.seasonTemplate}{contentType.toLowerCase() === 'tv show' ? ` (TV Show)` : contentType.toLowerCase() === 'original' ?  ` (Original)` : ` ${contentType}`}
                      </span>{" "}
                      :
                      <span className="Create-License">
                        <strong> {showTitle}</strong>
                      </span>
                    </div>
                    {manualJsonSchema && manualJsonSchema.length && (
                      <FormRender
                        form={manualJsonSchema}
                        serverCall={true}
                        handleAutoCreateInput={this.handleSearchableInput}
                        onChange={this.InputChanger}
                        setSelectDataArr={this.setSelectDataArr}
                      />
                    )}

                      <div className="col-md-6 col-lg-6">
                        <ButtonField
                          className="zee-btn-field zee-full"
                          variant="contained"
                          color="primary"
                          disabled={!isValidForm}
                          buttonText={editTemplate === false ? "SAVE" : "UPDATE"}
                          onClick={() => editTemplate === true ? this.saveTemplate(showTitle) : this.saveTemplate(showTitle)}
                        />
                      </div>
                    </div>}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CommonModel
          className="popup-wrap status-popup"
          state={showModal}
          showTitle={true}
          title="Template"
          showIcon={false}
          showDes={true}
          des={modalMessage}
          showBtn1={true}
          btn1Text={constantText.ok_text}
          btn1Action={this.closeCommonModel}
          showBtn2={false}
        />
      </div>
    );
  }
}
export default AddTemplate;
