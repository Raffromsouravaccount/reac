import React, { Component, Fragment } from "react";

//Common Components
import LeftTab from "../../Common/LeftTab/CommonLeftTab";
import { CommonModel } from '../../Common/Model/CommonModel';
import checkValidity from "../../Common/FormHelper/FieldValidator";
import BadgeBox from '../../Common/BadgeBox/BadgeBox';
import ButtonField from '../../Common/ButtonField/ButtonField';
import Lock from '../../Common/Locked/Locked';

//Steps Components
import TitleSummary from "./Steps/TitleSummary";
import Classification from "./Steps/Classification";
import PlayerAttributes from "./Steps/PlayerAttributes";
import GlobalFields from "./Steps/GlobalFields";
import ControlFields from "./Steps/ControlFields";

//Services
import { apiCalls } from "../../../_services/common.service";

//Helper files
import { addTag, validateReleaseAndTelecastDate } from "../../Common/CommonFunction/CommonFuntion";
import { constantText } from '../../../_helpers/constants.text';
import {
  manageDropDownValidation, manageValidationForLanguage, manageConditionForTime,
  manageValidationForSpacialCat, manageValidationForGenre, checkRequiredForGlobal
} from './contentValidation';
import Config from '../../../Config/config';
import { getLocalData, formatCountryGroup, getSelectedGroup, getTextFromHtml } from '../../../_helpers/util';
import { requiredValidate } from '../../../_helpers/validation';
import { permissionObj } from '../../../_helpers/permission';

//Images
import MarkDone from "images/tick.svg";
import LockIcon from 'images/lock-icon.svg';

//Css files
import "../../../../public/css/Common/ContentProperties.css";

class Properties extends Component {
  constructor(props) {
    super(props);
    let { journeyType, jsonData } = props;
    let { title_summary, specialCategory, specialCategoryArr, classification, awards, awardFieldArr,
      player, skipSong, skipFieldArr, globalFields, globalFieldsArr } = jsonData;
    let filterKey = (journeyType == "3") ? "singleLanding" : (journeyType == "2") ? "quickFiling" : "main";
    this.state = {
      userInfo: getLocalData("userData"), journeyType,
      tabData: constantText.season_content_properties_header_arr?.filter(data => data[filterKey]) || [],
      selectedTab: 0, tvShowId: null, seasonId: null, episodeId: null,
      title_summary: title_summary?.map(data => ({ ...data, inherited: "true" })),
      classification: classification?.map(data => ({ ...data, inherited: "true" })),
      player: player?.map(data => ({ ...data, inherited: "true" })),
      specialCategory: specialCategory?.map(nestedData => nestedData?.map(data => ({ ...data, inherited: true }))),
      specialCategoryArr: specialCategoryArr?.map(data => ({ ...data, inherited: "true" })),
      awards: awards?.map(nestedData => nestedData?.map(data => ({ ...data, inherited: true }))),
      skipSong: skipSong?.map(nestedData => nestedData?.map(data => ({ ...data, inherited: true }))),
      awardFieldArr: awardFieldArr?.map(data => ({ ...data, inherited: "true" })),
      skipFieldArr: skipFieldArr?.map(data => ({ ...data, inherited: "true" })),
      globalFields, globalFieldsArr, controlFieldsData: {},
      canMarkAsDone: false, showLockedPopup: false, viewOnly: false, error: false,
    };
  }

  componentDidMount() {
    let { tvShowId, seasonId, episodeId, viewOnly } = this.props;
    this.setState(prevState => ({
      tvShowId: tvShowId || null, seasonId: seasonId || null, episodeId: episodeId || null,
      viewOnly: !!viewOnly
    }), () => {
      if (tvShowId && seasonId && episodeId) {
        this.fetchContentData();
      }
    });
  }

  fetchContentData = async () => {
    let { episodeId } = this.state;
    let url = `${Config?.episode?.episodeProperties}/${episodeId}`;
    let response = await apiCalls(url, "GET", {}, this.props.match.path);
    if (response) {
      this.updateValues(response);
      this.props.setEpisodeStage(response)
    }
  };

