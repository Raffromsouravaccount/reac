import React, { Component, Fragment } from "react";

//Common Components
import LeftTab from "../../Common/LeftTab/CommonLeftTab";
import LockedPopup from '../LockedPopup';
import checkValidity from "../../Common/FormHelper/FieldValidator";
import BadgeBox from "../../Common/BadgeBox/BadgeBox";

//Steps Components
import TitleSummary from "./Steps/TitleSummary";
import Classification from "./Steps/Classification";
import PlayerAttributes from "./Steps/PlayerAttributes";
import ControlFields from "./Steps/ControlFields";

//Services
import { apiCalls } from "../../../_services/common.service";

//Helper files
import { constantText } from '../../../_helpers/constants.text';
import {
  manageDropDownValidation, manageValidationForDuration, manageValidationForSkipSong,
  manageValidationForTime, manageValidationForSpacialCat, manageValidationForLanguage, manageValidationForGenre
} from '../../Common/ContentProperties/contentValidation';
import Config from '../../../Config/config';
import { addTag, validateReleaseAndTelecastDate } from "../../Common/CommonFunction/CommonFuntion";
import { getLocalData, formatCountryGroup,getSelectedGroup, getTextFromHtml } from '../../../_helpers/util';
import { requiredValidate } from '../../../_helpers/validation';

//Images
import MarkDone from "images/tick.svg";
import LockIcon from "images/lock-icon.svg";

//Css files
import "../../../../public/css/Common/ContentProperties.css";

class ContentProperties extends Component {
  constructor(props) {
    super(props);
    let { state, jsonData } = props;
    let { title_summary, global, groupWiseTitle, groupWiseArr, classification, awards, awardFieldArr, player,
      skip_song, skipFieldArr, specialCategory, specialCategoryArr } = jsonData;
    this.state = {
      tabData: state ? (state == 'quick-filing') ? 
        JSON.parse(JSON.stringify(constantText.quick_filing_content_properties_header_arr)) :
        JSON.parse(JSON.stringify(constantText.single_page_landing_content_properties_header_arr)) : 
        JSON.parse(JSON.stringify(constantText.movie_content_properties_header_arr)),
      stage: { title: null },
      selectedTab: 0, movieId: null, controlFieldsData: {},
      userInfo: getLocalData("userData"),
      title_summary, groupWiseTitle, groupWiseArr, global, classification, awards, awardFieldArr, player,
      skip_song, skipFieldArr, specialCategory, specialCategoryArr,
      showLockedPopup: false,
      videoDuration: null, introStartTime: null, isSkipAvailable: false,
      canMarkAsDone: false, error: false,
    };
  }

  componentDidMount() {
    let { movieId } = this.props;
    this.setState(prevState => ({ movieId: movieId || null }), () => {
      if (movieId) {
        this.fetchContentData();
      }
    });
  }

  getControlFieldData = async () => {
    let { movieId, language } = this.props;
    let controlFieldsData = { ...this.state.controlFieldsData }
    let url = `${Config.movieProperties}/controlFields/${movieId}`;
    let response = await apiCalls(url, 'GET', {});
    if (response) {
      controlFieldsData = { ...controlFieldsData, ...response }
      this.setState({ controlFieldsData });
    }
  }

  fetchContentData = async () => {
    let { movieId } = this.state;
    let { language } = this.props;
    let url = `${Config.movieProperties}/${movieId}`;
    let response = await apiCalls(url, "GET", {});
    if (response) {
      this.props.getExternalId(response?.externalId)
      this.updateValues(response || {});
    }
  };

