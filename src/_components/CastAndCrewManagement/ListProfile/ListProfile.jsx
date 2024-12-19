import React, { Component, Fragment } from "react";
import BottomScrollListener from 'react-bottom-scroll-listener';
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import moment from "moment";

//Helper Files
import { setLocalData } from "../../../_helpers/util";
import { permissionObj } from '../../../_helpers/permission';
import BadgeBox from "../../Common/BadgeBox/BadgeBox";
import { LeftTabListing } from "../../Common/LeftTab/LeftTabListing";
import { apiCalls, commonService } from "../../../_services/common.service";
import { CommonModel } from "../../Common/Model/CommonModel";
import InlineLoader from "../../Common/InlineLoader/InlineLoader";
import Config from "../../../Config/config";
import BreadcrumbsComp from "../../Common/BreadCrumbs/BreadCrumbs";
import { constantText } from "../../../_helpers/constants.text";
import ButtonField from "../../Common/ButtonField/ButtonField";
import ImagePreview from "../../Common/ImagePreview/ImagePreview";
import FormRender from '../../Common/FormHelper/FormRender';
import { history } from '../../../_helpers/history';
//Images
import FilterIcon from "images/filter-icon.svg";
import CloseSquareIcon from "images/close-square-icon.svg";
import AngleLeftArrow from "images/angle-left-arrow.svg";
import Edit from "images/edit.svg";
import View from "images/eye.svg";
import ArchiveIcon from "images/archive-icon.svg";
import RestoreIcon from "images/restore-icon.svg";
//JSON
import CastProfileJson from "../Schema/CastProfile_FE_Structure.json";
//Css Files
import "./ListProfile.css";
import AppliedFilter from "../../Common/LeftTab/AppliedFilter";