  updateValues = dataObj => {
    let { userInfo, title_summary, specialCategory, specialCategoryArr, globalFields, classification, awards,
      awardFieldArr, player, skipSong, skipFieldArr } = this.state;

    title_summary = title_summary ? this.updateArrValue(title_summary, dataObj, null) : title_summary;
    const assignedCollectionIndex= title_summary.findIndex(data=> data.name== 'assignedCollectionExternalids');
    const updatedCollectionsData= title_summary[assignedCollectionIndex].value?.length> 0
      ? title_summary[assignedCollectionIndex].value.map(data=> ({...data, title: `${data.title} (${data.externalId})`}))
      : [];
    title_summary[assignedCollectionIndex]= {...title_summary[assignedCollectionIndex], value: updatedCollectionsData}
    classification = classification ? this.updateArrValue(classification, dataObj) : classification;
    player = player ? this.updateArrValue(player, dataObj) : player;

    specialCategory = (specialCategory && dataObj?.specialCategory && dataObj?.specialCategory?.value?.length) ?
      dataObj?.specialCategory?.value?.map(specialCategoryObj => (
        this.updateArrValue(specialCategoryArr, specialCategoryObj, dataObj?.specialCategory?.inherited))) :
      specialCategory;

    awards = (awards && dataObj?.awards && dataObj?.awards?.value?.length) ?
      dataObj?.awards?.value?.map(awardsObj => this.updateArrValue(awardFieldArr, awardsObj, dataObj?.awards?.inherited)) :
      awards;

    skipSong = (skipSong && dataObj?.skipSong && dataObj?.skipSong?.value?.length) ?
      dataObj?.skipSong?.value?.map(skipSongObj => this.updateArrValue(skipFieldArr, skipSongObj, dataObj?.skipSong?.inherited)) :
      skipSong;

    globalFields = checkRequiredForGlobal(globalFields);
    let seasonIndex = title_summary?.findIndex(data => (data.name == 'indexNumber'));
    (seasonIndex > -1) ? (title_summary[seasonIndex]['readOnly'] = (userInfo.RoleName == 'System Admin') ? false : true) :
      (title_summary[seasonIndex]['readOnly'] = false)
    this.setState({
      title_summary, specialCategory, globalFields, classification, awards, player, skipSong
    }, () => {
      this.checkIfMarkAsDone();
    });
  }

  updateArrValue = (stateArr, updatedObj, inherited) => {
    let updatedData = stateArr?.map(data => {
      if (data["name"] == 'audioLanguages') {
        return {
          ...data,
          multiple: updatedObj.isMultiAudio?.value,
          value: (updatedObj.isMultiAudio?.value) ? updatedObj[data?.name]?.value : updatedObj[data?.name]?.value ?
            updatedObj[data?.name]?.value[0] : data["value"],
          initialValue: (updatedObj.isMultiAudio?.value) ? updatedObj[data?.name]?.value : updatedObj[data?.name]?.value ?
            updatedObj[data?.name]?.value[0] : data["value"],
          inherited: inherited ? inherited : (updatedObj?.[data?.name]?.inherited || "true")
        };
      }
      else {
        return {
          ...data,
          value: inherited ? updatedObj?.[data?.name] : (updatedObj?.[data?.name]?.value || data["value"]),
          initialValue: inherited ? updatedObj?.[data?.name] : (updatedObj?.[data?.name]?.value || data["value"]),
          inherited: inherited ? inherited : (updatedObj?.[data?.name]?.inherited || "true")
        };
      }
    });
    return updatedData;
  };

  handleSearchableInput = async (value, rootIndex, index, sectionName) => {
    let shallowArr = [...this.state[sectionName]];
    let url = rootIndex ? (shallowArr[rootIndex][index]?.name == "tags") ? `${Config.masterTags}?title` :
      `${Config.castnamesUrl}?castName` : (shallowArr[index]?.name == "tags") ? `${Config.masterTags}?title` :
      `${Config.castnamesUrl}?castName`;
    if (rootIndex ? (shallowArr[rootIndex][index]?.name == "assignedCollectionExternalids") : (shallowArr[index]?.name == "assignedCollectionExternalids")) {
      url = `collection?searchStringOrExternalId`
    }
    let response = await apiCalls(`${url}=${value}`, "GET", {}, null, false) || [];
    if (url == `collection?searchStringOrExternalId`) {
      let newArr = []
      response?.rows?.forEach(item => {
        let obj = {};
        obj.externalId = item?.externalId;
        obj.id = item?.id
        obj.title = `${item?.title} (${item?.externalId})`;
        newArr.push(obj);
      })
      response = newArr
    }
    (rootIndex != null) ? (shallowArr[rootIndex][index]["data"] = response) : (shallowArr[index]["data"] = response);
    this.setState(prevState => ({ [sectionName]: shallowArr }));
  }