  updateValues = dataObj => {
    let { skipAvailable, duration, introStartTime, contentState } = dataObj;
    let { title_summary, global, classification, awards, awardFieldArr, specialCategory, specialCategoryArr, player, skip_song, skipFieldArr,
      userInfo, stage } = this.state;
    title_summary = title_summary ? this.updateArrValue(title_summary, dataObj) : title_summary;
    classification = classification ? this.updateArrValue(classification, dataObj) : classification;
    player = player ? this.updateArrValue(player, dataObj) : player;
    global = (dataObj?.globalProperties && dataObj?.globalProperties.length && global) ? this.updateArrValue(global, dataObj.globalProperties) : global;
    awards = (dataObj?.awards && dataObj?.awards.length && awards) ? dataObj?.awards?.map(awardsObj => this.updateArrValue(awardFieldArr, awardsObj)) :
      awards;
    specialCategory = (dataObj?.specialCategory && dataObj?.specialCategory.length && specialCategory) ? dataObj?.specialCategory?.map(specialCategoryObj => this.updateArrValue(specialCategoryArr, specialCategoryObj)) :
      specialCategory;
    skip_song = (dataObj?.skipSong && dataObj?.skipSong.length && skip_song) ? dataObj?.skipSong?.map(skipSongObj => this.updateArrValue(skipFieldArr, skipSongObj)) :
      skip_song;

    this.setState({
      title_summary, global, classification, awards, specialCategory, player, skip_song,
      isSkipAvailable: skipAvailable,
      introStartTime: introStartTime,
      stage: contentState || { ...stage },
      videoDuration: duration || null
    }, () => {
      this.checkIfMarkAsDone();
      this.props?.setStage(contentState)
      this.props?.setTitle(dataObj.title)
    });
  }

  updateArrValue = (stateArr, updatedObj) => {
    let { state } = this.props
    let updatedData = stateArr?.map(data => {
      this.manageCondition('title_summary', data['name'], updatedObj[data["name"]] || data["value"]);
      if (data["name"] == 'audioLanguages') {
        return {
          ...data,
          multiple: updatedObj.isMultiAudio || (!!(state == 'quick-filing') || !!(state == 'single-landing-page')),
          value: (updatedObj.isMultiAudio || (!!(state == 'quick-filing') || !!(state == 'single-landing-page'))) ? updatedObj[data["name"]] : updatedObj[data["name"]] ? updatedObj[data["name"]][0] : data["value"],
        };
      }
      else {
        return {
          ...data,
          value: updatedObj[data["name"]] || data["value"],
        };
      }
    });
    return updatedData;
  };

  addTag = async data => {
    let index = data.findIndex(obj => !obj.id);
    if (index > -1) {
      const response = await apiCalls(Config.masterUrl, "POST", {...data[index], type: "Tags"}, null, false);
      if (response) {
        const {id, title}= response;
        data[index]= {id, title};
      }
    }
    return data;
  }

  //(stepName, rootIndex, index, value)
  handleStateChange = async(event, rootIndex, index, stepName) => {
    let { value, triggerAutoSave } = event.target;
    let { videoDuration, isSkipAvailable, stage } = this.state;
    let stepNameArr = this.state[stepName].slice();
    if (stage?.title === constantText.contentConstants.published) {
      let changedState = { title: constantText.contentConstants.changed }
      this.setState({ stage: changedState })
    }
    if (stage?.title === constantText.contentConstants.submittedToReview){
      let draftState = { title: constantText.contentConstants.draft }
      this.setState({ stage:draftState })
    }
    if (stage?.title === constantText.contentConstants.unpublished) {
      let draftState = { title: constantText.contentConstants.draft }
      this.setState({ stage:draftState })
    }
    if (rootIndex != null) {
      let shallowArr = [...stepNameArr];
      let rootArr = [...shallowArr[rootIndex]];
      const { name, label, type, keyText, validation } = rootArr[index];
      let errorIndex= (type == "SearchableWithCreate")? value.findIndex(data=> !!checkValidity(data[keyText], validation, false).errorText): -1;
      let { errorText } = (type == "SearchableWithCreate") ? { errorText: (errorIndex> -1)?
        checkValidity(value[errorIndex][keyText], validation, false).errorText: "" } : checkValidity(value, validation, false);
      rootArr[index] = { ...rootArr[index], value, errorText, isChanged: true };
      if (name == "specialCategoryFrom" || name == "specialCategoryTo") {
        rootArr = manageValidationForSpacialCat(rootArr, name, label, value);
      }
      shallowArr[rootIndex] = rootArr;
      this.setState(prevState => ({ [stepName]: shallowArr }), () => {
        if (stepName == 'skip_song') {
          this.manageConditionForSkipSong(rootIndex, rootArr[index]['name'], value);
        }
        if (triggerAutoSave) {
          this.autoSave();
        }
      });
    }
    else {
      if(event?.target?.name === 'title') {
        value = value.replace(/^\s\s*/, '');
      }
      let shallowArr = [...stepNameArr];
      const { name, type, keyText, validation } = shallowArr[index];
      let errorIndex= (type == "SearchableWithCreate")? value.findIndex(data=> !!checkValidity(data[keyText], validation, false).errorText): -1;
      let { errorText } = (type == "SearchableWithCreate") ? { errorText: (errorIndex> -1)?
        checkValidity(value[errorIndex][keyText], validation, false).errorText: "" } : checkValidity(value, validation, false);
      shallowArr[index] = { ...shallowArr[index], value: (name == "tags" && !errorText) ?
        await addTag(value, 'movie') : value, errorText, isChanged: true };
        if( name == "dateZee5Published" || name == "telecastDate"){
          if(this.props.state !== "quick-filing" ){
            shallowArr = validateReleaseAndTelecastDate(shallowArr, name, value);
          }
        }
      if(name === "primaryGenre" || name === "secondaryGenre") {
        shallowArr = manageValidationForGenre(shallowArr, name)
      } else if(name === "primaryLanguage" || name === "dubbedLanguageTitle") {
        shallowArr = manageValidationForLanguage(shallowArr, name)
      }
      shallowArr = manageDropDownValidation(shallowArr, shallowArr[index]["name"], value)
      this.setState(
        (prevState) => ({
          [stepName]: shallowArr,
          isSkipAvailable: (shallowArr[index]['label'] == 'Skip Available') ? value : isSkipAvailable,
          videoDuration: (shallowArr[index]['name'] == 'duration') ? value : videoDuration
        }), () => {
          if(stepName === 'player' || stepName === 'skip_song')
          this.manageConditionForTime(null, stepName, shallowArr[index]['name'], value);
          if (shallowArr[index]['label'] == 'Skip Available')
            this.manageConditionForSkipAvailabel();
          if (stepNameArr[index]["type"] == "checkbox" || triggerAutoSave) {
            this.autoSave();
          }
        }
      );
    }
  };

