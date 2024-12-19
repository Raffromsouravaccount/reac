import React, { Component, Fragment } from "react";

//Common files
import BreadcrumbsComp from "../../Common/BreadCrumbs/BreadCrumbs";
import RadioButton from "../../Common/RadioButton/RadioButton";
import { CommonModel } from "../../Common/Model/CommonModel";
import LeftTab from "../../Common/LeftTab/CommonLeftTab";
import SeasonList from "./SeasonList";
import OrderSet from "./OrderSet/OrderSet";
import FormRender from "../../Common/FormHelper/FormRender";
import { DEFAULT_JSON, isValidatedForm } from "../../Common/FormHelper/FormValidSetter";
import checkValidity from "../../Common/FormHelper/FieldValidator";
//Helper files
import { history } from "../../../_helpers/history";
import { permissionObj } from "../../../_helpers/permission";
import { constantText } from "../../../_helpers/constants.text";
import { breadCrumbs } from "../breadCrumbs";
import { getSelectedGroup, dateDiffDayCount } from "../../../_helpers/util";
import { apiCalls } from "../../../_services/common.service";
import Config from "../../../Config/config";
//Icons
import AngleLeftArrow from "images/angle-left-arrow.svg";
//JSON
import headerTabs from "../Schema/SeasonList/HeaderTabs.json";
import OrderSetJson from "../Schema/OrderSet/OrderSet.json";

//CSS
import "../../../../public/css/Common/Season.css";
import { filterService } from "../../../_services/filterService";
export default class Season extends Component {
  constructor(props) {
    super(props);
    const savedFilterData = filterService.getSavedFilterData({ page: filterService.pages.seasonListing })
    this.state = {
      JSONSchema: DEFAULT_JSON(OrderSetJson),
      selectJourney: null,
      showAskedPopup: false,
      tvShow: {},
      showSetPopup: false,
      showDelPopup: false,
      showSetEditPopup:false,
      showModelForClone: false,
      selectedTab: 0,
      setMode: 'create',
      assignedData: [],
      allStatus: [],
      LanguageArr: [],
      filteredData: [],
      defaultSeasonId: null,
      searchString: savedFilterData.searchString || "",
      OrderSetList: [],
      seasonOrderingId:"",
      options: JSON.parse(JSON.stringify(headerTabs)),
      updateObj: { setName: null, country: null },
      model: {
        detail: "",
        open: false,
        desc: "",
        btn1: constantText.yes_text,
        btn2: constantText.no_text,
      },
    };
  }
  componentDidMount() {
    this.getAllStatus();
    this.fetchDefaultList();
    this.getAllLanguage();
  }
  getAllStatus = async () => {
    let response = await apiCalls(
      `${Config.masterUrl}/ContentState`,
      "GET",
      {},
      `/tvshow`,
      false
    );
    if (response) {
      this.setState({ allStatus: response });
    }
  };
  fetchSetList = async () => {
    const { match } = this.props;
    const { id } = match.params || {};
    if(id){
      const response = await apiCalls(`${Config?.season?.seasonOrder}/${id}/Manual`, "GET",{}, null,true);
      if(response && response?.orderList?.length){
        const tvshowData = response?.tvShow || {};
        this.setState({tvShow: tvshowData, OrderSetList : response?.orderList});
      }
      else{
        this.setState({OrderSetList : []});
      }
    }
  }
  fetchDefaultList = async () => {
    const { match } = this.props;
    const { id } = match.params || {};
    if (id) {
      const response = await apiCalls(`${Config?.season?.seasonOrder}/${id}/Default`, "GET", {}, null, true);
      if (response && response?.orderList?.length) {
        const data = response?.orderList[0] || {};
        const tvshowData = response?.tvShow || {};
        const seasons = this.setSeasonListData(data?.seasonList || [], tvshowData);
        this.setState({tvShow: tvshowData, assignedData : seasons, defaultSeasonId : data?.seasonOrderingId},() => {
          this.filterDefaultList();
        });
      }
      else{
        this.setState({ assignedData : [], defaultSeasonId : null});
      }
    }
  }
  setSeasonListData = (seasonList, tvShow) => {
    const { tvShowLicenses } = tvShow || {};
    seasonList?.map((item) => {
      item["licenceExpDays"] = [];
      if (item?.seasonLicenses?.length > 0) {
        item?.seasonLicenses.map((licenceItem) => {
          if (licenceItem?.validUntil) {
            let days = dateDiffDayCount(licenceItem?.validUntil);
            let signDays = Math.sign(days);
            let expDays = dateDiffDayCount(licenceItem?.validUntil) <= 5;
            if (signDays >= 0 && expDays) {
              item["licenceExpDays"].push(days);
            }
          }
        });
      }
      else if(tvShowLicenses?.length > 0){
        tvShowLicenses?.map((licenceItem) => {
          if (licenceItem?.validUntil) {
            let days = dateDiffDayCount(licenceItem?.validUntil);
            let signDays = Math.sign(days);
            let expDays = dateDiffDayCount(licenceItem?.validUntil) <= 5;
            if (signDays >= 0 && expDays) {
              item["licenceExpDays"].push(days);
            }
          }
        });
      }
    });
    return seasonList;
  };