  handleStateChange = async (event, rootIndex, index, stepName) => {
    let { title_summary, player } = this.state;
    let { value } = event.target;
    let stepNameArr = this.state[stepName].slice();
    if (rootIndex != null) {
      let shallowArr = [...stepNameArr];
      let rootArr = [...shallowArr[rootIndex]];
      const {type, keyText, multiple, name, validation } = rootArr[index];
      let errorIndex= (type == "SearchableWithCreate")? multiple?
        value.findIndex(data=> !!checkValidity(data[keyText], validation, false).errorText): 0: -1;
      let { errorText } = (type == "SearchableWithCreate") ? { errorText: (errorIndex> -1)?
          multiple? checkValidity(value[errorIndex][keyText], validation, false).errorText: 
          checkValidity(value[keyText], validation, false).errorText:"" } : checkValidity(value, validation, false);
      rootArr[index] = { ...rootArr[index], value, errorText };
      if (name == "specialCategoryFrom" || name == "specialCategoryTo") {
        rootArr = manageValidationForSpacialCat(rootArr, name, value);
      }
      let fromDateName = (name == "skipSongStartTime" || name == "skipSongEndTime") ? "skipSongStartTime" : null;
      let toDateName = (name == "skipSongStartTime" || name == "skipSongEndTime") ? "skipSongEndTime" : null;

      rootArr = (fromDateName && toDateName) ? manageConditionForTime(fromDateName, toDateName, name, value, rootArr,
        rootArr, rootArr) : rootArr;
      shallowArr[rootIndex] = rootArr;
      this.setState(prevState => ({ [stepName]: shallowArr }), () => {
        this.props.markAsDone(this.props?.selectedTab, false);
      });
    }
    else {
      let shallowArr = [...stepNameArr];
      const {type, keyText, multiple, name, validation} = shallowArr[index];
      let errorIndex= (type == "SearchableWithCreate")? multiple?
        value.findIndex(data=> !!checkValidity(data[keyText], validation, false).errorText): 0: -1;
      let { errorText } = (type == "SearchableWithCreate") ? { errorText: (errorIndex> -1)?
          multiple? checkValidity(value[errorIndex][keyText], validation, false).errorText: 
          checkValidity(value[keyText], validation, false).errorText:"" } : checkValidity(value, validation, false);
      shallowArr[index] = {
        ...shallowArr[index], value: (name == "tags" && !errorText) ? await addTag(value, 'episode') :
          value, errorText
      };
      if( name == "dateZee5Published" || name == "telecastDate"){
        if(this.props.state !== "quick-filing" ){
          shallowArr = validateReleaseAndTelecastDate(shallowArr, name, value);
        }
      }
      shallowArr = (name === "primaryLanguage" || name === "dubbedLanguageTitle") ?
        manageValidationForLanguage(shallowArr) : shallowArr;

      shallowArr = (name === "primaryGenre" || name === "secondaryGenre") ?
        manageValidationForGenre(shallowArr) : shallowArr;

      shallowArr = manageDropDownValidation(shallowArr, shallowArr[index]["name"], value);

      let fromDateName = (name == "introStartTime" || name == "introEndTime") ? "introStartTime" :
        (name == "recapStartTime" || name == "recapEndTime") ? "recapStartTime" :
          (name == "duration" || name == "endCreditsStartTime") ? "endCreditsStartTime" : null;

      let toDateName = (name == "introStartTime" || name == "introEndTime") ? "introEndTime" :
        (name == "recapStartTime" || name == "recapEndTime") ? "recapEndTime" :
          (name == "duration" || name == "endCreditsStartTime") ? "duration" : null;
      shallowArr = (fromDateName && toDateName) ? manageConditionForTime(fromDateName, toDateName, name, value,
        (name == "duration" || name == "endCreditsStartTime") ? player : shallowArr,
        (name == "duration" || name == "endCreditsStartTime") ? title_summary : shallowArr, shallowArr) : shallowArr;

      this.setState(prevState => ({ [stepName]: shallowArr }));
    }
  };