  filterSecondaryGenreData = (stepName, index, options) => {
    let section = [...this.state[stepName]]
    const sec = section.filter((item) => item.name === "primaryGenre")
    const existingIds = sec[0]?.value?.map(function (item) {
      return item.id;
    });

    const filteredOptions = options.filter((item) => !existingIds?.includes(item.id));
    return filteredOptions
  }

  filterDubbedAndPrimaryLang = (stepName, index, options, filterLanguage) => {
    let section = [...this.state[stepName]]
    const lang = section.filter((item) => item.name === filterLanguage)
    const existingIds = Array.isArray(lang[0]?.value) ? lang[0]?.value?.map(function (item) {
      return item.id
    }) : lang[0]?.value?.id;
    const filteredOptions = Array.isArray(existingIds) ? options.filter((item) => !existingIds.includes(item.id)) : options.filter((item) => item?.id !== existingIds);
    return filteredOptions
  }

  setSelectDataArr = (stepName, rootIndex, index, data) => {
    let stepNameArr = this.state[stepName].slice();
    if (rootIndex != null) {
      let shallowArr = [...stepNameArr];
      let rootArr = [...shallowArr[rootIndex]];
      if (rootArr[index].name === "specialCategoryCountry") {
        const groupData = formatCountryGroup(data)
        data = groupData
      }
      if (shallowArr[0][index].name === "primaryLanguage") {
        const filterAudioLang = this.filterDubbedAndPrimaryLang(stepName, index, data, 'dubbedLanguageTitle')
        data = filterAudioLang
      }
      if (shallowArr[0][index].name === "dubbedLanguageTitle") {
        const filterAudioLang = this.filterDubbedAndPrimaryLang(stepName, index, data, 'primaryLanguage')
        data = filterAudioLang
      }
      rootArr[index] = { ...rootArr[index], data: data || [] };
      shallowArr[rootIndex] = rootArr;
      this.setState((prevState) => ({ [stepName]: shallowArr }));
    }
    else {
      let shallowArr = [...stepNameArr];
      if (shallowArr[index].name === "secondaryGenre") {
        const filteredData = this.filterSecondaryGenreData(stepName, index, data)
        data = filteredData
      }
      shallowArr[index] = { ...shallowArr[index], data: data || [] };
      shallowArr = (shallowArr[index].name === "primaryLanguage" || shallowArr[index].name === "dubbedLanguageTitle") ?
      manageValidationForLanguage(shallowArr) : shallowArr;
    shallowArr = (shallowArr[index].name === "primaryGenre" || shallowArr[index].name === "secondaryGenre") ?
      manageValidationForGenre(shallowArr) : shallowArr;
      this.setState((prevState) => ({ [stepName]: shallowArr }));
    }
  };