  handleRadioButton = (event) => {
    let { name, value } = event.target;
    this.setState((prevState) => ({ [name]: value }));
  };
  InputChanger = (event, elemIndex) => {
    const { updateObj } = this.state;
    const copyJSON = [...this.state.JSONSchema];

    const updatedElement = copyJSON[elemIndex];
    updatedElement.value = event.target.value;

    const { isValid, errorText } = checkValidity(
      updatedElement.value,
      updatedElement.validation,
      false
    );
    updatedElement.valid = isValid;
    updatedElement.errorText = errorText;
    this.setState({ 
      JSONSchema: copyJSON,
      updateObj: {
        ...updateObj,
        [updatedElement.name]: updatedElement.value,
      }
    });
  };
  getAskedCreateUI = () => {
    const { selectJourney } = this.state;
    return (
      <RadioButton
        name={"selectJourney"}
        value={selectJourney}
        labelText=""
        labelPlacement="end"
        data={constantText.season_journey_obj}
        onChange={this.handleRadioButton}
        className="zee-radio-field status-field align-items-center"
      />
    );
  };
  selectGroup = (event, group) => {
    const { JSONSchema } = this.state;
    const copyFormFieldsJson = JSON.parse(JSON.stringify(JSONSchema));
    const copyElement = { ...copyFormFieldsJson[1] };
    const copyOptions = [...copyElement.data];
    copyElement.value = getSelectedGroup(
      event,
      group,
      copyOptions,
      copyElement.value
    );
    copyFormFieldsJson[1] = copyElement;
    this.setState({ JSONSchema: copyFormFieldsJson });
  };
  setSelectDataArr = (res, index) => {
    const copySelect = [...this.state.JSONSchema];
    const updatedElement = copySelect[index];
    if (updatedElement.name === "country") {
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
      updatedElement.data = res || [];
    }
    this.setState({ JSONSchema: copySelect });
  };
  getSetCreateUI = () => {
    const { JSONSchema } = this.state;
    return (
      <FormRender
        form={JSONSchema}
        selectGroup={this.selectGroup}
        setSelectDataArr={this.setSelectDataArr}
        onChange={(e, index) => this.InputChanger(e, index)}
      />
    );
  };
  showHideSetPopup = () => {
    let { showSetPopup } = this.state;
    this.setState((prevState) => ({ 
      showSetPopup: !showSetPopup,
      setMode: 'create',
      updateObj: { setName: null, country: null },
      JSONSchema: DEFAULT_JSON(OrderSetJson)
     }));
  };

