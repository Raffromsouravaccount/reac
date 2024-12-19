import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import moment from "moment";
import BottomScrollListener from "react-bottom-scroll-listener";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

//Common files
import BreadcrumbsComp from "../../Common/BreadCrumbs/BreadCrumbs";
import RadioButton from "../../Common/RadioButton/RadioButton";
import CheckBox from "../../Common/CheckBox/CheckBox";
import { CommonModel } from "../../Common/Model/CommonModel";
import AppliedFilter from "../../Common/LeftTab/AppliedFilter";
import ButtonField from "../../Common/ButtonField/ButtonField";
import LeftTab from "../../Common/LeftTab/CommonLeftTab";
import EpisodeCard from "./EpisodeCard/EpisodeCard";
import { episodeConstants } from "../Constants/episode.constant";
import OrderSet from "./OrderSet/OrderSet";
import FormRender from "../../Common/FormHelper/FormRender";
import DropDown from "../../../_components/Common/DropDown/DropDown";

import {
  DEFAULT_JSON,
  isValidatedForm,
} from "../../Common/FormHelper/FormValidSetter";
import checkValidity from "../../Common/FormHelper/FieldValidator";
import DatePicker from "../../Common/DatePicker/DatePicker";
import InlineLoader from "../../Common/InlineLoader/InlineLoader";

//Helper files
import { history } from "../../../_helpers/history";
import { tvEpisodeAction } from "../../../_actions/tvEpisode.action";
import { constantText } from "../../../_helpers/constants.text";
import { breadCrumbs } from "../breadCrumbs";
import { getSelectedGroup, dateDiffDayCount } from "../../../_helpers/util";
import { permissionObj } from "../../../_helpers/permission";
import { apiCalls } from "../../../_services/common.service";
import Config from "../../../Config/config";
import { createQuery } from "../../Common/CommonFunction/CommonFuntion";
//Icons
import AngleLeftArrow from "images/angle-left-arrow.svg";
import SortIcon from "images/sort-icon.svg";
import CloseSquareIcon from "images/close-square-icon.svg";
import FilterIcon from "images/filter-icon.svg";
import TemplateIcon from "images/Quick-Links/Qi-Template.svg";
import OrderSetIcon from "images/orderbysort.svg";
import Delete from "images/delete.svg";

//JSON
import headerTabs from "../Schema/EpisodeList/HeaderTabs.json";
import OrderSetJson from "../Schema/OrderSet/OrderSet.json";
import {
  sideSelectFilters,
  filterByDate,
  StatusTypes,
  sortingFilters,
  setOrderFilters,
} from "../Schema/EpisodeList/SideFilter.json";

//CSS
import "../../../../public/css/Common/Episode.css";
import { filterService } from "../../../_services/filterService";