  manageCondition = (stepName, name, value) => {
    let stepNameArr = this.state[stepName];
    stepNameArr = manageDropDownValidation(stepNameArr, name, value);
    return stepNameArr;
  };

  manageConditionForTime = (rootIndex, stepName, name, value) => {
    let { videoDuration, player, skip_song } = this.state;
    let stepNameArr = rootIndex ? this.state[stepName][rootIndex].slice() : this.state[stepName].slice();
    let {dataArr = player, error, skipSong } = manageValidationForDuration(videoDuration, player, name, value, skip_song)
    skip_song = skipSong
    if(error) {
      this.setState({player: dataArr})
      return;
    } else {
      let { data = stepNameArr, introStartTime, skipSongArr} = manageValidationForTime(stepNameArr, name, value, skip_song);
      skip_song = skipSongArr
      this.setState((prevState) => {
        if( rootIndex !== null) {
          prevState[stepName][rootIndex] = data
        } else {
          prevState[stepName] = data
        }
        return {
          introStartTime,
          [stepName]: prevState[stepName],
          skip_song
        }
      });
    }
  };

  manageConditionForDuration = (name, value) => {
    let { videoDuration, player } = this.state;
    this.setState({ player: player ? manageValidationForDuration(videoDuration, player, name, value) : player });
  }

  manageConditionForSkipSong = (rootIndex, name, value) => {
    let { introStartTime, skip_song, player } = this.state;
    if (skip_song) {
      let shallowArr = [...skip_song];
      let rootArr = [...shallowArr[rootIndex]];

      rootArr = manageValidationForSkipSong(rootArr, introStartTime, name, value, player, skip_song, rootIndex);
      shallowArr[rootIndex] = rootArr;
      this.setState({ skip_song: shallowArr });
    }
  }

  manageConditionForSkipAvailabel = () => {
    let { isSkipAvailable, player, skip_song } = this.state;
    player = player?.map(data => {
      if (data.name != "skipAvailable" && data.name != "adMarker") {
        data.value = isSkipAvailable ? data.value : (data.type == "text") ? "" : null
      }
      return data;
    });
    skip_song = skip_song?.map(nestedArr => nestedArr?.map(data => {
      data.value = isSkipAvailable ? data.value : null;
      return data;
    }));
    this.setState({ player, skip_song }, () => this.autoSave());
  }

  addRemoveSkipSong = index => {
    let { skip_song, skipFieldArr } = this.state;
    skip_song = skip_song.slice();
    if (index > 0) {
      skip_song.splice(index, 1);
    } else {
      skip_song.push(skipFieldArr);
    }
    this.setState({ skip_song }, () => this.autoSave());
  };

  addRemoveSpecialCategory = index => {
    let { specialCategory, specialCategoryArr } = this.state;
    specialCategory = specialCategory.slice();
    if (index > 0) {
      specialCategory.splice(index, 1);
    } else {
      specialCategory.push(specialCategoryArr);
    }
    this.setState({ specialCategory }, () => this.autoSave());
  };

  addRemoveAwards = index => {
    let { awards, awardFieldArr } = this.state;
    awards = awards.slice();
    if (index > 0) {
      awards.splice(index, 1);
    } else {
      awards.push(awardFieldArr);
    }
    this.setState({ awards }, () => this.autoSave());
  };

  addRemoveGroupWise = index => {
    let { groupWiseTitle, groupWiseArr } = this.state;
    groupWiseTitle = groupWiseTitle.slice();
    if (index > 0) {
      groupWiseTitle.splice(index, 1);
    } else {
      groupWiseTitle.push(groupWiseArr);
    }
    this.setState((prevState) => ({ groupWiseTitle }));
  };

  formatValue = (value, isArray) => {
    if (isArray) {
      return value.map(item => {
        return item.id;
      })
    }
    return value.id;
  }

  formatData = (data, checkLength) => {
    let formattedData = {};
    for (let obj of data ? data : []) {
      let { name, value, multiple, type, isChanged = false } = obj;
      if (isChanged === true || typeof value == "boolean" || type === "time" || !checkLength || (checkLength && (multiple ? value?.length > 0 : value))) {
        if ((type === 'dropdown' || type === 'dropdownAsync' || name== "tags") && value) {
          value = this.formatValue(value, multiple)
        }
        if (type === "date" && value === "") {
          value = null
        }
        formattedData[name] = value;
        obj.isChanged = false
      }
    }
    return formattedData;
  };