const statusText = {
  Draft: "Last Modified By",
  Published: "Published By",
  Unpublished: "Unpublished By",
  Archived: "Archived By",
  Changed: "Last Modified By",
}
class ListProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      links: [
        {
          color: "inherit",
          text: constantText.dashBoard_text,
          route: "/dashboard",
        },
      ],
      typography: [
        {
          color: "textPrimary",
          text: constantText.cast_profile_list,
        },
      ],
      isRequestIntiate: null,
      castFilterQuery: {},
      appliedFilters: [],
      isFilterUpdate: false,
      changingTab : false,
      showFilterDrawer: false,
      lastEvaluatedKey: 0,
      listCount: null,
      maxPage: null,
      allStatus: [],
      listProfile: [],
      castTypeList: [],
      tagBadgeList: [],
      filter: {
        limit: constantText.search_limit,
        fields: JSON.parse(JSON.stringify(CastProfileJson?.sideSelectFilters)),
        castName: "",
        contentStateId: "",
      },
      leftTabOtions: [],
      selectedLeftTab: 0,
      model: {
        detail: "",
        open: false,
        desc: "",
        btn1: constantText.yes_text,
        btn2: constantText.no_text
      },
      applyFilterKey: false,
      searchMode: false,
    
    };
  }

  componentDidMount() {
    const { filter} = this.state;
    commonService.getLeftSideBarListing('castAndCrew').then(res => {
      this.setState({ leftTabOtions: res.menuItems});
    });
    this.getAllStatus();
    this.fetchLeftTabData();
    this.getListProfile();
   
  }

  getAllStatus = async() => {
    let response = await apiCalls(`${Config.masterUrl}/ContentState`, 'GET', {}, constantText.cast_route, false);
    if (response) {
      this.setState({allStatus: response});
    }
  }
  fetchLeftTabData = async () => {
    let url = `${Config.castCount}`;
    const { listCount, filter } = this.state;
    const { contentStateId } = filter;
    let response = await apiCalls(url, "GET", null, constantText.cast_route, false);
    if (response && response?.length) {
      const data = response.map(item => {
        const obj = {};
        obj.displayName = item?.title || "";
        obj.count = item?.count || 0;
        obj.id = item?.id || "";
        obj.status = item?.status || "";
        obj.statusText = statusText[item?.title] || "Last Modified By";
        return obj;
      });
      this.setState({ leftTabOtions: data });
  }
 };
  fetchListProfile = async () => {
    const { isRequestIntiate, castFilterQuery } = this.state;
    if (isRequestIntiate || isRequestIntiate === null) {
      this.setState({ isRequestIntiate: false, isFilterUpdate: false });
      let url = `${Config.castList}`;
      if (castFilterQuery && Object.keys(castFilterQuery).length !== 0) {
        const ret = [];
        delete castFilterQuery.allFilter;
        for (let d in castFilterQuery) {
          if (!(castFilterQuery[d] === null || castFilterQuery[d] === undefined || castFilterQuery[d] === "")) {
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(castFilterQuery[d]));
          }
        }
        ret.length ? url = (url + '?' + ret.join('&')) : '';
      }
      //ListCall
      let response = await apiCalls(url, "GET", null, constantText.cast_route, false);
      this.setState({ isRequestIntiate: true, changingTab: false });
      const { listProfile, lastEvaluatedKey, leftTabOtions } = this.state;
      const { limit, contentStateId } = this.state.filter;
      if (response) {
        const newListProfile = [...listProfile, ...response?.rows];
        const Count = response?.count ? response?.count : 0;
        const Page = Count ? (Math.ceil(Count / limit) - 1) : 0;
        let stateObj = {
          listProfile: response?.rows?.length ? newListProfile : [],
          listCount: Count || 0,
          maxPage: Page || 0,
          lastEvaluatedKey: (lastEvaluatedKey + 1)
        };
        this.setState(stateObj);
      }
      else {
        this.setState({listCount: 0, listProfile : []});
      }
    }
  }
  handleMultiSelect = (ev, index) => {
    let { filter } = this.state;
    const { value } = ev.target;
    filter.fields[index].value = value;
    this.setState({
      filter: { ...filter }
    });
  }

  handleChange = (event) => {
    const { value } = event.target;
    let { filter } = this.state;
    filter['castName'] = value || "";
    this.setState({
      filter: filter,
      searchMode: true,
    });
  };
  checkvalidation = () => {
    const { filter } = this.state;
    if (filter.castTag.length || filter.castType.length || filter.castBirthday) {
      return false;
    } else {
      return true;
    }
  };
  getAppliedFilter = () => {
    let Arr = [];
    const birthDayArr = ["","Today","This Week","This Month"];
    const { filter } = this.state;
    filter.fields.forEach( item => {
    if(item?.value){
        if(item.multiple){
          item?.value?.forEach(selected => {
            let obj = {};
            obj.label = item?.label;
            obj.value = selected?.title;
            Arr.push(obj);
          })
        }
        else{
          let obj = {};
              obj.label = item?.label;
              obj.value = birthDayArr[item?.value];
              Arr.push(obj);
        }
    }
    });
    return Arr;
  }
  async applyFilter() {
    this.setState({ 
        appliedFilters: await this.getAppliedFilter(),
        listProfile: [],
        isFilterUpdate: true,
        listCount: 0,
        lastEvaluatedKey: 0,
        applyFilterKey: true,
       searchMode: false
      }, () => {
      this.getListProfile();
    });
  };
  async getListProfile() {
      await this.getListProfileQueryParams();
      await this.fetchListProfile();
  }
  getListProfileQueryParams = async () => {
    const paramsCopy = JSON.parse(JSON.stringify(this.state.filter));
    const { lastEvaluatedKey, isFilterUpdate, castFilterQuery } = this.state;
    const queryParams = {
      ...castFilterQuery,
      limit: paramsCopy.limit,
      page: lastEvaluatedKey,
      contentStateId: paramsCopy.contentStateId,
      castName: paramsCopy.castName
    };
    if(isFilterUpdate){
      if (paramsCopy?.fields[0]?.value && paramsCopy?.fields[0]?.value?.length) {
        queryParams['castType'] = paramsCopy?.fields[0]?.value.map((option) => option?.id);
        paramsCopy.castType = queryParams.castType.join(',')
      }
      if (paramsCopy?.fields[1]?.value && paramsCopy?.fields[1]?.value?.length) {
        queryParams['castTag'] = paramsCopy?.fields[1]?.value.map((option) => option?.id);
        paramsCopy.castTag = queryParams.castTag.join(',')
      }
      if (paramsCopy?.fields[2]?.value) {
        queryParams['castBirthday'] = paramsCopy?.fields[2]?.value;
      }
    }
    this.setState({castFilterQuery : queryParams});
  }
  async getCastTypeRecords(type, masterType) {
    await this.props.getCastType(type, masterType);
  }
  async getTagBadge(type, masterType) {
    await this.props.getTagBadge(type, masterType);
  }
  showHideFilterDrawer = () => {
    let { showFilterDrawer } = this.state;
    this.setState({ showFilterDrawer: !showFilterDrawer });
  };
  clearFilter = () => {
    const { filter } = this.state;
    const paramsCopy = JSON.parse(JSON.stringify(this.state.filter));
    const { lastEvaluatedKey } = this.state;
    const queryParams = {
      limit: paramsCopy.limit,
      page: lastEvaluatedKey,
      contentStateId: paramsCopy.contentStateId,
      castName: paramsCopy.castName
    };

    filter.fields.forEach(item => item.value = item.multiple ? [] : null)
    this.setState({
      castFilterQuery : queryParams,
      appliedFilters: [],
      listProfile: [],
      applyFilterKey: false,
      listCount: 0,
      lastEvaluatedKey: 0,
      filter: {
        ...filter
      },
      searchMode: false
    }, () => {
      this.showHideFilterDrawer();
      this.getListProfile();
    });
  };
  getFilterDrawerUI = () => {
    let { filter } = this.state;
    const disabled = (
      filter.fields[0].value?.length == 0
      && filter.fields[1].value?.length == 0
      && filter.fields[2].value == null) ? true : false;
    return (
      <div className="sidebarBox">
        <div className="top-w flex align-items-center justify-content-between">
          <div className="title">{constantText.filters_header_text}</div>
          <div className="side-close-btn" onClick={this.showHideFilterDrawer}><CloseSquareIcon /></div>
        </div>
        <Divider />
        <div className="middle-w">
          <div className="inner">
            <div className="f-filter">
              <FormRender
              data-test="list-profile-handleMultiSelect"
                form={filter.fields}
                setSelectDataArr={this.setSelectDataArr}
                onChange={this.handleMultiSelect}
              />
            </div>
          </div>
        </div>
        <div className="bottom-w filter-btn">
          <ButtonField color="secondary" className="apply-btn" buttonText={constantText.apply_filter_text}
            disabled={disabled}
            data-test="list-profile-applyFilter"
            onClick={() => {
              this.showHideFilterDrawer();
              this.applyFilter();
              this.setState({
                searchMode: false
              })
            }}
          />
          <ButtonField color="secondary" className="cancle-btn" buttonText={constantText.clear_text}
            data-test="list-profile-clearFilter" onClick={() => this.clearFilter()}
          />
        </div>
      </div>
    )
  }
  setSelectDataArr = (res, index) => {
    const { filter } = this.state;
    const copyFilters = JSON.parse(JSON.stringify(filter));
    copyFilters.fields[index].data = res;
    this.setState({ filter: copyFilters });
  };
  handleRoute = route => {
    history.push(route);
  };

  handleConditionRoute = (view, id) => {
    let { canView, canCreate, canUpdate }= permissionObj?.cast?.createCast;
    let {archive } = permissionObj?.cast;
    let detail = {};
    detail.contentId = id;
    detail.view = view;
    if (view === 'view') {
      setLocalData("ImageSection", view);
      if (canView()) {
        history.push(`${constantText?.cast_view_route}/${id}`, detail);
      }
    } else if (view === 'create') {
      if (canCreate()) {
        history.push(constantText?.cast_create_route, detail);
      }
    } else if (view === 'edit') {
      if (canUpdate()) {
        history.push(`${constantText?.cast_edit_route}/${id}`, detail);
      }
    } else if (view === 'archive' || view === 'restore' ) {
      if(archive?.canCreate() || archive?.canUpdate()){
      const { model } = this.state;
      let shallowModel = { ...model };
      shallowModel.detail = detail;
      shallowModel.open = true;
      shallowModel.title = view === 'archive' ? constantText.archived_content : constantText.restore_content;
      shallowModel.desc = view === 'archive' ? constantText.archived_content_desc : constantText.restore_content_desc;
      this.setState({ model: shallowModel });
      }
    }
  };
  nextCall = (key) => {
    const { filter, isRequestIntiate, maxPage, lastEvaluatedKey } = this.state;
    if (isRequestIntiate && maxPage && lastEvaluatedKey <= maxPage) {
    this.getListProfile();
    }
  }
  handleLeftTab = (option, index) => {
    // get status wise listing
    const { filter } = this.state;
    filter.contentStateId = option?.id;
    this.setState({ changingTab: true, listProfile: [], lastEvaluatedKey: 0, selectedLeftTab: index, filter }, () => {
      this.handleTabTimeout();
    });
  }
  archiveServerCalls = async (id, data, tabName) => {
    let response = await apiCalls(`${Config.workflowAPI}/${id}`, "PUT", data,constantText.cast_route, false );
    if(response) {
      let {leftTabOtions} = this.state;
      let tabIndex =leftTabOtions.findIndex(option => option.displayName === tabName);
      const tabOption = leftTabOtions.find(item => item.displayName === tabName);
      this.handleLeftTab(tabOption, tabIndex);
      this.fetchLeftTabData();
    }
  }
  handleModel = async (action, model) => {
    let shallowModel = { ...model };
    // Unpublish to Archive
    // Archive to Draft
    if (action && (shallowModel.detail?.view === 'archive' || shallowModel.detail?.view === 'restore')) {
      let { language, allStatus } = this.state;
      const cStatus = shallowModel.detail?.view === 'archive' ? constantText.castProfile.unpublished : constantText.castProfile.archived;
      const nStatus = shallowModel.detail?.view === 'archive' ? constantText.castProfile.archived : constantText.castProfile.draft;
      const currentStatus = allStatus.find(item => item?.title === cStatus);
      const nextState = allStatus.find(item => item?.title === nStatus);
      let data = {
        fromState: currentStatus?.id,
        toState: nextState?.id,
        contentType: "castProfile",
        language,
        contentData: { }
      };
      let tabName = shallowModel.detail?.view === 'archive' ? constantText.castProfile.archived : constantText.castProfile.draft
      this.archiveServerCalls(model?.detail?.contentId, data, tabName);
    }
    shallowModel.for = "";
    shallowModel.open = false;
    shallowModel.title = "";
    shallowModel.desc = "";
    this.setState({ model: shallowModel });
  }
  handleTabTimeout = () =>{
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      this.getListProfile();
    }, 1000);
  }
  handleKeyPress = (e) => {
    window.clearTimeout(this.timer);
  }
  handleKeyUp = (e) => {
    const { filter } = this.state;
    const { castName } = filter;
    window.clearTimeout(this.timer); // prevent errant multiple timeouts from being generated
    this.timer = window.setTimeout(() => {
      if (castName.length >= 3 || castName.length === 0) {
        this.setState({ listProfile: [],listCount : 0, lastEvaluatedKey: 0, isRequestIntiate: true });
        this.getListProfile();
      }
    }, 1000);
  }

  render() {
    const {
      listProfile,
      appliedFilters,
      listCount,
      lastEvaluatedKey,
      links,
      typography,
      showFilterDrawer,
      filter,
      leftTabOtions,
      selectedLeftTab,
      model,
      searchMode,
      isRequestIntiate,
      changingTab,
      applyFilterKey
    } = this.state || {};
    const { castName } = filter;
    const joinName = (obj) => {
      if (obj?.first_name || obj?.last_name) {
        return `${obj?.first_name} ${obj?.last_name}`;
      }
      else {
        return 'N/A';
      }
    }

    let { canView, canCreate, canUpdate }= permissionObj?.cast?.createCast;
    let {archive} = permissionObj?.cast;
    return (
      <div className="d-wrap c-n">
        <BreadcrumbsComp className="" links={links} typography={typography} />
        <div className="user-head profile-head flex justify-content-between align-items-center">
          <div
            className="back-user-btn flex align-items-center auto-back-btn"
            data-test="list-profile-handleRoute"
            onClick={() => this.handleRoute("/dashboard")}
          >
            <div className="text">
              <span>
                <AngleLeftArrow />
              </span>
              <strong data-test="list-profile-heading-text">
                {constantText.list_profile_heading_text}
              </strong>
            </div>
          </div>
          <div className="s-form flex">
            <input
              type="text"
              autoComplete="off"
              className="auto-search"
              id="searchVal"
              placeholder={constantText.profile_search_text}
              value={castName}
              data-test="list-profile-handleChange"
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress}
              onKeyUp={this.handleKeyUp}
            />
            <div className="filter-w">
              <ButtonField
                color="secondary"
                className={
                  applyFilterKey
                    ? "filter-btn current-active-filter"
                    : "filter-btn"
                }
                Icon={FilterIcon}
                buttonText={constantText.filter_button_text}
                data-test="list-profile-showfilterdrawer"
                onClick={this.showHideFilterDrawer}
              />
              <div
                className={
                  canCreate()
                    ? "btn-create-user auto-button-createProfile"
                    : "btn-create-user disable-f-btn auto-button-createProfile"
                }
                onClick={() =>
                  canCreate()
                    ? this.handleRoute(constantText?.cast_create_route)
                    : {}
                }
              >
                {constantText.create_profile_button_text}
              </div>
            </div>
          </div>
        </div>
        <div className="row list-profile">
          <div className="col-md-4 col-lg-3">
            <LeftTabListing
              disableTabs={changingTab}
              selectedTab={selectedLeftTab}
              options={leftTabOtions}
              data-test="list-profile-handleLeftTab"
              onChange={this.handleLeftTab}
            />
          </div>

          <div className="col-md-8 col-lg-9">
            {appliedFilters?.length > 0 && (
              <AppliedFilter
                className="tabs lang-tab filter-scroll"
                options={appliedFilters}
                listCount={listCount}
              />
            )}
            {lastEvaluatedKey !== 0 && (
              <Fragment>
                <BottomScrollListener
                  onBottom={() => {
                    this.nextCall(lastEvaluatedKey);
                  }}
                debounce={10000} offset={5}
                />
              </Fragment>
            )}

            {listProfile && listProfile.length > 0 ? null : isRequestIntiate &&
              !changingTab ? (
              searchMode ? (
                <div className="whitebox list-profile-box flex justify-content-between">
                  {castName ? (
                    constantText.no_result_text
                  ) : (
                    <b>{constantText.no_record_found}</b>
                  )}
                </div>
              ) : (
                <div className="whitebox list-profile-box flex justify-content-between">
                  {applyFilterKey ? (
                    <span>
                      <b>{constantText.no_result_filter}</b>
                      {constantText.no_result_filter_text}
                    </span>
                  ) : (
                    <b>{constantText.no_record_found}</b>
                  )}
                </div>
              )
            ) : (
              <div className="whitebox list-profile-box">
                <InlineLoader
                  show={!isRequestIntiate || listProfile?.length === 0}
                />
              </div>
            )}
            {listProfile &&
              listProfile.map((item, key) => {
                return (
                  <div
                    key={key}
                    className="whitebox cast-listing list-profile-box flex justify-content-between"
                  >
                    <div className="left-block flex">
                      <ImagePreview
                        className="MuiPaper-root"
                        imageUrl={
                          item?.castProfileImage && item.castProfileImage?.url
                            ? `${Config.imageBaseUrl}${item?.externalId}/${constantText.castProfileImage}/${item.castProfileImage?.url}`
                            : "images/no-image-icon.svg"
                        }
                        title={item?.castName !== "NoName"}
                      />
                      <div className="info-block">
                        <div className="flex list-top-text align-items-center">
                          <strong>
                            {item?.castName
                              ? item?.castName
                              : "Untitled Profile"}
                          </strong>
                          {item?.contentState && selectedLeftTab == 0 && (
                            <BadgeBox
                              status={item?.contentState?.title}
                            />
                          )}
                        </div>

                        <div key={key} className="list-middle-text">
                          {item?.castTypeNames?.length
                            ? item?.castTypeNames
                                ?.map((e) => e?.title)
                                .join(", ")
                            : "N/A"}
                        </div>

                        <div className="status-text flex">
                          <span className="label">
                            {leftTabOtions[selectedLeftTab]?.statusText}
                          </span>
                          <span className="text list-capitalize">
                            <span>
                              {item?.modified_by
                                ? joinName(item?.modified_by)
                                : joinName(item?.created_by)}
                            </span>
                            <span>
                              {item?.modifiedOn || item?.createdOn
                                ? moment(
                                    item?.modifiedOn
                                      ? item?.modifiedOn
                                      : item?.createdOn
                                  ).format(constantText.date_format_without_time)
                                : "N/A"}
                            </span>
                            <span>
                              {item?.modifiedOn || item?.createdOn
                                ? moment(
                                    item?.modifiedOn
                                      ? item?.modifiedOn
                                      : item?.createdOn
                                  ).format(constantText.time_format_lt)
                                : "N/A"}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="right-block">
                    <div className="cast-icon-sec flex align-items-center  justify-content-between">
                      <div className="ext-id"><span className="text-id">{constantText.external_id_text}</span><span className="num-id"> {item?.externalId}</span></div>
                      <div className="cast-cta-wrap flex">
                        <div
                          className="span view tooltip-sec"
                          onClick={() =>
                            canView()
                              ? this.handleRoute(
                                  `${constantText?.cast_view_route}/${item?.id}`
                                )
                              : {}
                          }
                        >
                          <View />
                          <div className="tooltip-box">
                            {canView()
                              ? constantText.tool_tip_view
                              : constantText.tool_tip_noPermission}{" "}
                          </div>
                        </div>
                        {item?.contentState?.title !==
                        constantText.contentConstants.archived ? (
                          <div
                            className="span edit tooltip-sec"
                            onClick={() =>
                              canUpdate()
                                ? this.handleRoute(
                                    `${constantText?.cast_edit_route}/${item?.id}`
                                  )
                                : {}
                            }
                          >
                            <Edit />
                            <div className="tooltip-box">
                              {canUpdate()
                                ? constantText.tool_tip_edit
                                : constantText.tool_tip_noPermission}{" "}
                            </div>
                          </div>
                        ) : null}
                        {item?.contentState?.title ==
                          constantText.contentConstants.unpublished && (
                          <div
                            className="span edit tooltip-sec"
                            onClick={() =>
                              this.handleConditionRoute("archive", item?.id)
                            }
                          >
                            <ArchiveIcon />
                            <div className="tooltip-box">
                              {archive?.canCreate()
                                ? constantText.tool_tip_archive
                                : constantText.tool_tip_noPermission}{" "}
                            </div>
                          </div>
                        )}
                        {item?.contentState?.title ==
                          constantText.contentConstants.archived && (
                          <div 
                            className="span edit tooltip-sec"
                            onClick={() =>
                              this.handleConditionRoute("restore", item?.id)
                            }
                          >
                            <RestoreIcon />
                            <div className="tooltip-box">
                              {archive?.canCreate()
                                ? constantText.tool_tip_restore
                                : constantText.tool_tip_noPermission}{" "}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    </div>
                  </div>
                );
              })}
            <InlineLoader
              show={listProfile.length !== 0 && !isRequestIntiate}
            />
          </div>
        </div>

        <div className="sidebarBox">
          <Drawer
            open={showFilterDrawer}
            anchor="right"
            onClose={this.showHideFilterDrawer}
          >
            {this.getFilterDrawerUI()}
          </Drawer>
        </div>
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
      </div>
    );
  }
}

export default ListProfile;