  selectGroup = (event, group, rootIndex, index, sectionName) => {
    let shallowArr = [...this.state[sectionName]];
    let { value, data } = (rootIndex != null) ? shallowArr[rootIndex][index] : shallowArr[index];
    let selectedData = getSelectedGroup(event, group, data, value);

    (rootIndex != null) ? (shallowArr[rootIndex][index]["value"] = selectedData) : (shallowArr[index]["value"] = selectedData);
    this.setState(prevState => ({ [sectionName]: shallowArr }));
  };

  setSelectDataArr = (stepName, rootIndex, index, data) => {
    let stepNameArr = this.state[stepName].slice();
    if (rootIndex != null) {
      let shallowArr = [...stepNameArr];
      let rootArr = [...shallowArr[rootIndex]];
      data = (rootArr[index].name === "specialCategoryCountry") ? formatCountryGroup(data) : data;
      rootArr[index] = { ...rootArr[index], data: data || [] };
      shallowArr[rootIndex] = rootArr;
      this.setState((prevState) => ({ [stepName]: shallowArr }));
    } else {
      let shallowArr = [...stepNameArr];
      shallowArr[index] = { ...shallowArr[index], data: data || [] };
      shallowArr = (shallowArr[index].name === "primaryLanguage" || shallowArr[index].name === "dubbedLanguageTitle") ?
        manageValidationForLanguage(shallowArr) : shallowArr;
      shallowArr = (shallowArr[index].name === "primaryGenre" || shallowArr[index].name === "secondaryGenre") ?
        manageValidationForGenre(shallowArr) : shallowArr;
      this.setState((prevState) => ({ [stepName]: shallowArr }));
    }
  };

  handleEditable = (rootIndex, index, sectionName) => {
    let stepNameArr = [...this.state[sectionName]];
    let { editable, initialValue, value } = (rootIndex != null) ? stepNameArr[rootIndex][index] : stepNameArr[index];
    if (rootIndex != null) {
      let shallowArr = [...stepNameArr];
      let rootArr = [...shallowArr[rootIndex]];
      rootArr[index] = {
        ...rootArr[index], editable: !!!editable, value: !!editable ? initialValue : value,
        errorText: ''
      };
      shallowArr[rootIndex] = rootArr;
      this.setState(prevState => ({ [sectionName]: shallowArr }));
    }
    else {
      let shallowArr = [...stepNameArr];
      shallowArr[index] = {
        ...shallowArr[index], editable: !!!editable, value: !!editable ? initialValue : value,
        errorText: ''
      };
      this.setState(prevState => ({ [sectionName]: shallowArr }));
    }
  }

  addRemoveMultipleFields = (name, index) => {
    let shallowArr = this.state?.[name]?.slice() || [];
    let { specialCategoryArr, awardFieldArr, skipFieldArr, globalFieldsArr } = this.state;
    if (index > 0) {
      shallowArr.splice(index, 1);
    } else {
      let dataArr = (name == "specialCategory") ? specialCategoryArr : (name == "awards") ? awardFieldArr :
        (name == "skipSong") ? skipFieldArr : (name == "globalFields") ? globalFieldsArr : [];
      shallowArr.push(dataArr);
    }
    this.setState((prevState) => ({ [name]: shallowArr }), () => (index > 0 && this.handleSave(0, 0, name)));
  };

  formatValue = (value, isArray) => {
    if (isArray) {
      return value.map(item => {
        return item.id;
      })
    }
    return value.id;
  }

  formatNestedData = dataArr => {
    let formattedData = dataArr?.filter(nestedObj => {
      let hasValue = false;
      for (let key in nestedObj) {
        if (nestedObj[key]?.length >= 0) hasValue = true;
      }
      if (hasValue) return nestedObj;
    });
    return formattedData;
  };

  formatData = dataArr => {
    let formattedData = {};
    for (let obj of dataArr ? dataArr : []) {
      let { name, type, value, multiple } = obj || {};
      if ((type === 'dropdown' || type === 'dropdownAsync' || name == "tags") && (name != "showAirTimeDays") && value) {
        value = this.formatValue(value, multiple)
      }
      formattedData[name] = (type === "date" && value === "")? null: (name == 'index') ? Number(value) : value;
    }
    return formattedData;
  };