  formatNestedData = (dataArr) => {
    let formattedData = dataArr?.filter((nestedObj) => {
      let hasValue = true;
      for (let key in nestedObj) {
        if (!nestedObj[key] || nestedObj[key].length <= 0) hasValue = false;
      }
      if (hasValue) return nestedObj;
    });
    return formattedData;
  };

  checkError = (dataArr, checkRequired) => {
    let error = null;
    for (let obj of dataArr) {
      let { name, type, value, multiple, validation, errorText } = obj;
      let { required } = validation || {};
      if (errorText) return (error = name);
      if (checkRequired && !!required && requiredValidate(multiple ? !!value?.length :
        (type == "textEditor") ? getTextFromHtml(value) : value)) {
        return (error = name);
      }
    }
    return error;
  };

  formatAllData = (checkRequired) => {
    let { title_summary, global, groupWiseTitle, groupWiseArr, classification, awards, specialCategory, player, skip_song } = this.state;
    let { language } = this.props;
    let allData = [...title_summary];
    allData = classification ? [...allData, ...classification] : allData;
    allData = player ? [...allData, ...player] : allData;
    let dataError = this.checkError(global ? [...allData, ...global] : allData, checkRequired);
    let formattedData = this.formatData(allData, true);

    let awardsArrOfObj = [];
    let awardsObj = awards?.map(awardNestedArr => awardNestedArr?.map(data => {
      awardsArrOfObj = [...awardsArrOfObj, data];
      return data;
    }));
    let awardsError = this.checkError(awardsArrOfObj, checkRequired);
    let awardsArr = awards?.map(awardNestedArr => this.formatData(awardNestedArr, false));

    let specialCategoryArrOfObj = [];
    let specialCategoryObj = specialCategory?.map(awardNestedArr => awardNestedArr?.map(data => {
      specialCategoryArrOfObj = [...specialCategoryArrOfObj, data];
      return data;
    }));
    let specialCategoryError = this.checkError(specialCategoryArrOfObj, checkRequired);
    let specialCategoryArr = specialCategory?.map(awardNestedArr => this.formatData(awardNestedArr, false));
    let skipArrOfObj = [];
    let skipSongObj = skip_song?.map(skipSongNestedArr => skipSongNestedArr?.map(data => {
      skipArrOfObj = [...skipArrOfObj, data];
      return data;
    }));
    let skipSongError = this.checkError(skipArrOfObj, checkRequired);

    let skipSongArr = skip_song?.map(skipNestedArr => this.formatData(skipNestedArr, false));
    //Group Title Start//
    let groupWiseArrOfObj = [];
    groupWiseTitle?.forEach(groupNestedArr => groupNestedArr?.map(data => {
      groupWiseArrOfObj = [...groupWiseArrOfObj, data];
    }));
    let groupWiseError = this.checkError(groupWiseArrOfObj, checkRequired);
    let groupWiseArray = groupWiseTitle?.map(groupNestedArr => this.formatData(groupNestedArr, false));
    groupWiseArray = this.formatNestedData(groupWiseArray);
    if (groupWiseArray?.length > 0) {
      formattedData.globalProperties = {}
      formattedData.globalProperties.groupWiseTitle = groupWiseArray;
    }
    //Group Title End//
    if (Object.keys(this.formatData(global, true))?.length > 0) {
      formattedData.globalProperties = { ...formattedData.globalProperties, ...this.formatData(global, true) };
    }
    formattedData.awards = awardsArr;
    formattedData.specialCategory = specialCategoryArr;
    formattedData.skipSong = skipSongArr;
    let error = !!dataError || !!awardsError || !!specialCategoryError || !!skipSongError || !!groupWiseError;
    let movieData = { language, movie: formattedData };
    if (movieData.movie.audioLanguages && !Array.isArray(movieData.movie.audioLanguages)) {
      const audLangs = Array(movieData.movie.audioLanguages)
      movieData.movie.audioLanguages = audLangs
    }
    return { error, movieData };
  };