export const filterValidityCheck = (jsonform) => {
  let formIsValid = true;
  let elementValid = true;
  let form = jsonform;

  form.forEach((element) => {
    if (element?.display !== false) {
      let { isValid } = checkValidity(element.value, element.validation);
      elementValid = isValid;
      formIsValid = elementValid && formIsValid;
    }
  });
  return { formValidity: formIsValid };
};

 class Episode extends Component {
  constructor(props) {
    super(props);
    const savedFilterData = filterService.getSavedFilterData({
      page: filterService.pages.episodeListing, 
      sortingFilters: sortingFilters,
      statusTypes: StatusTypes,
      filterByDate: filterByDate,
      selectFilters: DEFAULT_JSON(JSON.parse(JSON.stringify(sideSelectFilters)))
    })
    this.state = {
      JSONSchema: DEFAULT_JSON(OrderSetJson),
      updateObj: {
        setName: null,
        country: null,
      },
      selectJourney: null,
      allStatus: [],
      currentCloneIndex: null,
      showsCount: 0,
      maxPage: null,
      isSelectAll: false,
      currentSortkey: savedFilterData.currentSortkey || 'lastModifiedOn',
      currentSortValue: savedFilterData.currentSortValue || 'desc',
      isRequestIntiate: true,
      selectCreateType: null,
      showsFilterQuery: {},
      indexSortType: savedFilterData.indexSortType || "DESC",
      sortDatakey: savedFilterData.sortDatakey,
      checkSortValid: true,
      blankDate: savedFilterData.blankDate,
      showFilterDrawer: false,
      openSetIndexDrawer: false,
      openSortDrawer: false,
      filterDatakey: savedFilterData.filterDatakey,
      MoreCountriesBlock: null,
      showModelForMore: false,
      showAskedPopup: false,
      showDelPopup: false,
      openCloneDrawer: false,
      showAskedStep: 0,
      showSetPopup: false,
      setMode: "create",
      selectedTab: 0,
      episodeList: [],
      LanguageArr: [],
      tabOptions: [],
      contentStateName: savedFilterData.contentStateName || "All",
      defaultOrderingId: null,
      cloneGenerateXmlCheck: false,
      openXMLandCloneDropdown: false,
      XMLErrorBlock: "",
      showModelForXmlError: false,
      queryData: {
        limit: constantText.search_limit,
        searchString: savedFilterData.searchString || "",
        page: 1,
        lastEvaluatedKey: "",
        contentState: savedFilterData.contentState == "All" ? "" : savedFilterData.contentState,
      },
      setOrderFilters: JSON.parse(JSON.stringify(setOrderFilters)),
      sort: {
        sortingFilters: JSON.parse(JSON.stringify(savedFilterData.sortingFilters)),
        showReleaseDate: episodeConstants.episodeReleaseDateVal,
        showUnpublished: episodeConstants.episodeUnpublishedVal,
        showCreated: episodeConstants.episodeCreatedVal,
        showSubmitedToWork: episodeConstants.episodeSubmitedToWorkVal,
      },
      filters: {
        formValidity: savedFilterData.formValidity || false,
        filterByStatus: JSON.parse(JSON.stringify(savedFilterData.statusTypes)),
        filterByDate: JSON.parse(JSON.stringify(savedFilterData.filterByDate)),
        selectFilters: JSON.parse(JSON.stringify(savedFilterData.selectFilters)) || [],
        querys: "",
        byDate: "",
        startDate: "",
        endDate: "",
      },
      model: {
        detail: "",
        open: false,
        desc: "",
        btn1: constantText.yes_text,
        btn2: constantText.no_text,
      },
      OrderSetList: [],
      options: JSON.parse(JSON.stringify(headerTabs)),
      canGenerateXml: false,
      tvshowData: null,
      appliedFilters: savedFilterData.appliedFilters || []
    };
  }
  componentDidMount() {
    this.fetchTvShowData();
    this.getAllStatus();
    this.getAllShows();
    this.getAllLanguage();
  }

  fetchTvShowData = async () => {
    let { id } = this.props?.match?.params;
    let response = await apiCalls(`${Config.tvShowProperties}/${id}`, "GET", {});
    if (response) {
      const { subtype, channel, audioLanguages, xmlTitle } = response || {};
      this.setState({
        tvshowData : {subtype, channel, audioLanguages, xmlTitle },
        canGenerateXml: (subtype && subtype?.title?.toLowerCase() === constantText.xml_tvshow_subtype && channel && audioLanguages?.length && xmlTitle)? true : false
      })
    }
  };

  getAllStatus = async () => {
    const { match } = this.props;
    let response = await apiCalls(
      `${Config.masterUrl}/ContentState`,
      "GET",
      {},
      match?.url,
      false
    );
    if (response) {
      this.setState({ allStatus: response });
    }
  };

  fetchSetList = async () => {
    const { match } = this.props;
    const { seasonId } = match.params || {};
    if (seasonId) {
      const response = await apiCalls(
        `${Config?.episode?.episodeOrder}/${seasonId}/Manual`,
        "GET",
        {},
        null,
        true
      );
      if (response && response?.length) {
        this.setState({ OrderSetList: response });
      } else {
        this.setState({ OrderSetList: [] });
      }
    }
  };

  setSelectAllNextRecords = () => {
    const { isSelectAll } = this.state;
    if(isSelectAll){
      this.handleSelectAllToggle({ target : { checked : isSelectAll}});
    }
  }
  fetchDefaultList = async (params) => {
    const { match } = this.props;
    const { seasonId } = match.params || {};
    const { isRequestIntiate, queryData, indexSortType, episodeList } = this.state;

    const query = createQuery(params);
    let episodeDefaultUrl =  `${Config?.episode?.episodeOrder}/${seasonId}/Default${query ? query : ""}`;
    if (seasonId && (isRequestIntiate || isRequestIntiate === null)) {
      this.setState({ isRequestIntiate: false, isFilterUpdate: false });
      const response = await apiCalls(
        episodeDefaultUrl,
        "GET",
        {},
        null,
        false
      );
      if (response && response[0]?.episodeList?.rows?.length) {
        const copyQueryData = { ...queryData };
        //If has EpisodeData increase page
        copyQueryData.page = copyQueryData.page + 1;
        const episodes = response[0]?.episodeList?.rows || [];
        //Make Id's Array
        let episodesId = episodes?.map((item) => item?.episodeId);
        let postData = {};
            postData.episodeIds = episodesId;
        //Call XMLStatus API
        let promise = new Promise((resolve, reject) => {
          let res = apiCalls(
            Config?.episodeXmlStatus,
            "POST",
            postData,
            match?.url,
            false
          );
          if (res){
            resolve(res);
          } else {
            reject([]);
          }
        });
        promise.then((res) => {
            //Setting prefix & xmlStatus start
            episodes?.forEach((row) => {
              //Setting prefix
              const find = res?.findIndex((e) => e?.episodeId === row?.episodeId);
              row.xmlGenerateStatus = res[find]?.xmlStatus;
              row.xmlPrefix = res[find]?.xmlPrefix ? res[find]?.xmlPrefix : "";
              row.xmlPrefixText = "";
            });
            //Setting prefix & xmlStatus end

            const limit = constantText.search_limit;
            const Count = response[0]?.episodeList?.count ? response[0]?.episodeList?.count : 0;
            const Page = Count ? Math.ceil(Count / limit) : 1;
            this.setState({
              queryData: copyQueryData,
              showsCount: Count || 0,
              isRequestIntiate: true,
              maxPage: Page || 0,
              episodeList: [...episodeList, ...episodes],
              indexSortType: response[0]?.indexSortType,
              defaultOrderingId: response[0]?.episodeOrderingId,
            }, () => {
              this.setSelectAllNextRecords();
            });

        });

      } else {
        this.setState({
          showsCount: 0,
          isRequestIntiate: true,
          indexSortType: response[0]?.indexSortType ? response[0]?.indexSortType : indexSortType,
          maxPage: null,
          episodeList: [],
        });
      }
    }
  };

  setQueryData = async () => {
    const { filters, sort, queryData } = this.state;
    this.setState({
      showsFilterQuery: await {
        filters: filters.selectFilters,
        filterByDate: filters.filterByDate,
        sort: sort.sortingFilters,
        paramQuery: queryData,
      },
    });
  };
  saveFilter = () => {
    const { queryData, sort, filters, contentStateName, currentSortkey, currentSortValue, indexSortType, blankDate, filterDatakey, sortDatakey, appliedFilters  } = this.state
    filterService.saveFilterData({
      page: filterService.pages.episodeListing,
      contentState: queryData.contentState,
      contentStateName: contentStateName,
      searchString: queryData.searchString,
      sortingFilters: sort.sortingFilters,
      statusTypes: filters.filterByStatus,
      filterByDate: filters.filterByDate,
      selectFilters: filters.selectFilters,
      currentSortkey,
      currentSortValue,
      indexSortType,
      blankDate,
      filterDatakey,
      sortDatakey,
      appliedFilters,
      formValidity: filters.formValidity
    });
  }
  getAllShows = async () => {
    this.saveFilter()
    await this.setQueryData();
    const { showsFilterQuery } = this.state;
    let { paramQuery } = showsFilterQuery;
    let { searchString } = paramQuery;
    paramQuery = searchString
      ? { ...paramQuery, searchString: searchString.trim() }
      : paramQuery;
    showsFilterQuery.paramQuery = paramQuery;
    await this.fetchDefaultList(showsFilterQuery);
  };

  nextCall = () => {
    const { maxPage, isRequestIntiate, queryData } = this.state;
    const { page } = queryData;
    if (isRequestIntiate && maxPage && (page <= maxPage)) {
      this.getAllShows();
    }
  };

  createNewSet = async () => {
    const { match } = this.props;
    const { seasonId } = match.params || {};
    const { JSONSchema } = this.state;
    const copyJSON = [...JSONSchema];
    const { formValidity, validatedForm } = isValidatedForm(copyJSON);
    this.setState({ JSONSchema: validatedForm });
    if (seasonId && formValidity) {
      const setName = copyJSON[0].value;
      const countries = copyJSON[1].value;
      const postData = {};
      postData.seasonId = seasonId;
      postData.setName = setName;
      postData.countryId = countries?.map((e) => e.id);
      const response = await apiCalls(
        `${Config?.episode?.episodeOrder}`,
        "POST",
        postData,
        match?.url,
        true
      );
      this.setState({
        updateObj: { setName: null, country: null },
        showSetPopup: false,
      });
      if (response) {
        this.fetchSetList();
      }
    }
  };

  handleRadioButton = (event) => {
    let { name, value } = event.target;
    this.setState({ [name]: value });
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
      },
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
        data={constantText.episode_journey_obj}
        onChange={this.handleRadioButton}
        className="zee-radio-field status-field align-items-center"
      />
    );
  };
  getAskedPlaceholder = () => {
    const { selectCreateType } = this.state;
    return (
      <RadioButton
        name={"selectCreateType"}
        value={selectCreateType}
        labelText=""
        labelPlacement="end"
        data={constantText.episode_create_type}
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
  setSelectDataArrForSet = (res, index) => {
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
        setSelectDataArr={this.setSelectDataArrForSet}
        onChange={(e, index) => this.InputChanger(e, index)}
      />
    );
  };

  showHideSetPopup = () => {
    let { showSetPopup } = this.state;
    this.setState((prevState) => ({
      setMode: "create",
      updateObj: { setName: null, country: null },
      showSetPopup: !showSetPopup,
      JSONSchema: DEFAULT_JSON(OrderSetJson),
    }));
  };
  showHideXMLError = (close = false) => {
    let { showModelForXmlError, XMLErrorBlock } = this.state;
    this.setState((prevState) => ({
      XMLErrorBlock: close ? "" : XMLErrorBlock,
      showModelForXmlError: !showModelForXmlError,
    }));
  };
  showHideAskedPopup = () => {
    let { showAskedPopup } = this.state;
    this.setState((prevState) => ({
      showAskedStep: 0,
      selectJourney: null,
      selectCreateType: null,
      showAskedPopup: !showAskedPopup,
      selectJourney: null,
    }));
  };
  showStatusField = (selectFilters, flag) => {
    selectFilters.map((item) => {
      if (item.name === "translationStatus") {
        if (flag) {
          item.display = flag;
          item.value = null;
          item.data = constantText.translationStatus;
        } else {
          item.display = flag;
          item.value = null;
        }
      }
    });
  };
  handleRoute = (route) => {
    history.push(route);
  };
  tabSwitched = (event, selectedTab) => {
    const { OrderSetList } = this.state;
    if (selectedTab === this.state.selectedTab) {
      return;
    } else if (selectedTab === 1 && !OrderSetList?.length) {
      this.fetchSetList();
    }
    this.setState({
      selectedTab,
    });
  };
  goNextStep = () => {
    let { selectCreateType } = this.state;
    const { match } = this.props;
    if (selectCreateType === "placeholder") {
      let route = `${match?.url}/placeholder`;
      history.push(route);
    } else {
      this.setState({ showAskedStep: 1 });
    }
  };
  goToEpisode = () => {
    this.showHideAskedPopup();
    let { selectJourney } = this.state;
    let previousRoute = this.props.match.url;
    if (selectJourney) {
      let route =
        selectJourney == "3"
          ? `${previousRoute}/single/create`
          : selectJourney == "2"
          ? `${previousRoute}/quick/create`
          : `${previousRoute}/create`;
      history.push(route);
    }
  };
  searchDefaultChange = (event) => {
    let { name, value } = event.target;
    let { queryData } = this.state;
    this.setState({
      queryData: {
        ...queryData,
        page: 1,
        [name]: value,
      },
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
  showHideFilterDrawer = () => {
    let { showFilterDrawer } = this.state;
    this.setState({ showFilterDrawer: !showFilterDrawer });
  };
  showHideSortDrawer = () => {
    let { openSortDrawer } = this.state;
    this.setState({ openSortDrawer: !openSortDrawer });
  };
  showHideSetIndexDrawer = () => {
    let { openSetIndexDrawer } = this.state;
    this.setState({ openSetIndexDrawer: !openSetIndexDrawer });
  };
  handleSortFilter = (item, index, event) => {
    let { value } = event.target;
    let { sort } = this.state;
    let { sortingFilters } = sort;
    sortingFilters.forEach((sortItem) => {
        sortItem.value = "";
    });
    sortingFilters[index].value = value;
    this.setState(
      {
        sort: {
          sortingFilters: sortingFilters,
        },
      },
      () => {
        this.checkvalidation();
      }
    );
  };
  handleSetIndexFilter = async (index, event) => {
    const { value } = event.target;
    const { match } = this.props;
    const { seasonId } = match?.params;
    const { setOrderFilters, defaultOrderingId, queryData } = this.state;

    setOrderFilters[index].value = value;
    const patchData = {};
    patchData.orderType = defaultOrderingId;
    patchData.indexSortType = value;

    let response = await apiCalls(
      `${Config?.episode?.episodeOrder}/${seasonId}`,
      "PATCH",
      patchData,
      match?.url,
      true
    );
    if (response === null) {
      this.setState(
        {
          queryData: {
            ...queryData,
            page: 1,
          },
          episodeList: [],
          maxPage: null,
          indexSortType: value,
          openSetIndexDrawer: false,
          setOrderFilters: setOrderFilters,
        },
        () => this.getAllShows()
      );
    }
  };
  checkvalidation = () => {
    const { sortingFilters } = this.state.sort;
    const checkFilter = sortingFilters.findIndex((item) => item?.display && item?.value);
    this.setState({checkSortValid : checkFilter !== -1 ? false : true });
  };

  getSortUi = () => {
    const { sort, contentStateName, checkSortValid } = this.state;
    const { sortingFilters } = sort;
    const allSort = sortingFilters.map((sortItem, i) => {
      if (
        contentStateName.toLowerCase() === sortItem.for.toLowerCase() ||
        sortItem.for === ""
      ) {
        sortItem.display = true;
      } else {
        sortItem.display = false;
      }
      let sortFilter = sortItem.display ? (
        <RadioButton
          key={i}
          labelText={sortItem.label}
          className="zee-radio-field status-field align-items-center"
          name="showReleaseDate"
          areaLabel="showReleaseDate"
          value={sortItem.value}
          onChange={(e) => this.handleSortFilter(sortItem, i, e)}
          labelPlacement="end"
          data={sortItem.data}
        />
      ) : (
        ""
      );
      return sortFilter;
    });
    return (
      <div className="sidebarBox">
        <div className="top-w flex align-items-center justify-content-between">
          <div className="title">{episodeConstants.sort_text}</div>
          <div className="side-close-btn" onClick={this.showHideSortDrawer}>
            <CloseSquareIcon />
          </div>
        </div>
        <Divider />
        <div className="middle-w">
          <div className="inner">
            <div className="status-s inlineGrid">{allSort}</div>
          </div>
          <div className="bottom-w filter-btn">
            <ButtonField
              color="secondary"
              className="apply-btn"
              buttonText={constantText.apply_sort_text}
              disabled={checkSortValid}
              data-test="episode-applySortFilter"
              onClick={() => {
                this.showHideSortDrawer();
                this.applySortFilter();
              }}
            />
            <ButtonField
              color="secondary"
              className="cancle-btn"
              disabled={checkSortValid}
              buttonText={constantText.clear_text}
              data-test="episode-clearSortFilter"
              onClick={this.clearSortFilter}
            />
          </div>
        </div>
      </div>
    );
  };

  getSetIndexUi = () => {
    const { setOrderFilters, indexSortType } = this.state;
    const allSort = setOrderFilters.map((sortItem, i) => {
      let orderFilter = sortItem.display ? (
        <RadioButton
          key={i}
          labelText={sortItem.label}
          className="zee-radio-field status-field align-items-center"
          name="showReleaseDate"
          areaLabel="showReleaseDate"
          value={indexSortType}
          onChange={(e) => this.handleSetIndexFilter(i, e)}
          labelPlacement="end"
          data={sortItem.data}
        />
      ) : (
        ""
      );
      return orderFilter;
    });
    return (
      <div className="sidebarBox">
        <div className="top-w flex align-items-center justify-content-between">
          <div className="title">{episodeConstants.set_order_text}</div>
          <div className="side-close-btn" onClick={this.showHideSetIndexDrawer}>
            <CloseSquareIcon />
          </div>
        </div>
        <Divider />
        <div className="middle-w">
          <div className="inner">
            <div className="status-s inlineGrid">{allSort}</div>
          </div>
        </div>
      </div>
    );
  };
  setSelectDataArr = (res, index) => {
    const { filters } = this.state;
    const copyFilters = { ...filters };
    const copySelect = [...copyFilters?.selectFilters];
    if (copySelect[index]?.name === "licenseGroupCountries") {
      const GroupName = [];
      res.forEach((group) => {
        group?.countries.forEach((item) => {
          const obj = { ...item };
          obj.group = group?.title;
          GroupName.push(obj);
        });
      });
      copySelect[index].data = GroupName;
    } else {
      copySelect[index].data = res;
    }
    this.setState({ filters: copyFilters });
  };
  selectCountryGroup = (event, group) => {
    const { filters } = this.state;
    const { filterByDate, selectFilters } = filters;
    const copyFilters = { ...filters };
    const copySelect = [...copyFilters?.selectFilters];
    const findIndex = copySelect.findIndex(
      (e) => e.name === "licenseGroupCountries"
    );
    const copyElement = copySelect[findIndex];
    const options = [...copyElement.data];
    copyElement.value = getSelectedGroup(
      event,
      group,
      options,
      copyElement.value
    );

    const { formValidity } = filterValidityCheck([...selectFilters]);
    const checkDate = filterByDate.find(
      (item) => item.date.startDate && item.date.endDate
    );
    this.setState({
      filters: {
        ...copyFilters,
        formValidity: checkDate ? checkDate : formValidity,
      },
    });
  };
  handleSearchableInput = async (value, index) => {
    let { filters } = this.state;
    let { selectFilters } = filters;
    let url =
      selectFilters[index].name == "tags"
        ? `${Config.masterTags}?title=${value}`
        : `${Config.castnamesUrl}?castName=${value}`;
    let response = (await apiCalls(url, "GET", {}, `/tvshow`, false)) || [];
    selectFilters[index]["data"] = response;
    this.setState((prevState) => ({
      filters: {
        ...filters,
        selectFilters,
      },
    }));
  };
  handleFilterStatusSelection = (event, selectedTab) => {
    let { filters, queryData, allStatus } = this.state;
    let shallowFilters = JSON.parse(JSON.stringify(filters));
    const findContentIndex = allStatus.findIndex(
      (e) =>
        e?.title.toLowerCase() ===
        shallowFilters.filterByStatus[selectedTab]?.label.toLowerCase()
    );
    shallowFilters.filterByStatus.forEach((item, index) => {
      item["active"] = index == selectedTab ? true : false;
    });
    let contentState = allStatus[findContentIndex]?.id;
    this.setState({
      filters: shallowFilters,
      queryData: {
        ...queryData,
        contentState,
      },
    });
  };
  getAppliedFilter = (JSON, filterByDate, filterByStatus) => {
    const checkDate = filterByDate.find(
      (item) => item.date.startDate && item.date.endDate
    );
    let Arr = [];
    if (checkDate) {
      let obj1 = {};
      let obj2 = {};
      obj1.label = checkDate?.date?.startPlaceholder;
      obj1.value = moment(checkDate?.date?.startDate).format(
        constantText.date_format_placeholder
      );
      obj2.label = checkDate?.date?.endPlaceholder;
      obj2.value = moment(checkDate?.date?.endDate).format(
        constantText.date_format_placeholder
      );
      Arr.push(obj1);
      Arr.push(obj2);
    }
    filterByStatus.forEach((item) => {
      if (item?.active) {
        let obj = {};
        obj.label = "Status";
        obj.value = item?.label;
        Arr.push(obj);
      }
    });
    JSON.forEach((item) => {
      if (
        (item?.type === "dropdownAsync" ||
          item?.type === "SearchableWithCreate") &&
        item?.value
      ) {
        let obj = {};
        if (item?.multiple) {
          item?.value.forEach((selected) => {
            let obj = {};
            obj.label = item?.label;
            obj.value = selected[item?.keyText];
            Arr.push(obj);
          });
        } else {
          obj.label = item?.label;
          obj.value = item?.value[item?.keyText];
          Arr.push(obj);
        }
      }
    });
    return Arr;
  };
  getFiltersUi = () => {
    let { filters, contentStateName } = this.state;
    let { filterByDate, filterByStatus, selectFilters, formValidity } = filters;
    let allStatusFilters = filterByStatus.map((status, index) => (
      <div className="bystatus-col" key={"status_" + index}>
        <div
          className={`bystatus-f-cta flex align-items-center justify-content-center${
            status.active ? " s-active" : ""
          }`}
          onClick={(e) => this.handleFilterStatusSelection(e, index)}
        >
          {status.displayName}
        </div>
      </div>
    ));
    let allDateFilters = null;
    if (filterByDate && filterByDate.length) {
      allDateFilters = filterByDate.map((filterDate, i) => {
        if (contentStateName.toLowerCase() === filterDate.for.toLowerCase()) {
          filterDate.display = true;
        } else {
          filterDate.display = false;
        }
        let sortFilter = filterDate.display ? (
          <div key={i} className="dateFilterBox">
            <h5 className="sidebar-s-title">{filterDate.label}</h5>
            <div className="row">
              <div className="col-sm-6">
                <DatePicker
                  type="date"
                  placeholder={filterDate.date.startPlaceholder}
                  value={filterDate.date.startDate}
                  data-test="episode-handleDateChange"
                  minDateValue={filterDate.date.endDate && moment(filterDate.date.endDate).subtract(constantText.filterDateRangeMonthCount,'months')}
                  onChange={(e) =>
                    this.handleDateChange("startDate", filterDate, i, e)
                  }
                  className="zee-input-field filter-drower-custom"
                />
              </div>
              <div className="col-sm-6">
                <DatePicker
                  type="date"
                  placeholder={filterDate.date.endPlaceholder}
                  value={filterDate.date.endDate}
                  maxDateValue={filterDate.date.startDate && moment(filterDate.date.startDate).add(constantText.filterDateRangeMonthCount,'months')}
                  onChange={(e) =>
                    this.handleDateChange("endDate", filterDate, i, e)
                  }
                  className="zee-input-field filter-drower-custom"
                />
              </div>
            </div>
            <div className="date-info-msg">{constantText?.max_3_months_date}</div>
          </div>
        ) : (
          ""
        );
        return sortFilter;
      });
    }

    return (
      <div className="sidebarBox">
        <div className="top-w flex align-items-center justify-content-between">
          <div className="title">{constantText.filters_header_text}</div>
          <div className="side-close-btn" onClick={this.showHideFilterDrawer}>
            <CloseSquareIcon />
          </div>
        </div>
        <Divider />
        <div className="middle-w">
          <div className="inner">
            <div className="f-filter">
              {allStatusFilters && contentStateName === "All" && (
                <span>
                  <h5 className="sidebar-s-title">Select Status</h5>
                  <div className="bystatus-filter flex">{allStatusFilters}</div>
                </span>
              )}
              <div className="bydate-filter">{allDateFilters}</div>
              <Divider className="date-divider" />

              <FormRender
                form={selectFilters}
                setSelectDataArr={this.setSelectDataArr}
                handleAutoCreateInput={this.handleSearchableInput}
                selectGroup={this.selectCountryGroup}
                onChange={this.filterChange}
              />
            </div>
          </div>
        </div>
        <div className="bottom-w filter-btn">
          <ButtonField
            color="secondary"
            className="apply-btn"
            disabled={!formValidity}
            buttonText={constantText.apply_filter_text}
            data-test="episode-applyFilter"
            onClick={() => {
              this.showHideFilterDrawer();
              this.filterData();
            }}
          />
          <ButtonField
            color="secondary"
            className="cancle-btn"
            buttonText={constantText.clear_text}
            data-test="episode-clearFilter"
            onClick={this.clearFilter}
          />
        </div>
      </div>
    );
  };
  handleDateChange = (type, dateItem, index, event) => {
    let { value } = event.target;
    const { filters } = this.state;
    const { filterByDate, selectFilters } = filters;
    filterByDate.map((fDItem, i) => {
      if (index !== i) {
        fDItem.date.startDate = "";
        fDItem.date.endDate = "";
      }
    });
    let startDate = filterByDate[index].date.startDate;
    let endDate = filterByDate[index].date.endDate;
    //Date Validation
    if (type === "startDate") {
      if (endDate) {
        if (moment(value).isSameOrBefore(endDate)) {
          filterByDate[index].date.startDate = value;
        } else if (value === "") {
          filterByDate[index].date.startDate = value;
        }
      } else {
        filterByDate[index].date.startDate = value;
      }
      startDate = value;
    } else {
      if (startDate) {
        if (moment(value).isSameOrAfter(startDate)) {
          filterByDate[index].date.endDate = value;
        } else if (value === "") {
          filterByDate[index].date.endDate = value;
        }
      } else {
        filterByDate[index].date.endDate = value;
      }
      endDate = value;
    }
    //Date Validation end
    const checkDate = filterByDate.find(
      (item) => item.date.startDate && item.date.endDate
    );
    const { formValidity } = filterValidityCheck([...selectFilters]);
    this.setState({
      blankDate: startDate === "" && endDate === "",
      filters: {
        ...filters,
        formValidity: formValidity
          ? startDate === "" && endDate === ""
            ? formValidity
            : checkDate && formValidity
          : checkDate,
        filterByDate: filterByDate,
      },
    });
  };
  filterChange = (event, elemIndex) => {
    let { filters, blankDate } = this.state;
    let { selectFilters, filterByDate } = filters;
    const copyJSON = [...this.state.filters.selectFilters];
    const updatedElement = copyJSON[elemIndex];
    updatedElement.value = event.target.value;

    if (
      updatedElement.name === "translationLanguage" &&
      updatedElement.value.length
    ) {
      this.showStatusField(selectFilters, true);
    }
    if (
      updatedElement.name === "translationLanguage" &&
      updatedElement.value.length === 0
    ) {
      this.showStatusField(selectFilters, false);
    }

    const { isValid, errorText } = checkValidity(
      updatedElement.value,
      updatedElement.validation
    );
    updatedElement.valid = isValid;
    updatedElement.errorText = errorText;
    updatedElement.touched = 1;

    const checkDate = filterByDate.find(
      (item) => item.date.startDate && item.date.endDate
    );
    const { formValidity } = filterValidityCheck(copyJSON);

    this.setState({
      filters: {
        ...filters,
        formValidity: formValidity
          ? blankDate
            ? formValidity
            : checkDate && formValidity
          : checkDate,
        selectFilters: copyJSON,
      },
    });
  };
  applySortFilter = () => {
    let { queryData, sort } = this.state;
    let { sortingFilters } = sort;
    let index  = sortingFilters.findIndex((sortItem) => sortItem?.value);
    this.setState(
      {
        currentSortkey: sortingFilters[index]?.sortValue,
        currentSortValue: sortingFilters[index]?.value,
        episodeList: [],
        sortDatakey: true,
        searchMode: false,
        queryData: {
          ...queryData,
          page: 1,
        },
      },
      () => {
        this.getAllShows();
      }
    );
  };
  clearSortFilter = () => {
    let { sort, queryData } = this.state;
    let { sortingFilters } = sort;
      sortingFilters.forEach((sortItem) => {
        sortItem.value = "";
    });
    this.setState(
      {
        episodeList: [],
        sortDatakey: false,
        checkSortValid: true,
        currentSortValue: "desc",
        currentSortkey: "lastModifiedOn",
        sort: {
          ...sort,
          sortingFilters: sortingFilters,
        },
        queryData: {
          ...queryData,
          page: 1,
        },
      },
      () => {
        this.showHideSortDrawer();
        this.getAllShows();
      }
    );
  };
  clearFilter = () => {
    this.clearFilterData()
      .then(() => {
        this.showHideFilterDrawer();
        this.getAllShows();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  clearFilterData = () => {
    const { filters, queryData, contentStateName } = this.state;
    const { filterByDate, filterByStatus } = filters;
    //Clear Status
    filterByStatus.forEach((e) => {
      e.active = e.label === "All" ? true : false;
    });
    filterByDate.map((item) => {
      if (item.for === contentStateName) {
        item.date.endDate = "";
        item.date.startDate = "";
      }
    });
    const selectFilters = [...this.state.filters.selectFilters];
    selectFilters.map((filter) => {
      filter.value =
        filter?.type === "text" ? "" : filter?.multiple ? [] : null;
    });
    const checkDate = filterByDate.find(
      (item) => item.date.startDate && item.date.endDate
    );
    return new Promise((resolve, reject) => {
      this.setState(
        {
          filterDatakey: false,
          blankDate: true,
          appliedFilters: [],
          episodeList: [],
          filters: {
            ...filters,
            formValidity: checkDate
              ? true
              : contentStateName === "All"
              ? true
              : false,
            selectFilters: selectFilters,
            filterByStatus: filterByStatus,
          },
          queryData: {
            ...queryData,
            page: 1,
            contentState:
              contentStateName === "All" ? "" : queryData?.contentState,
          },
        },
        () => {
          resolve(true);
        }
      );
    });
  };
  filterData = async () => {
    let { queryData, filters } = this.state;
    const copyJSON = [...filters.selectFilters];
    this.setState(
      {
        appliedFilters: await this.getAppliedFilter(
          copyJSON,
          filters.filterByDate,
          filters.filterByStatus
        ),
        filterDatakey: true,
        searchMode: false,
        episodeList: [],
        showsCount: 0,
        queryData: {
          ...queryData,
          page: 1,
        },
      },
      () => {
        this.getAllShows();
      }
    );
  };
  handleOpenDeleteSet = (set) => {
    const { showDelPopup } = this.state;
    this.setState({
      episodeOrderingId: set?.episodeOrderingId,
      showDelPopup: !showDelPopup,
    });
  };
  deleteSet = async () => {
    const { episodeOrderingId } = this.state;
    let url = `${Config?.episode?.episodeOrder}/${episodeOrderingId}`;
    await apiCalls(
      url,
      "DELETE",
      { episodeOrderingId: episodeOrderingId },
      null,
      true,
      false
    );
    this.setState(
      {
        showDelPopup: false,
      },
      () => {
        this.fetchSetList();
      }
    );
  };
  updateSet = async () => {
    const { match } = this.props;
    const { episodeOrderingId, JSONSchema, updateObj } = this.state;
    const copyJSON = [...JSONSchema];
    const { validatedForm } = isValidatedForm(copyJSON);
    this.setState({ JSONSchema: validatedForm });
    if (updateObj?.setName || updateObj?.country?.length) {
      const putData = {};
      putData.setName = updateObj?.setName ? updateObj?.setName : "";
      putData.countryId = updateObj?.country?.length
        ? updateObj?.country?.map((e) => e.id)
        : [];

      const response = await apiCalls(
        `${Config?.episode?.episodeOrder}/${episodeOrderingId}`,
        "PUT",
        putData,
        match?.url,
        true
      );
      this.setState({
        updateObj: { setName: null, country: null },
        showSetPopup: false,
      });
      if (response) {
        this.fetchSetList();
      }
    }
    else{
      this.setState({
        updateObj: { setName: null, country: null },
        showSetPopup: false
       });
    }
  };
  showHideMorePopup = (countryArr) => {
    const { showModelForMore } = this.state;
    let stateObj;
    if (countryArr) {
      const newArr = countryArr.slice(2, countryArr.length);
      const MoreCountriesBlock = (
        <ul className="mov-con-list flex">
          {newArr.map((item, index) => (
            <li className="col-6 col-md-4" key={index}>
              {item}
            </li>
          ))}
        </ul>
      );
      stateObj = {
        showModelForMore: !showModelForMore,
        MoreCountriesBlock: MoreCountriesBlock,
      };
    } else {
      stateObj = {
        showModelForMore: !showModelForMore,
      };
    }
    this.setState(stateObj);
  };
  handleOpenEditSet = async (set) => {
    const { showSetPopup, JSONSchema } = this.state;
    const jsonObj = {
      setName: set?.setName,
      country: set?.countryId,
    };
    JSONSchema.forEach((item) => {
      const value = jsonObj[item?.name];
      item.value =
        item.type === "dropdown" ? (value === "" ? null : value) : value || "";
    });
    this.setState((prevState) => ({
      showSetPopup: !showSetPopup,
      episodeOrderingId: set?.episodeOrderingId,
      setMode: "edit",
      JSONSchema,
    }));
  };
  handleOpenCloseOrderBy = (index) => {
    const { OrderSetList } = this.state;
    const copyOrderSetList = [...OrderSetList];
    copyOrderSetList[index].openIndex = !!!copyOrderSetList[index]?.openIndex;
    this.setState({ OrderSetList: copyOrderSetList });
  };
  handleMenuClick = async (index, value) => {
    const { OrderSetList } = this.state;
    const { match } = this.props;
    const { seasonId } = match?.params;
    const copyOrderSetList = [...OrderSetList];
    copyOrderSetList[index].indexSortType = value;
    copyOrderSetList[index].openIndex = !copyOrderSetList[index].openIndex;
    const patchData = {};
    patchData.orderType = copyOrderSetList[index]?.episodeOrderingId;
    patchData.indexSortType = value;

    let response = await apiCalls(
      `${Config?.episode?.episodeOrder}/${seasonId}`,
      "PATCH",
      patchData,
      match?.url,
      true
    );
    if (response === null) {
      this.setState({ OrderSetList: copyOrderSetList });
    }
  };
  handleKeyPress = (e) => {
    window.clearTimeout(this.timer);
  };
  handleKeyUp = (e) => {
    const { queryData } = this.state;
    const { searchString } = queryData;
    window.clearTimeout(this.timer); // prevent errant multiple timeouts from being generated
    this.timer = window.setTimeout(() => {
      if (searchString.trim().length >= 3 || searchString.length === 0) {
        this.setState(
          {
            episodeList: [],
            searchMode: true,
            queryData: {
              ...queryData,
              page: 1,
            },
          },
          () => {
            this.getAllShows();
          }
        );
      }
    }, 1000);
  };
  handleConditionRoute = (view, id) => {
    let canArchive = permissionObj?.episode?.archive?.canUpdate();
    let canPublish = permissionObj?.episode?.publish?.canCreate();

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
        contentType: "episode",
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
    const { queryData } = this.state;
    let response = await apiCalls(
      `${Config.workflowAPI}/${id}`,
      "PUT",
      data,
      match?.url,
      false
    );
    if (response) {
      const copyQueryData = { ...queryData };
      //If has showData reset page
      copyQueryData.page = 1;
      this.setState(
        {
          queryData: copyQueryData,
          showsCount: 0,
          isRequestIntiate: true,
          maxPage: null,
          episodeList: [],
        },
        () => {
          this.getAllShows();
        }
      );
    }
  };
  handleSelectToggle = (event, index) => {
    const { episodeList } = this.state;
    const copyList = [...episodeList];
    const copyEpisode = copyList[index];
    copyEpisode.isChecked = event.target.checked;
    this.setState({ episodeList: copyList });
  };
  checkXMLMendatory = (list) => {
    const { canGenerateXml } = this.state;
    let valid = true;
    let errorMsg = [];
    return new Promise((resolve, reject) => {
      list?.forEach((data) => {
        if (!(canGenerateXml && !!data?.telecastDate)) {
          valid = false;
          errorMsg.push(`${data?.episodeTitle} (${data?.episodeExternalId})`);
        }
      });
      //Make UI Block
      let Block = (
        <ul>
          {errorMsg?.map((err, index) => (
            <li key={index}>{err}</li>
          ))}
        </ul>
      );

      this.setState(
        {
          XMLErrorBlock: Block,
        },
        () => {
          resolve(valid);
        }
      );
    });
  }
  handleGenerateXml = async () => {
    this.handleDropdown();
    const { episodeList, queryData } = this.state;
    const copyList = [...episodeList];
    const { match, generateXml } = this.props;
    const { params } = match || {};
    const { seasonId, id } = params;

    const filteredList = copyList.filter(
      (e) =>
        e?.isChecked && e?.isChecked !== false
    );
    //check mendatory validation
    let valid = await this.checkXMLMendatory(filteredList);

    if (id && seasonId && filteredList?.length && valid) {
      const postObj = {};
      postObj.tvShowId = id;
      postObj.seasonId = seasonId;
      //Grouping Id's by subtype
      const type = filteredList.reduce(function (r, a) {
        r[a?.episodeSubtype] = r[a?.episodeSubtype] || [];
        r[a?.episodeSubtype].push(a?.episodeId);
        return r;
      }, Object.create(null));
      postObj.type = type;
      const response = await generateXml(
        postObj,
        match?.url,
        match?.url
      );
      if(response){
        this.handleSelectAllToggle({ target: { checked: false } })
      }
    }
    if(valid === false){
      this.showHideXMLError();
    }
  };
  handleCreateType = (event) => {
    const { selectCreateType,selectJourney, showAskedStep } = this.state;
    if(selectCreateType && showAskedStep === 0){
      this.goNextStep();
    }
    else if(selectJourney && showAskedStep === 1){
      this.goToEpisode();
   }
  }
  getCheckedCount = () => {
    const { episodeList } = this.state;
    return episodeList?.filter(e => e.isChecked)?.length;
  }
  handleSelectAllToggle = (event) => {
    const { episodeList } = this.state;
    const copyList = [...episodeList];
    copyList.forEach((copyEpisode) => {
        copyEpisode.isChecked = event.target.checked;
    });
    this.setState({ isSelectAll: event.target.checked, episodeList: copyList });
  };
  handleTemplateClick = () => {
    const { match } = this.props;
    const templateUrl = match?.url.replace(/episode/g, "template");
    history.push(templateUrl);
  };

  handleDropdown = () => {
    let { openXMLandCloneDropdown } = this.state;
    this.setState({ openXMLandCloneDropdown: !openXMLandCloneDropdown });
  }
  
  showHideCloneDrawer = () => {
    let { openCloneDrawer, episodeList } = this.state;
    episodeList?.forEach(episode => {
      episode.xmlPrefixText = "";
      episode.errorText = "";
    });
    if(!openCloneDrawer) {
      this.handleCloneGenerateXmlCheck()
    }
    this.setState({ openCloneDrawer: !openCloneDrawer, episodeList, openXMLandCloneDropdown : false })
  }
  validateRequiredPrefix = () => {
    const { episodeList } = this.state;
    const cloneEpisodesList = [...episodeList.filter(e => e?.isChecked)];
    return cloneEpisodesList?.every(e => (e?.xmlPrefixText && !(!!e?.errorText)));
  }
  uncheckedEpisode = (id) => {
    const { episodeList, currentCloneIndex } = this.state;
    let currentIndex = currentCloneIndex;
    const cloneIndex = episodeList?.findIndex(e => e?.episodeId === id);
    episodeList[cloneIndex].isChecked = false;
    const prefixArr = [...episodeList.filter(e => (e?.isChecked && e?.episodeId !== id && e?.xmlPrefixText === episodeList[cloneIndex]?.xmlPrefixText))];
    
    if(prefixArr?.length === 1){
      currentIndex = episodeList?.findIndex(e => e?.episodeId === prefixArr[0]?.episodeId);
      this.checkClonePrefixEist(episodeList[currentIndex], episodeList[currentIndex]?.xmlPrefixText);
      episodeList[currentIndex].duplicatePrefix = false;
    }
    
    episodeList[cloneIndex].errorText = "";
    episodeList[cloneIndex].xmlPrefixText = episodeList[cloneIndex]?.xmlPrefix ? episodeList[cloneIndex]?.xmlPrefix : "";
    this.setState({ episodeList, currentCloneIndex: currentIndex });
  }
  checkDuplicatePrefix = (episodeList, episodeIndex, value, id, errorText, episodeSubtype) => {
    //CheckDuplicate
    //Filter out same index, same subtype list except the same episode ID.
    const cloneEpisodesListExceptOne = [...episodeList.filter(e => (e?.isChecked && e?.episodeId !== id && e?.xmlPrefixText && e?.indexNumber == episodeIndex && e?.episodeSubtype == episodeSubtype))];
    const prefixArr = cloneEpisodesListExceptOne?.map(e => String(e?.xmlPrefixText).toLowerCase());
    const cloneIndex = episodeList?.findIndex(e => e?.episodeId === id);
    if(prefixArr?.length){
      episodeList[cloneIndex].errorText = prefixArr?.includes(String(value).toLowerCase()) ? constantText?.xml_prefix_already : errorText;
      episodeList[cloneIndex].duplicatePrefix = prefixArr?.includes(String(value).toLowerCase());
    }
    return episodeList;
  }
  prefixChangeHandler = (e, id) => {
    const { value } = e?.target;
    const { episodeList } = this.state;
    const { errorText } = checkValidity(value, { isAlphaNumeric: true, maxLength: constantText.xml_title_length })
    const cloneIndex = episodeList?.findIndex(e => e?.episodeId === id);
    episodeList[cloneIndex].xmlPrefixText = value;
    episodeList[cloneIndex].errorText = errorText;
    this.setState({ episodeList : this.checkDuplicatePrefix(episodeList, episodeList[cloneIndex]?.indexNumber, value, id, errorText, episodeList[cloneIndex]?.episodeSubtype), currentCloneIndex : cloneIndex});
  }
  handleKeyPressCloned = (e) => {
    window.clearTimeout(this.timerCloned);
  };
  handleKeyUpCloned = (e) => {
    const { episodeList, currentCloneIndex } = this.state;
    window.clearTimeout(this.timerCloned); // prevent errant multiple timeouts from being generated
    this.timerCloned = window.setTimeout(() => {
      if(episodeList[currentCloneIndex]?.xmlPrefixText && !(!!episodeList[currentCloneIndex]?.duplicatePrefix)){
        this.checkClonePrefixEist(episodeList[currentCloneIndex], episodeList[currentCloneIndex]?.xmlPrefixText);
      }
    }, 500);
  };
  checkClonePrefixEist = async (data, xmlPrefixText) => {
    const { episodeId, seasonId, indexNumber } = data;
    const { checkExistPrefix } = this.props;
    const postData = {};
    postData.episodeId = episodeId;
    postData.seasonId = seasonId;
    postData.indexNumber = indexNumber;
    postData.xmlPrefix = xmlPrefixText;
    const { errorText } = checkValidity(xmlPrefixText, { isAlphaNumeric: true, maxLength: constantText.xml_title_length })
    const response = await checkExistPrefix(postData);
      const { episodeList, currentCloneIndex } = this.state;
      episodeList[currentCloneIndex].errorText = response ? response : errorText;
      this.setState({ episodeList });
  }
  cloneContent = async () => {
    const { match, cloneEpisode } = this.props;
    const { id, seasonId } = match?.params;
    const url = `${Config?.episodeClone}/${id}/${seasonId}`;
    const { queryData, episodeList, cloneGenerateXmlCheck } = this.state;
    const cloneEpisodesList = [...episodeList.filter(e => e?.isChecked)];
    const postData = {};
    postData.xmlGenerate = cloneGenerateXmlCheck ? "true" : "false";
    postData.episodes = cloneEpisodesList?.map(item => {
      return {type: item?.episodeSubtype, episodeId : item?.episodeId, xmlPrefix: item?.xmlPrefixText};
    });
    const response = await cloneEpisode(
      url,
      postData,
      match?.url,
      match?.url
    );
    //Close Drawer
    this.showHideCloneDrawer();
    
    if(response){
      this.setState(
        {
          queryData: {
            ...queryData,
            page: 1,
          },
          isSelectAll: false,
          episodeList: [],
          maxPage: null
        },
        () => this.getAllShows()
      );
    }
  }
  handleCloneGenerateXmlCheck = async () => {
    const filteredList = this.state.episodeList?.filter((e) => e?.isChecked && e?.isChecked !== false);
    let valid = await this.checkXMLMendatory(filteredList);
    if (!valid) { return; }
    const { cloneGenerateXmlCheck } = this.state;
    this.setState({
      cloneGenerateXmlCheck : !cloneGenerateXmlCheck
    });
  }
  getCloneContentUi = () => {
    const { episodeList, cloneGenerateXmlCheck } = this.state;
    const cloneEpisodesList = [...episodeList.filter(e => e?.isChecked)];
    return(
        <div className="sidebarBox">     
          <div className="top-w flex align-items-center justify-content-between">
            <div className="title">Clone</div>
            <div className="side-close-btn" onClick={this.showHideCloneDrawer}><CloseSquareIcon /></div>
          </div>
          <Divider />
          <div className="middle-w">
            <div className="inner">
            {cloneEpisodesList?.map((episode, index) => {
              return (
                  <div key={index} className="prefix-box">
                  <div className="content">
                    <div className="title">{episode?.episodeTitle}</div>
                    <div className="ext-id"><span className="m-r-20">External ID</span> {episode?.episodeExternalId}</div>
                    <div className="index">Index No - {episode?.indexNumber}</div>
                    <div onClick={() => this.uncheckedEpisode(episode?.episodeId)} className="default-delete-btn"><Delete /></div>
                  </div>
                  <div className="input">
                    <TextField
                      className={`zee-input-field`}
                      variant="outlined"
                      label={"Add Prefix"}
                      value={episode?.xmlPrefixText}
                      error={!!episode?.errorText}
                      helperText={episode?.errorText ? episode?.errorText : null}
                      onChange={(e) => this.prefixChangeHandler(e, episode?.episodeId)}
                      onKeyPress={this.handleKeyPressCloned}
                      onKeyUp={this.handleKeyUpCloned}
                      required
                      placeholder={"Add Prefix"}
                    />
                  </div>
                </div>
            )})}
            </div>
            <div className="p-l-20 p-t-20">
              <CheckBox
                label={"Generate XML"}
                handleCheckBox={this.handleCloneGenerateXmlCheck}
                className={`zee-checkbox-field auto-checkbox`}
                checked={cloneGenerateXmlCheck}
              />
            </div>
          </div>
          <div className="bottom-w filter-btn">
          <ButtonField color="secondary" className="apply-btn" buttonText="Clone Content"
            disabled={cloneEpisodesList?.length == 0 || !this.validateRequiredPrefix()}
            onClick={() => this.cloneContent()}
            data-test="list-profile-applyFilter"
          />
        </div>
        </div>

    )
  }

  render() {
    let {
      showAskedPopup,
      showDelPopup,
      showsCount,
      appliedFilters,
      canGenerateXml,
      tvshowData,
      XMLErrorBlock,
      showModelForXmlError,
      isRequestIntiate,
      showAskedStep,
      LanguageArr,
      sortDatakey,
      filterDatakey,
      episodeList,
      openSortDrawer,
      openSetIndexDrawer,
      showFilterDrawer,
      showSetPopup,
      MoreCountriesBlock,
      showModelForMore,
      openCloneDrawer,
      setMode,
      model,
      options,
      queryData,
      selectedTab,
      OrderSetList, openXMLandCloneDropdown
    } = this.state;
    let { searchString, page } = queryData;
    const option = options[selectedTab];
    const { location } = this.props;

    const { match, path } = this.props;

    let url = "/edit";
    let seasonUrl = "/season";
    if (path?.includes("/tvshow/:viewEdit")) {
      url = `/${match?.params?.viewEdit}`;
    }
    if (path?.includes("/tvshow/:quickSingle")) {
      url = `/${match?.params?.quickSingle}/edit`;
    }
    if (path?.includes("/season/view")) {
      seasonUrl = "/season/view";
    }
    if (path?.includes("/season/:quickSingle")) {
      seasonUrl = `/season/${match?.params?.quickSingle}/edit`;
    }
    return (
      <div className="d-wrap c-n">
        <BreadcrumbsComp
          className=""
          links={breadCrumbs.links(
            url,
            seasonUrl,
            match?.params?.id,
            match?.params?.seasonId
          )}
          typography={breadCrumbs.typography}
          journeyType={location?.state?.journeyType}
        />
        <div className="profile-head flex align-items-center justify-content-between">
          <div className="back-user-btn">
            <span
              onClick={() =>
                this.handleRoute(`/tvshow${url}/${match?.params?.id}${seasonUrl}/${match?.params?.seasonId}`)
              }
            >
              <AngleLeftArrow />
            </span>
            <strong data-test="episode-heading-text">
              {constantText.tv_show_episode_text.episodes}
            </strong>
          </div>
        </div>
        <div className="create-movie">
          <div className="whitebox min-h-350">
            <div className="ccm-head episode-head flex align-items-center justify-content-between m-b-0">
              <h4>{constantText.tv_show_episode_text.episodes}</h4>
              <span onClick={this.handleTemplateClick} className="eps-temp flex align-items-center">
                <TemplateIcon /> Template
              </span>
            </div>
            <div className=" p-all-15">
              <div className="cr-mov-tab ralated-tabs">
                <LeftTab
                  className="tabs"
                  orientation="horizontal"
                  variant="scrollable"
                  options={[...options]}
                  selectedTab={this.state.selectedTab}
                  showIcon={false}
                  handleChange={this.tabSwitched}
                />
              </div>
              {selectedTab === 0 && (
                <Fragment>
                  <div className="episode-search s-form flex justify-content-between p-t-20">
                    <input
                      type="text"
                      autoComplete="off"
                      name="searchString"
                      className={"auto-search"}
                      placeholder={
                        constantText.tv_show_episode_text.searchEpisode
                      }
                      value={searchString || ""}
                      onChange={this.searchDefaultChange}
                      onKeyPress={this.handleKeyPress}
                      onKeyUp={this.handleKeyUp}
                    />
                    <div className="flex action-cta">
                      <ButtonField
                        color="secondary"
                        className={
                          sortDatakey
                            ? "short-btn current-active-filter"
                            : "short-btn"
                        }
                        Icon={SortIcon}
                        buttonText={"Sort"}
                        onClick={this.showHideSortDrawer}
                      />
                      <ButtonField
                        color="secondary"
                        className={
                          filterDatakey
                            ? "filter-btn current-active-filter auto-filter-movie"
                            : "filter-btn auto-filter-movie"
                        }
                        Icon={FilterIcon}
                        buttonText={"Filters"}
                        onClick={this.showHideFilterDrawer}
                      />
                      <div className="filter-btn outline-drop-btn">
                        <DropDown
                          className={(this.getCheckedCount() > 100 || this.getCheckedCount() === 0) ? `dropdown-btn auto-bulk-filling-movie disabled` : `dropdown-btn auto-bulk-filling-movie`}
                          buttonText={"Generate XML"}
                          open={openXMLandCloneDropdown}
                          handleOpenClose={this.handleDropdown}
                          handleClose={this.handleDropdown}
                        >
                          <MenuItem
                            onClick={() => this.handleGenerateXml()}
                          >
                            Generate XML
                          </MenuItem>
                          <MenuItem
                            onClick={() => this.getCheckedCount() > 10 ? "" : this.showHideCloneDrawer()}
                            disabled={this.getCheckedCount() > 10}
                          >
                            Clone Content
                          </MenuItem>
                        </DropDown>
                      </div>
                      <button
                        className="upload-btn auto-upload-btn m-l-20"
                        onClick={this.showHideAskedPopup}
                      >
                        {constantText.tv_show_episode_text.create}
                      </button>
                    </div>
                  </div>

                  <div className="flex align-items-center justify-content-between m-t-10">
                    <h4 className="episode-title">
                      {"All Groups / Countries"}
                    </h4>
                    <div className="s-form ">
                      <div className="action-cta">
                        <ButtonField
                          color="secondary"
                          className={"short-btn"}
                          Icon={OrderSetIcon}
                          buttonText={"Set Order By Index No"}
                          onClick={this.showHideSetIndexDrawer}
                        />
                      </div>
                    </div>
                  </div>
                  {episodeList?.length ? (
                    <div className="episode-select-all m-b-20">
                      <CheckBox
                        label={"Select All"}
                        handleCheckBox={this.handleSelectAllToggle}
                        checked={episodeList?.every((e) => e?.isChecked === true)}
                        labelPlacement={"end"}
                      />
                      {this.getCheckedCount() > 100 && <span className={"episode-xml-message"}>{`*${constantText?.xml_error_100_selected_text}`}</span>}
                      {this.getCheckedCount() > 10 && <span className={"episode-xml-message"}>{`*${constantText?.clone_error_10_selected_text}`}</span>}
                    </div>
                  ) : null}
                  {appliedFilters?.length > 0 && (
                    <AppliedFilter
                      className="tabs lang-tab filter-scroll"
                      options={appliedFilters}
                      listCount={showsCount}
                    />
                  )}
                  {page !== 1 && (
                    <BottomScrollListener
                      onBottom={() => {
                        this.nextCall();
                      }}
                    debounce={10000} offset={5}
                    />
                  )}
                  {episodeList?.length ? (
                    episodeList?.map((item, index) => (
                      <EpisodeCard
                        key={index}
                        selectHandler={this.handleSelectToggle}
                        data={item}
                        tvshowData={tvshowData}
                        id={item?.episodeId}
                        canGenerateXml={canGenerateXml}
                        dataIndex={index}
                        handleConditionRoute={this.handleConditionRoute}
                        LanguageArr={LanguageArr}
                        matchParams={this.props?.match?.params}
                      />
                    ))
                  ) : (
                    <div className="no-data-box flex align-items-center justify-content-center">
                      {option.noItemsText}
                    </div>
                  )}

                  <InlineLoader
                    show={episodeList.length !== 0 && !isRequestIntiate}
                  />
                </Fragment>
              )}
              {selectedTab === 1 && (
                <Fragment>
                  <div className=" s-form flex align-items-center justify-content-between p-t-20">
                    <div className="set-order-title">
                      {constantText.tv_show_episode_text.createQuestion}
                    </div>
                    <div className="flex order-act-cta">
                      <button
                        className="upload-btn auto-upload-btn m-l-20"
                        onClick={this.showHideSetPopup}
                      >
                        {constantText.tv_show_episode_text.createSet}
                      </button>
                    </div>
                  </div>
                  {OrderSetList.length ? (
                    <OrderSet
                      OrderSets={OrderSetList}
                      handleOpenClose={this.handleOpenCloseOrderBy}
                      handleMenuClick={this.handleMenuClick}
                      toggleMorePopup={this.showHideMorePopup}
                      editHandler={this.handleOpenEditSet}
                      deleteHandler={this.handleOpenDeleteSet}
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
        <div>
          <Drawer
            anchor="right"
            open={openCloneDrawer}
            onClose={this.showHideCloneDrawer}
          >
            {this.getCloneContentUi()}
          </Drawer>

          <Drawer
            anchor="right"
            open={openSortDrawer}
            onClose={this.showHideSortDrawer}
          >
            {this.getSortUi()}
          </Drawer>
          <Drawer
            anchor="right"
            open={openSetIndexDrawer}
            onClose={this.showHideSetIndexDrawer}
          >
            {this.getSetIndexUi()}
          </Drawer>
          <Drawer
            open={showFilterDrawer}
            anchor="right"
            onClose={this.showHideFilterDrawer}
          >
            {this.getFiltersUi()}
          </Drawer>
        </div>
        <CommonModel
          state={showSetPopup}
          handleClose={this.showHideSetPopup}
          className="popup-wrap status-popup movie-edit-popup"
          title={
            setMode == "create"
              ? constantText.tv_show_season_text.createSet
              : constantText.tv_show_season_text.updateSet
          }
          showIcon={false}
          showDes={true}
          desClass={"p-all-15"}
          des={`${constantText.tv_show_season_text.pleaseSelectCreateText} ${
            setMode == "create"
              ? constantText.tv_show_season_text.createNewSet
              : constantText.tv_show_season_text.updateSet
          }`}
          Form={this.getSetCreateUI()}
          btn1Text={constantText.yes_text}
          btn1Action={setMode == "create" ? this.createNewSet : this.updateSet}
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
          state={showDelPopup}
          showIcon={false}
          showTitle={true}
          title={constantText?.delete_set_order_text}
          showDes={true}
          des={constantText?.tv_show_season_text.seasonSet}
          showBtn1={true}
          btn1Text={"Yes"}
          btn1Action={() => this.deleteSet()}
          showBtn2={true}
          btn2Text={"No"}
          btn2Action={() => this.setState({ showDelPopup: false })}
        />
        <CommonModel
          className="popup-wrap status-popup"
          state={showModelForMore}
          showTitle={true}
          title={constantText.license_country_text}
          showIcon={false}
          showDes={true}
          des={MoreCountriesBlock}
          desWithoutDialogText={true}
          showBtn1={false}
          showBtn2={true}
          btn2Text={constantText.close_text}
          btn2Action={() => this.showHideMorePopup()}
          handleClose={() => this.showHideMorePopup()}
        />
        <CommonModel
          className="popup-wrap status-popup"
          state={showModelForXmlError}
          showTitle={true}
          title={constantText.xml_field_missing}
          showIcon={false}
          showDes={true}
          des={XMLErrorBlock}
          desWithoutDialogText={true}
          showBtn1={false}
          showBtn2={true}
          btn2Text={constantText.close_text}
          btn2Action={() => this.showHideXMLError()}
          handleClose={() => this.showHideXMLError(true)}
        />
        <CommonModel
          state={showAskedPopup}
          handleClose={this.showHideAskedPopup}
          className="popup-wrap status-popup movie-edit-popup"
          title={episodeConstants?.createEpisode}
          showIcon={false}
          showDes={false}
          Form={
            showAskedStep === 0
              ? this.getAskedPlaceholder()
              : this.getAskedCreateUI()
          }
          btn1Text={constantText.yes_text}
          btn1Action={this.handleCreateType}
          btn2Text={constantText.no_text}
          btn2Action={this.showHideAskedPopup}
        />
      </div>
    );
  }
}
const actionCreators = {
  generateXml: tvEpisodeAction?.generate_xml_action,
  cloneEpisode: tvEpisodeAction?.clone_episode_action,
  checkExistPrefix: tvEpisodeAction?.prefix_exist_action
};
export default connect(null, actionCreators)(Episode);