  checkError = dataArr => {
    let error = null;
    for (let obj of dataArr) {
      let { name, type, value, multiple, validation, errorText } = obj;
      let { required } = validation || {};
      if (errorText) error = name;
      if (!!required && requiredValidate(multiple ? !!value?.length : (type == "textEditor") ?
        getTextFromHtml(value) : value)) {
        error = name;
      }
    }
    return error;
  };

  checkAnyError = () => {
    let { title_summary, specialCategory, classification, awards, globalFields } = this.state;
    let shallowArr = (classification?.length > 0) ? [...title_summary, ...classification] : [...title_summary];
    let titleClassifcationError = this.checkError(shallowArr);

    let specialCategoryArrOfObj = [];
    specialCategory?.map(nestedArr => nestedArr?.map(data => (specialCategoryArrOfObj = [...specialCategoryArrOfObj, data])));
    let specialCategoryError = this.checkError(specialCategoryArrOfObj);

    let awardsArrOfObj = [];
    awards?.map(nestedArr => nestedArr?.map(data => (awardsArrOfObj = [...awardsArrOfObj, data])));
    let awardsError = this.checkError(awardsArrOfObj);

    let globalArrOfObj = [];
    globalFields?.map(nestedArr => nestedArr?.map(data => (globalArrOfObj = [...globalArrOfObj, data])));
    let globalFieldsError = this.checkError(globalArrOfObj);

    let error = !!titleClassifcationError || !!specialCategoryError || !!awardsError || !!globalFieldsError;
    return error
  };

  handleSave = async (rootIndex, index, sectionName) => {
    let { seasonId, episodeId, journeyType } = this.state;
    let shallowArr = [...this.state[sectionName]] || [];
    let field = (rootIndex != null) ? shallowArr[rootIndex][index] : shallowArr[index];
    let { name, value, multiple } = field;
    let subTypeIndex= (rootIndex != null) ? null : shallowArr?.findIndex(data => (data?.name == 'subtype'));
    let updatedData = (rootIndex != null) ? { [sectionName]: this.formatNestedData(shallowArr?.map(data => this.formatData(data))) } :
      (name == "audioLanguages" && !multiple) ? { [name]: value? [value?.id]: null } : (name== 'indexNumber')?
      {[name]: value, 'subtype': shallowArr?.[subTypeIndex]?.value?.id}: this.formatData([field]);
    const audioLangIndex = (rootIndex != null) ? null : shallowArr?.findIndex(data => (data?.name == 'audioLanguages'));
    const isMultiAudioIndex = (rootIndex != null) ? null : shallowArr?.findIndex(data => (data?.name == 'isMultiAudio'));
    const needInsert = (audioLangIndex > -1 && name == "isMultiAudio" && shallowArr[audioLangIndex]?.value?.length > 0) ?
      true : false;
    updatedData = needInsert ? { ...updatedData, audioLanguages: null } : updatedData;
    updatedData = (name == "audioLanguages") ? multiple? { ...updatedData, isMultiAudio: true }:
      { ...updatedData, isMultiAudio: false } : updatedData;
    updatedData = (name == "assignedCollectionExternalids") ? { ...updatedData, assignedCollectionExternalids: updatedData.assignedCollectionExternalids.map(item => item.externalId)} : updatedData;
    let { errorText } = field;
    if (!errorText) {
      updatedData.seasonId = seasonId;
      updatedData.journeyType = journeyType;
      const url = `${Config?.episode?.episodeProperties}/${episodeId}`;
      const response = await apiCalls(url, "PUT", { "episode": updatedData }, null, false, false,
        this.props?.autoSaveError);
      if (response) {
        if (rootIndex != null) {
          let rootArr = [...shallowArr[rootIndex]];
          rootArr = rootArr?.map(data => ({ ...data, inherited: "false" }))
          rootArr[index] = { ...rootArr[index], initialValue: value, editable: false };
          shallowArr[rootIndex] = rootArr;
          shallowArr = (sectionName == 'globalFields') ? checkRequiredForGlobal(shallowArr) : shallowArr;
          this.setState(prevState => ({ [sectionName]: shallowArr }));
        }
        else {
          shallowArr[index] = { ...shallowArr[index], initialValue: value, inherited: "false", editable: false };
          if (needInsert) {
            (audioLangIndex > -1) ? (shallowArr[audioLangIndex]["inherited"] = "false") :
              (shallowArr[audioLangIndex]["inherited"] = shallowArr[audioLangIndex]?.inherited);
          }
          if (name== 'audioLanguages') {
            shallowArr[isMultiAudioIndex] = { ...shallowArr[isMultiAudioIndex],
              initialValue: multiple? true: false, value: multiple? true: false, inherited: "false", editable: false };
          }
          if(name== 'subtype' || name== 'indexNumber' || name== 'dateZee5Published') {
            let indexNumberForIndex= shallowArr?.findIndex(data=> (data.name== 'indexNumber'));
            let indexNumberForTitle= shallowArr?.findIndex(data=> (data.name== 'title'));
            let indexNumberForSubtitleLanguages= shallowArr?.findIndex(data=> (data.name== 'subtitleLanguages'));
            (shallowArr[indexNumberForIndex]["value"] = response.indexNumber);
            (shallowArr[indexNumberForTitle]["value"] = response.title);
            (shallowArr[indexNumberForSubtitleLanguages]["value"] = []);
            (shallowArr[indexNumberForSubtitleLanguages]['inherited'] = "false");
          }
          this.setState(prevState => ({ [sectionName]: shallowArr }));
          // Re-render the component to get updated value for subtitleLanguages from api
          if(name == 'subtype'){
           this.fetchContentData();
          }
        }
        this.props.markAsDone(this.props?.selectedTab, false);
        this.checkIfMarkAsDone();
      }
    }
  }