  autoSave = async (avoidStateUpdate) => {
    let { movieId } = this.state;
    let { match, state } = this.props;
    let { movieData, error } = this.formatAllData(false);
    movieData.movie.isMultiAudio = state ? true : movieData.movie.isMultiAudio;
    if (!error) {
      let url = `${Config.movieProperties}/${movieId}`;
      let response = await apiCalls(url, "PUT", movieData, null, false, false, this.props.autoSaveError);
      if (response) {
        if (!avoidStateUpdate) {
          let { movieId } = response;
          this.setState((prevState) => ({
            error: false,
            movieId: movieId || this.state.movieId,
          }));
          this.props.markAsDone(this.props?.selectedTab, false);
          this.checkIfMarkAsDone();
        }
      }
    }
  };

  selectCountryGroup = (event, group, stepName, rootIndex, index) => {
    const section = JSON.parse(JSON.stringify(this.state[stepName]));
    const element = { ...section[rootIndex][index] };
    const options = [...element.data];
    element.value = getSelectedGroup(event, group, options, element.value);

    section[rootIndex][index] = element;
    this.setState({ [stepName]: section });
  };

  handleSearchableInput = async (value, rootIndex, index, sectionName) => {
    let shallowArr = [...this.state[sectionName]];
    let url= rootIndex? (shallowArr[rootIndex][index]?.name== "tags")? `${Config.masterTags}?title`:
      `${Config.castnamesUrl}?castName`: (shallowArr[index]?.name== "tags")? `${Config.masterTags}?title`:
      `${Config.castnamesUrl}?castName`;

    let response = await apiCalls(`${url}=${value}`, "GET", {}, null, false) || [];
    (rootIndex != null) ? (shallowArr[rootIndex][index]["data"] = response) : (shallowArr[index]["data"] = response);
    this.setState(prevState => ({ [sectionName]: shallowArr }));
  }

  checkIfMarkAsDone = () => {
    let { error } = this.formatAllData(true);
    this.setState({ canMarkAsDone: !error ? true : false });
  };

  markAsDone = async () => {
    this.props.markAsDone(this.props?.selectedTab, true);
  };

  showHideLockPopup = isLocked => {
    let { showLockedPopup } = this.state;
    this.setState({
      showLockedPopup: !showLockedPopup
    }, () => {
      if (!isLocked) {
        this.props?.unLockedSession(this.props?.selectedTab);
      }
    });
  }

  getTitleSummaryUI = () => {
    let { selectedTab, title_summary, groupWiseTitle, specialCategory, global, error } = this.state;
    let { isLocked } = this.props?.currentTabData;
    return (
      <TitleSummary
        title_summary={title_summary || []}
        specialCategory={specialCategory || []}
        global={global || []}
        groupWiseTitle={groupWiseTitle || []}
        addRemoveGroupWise={this.addRemoveGroupWise}
        addRemoveSpecialCategory={this.addRemoveSpecialCategory}
        selectGroup={this.selectCountryGroup}
        setSelectDataArr={this.setSelectDataArr}
        onBlur={() => { this.autoSave() }}
        handleChange={this.handleStateChange}
        selectedTab={selectedTab}
        handleTab={this.handleTab}
        error={error} disabled={!!isLocked}
      />
    );
  };

  getClassificationUI = () => {
    let { selectedTab, classification, awards, error } = this.state;
    let { isLocked } = this.props?.currentTabData;
    return (
      <Classification
        classification={classification || []}
        awards={awards || []}
        setSelectDataArr={this.setSelectDataArr}
        handleSearchableInput={this.handleSearchableInput}
        addRemoveAwards={this.addRemoveAwards}
        onBlur={() => { this.autoSave() }}
        handleChange={this.handleStateChange}
        selectedTab={selectedTab}
        handleTab={this.handleTab}
        error={error} disabled={!!isLocked}
      />
    );
  }

  getPlayerAttributeUI = () => {
    let { selectedTab, player, skip_song, isSkipAvailable, error } = this.state;
    let { isLocked } = this.props?.currentTabData;
    return (
      <PlayerAttributes
        player={player || []}
        skip_song={skip_song || []}
        setSelectDataArr={this.setSelectDataArr}
        onBlur={() => { this.autoSave() }}
        addRemoveSkipSong={this.addRemoveSkipSong}
        handleChange={this.handleStateChange}
        selectedTab={selectedTab}
        handleTab={this.handleTab}
        error={error} disabled={!!isLocked} isSkipAvailable={isSkipAvailable}
      />
    );
  }