  showHideAskedPopup = () => {
    let { showAskedPopup } = this.state;
    this.setState((prevState) => ({
      showAskedPopup: !showAskedPopup,
      selectJourney: null,
    }));
  };
  handleRoute = (route) => {
    history.push(route);
  };
  tabSwitched = (event, selectedTab) => {
    const { OrderSetList } = this.state;
    if (selectedTab === this.state.selectedTab) {
      return;
    }
    else if(selectedTab === 1 && !OrderSetList?.length){
      this.fetchSetList();
    }
    this.setState({
      selectedTab,
    });
  };
  goToSeason = () => {
    this.showHideAskedPopup();
    let { selectJourney } = this.state;
    let previousRoute = this.props.match.url;
    if (selectJourney) {
      let route = selectJourney == "3"? `${previousRoute}/single/create`: selectJourney == "2"
        ? `${previousRoute}/quick/create`: `${previousRoute}/create`;
      history.push(route);
    }
  };
  searchDefaultChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value },() => {
      filterService.saveFilterData({ page: filterService.pages.seasonListing, searchString: value });
      this.filterDefaultList();
    });
  };
  getAllLanguage = async () => {
    let response = await apiCalls(
      `${Config.masterUrl}/Language`,
      "GET",
      {},
      `/tvshow`,
      false
    );
    if (response) {
      this.setState({ LanguageArr: response });
    }
  };
  filterDefaultList = () =>{
    const { searchString, assignedData} = this.state;
    if(assignedData?.length){
      const copyAssignedData = [...assignedData];
      const filteredData = copyAssignedData.filter(e => {
        let searchKey = `${e?.title} ${e?.externalId}`;
         return searchKey.toLowerCase().includes(searchString?.toLowerCase());
      });
      this.setState({ filteredData : filteredData });
    }
  }
  reArrangeHandler = async (event) => {
    const { defaultSeasonId } = this.state;
    const { match } = this.props;
    const { id } = match.params || {};
    const { source, destination } = event;
    if (!destination || source.index == destination.index) {
      return;
    }
    let contentList = [...this.state.assignedData];
    const contentListCopy = JSON.parse(
      JSON.stringify([...this.state.assignedData])
    );
    let content = contentList.splice(source.index, 1);
    contentList.splice(destination.index, 0, content[0]);

    if (defaultSeasonId && id) {
      const patchData = {};
      patchData.orderType = defaultSeasonId;
      patchData.rearrangeArray = contentList.map(e => e?.seasonId);
      const response = await apiCalls(`${Config?.season?.seasonOrder}/${id}`,"PATCH",patchData,null,true);
      this.setState({ assignedData: contentList},() => {
        this.filterDefaultList();
      });
    }
  };
  reArrangeSetHandler = async (event, index) => {
    const { OrderSetList } = this.state;
    const { match } = this.props;
    const { id } = match.params || {};
    const { source, destination } = event;
    if (!destination || source.index == destination.index) {
      return;
    }
    let orderID = OrderSetList[index]['seasonOrderingId'] || null;
    let contentList = [...OrderSetList[index]['seasonList']];
    const contentListCopy = JSON.parse(
      JSON.stringify([...OrderSetList[index]['seasonList']])
    );
    let content = contentList.splice(source.index, 1);
    contentList.splice(destination.index, 0, content[0]);
    OrderSetList[index]['seasonList'] = contentList;
    if(orderID && id){
      const patchData = {};
      patchData.orderType = orderID;
      patchData.rearrangeArray = contentList.map(e => e?.seasonId);
      const response = await apiCalls(`${Config?.season?.seasonOrder}/${id}`,"PATCH",patchData,null,true);
      this.setState({ OrderSetList });
    }
  };

  handleOpenEditSet = async (set) => {
    const { showSetPopup, JSONSchema } = this.state;
    const jsonObj = {
      setName : set?.setName,
      country: set?.countryId
    }
     JSONSchema.forEach((item) => {
      const value = jsonObj[item?.name];
      item.value =
        item.type === "dropdown"
          ? value === ""
            ? null
            : value
          : value || "";
    });
    this.setState((prevState) => ({ 
      showSetPopup: !showSetPopup,
      seasonOrderingId: set?.seasonOrderingId,
      setMode: 'edit',
      JSONSchema
     }));
  }
  createNewSet = async () => {
    const { match } = this.props;
    const { id } = match.params || {};
    const { JSONSchema } = this.state;
    const copyJSON = [...JSONSchema];
    const { formValidity, validatedForm } = isValidatedForm(copyJSON);
    this.setState({ JSONSchema: validatedForm });
    if (id && formValidity) {
      const setName = copyJSON[0].value;
      const countries = copyJSON[1].value;
      const postData = {};
      postData.tvShowId = id;
      postData.setName = setName;
      postData.countryId = countries?.map(e => e.id);
      const response = await apiCalls(`${Config?.season?.seasonOrder}`, "POST", postData, match?.url,true);
      this.setState({ 
        updateObj: { setName: null, country: null },
        showSetPopup: false 
      });
      if(response){
        this.fetchSetList();
      }
    }
  }
  updateSet = async() =>{
    const { match } = this.props;
    const { seasonOrderingId, JSONSchema, updateObj } = this.state;
    const copyJSON = [...JSONSchema];
    const { validatedForm } = isValidatedForm(copyJSON);
    this.setState({ JSONSchema: validatedForm });
    if (updateObj?.setName || updateObj?.country?.length) {
      const putData = {};
        putData.setName = updateObj?.setName ? updateObj?.setName : '';
        putData.countryId = updateObj?.country?.length ? updateObj?.country?.map((e) => e.id) : [];
        
      const response = await apiCalls(`${Config?.season?.seasonOrder}/${seasonOrderingId}`, "PUT", putData, match?.url,true);
      this.setState({ 
        updateObj: { setName: null, country: null },
        showSetPopup: false
       });
      if(response){
        this.fetchSetList();
      }
    }
    else{
      this.setState({ 
        updateObj: { setName: null, country: null },
        showSetPopup: false
       });
    }
  }
  handleOpenDeleteSet = (set) => {
    const {showDelPopup} = this.state;
    this.setState({
      seasonOrderingId:set?.seasonOrderingId,
      showDelPopup: !showDelPopup,
    });
  }

  deleteSet = async() => {
    const {seasonOrderingId} = this.state;
    let url = `${Config?.season?.seasonOrder}/${seasonOrderingId}`;
    await apiCalls(url, "DELETE", {  seasonOrderingId: seasonOrderingId },null, true, false);
      this.setState({
        showDelPopup:false
      },()=>{
        this.fetchSetList()
      })
  }
  showHideClonePopup = (currentShow, id, journey) => {
    const { showModelForClone } = this.state;
    if (currentShow) {
      this.setState({
        currentShow,
        currentCloneId: id,
        currentJourneyType: journey,
        showModelForClone: !showModelForClone,
      });
    } else {
      this.setState({
        currentShow: null,
        currentJourneyType: null,
        currentCloneId: null,
        showModelForClone: !showModelForClone,
      });
    }
  };
  cloneContent = async () => {
    const { match } = this.props;
    const { id } = match?.params;
    const {
      currentCloneId,
      currentJourneyType,
      showModelForClone,
    } = this.state;
    const cloneUrl = `${Config?.seasonClone}/${currentCloneId}`;
    const url = `${cloneUrl}`;
    const res = await apiCalls(url, "POST", {}, match?.url, true);
    if (res) {
      const clonedVideo = res;
      let seasonRoute =
        currentJourneyType == "3"
          ? `/tvshow/view/${id}/season/single/edit`
          : currentJourneyType == "2"
          ? `/tvshow/view/${id}/season/quick/edit`
          : `/tvshow/view/${id}/season`;

      this.props.history.push({
        pathname: `${seasonRoute}/${clonedVideo}`,
      });
    } else {
      this.setState({ showModelForClone: !showModelForClone });
    }
  };
  handleConditionRoute = (view, id) => {
    let canArchive = permissionObj?.tvShows?.archive?.canUpdate();
    let canPublish = permissionObj?.tvShows?.publish?.canCreate();

    if (!canPublish) return;
    let detail = {};
    detail.contentId = id;
    detail.view = view;
    if (view === "archive" || view === "restore") {
      if (canArchive) {
        const { model } = this.state;
        let shallowModel = { ...model };
        shallowModel.detail = detail;
        shallowModel.open = true;
        shallowModel.title =
          view === "archive"
            ? constantText.archived_content
            : constantText.restore_content;
        shallowModel.desc =
          view === "archive"
            ? constantText.archived_content_desc
            : constantText.restore_content_desc;
        this.setState({ model: shallowModel });
      }
    }
  };
  handleModel = async (action, model) => {
    let shallowModel = { ...model };

    // Archive to Draft
    if (
      action &&
      (shallowModel.detail?.view === "archive" ||
        shallowModel.detail?.view === "restore")
    ) {
      let { language, allStatus } = this.state;
      const cStatus =
        shallowModel.detail?.view === "archive"
          ? constantText.tvShowsConstants.unpublished
          : constantText.tvShowsConstants.archived;
      const nStatus =
        shallowModel.detail?.view === "archive"
          ? constantText.tvShowsConstants.archived
          : constantText.tvShowsConstants.draft;
      const currentStatus = allStatus.find((item) => item?.title === cStatus);
      const nextState = allStatus.find((item) => item?.title === nStatus);
      let data = {
        fromState: currentStatus?.id,
        toState: nextState?.id,
        contentType: 'season',
        contentData: {},
      };
      this.archiveServerCalls(model?.detail?.contentId, data);
    }
    shallowModel.for = "";
    shallowModel.open = false;
    shallowModel.title = "";
    shallowModel.desc = "";
    this.setState({ model: shallowModel });
  };
  archiveServerCalls = async (id, data) => {
    const { match } = this.props;
    let response = await apiCalls(
      `${Config.workflowAPI}/${id}`,
      "PUT",
      data,
      match?.url,
      false
    );
    if (response) {
      this.fetchDefaultList();
    }
  };
  render() {
    let {
      showAskedPopup,
      LanguageArr,
      filteredData,
      showSetPopup,
      showDelPopup,
      showSetEditPopup,
      showModelForClone,
      model,
      tvShow,
      setMode,
      options,
      searchString,
      selectedTab,
      OrderSetList
    } = this.state;
    const option = options[selectedTab];
    const {location} = this.props;

    const { match, path } = this.props;
    let url = "/edit";
    if (path?.includes("/tvshow/view")) {
      url = "/view";
    }
    if (path?.includes("/tvshow/quick/edit")) {
      url = "/quick/edit";
    }
    if (path?.includes("/tvshow/single/edit/")) {
      url = "/single/edit";
    }
    return (
      <div className="d-wrap c-n">
        <BreadcrumbsComp
          className=""
          links={breadCrumbs.links(url, match?.params?.id)}
          typography={breadCrumbs.typography} journeyType={location?.state?.journeyType}
        />
        <div className="profile-head flex align-items-center justify-content-between">
          <div className="back-user-btn">
            <span
              onClick={() =>
                this.handleRoute(`/tvshow${url}/${match?.params?.id}`)
              }
            >
              <AngleLeftArrow />
            </span>
            <strong>
              <span> {constantText.tv_show_season_text.seasons} </span>
            </strong>
          </div>
        </div>
        <div className="create-movie">
          <div className="whitebox min-h-350">
            <div className="ccm-head m-b-0">
              <h4>{constantText.tv_show_season_text.seasons}</h4>
            </div>
            <div className="cr-mov-tab ralated-tabs p-all-15">
              <LeftTab
                className="tabs"
                orientation="horizontal"
                variant="scrollable"
                options={[...options]}
                selectedTab={this.state.selectedTab}
                showIcon={false}
                handleChange={this.tabSwitched}
              />
              {selectedTab === 0 && (
                <Fragment>
                  <div className="season-search s-form flex justify-content-between p-t-20">
                    <input
                      type="text"
                      autoComplete="off"
                      name="searchString"
                      className={"auto-search"}
                      placeholder={
                        constantText.tv_show_season_text.searchSeason
                      }
                      value={searchString || ""}
                      onChange={this.searchDefaultChange}
                    />
                    <button
                      className="upload-btn auto-upload-btn"
                      onClick={this.showHideAskedPopup}
                    >
                      {constantText.tv_show_season_text.create}
                    </button>
                  </div>
                  <h4 className="title-h4">{"All Groups / Countries"}</h4>
                  <SeasonList
                    contentIdKey={option?.contentIdKey}
                    assignedData={[...filteredData]}
                    tvShow={tvShow}
                    LanguageArr={LanguageArr}
                    handleConditionRoute={this.handleConditionRoute}
                    reArrangeHandler={this.reArrangeHandler}
                    showHideClonePopup={this.showHideClonePopup}
                    meta={option}
                    matchParams={this.props?.match?.params}
                  />
                </Fragment>
              )}
              {selectedTab === 1 && (
                <Fragment>
                  <div className="flex align-items-center justify-content-between p-t-20">
                    <div className="set-order-title">{constantText.tv_show_season_text.createQuestion}</div>
                    <button
                      className="upload-btn auto-upload-btn"
                      onClick={this.showHideSetPopup}
                    >
                      {constantText.tv_show_season_text.createNewSet}
                    </button>
                  </div>
                  {OrderSetList.length ? (
                    <OrderSet
                      OrderSets={OrderSetList}
                      tvShow={tvShow}
                      LanguageArr={LanguageArr}
                      editHandler={this.handleOpenEditSet}
                      showHideClonePopup={this.showHideClonePopup}
                      deleteHandler={this.handleOpenDeleteSet}
                      reArrangeSetHandler={this.reArrangeSetHandler}
                      matchParams={this.props?.match?.params}
                      isViewMode={false}
                      option={option}
                    />
                  ) : (
                      <div className="no-data-box flex align-items-center justify-content-center">
                        {constantText.tv_show_season_text.no_set_text}
                      </div>
                    )}
                </Fragment>
              )}
            </div>
          </div>
        </div>

        <CommonModel
          state={showAskedPopup}
          handleClose={this.showHideAskedPopup}
          className="popup-wrap status-popup movie-edit-popup"
          title={"Create Season"}
          showIcon={false}
          showDes={false}
          Form={this.getAskedCreateUI()}
          btn1Text={constantText.yes_text}
          btn1Action={this.goToSeason}
          btn2Text={constantText.no_text}
          btn2Action={this.showHideAskedPopup}
        />
        <CommonModel
          state={showSetPopup}
          handleClose={this.showHideSetPopup}
          className="popup-wrap status-popup movie-edit-popup"
          title={setMode == 'create' ? constantText.tv_show_season_text.createSet: constantText.tv_show_season_text.updateSet}
          showIcon={false}
          showDes={true}
          desClass={"p-all-15"}
          des={`${constantText.tv_show_season_text.pleaseSelectCreateText} ${setMode == 'create' ? constantText.tv_show_season_text.createNewSet :  constantText.tv_show_season_text.updateSet}`}
          Form={this.getSetCreateUI()}
          btn1Text={constantText.yes_text}
          btn1Action={setMode == 'create' ? this.createNewSet : this.updateSet }
          btn2Text={constantText.no_text}
          btn2Action={this.showHideSetPopup}
        />
           <CommonModel
          className="popup-wrap status-popup"
          state={model.open}
          showIcon={false}
          showTitle={true}
          title={model.title}
          showDes={true}
          des={model.desc}
          showBtn1={true}
          btn1Text={model.btn1}
          btn1Action={() => this.handleModel(true, model)}
          showBtn2={true}
          btn2Text={model.btn2}
          btn2Action={() => this.handleModel(false, model)}
        />
        <CommonModel
          className="popup-wrap status-popup"
          state={showModelForClone}
          showTitle={true}
          title={constantText.Clone_content}
          showIcon={false}
          showDes={true}
          des={constantText.clone_popup_message}
          showBtn1={true}
          btn1Text={constantText.yes_text}
          btn1Action={this.cloneContent}
          showBtn2={true}
          btn2Text={constantText.no_text}
          btn2Action={() => this.showHideClonePopup(null)}
          handleClose={() => this.showHideClonePopup(null)}
        />

         <CommonModel
          className="popup-wrap status-popup"
          state={showDelPopup}
          showIcon={false}
          showTitle={true}
          title={constantText?.delete_set_order_text}
          showDes={true}
          des={constantText.tv_show_season_text.seasonSet}
          showBtn1={true}
          btn1Text={"Yes"}
          btn1Action={()=>this.deleteSet()}
          showBtn2={true}
          btn2Text={"No"}
          btn2Action={() => this.setState({ showDelPopup: false })}
        />
      </div>
    );
  }
}