  checkIfMarkAsDone = () => {
    let error = this.checkAnyError();
    this.setState({ canMarkAsDone: !error ? true : false });
  };

  markAsDone = async () => {
    this.props.markAsDone(this.props?.selectedTab, true);
  };

  showHideLockPopup = () => {
    let { showLockedPopup } = this.state;
    this.setState(prevState => ({ showLockedPopup: !showLockedPopup }));
  }

  unLockProperties = () => {
    this.showHideLockPopup();
    this.props.unLockedSession(this.props?.selectedTab);
  }

  getTitleSummaryUI = () => {
    let { selectedTab, title_summary, specialCategory, viewOnly } = this.state;
    let { isLocked } = this.props?.currentTabData;
    return (
      <TitleSummary
        title_summary={title_summary || []}
        specialCategory={specialCategory || []}
        handleSearchableInput={this.handleSearchableInput}
        addRemoveMultipleFields={this.addRemoveMultipleFields}
        setSelectDataArr={this.setSelectDataArr}
        handleEditable={this.handleEditable}
        handleSave={this.handleSave}
        handleChange={this.handleStateChange}
        selectGroup={this.selectGroup}
        selectedTab={selectedTab}
        handleTab={this.handleTab}
        viewOnly={viewOnly} disabled={isLocked}
      />
    );
  };

  getClassificationUI = () => {
    let { selectedTab, classification, awards, viewOnly, error } = this.state;
    let { isLocked } = this.props?.currentTabData;
    return (
      <Classification
        classification={classification || []}
        awards={awards || []}
        setSelectDataArr={this.setSelectDataArr}
        addRemoveMultipleFields={this.addRemoveMultipleFields}
        handleSearchableInput={this.handleSearchableInput}
        handleEditable={this.handleEditable}
        handleSave={this.handleSave}
        handleChange={this.handleStateChange}
        selectedTab={selectedTab}
        handleTab={this.handleTab}
        viewOnly={viewOnly} error={error} disabled={isLocked}
      />
    );
  }

  getPlayerAttributeUI = () => {
    let { selectedTab, player, skipSong, viewOnly, error } = this.state;
    let { isLocked } = this.props?.currentTabData;
    return (
      <PlayerAttributes
        player={player || []}
        skipSong={skipSong || []}
        setSelectDataArr={this.setSelectDataArr}
        addRemoveMultipleFields={this.addRemoveMultipleFields}
        handleEditable={this.handleEditable}
        handleSave={this.handleSave}
        handleChange={this.handleStateChange}
        selectedTab={selectedTab}
        handleTab={this.handleTab}
        viewOnly={viewOnly} error={error} disabled={isLocked}
      />
    );
  }