  getControlFieldUI = () => {
    let { movieId, selectedTab, controlFieldsData } = this.state;
    let { language } = this.props;
    return (
      <ControlFields
        selectedTab={selectedTab}
        handleTab={this.handleTab}
        movieId={movieId}
        language={language}
        controlFieldsData={controlFieldsData}
      />
    );
  }

  getMovieUI = () => {
    let { selectedTab } = this.state;
    return (
      <Fragment>
        {(selectedTab == 0) && this.getTitleSummaryUI()}
        {(selectedTab == 1) && this.getClassificationUI()}
        {(selectedTab == 2) && this.getPlayerAttributeUI()}
        {(selectedTab == 3) && this.getControlFieldUI()}
      </Fragment>
    )
  }

  getQuickFilingUI = () => {
    let { selectedTab } = this.state;
    return (
      <Fragment>
        {(selectedTab == 0) && this.getTitleSummaryUI()}
        {(selectedTab == 1) && this.getClassificationUI()}
        {(selectedTab == 2) && this.getControlFieldUI()}
      </Fragment>
    )
  }

  getSinglePageUI = () => {
    let { selectedTab } = this.state;
    return (
      <Fragment>
        {(selectedTab == 0) && this.getTitleSummaryUI()}
        {(selectedTab == 1) && this.getControlFieldUI()}
      </Fragment>
    )
  }

  handleTab = (event, selectedTab) => {
    const tabData = [...this.state.tabData]
    if (tabData[selectedTab].label === "Control Fields" && !tabData[selectedTab].fetched) {
      this.getControlFieldData()
      tabData[selectedTab].fetched = true
    }
    this.setState({ selectedTab, tabData })
  };

  componentWillUnmount() {
    const { isLocked, isDone } = this.props.currentTabData
    if (!isLocked && !isDone) {
      // this.autoSave(true)
    }
  }

  render() {
    let { stage, tabData, selectedTab, canMarkAsDone, showLockedPopup } = this.state;
    let { state, currentTabData } = this.props;
    let { isDone, isLocked, lockedBy } = currentTabData || {};
    
    return (
      <div className="create-movie">
        <div className={!!isLocked ? "lock-screen" : ""}>
          <div className="lock-dot-top"></div>
          <div className="lock-dot-bottom"></div>
          <div className="lock-dot-left"></div>
          <div className="lock-dot-right"></div>
          {!!isLocked && (
            <div className="lock-user-info">
              <div className="loc-icon" onClick={() => this.showHideLockPopup(true)}><LockIcon /></div>
              {lockedBy && <div className="user-name">{lockedBy}</div>}
            </div>
          )}
          <div className="whitebox remove-b-radius">
            <div className="ccm-head flex align-items-center justify-content-between m-b-0">
              <h4>{constantText.content_properties_text}</h4>
              <div className="status-head flex align-items-center">
                {stage?.title && <BadgeBox className="create-movie-stage" status={stage?.title} />}
                <div className="autosave">
                  {constantText.all_fields_auto_save_text}
                </div>
                <div
                  data-test="markAsDoneBtn"
                  className={`mark-done  ${isDone ? "mark-active auto-mark-done" : canMarkAsDone ? "mark-fill-active auto-mark-done" : ""} auto-mark-done`}
                  onClick={() => {
                    if (canMarkAsDone && !isLocked && !isDone)
                      this.markAsDone();
                  }}>
                  <span><MarkDone /></span>
                  {constantText.mark_as_done_text}
                </div>
              </div>
            </div>
            <div className="cr-mov-tab p-b-30">
              <LeftTab
                className="tabs"
                orientation="horizontal"
                variant="scrollable"
                options={tabData}
                selectedTab={selectedTab}
                showIcon={false}
                handleChange={this.handleTab}
              />
            </div>
          </div>

          <div className="movieForm-tab">
            {state ? (state == 'quick-filing') ? this.getQuickFilingUI() : this.getSinglePageUI() : this.getMovieUI()}
          </div>
        </div>
        <LockedPopup className="popup-wrap status-popup" state={showLockedPopup} lockedBy={lockedBy}
          doneAction={() => this.showHideLockPopup(false)} cancelAction={() => this.showHideLockPopup(true)} />
      </div>
    );
  }
}

export default ContentProperties;