  getGlobalFieldsUI = () => {
    let { selectedTab, globalFields, viewOnly, error } = this.state;
    let { isLocked } = this.props?.currentTabData;
    return (
      <GlobalFields
        globalFields={globalFields || []}
        setSelectDataArr={this.setSelectDataArr}
        addRemoveMultipleFields={this.addRemoveMultipleFields}
        handleEditable={this.handleEditable}
        handleSave={this.handleSave}
        handleChange={this.handleStateChange}
        selectedTab={selectedTab}
        handleTab={this.handleTab}
        viewOnly={viewOnly} error={error} disabled={isLocked}
      />
    );
  }

  getControlFieldUI = () => {
    let { selectedTab } = this.state;
    let { language } = this.props;
    return (
      <ControlFields {...this.props}
        selectedTab={selectedTab}
        handleTab={this.handleTab}
        language={language}
      />
    );
  }

  getEpisodeUI = () => {
    let { selectedTab } = this.state;
    return (
      <Fragment>
        {(selectedTab == 0) && this.getTitleSummaryUI()}
        {(selectedTab == 1) && this.getClassificationUI()}
        {(selectedTab == 2) && this.getPlayerAttributeUI()}
        {/* {(selectedTab == 3) && this.getGlobalFieldsUI()} */}
        {(selectedTab == 3) && this.getControlFieldUI()}
      </Fragment>
    )
  }

  getQuickFilingSingleLandingEpisodeUI = () => {
    let { selectedTab } = this.state;
    return (
      <Fragment>
        {(selectedTab == 0) && this.getTitleSummaryUI()}
        {(selectedTab == 1) && this.getClassificationUI()}
        {/* {(selectedTab == 2) && this.getGlobalFieldsUI()} */}
        {(selectedTab == 2) && this.getControlFieldUI()}
      </Fragment>
    )
  }

  handleTab = (event, selectedTab) => {
    window.scrollTo(0,0);
    this.setState({ selectedTab });
  }

  render() {
    let { tabData, selectedTab, canMarkAsDone, showLockedPopup, viewOnly, journeyType } = this.state;
    let { currentTabData, handleRoute, stage } = this.props;
    let { isDone, isLocked, lockedBy } = currentTabData || {};
    let { canUpdate } = permissionObj?.episode?.contentPropertiesModule;
    return (
      <div className="create-movie">
        <Lock lock={viewOnly ? false : isLocked} lockedBy={lockedBy} clicked={this.showHideLockPopup}>
          <div className="whitebox remove-b-radius">
            <div className="ccm-head flex align-items-center justify-content-between m-b-0">
              <h4>{constantText.content_properties_text}</h4>
              <div className="status-head flex align-items-center">
                <BadgeBox className="create-movie-stage" status={stage} />
                {viewOnly &&
                  <div className="edit-btn">
                    <ButtonField className="zee-btn-field zee-full MuiButton-containedPrimary"
                      buttonText={constantText.tvShowsConstant.editEpisode}
                      disabled={!canUpdate()}
                      onClick={handleRoute}
                    />
                  </div>
                }
                {!viewOnly &&
                  <div data-test="markIsDoneButton"
                    className={`mark-done ${isDone ? "mark-active" : canMarkAsDone ? "mark-fill-active" : ""} auto-mark-done`}
                    onClick={() => {
                      if (canMarkAsDone && !isDone)
                        this.markAsDone();
                    }}>
                    <span><MarkDone /></span> {constantText.mark_as_done_text}
                  </div>
                }
              </div>
            </div>
            <div className="cr-mov-tab p-b-30">
              <LeftTab className="tabs" orientation="horizontal" variant="scrollable" options={tabData}
                selectedTab={selectedTab} showIcon={false} handleChange={this.handleTab} />
            </div>
          </div>

          <div className="movieForm-tab">{(journeyType == "1") ? this.getEpisodeUI() :
            this.getQuickFilingSingleLandingEpisodeUI()}</div>
        </Lock>
        <CommonModel className="popup-wrap status-popup" state={showLockedPopup}
          showTitle={true} title={constantText.unlock_title_text}
          showIcon={true} icon={<LockIcon />}
          showDes={true} des={`${constantText.section_lock_with} ${lockedBy}, ${constantText.confirm_still_change}`}
          showBtn1={true} btn1Text={constantText.yes_text} btn1Action={this.unLockProperties}
          showBtn2={true} btn2Text={constantText.no_text} btn2Action={this.showHideLockPopup}
          handleClose={this.showHideLockPopup}
        />
      </div>
    );
  }
}
export default Properties;
