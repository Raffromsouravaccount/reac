import React, { Component, Fragment } from "react";
import Config from "../../../Config/config";
import { constantText } from "../../../_helpers/constants.text";
import TranslationView from "../Layout/TranslationView";
import TvshowContentPropertiesJson from "../Schema/Tvshow/ContentProperties.json";
import TvshowGlobalContentPropertiesJson from "../Schema/Tvshow/GlobalContentProperties.json";
import TvshowCastNCrewJson from "../Schema/Tvshow/CastNCrew.json";
import { translationService } from "../../../_services/translation.service";
import { alphanumericValidate, characterValidateAllLang, maxLength, numberValidate } from "../../../_helpers/validation";
import { apiCalls } from "../../../_services/common.service";
import TranslationInfo from "../Layout/TranslationInfo";
import { getLocalData, setLocalData } from "../../../_helpers/util";
import Locked from "../../Common/Locked/Locked";
import LockIcon from 'images/lock-icon.svg';
import { CommonModel } from '../../Common/Model/CommonModel';
import TranslationFormFields from '../Layout/TranslationFormFields';
import { showSuccessErrorMsg } from '../../../_actions/alertMessages.action';
import LeftTab from './../../Common/LeftTab/CommonLeftTab';

class TranslationTvshow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: this.props.params,
      showNavToAssignedLang: this.props.showNavToAssignedLang,
      language: this.props.language,
      sections: constantText.translations.tvshow_sections,
      globalSections: constantText.translations.tvshow_global_sections,
      selectedSecTab: 0,
      selectedGlobalSecTab: 0,
      fields: JSON.parse(JSON.stringify(TvshowContentPropertiesJson)),
      defaultData: {}, // default language content
      selectedLangData: {}, // selected lang
      error: false,
      isUpdating: false,
      isLocked:false,
      lockedBy:"",
      showModel:false,
      markAsDone: 1,  // 1 for disable markAsDone, 2 for enable markAsDone, 3 for mark as done true
      updatedFields: {},
      translationStatus: 0,
      globalFieldEditIndex: '',
      countryGroupList: [],
      masterData: [],
    };
  }

  async componentDidMount() {
    this.fetchContentData(true);
    this.fetchContentData();
  }

  componentWillReceiveProps(nextProps) {
    const { showNavToAssignedLang, language, section } = nextProps;
    if (String(this.state.language?.code) != String(language?.code)) {
      this.setState({ showNavToAssignedLang, language: language, selectedLangData: {} }, () => {
        this.fetchContentData();
      });
    }
  }

  componentWillUnmount() {
    this.updation = false;
  }

  fetchContentData = async (isDefaultData = false) => {
    const { params, sections, selectedSecTab, language, fields, globalSections, selectedGlobalSecTab, masterData } = this.state;
    const section = sections[selectedSecTab];
    const globalSection = globalSections[selectedGlobalSecTab];
    let response, masterDataResponse = [];
    if(isDefaultData && section.url == "castAndCrew" && masterData?.length === 0) {
      const res = await translationService.getContentType();
      masterDataResponse = res && res?.data;
    }
    const lng = isDefaultData ? String(Config.defaultLanguageCode) : String(language?.code);
    if(section.url == "properties" && globalSection.url == "globalFields") {
      response = await translationService.getShowDetails('tvShow', params?.tvshowId, lng, globalSection.url);
    } else {
      response = await translationService.getShowDetails('tvShow', params?.tvshowId, lng, sections[selectedSecTab].url);
    }
    if (response && response.data) {
      isDefaultData ? 
        this.setState({ 
          defaultData: section.url == "properties" ? 
            globalSection.url !== "globalFields" ? response.data[0] : response.data
          : await translationService.mapCastAndCrewValues(response.data, fields, masterDataResponse), masterData: masterDataResponse }) 
        : this.updateValues(response.data);
    } else if (isDefaultData && Object.keys(this.state.defaultData).length) {
      this.setState({ defaultData: {} });
    } else {
      const { defaultData} = this.state;
      let fields;
      /**
       * condition for clear data if already exists
       */
      section.url == "properties" ? fields = JSON.parse(JSON.stringify(TvshowContentPropertiesJson)) : "";
      section.url == "castAndCrew" ? fields = JSON.parse(JSON.stringify(TvshowCastNCrewJson)) : "";

      /**
       * conditon for adding multiple actors if available in default language
       */
      if (defaultData && defaultData.actors) {
        fields = JSON.parse(JSON.stringify(fields));
        let demoObj = JSON.parse(JSON.stringify(fields.actors[0]));
        fields.actors = [];
        defaultData.actors.forEach((element, index) => {
          fields.actors.push(demoObj);
        });
      };
      let transStatus = 0;
      if(section.url == "castAndCrew" || (section.url == "properties" && globalSection.url == "globalFields")) {
        const res = await this.getPropertiesData();
        if(res && res.data) {
          transStatus = res.data[0]?.translationStatus || transStatus;
          this.getTvshowStatus();
        }
      }
      if(section.url == "properties" && globalSection.url == "globalFields") {
        fields = JSON.parse(JSON.stringify(TvshowGlobalContentPropertiesJson));
        if (Object.keys(defaultData).length === 0) {
          fields.title_summary = fields?.title_summary.map(field => {
            field["isDisabled"] = true;
            return field;
          });
        }
        if(Array.isArray(defaultData)) {
          this.getCountryGroup(defaultData);
          let demoObj = JSON.parse(JSON.stringify(fields));
          let global = [];
          global.push(demoObj);
          let obj = {};
          defaultData.length && defaultData.forEach((element, index) => {
            obj['title_summary'+ index] = global[0].title_summary;
          });
          fields = obj;
        }
      }
      this.setState({isLocked: false, lockedBy: '', isUpdating: false, translationStatus: transStatus});

      // set data if changes available in fields
      fields ? this.setState({ fields }) : "";
    }
  };

  /**
   * Update values in case edit
   * @param {*} resData from responce 
   * updates values as per selected section url
   */
  updateValues = async (resData) => {
    if (!resData) {
      return;
    }
    let dataObj, mappedDataObj;
    const { sections, selectedSecTab, masterData, params, globalSections, selectedGlobalSecTab, defaultData} = this.state;
    const globalSection = globalSections[selectedGlobalSecTab];
    let fields = this.state.fields;
    if (sections[selectedSecTab].url === 'properties' && globalSection.url === 'titleSummary') {
      dataObj = resData[0];
      fields.title_summary = this.updatePropertiesValue(
        fields.title_summary,
        dataObj
      );
    } else if (sections[selectedSecTab].url === 'castAndCrew') {
      const response = await this.getPropertiesData();
      if(response && response.data) {
        dataObj = response.data[0];
      }
      mappedDataObj = await translationService.mapCastAndCrewValues(resData, fields, masterData);
      fields.others = this.updatePropertiesValue(
        fields.others,
        mappedDataObj
      );
      if (mappedDataObj && mappedDataObj.actors && mappedDataObj.actors.length && fields.actors) {
        fields.actors = [];
        mappedDataObj.actors.forEach((field, index) => {
          field.map(el => {
            if((el.hasOwnProperty('id') && !el.id) || el.name === "character") {
              el.isEditing = true;
            } else if (el.hasOwnProperty('id') && el.id){
              el.isEditing = false;
            }
            return el;
          })
          fields.actors.push(field);
        });
      }
    } else if (sections[selectedSecTab].url === 'properties' && globalSection.url === 'globalFields') {
        const response = await this.getPropertiesData();
        if(response && response.data) {
          dataObj = response.data[0];
        }
        this.getCountryGroup(defaultData);
        fields = JSON.parse(JSON.stringify(fields));
        let demoObj = JSON.parse(JSON.stringify(fields));
        let global = [];
        global.push(demoObj);
        let obj = {};
        resData.length && resData.forEach((element, index) => {
          global[0].title_summary = this.updatePropertiesValue(global[0].title_summary, element);
          obj['title_summary'+ index] = global[0].title_summary;
        });
        if(defaultData.length !== resData.length) {
          defaultData.forEach((element, index) => {
            if(index >= resData.length) {
              global[0].title_summary = this.updatePropertiesValue(global[0].title_summary, "");
              obj['title_summary'+ index] = global[0].title_summary;
            }
          });
        }
        fields = obj;
    }
    const selectedLangData = sections[selectedSecTab].url === 'properties' ? dataObj : mappedDataObj;
    this.getTvshowStatus();
    this.setState({ fields: JSON.parse(JSON.stringify(fields)), selectedLangData, isUpdating: true, translationStatus: dataObj?.translationStatus || "0"});
  };

  validateMarkAsDone(fields) {
    const { translationStatus } = this.state;
    let validation = 1;
    const validate = (value) => {
      return value && value != null && Object.keys(value).length ? 2 : 1;
    }
    Object.keys(fields).forEach(key => {
      if (key != 'actors') {
        fields[key].forEach(field => {
          if (field.type !== 'dropDown' && (validate(field.value) === 2) || (parseInt(translationStatus) === 1)) {
            validation = 2;
            return;
          }
        })
      } else {
        fields[key].forEach(field => {
          if (validate(field[0].value) === 2  && validate(field[1].value) === 2  || parseInt(translationStatus) === 1 || parseInt(translationStatus) === 2) {
            validation = 2;
            return;
          }
        })
      }
    })
    return validation;
  }

  validateMarkAsDoneShowAction = () => {
    const {translationStatus} = this.state;
    let markDone;
    if(translationStatus === "0") {
      markDone = 1;
    } else if (translationStatus === "1"  || translationStatus === "2") {
      markDone = 2;
    }
    return markDone;
  }

  updatePropertiesValue = (stateArr, updatedObj) => {
    const { globalSections, selectedGlobalSecTab } = this.state;
    const globalSection = globalSections[selectedGlobalSecTab];
    let updatedData = stateArr?.map((data) => {
      const dataObj = {
        ...data,
        value: updatedObj[data["name"]] || "",
        errorMsg: '',
        ...(globalSection.url === 'globalFields' && {gId: updatedObj["id"] || ""}),
      };

      return dataObj;
    });
    return updatedData;
  };

  validateError(text, numeric, maxTextLength, value) {
    return ((text && numeric
      ? alphanumericValidate(value)
      : text
        ? characterValidateAllLang(value)
        : numeric
          ? numberValidate(value)
          : null) ||
      (maxTextLength && maxLength(maxTextLength, value.replace(/(<([^>]+)>)/ig, ''))) ||
      null)
  }

  handleValueChange = (stepName, index, rootIndex, value) => {
    const {sections, globalSections, selectedSecTab, selectedGlobalSecTab} = this.state;
    let fields = JSON.parse(JSON.stringify(this.state.fields));
    const section = sections[selectedSecTab];
    const globalSection = globalSections[selectedGlobalSecTab];
    const shallowArr = fields[stepName];
    let errorMsg = null;
    if (typeof index == 'number' && index >= 0) {
      let { text, numeric, maxTextLength } = shallowArr[rootIndex][index];
      errorMsg = this.validateError(text, numeric, maxTextLength, value);
      shallowArr[rootIndex][index] = { ...shallowArr[rootIndex][index], value, errorMsg };
    } else {
      let { text, numeric, maxTextLength, type } = shallowArr[rootIndex];
      (type === 'texteditor' && value.trim() === "<p><br></p>") ? value = value.replace("<p><br></p>", "") : value;
      errorMsg = this.validateError(text, numeric, maxTextLength, value);
      shallowArr[rootIndex] = { ...shallowArr[rootIndex], value, errorMsg };
    }

    fields[stepName] = shallowArr;
    this.setState({ fields, ...(!index && {updatedFields: shallowArr[rootIndex]}), ...(section.url === "properties" && globalSection.url === 'globalFields' && {globalFieldEditIndex: stepName}) }, () => {
      if (shallowArr[rootIndex]["type"] == "dropDown") {
        console.log("autoSave");
        this.autoSave();
      }
    });
  };

  getPropertiesData = async () => {
    const { language, params} = this.state;
    const response = await translationService.getShowDetails(
      'tvShow', params.tvshowId, String(language?.code), 'properties'
    );
    return response;
  }

  toggleModel = () => {
    this.setState(prevState => {
      return { showModel: !prevState.showModel }
    });
  }

  lockUnlockTranslation = async () => {
    const {params}=this.state;
    this.toggleModel();
    this.setState({
      isLocked: false,
    }, () => {
      this.lockSections(params?.tvshowId);
    });
  }

  lockSections = async (tvshowId) => {
    const { sections, selectedSecTab, language, fields } = this.state;
    const section = sections[selectedSecTab];
    const paramsData = {  
      tvShowId : tvshowId,
      isLocked: true,
      sectionName: `${String(language?.code)}_properties`
    };
    const response= await this.markAsDoneNLockedAction(paramsData);
    response && console.log('Lock is updated!');
  }

  autoSave = async (isDoneMark) => {
    const { isLocked, sections, selectedSecTab, globalSections, selectedGlobalSecTab, language, params, fields, isUpdating, updatedFields, globalFieldEditIndex } = this.state;
    const section = sections[selectedSecTab];
    const globalSection = globalSections[selectedGlobalSecTab];
    const { error, formattedData } = (section.url === 'properties' && globalSection.url === 'globalFields') ? translationService.formatAllData(globalSection.url, fields, false) : translationService.formatAllData(section.url, fields, false);
    let data;
    if(section.url === 'properties' && globalSection.url === 'titleSummary') {
      const d = formattedData[updatedFields['name']];
      const c = updatedFields['name'];
      data = c ? { [c]: d } : {}
    } else if (section.url === 'properties' && globalSection.url === 'globalFields') {
      const s = globalFieldEditIndex?.slice(-1);
      const fData = formattedData?.filter((el,index) => {
        if(index == s) {
          return el;
        }
      })[0];
      const d = fData[updatedFields['name']];
      const c = updatedFields['name'];
      const countryListItems = [...this.state.countryGroupList];
      let countryArr;
      countryListItems.length && countryListItems.map((group, index) => {
        if(index == s) {
          countryArr = group['countryGroup'+ index].map(item => item.id);
        }
      });
      data = c ? 
            { [c]: d, 
              ...(!!fData?.id && {"id": fData?.id}), 
              ...((s > 0 && fData?.id === "") && {"sequenceNumber": s}), 
              country: countryArr || []} 
            : {}
    } else {
      let actorCharacter = [...formattedData.actors]
      data = { actorCharacter }
    }
    if (error) {
      console.log("Error in auto save");
      return false;
    }

    let url = "", initialUrl = "", method = "PUT", paramsData = {};

    initialUrl = (section.url === 'properties' && globalSection.url === 'globalFields') ? 'globalTranslation' : 'translation';
    paramsData = data;
    url = `${Config.tvShow[initialUrl]}/${params.tvshowId}?langCode=${String(language?.code)}`;

    this.updation = true;
    if (!isLocked && Object.keys(paramsData).length) {
      let response = await apiCalls(url, method, paramsData, null, false, false, this.autoSaveError);
      if (response && this.updation) {
        const transStatus = response?.translationStatus;
        transStatus && this.setState({translationStatus: transStatus});
        isDoneMark === 3 ? '' : this.checkIfMarkAsDone();
        this.props.updateMarkAsDoneAction(isDoneMark === 3 || transStatus == 0);
      }
    }
  };

  checkIfMarkAsDone() {
    const { fields } = this.state;
    this.setState({ markAsDone: this.validateMarkAsDone(fields) });
  }

  handleMarkAsDone = async (selectedTab) => {
    const {sections, selectedSecTab, params, language} = this.state;
    const section = sections[selectedSecTab];
    const paramsData = {  
      tvShowId : params?.tvshowId,
      isDone: true,
      sectionName: `${String(language?.code)}_properties`
    };
    const res = await this.markAsDoneNLockedAction(paramsData);
    if (res) { 
      this.setState({ markAsDone: 3 }, () => { this.props.updateMarkAsDoneAction(true)});
    }
  }

  markAsDoneNLockedAction= async data=> {
    const response= await apiCalls(Config.tvShow?.action, "POST", data);
    return response;
  }

  autoSaveError= error=> {
    if(error?.data?.message== constantText.locked_by_another_text) {
      showSuccessErrorMsg(error?.data?.message, null, "Alert", true, null, null, this.getTvshowStatus);
    }
  }

  getTvshowStatus= async()=> {
    let { params, sections, selectedSecTab, language }= this.state;
    const section = sections[selectedSecTab];
    const sName = `${String(language?.code)}_properties`;
    const { userID } = getLocalData("userData");
    const response= await apiCalls(`${Config.tvShow?.action}/${params?.tvshowId}`, "GET", null, null, false);
    if(response && response.length> 0) {
      let locked, lockBy, markDone;
      response?.map(data=> {
        const {sectionName, isDone, isLocked, lockedByUser } = data;
        const {id, firstName, lastName}= lockedByUser || {};
        if(sName === sectionName) {
          locked = (isLocked && (id!= userID))? true: false;
          lockBy = isLocked? `${firstName} ${lastName}`: "";
          markDone = isDone ? 3 : this.validateMarkAsDoneShowAction();
        }
      });
      this.setState(prevState=> ({isLocked: locked, lockedBy: lockBy, markAsDone: markDone}));
    }
}

  /**
  * Will trigger when content section will be change from select section
  * @param {*} event
  * @param {*} selectedSecTab selected section tab from array (ex: 0, 1, 2 , etc)
  */

  handleSecTab = (event, selectedSecTab) => {
    if (selectedSecTab != this.state.selectedSecTab) {
      this.commonTabHandler(selectedSecTab, 0);
    }
  };
  handleGlobalSecTab = (event, selectedGlobalSecTab) => {
    if(selectedGlobalSecTab != this.state.selectedGlobalSecTab) {
      this.commonTabHandler(selectedGlobalSecTab, 1);
    } 
  };

  commonTabHandler = (selectedTab, tabIndex) => {
    const {sections, globalSections, selectedSecTab, selectedGlobalSecTab} = this.state;
    const section = sections[tabIndex === 0 ? selectedTab : selectedSecTab];
    const globalSection = globalSections[tabIndex === 1 ? selectedTab : selectedGlobalSecTab];
    let fields = {};
    section?.url == "properties" && globalSection.url == "titleSummary" ? fields = JSON.parse(JSON.stringify(TvshowContentPropertiesJson)) : "";
    section?.url == "castAndCrew" ? fields = JSON.parse(JSON.stringify(TvshowCastNCrewJson)) : "";
    section?.url == "properties" && globalSection.url == "globalFields" ? fields = JSON.parse(JSON.stringify(TvshowGlobalContentPropertiesJson)) : "";
    this.setState({ ...(tabIndex === 0 && {selectedSecTab: selectedTab}), ...(tabIndex === 1 && {selectedGlobalSecTab: selectedTab}), fields, selectedLangData: {} }, async () => {
      await this.fetchContentData(true);
      await this.fetchContentData();
    });
  }

  /**
   *  For redering view part in translation
   * @param {*} key 
   * @param {*} index 
   * @param {*} fieldsData 
   * @param {*} contentData 
   */
  renderTranslationView = (key, index, fieldsData, contentData, renderView) => {
    if (fieldsData && Array.isArray(fieldsData)) {
      return (
        <div className="row actor-info m-minus-30">
          {fieldsData.map((field, i) => (
            <div key={i} className={`col-md-6 ${(renderView === 'renderView3' && field?.name === 'character') ? 'd-none' : '' }`}>
              <TranslationView
                labelAndValue={translationService.labelAndValue(key, index, field, contentData, renderView, this.state.language)}
              />
            </div>
          ))}
        </div>
      )
    }
    return (
      <TranslationView
        labelAndValue={translationService.labelAndValue(key, index, fieldsData, contentData, renderView, this.state.language)}
      />
    )
  }

  renderGlobalTextField = (key) => {
    const title = constantText?.translations[key + "_sec_text"];
    return (
      <div className="col-12 lang-global-text">
        <h4>{title}</h4>
      </div>
    )
  }

  setSelectDataArr = (key, index, data) => {
    let fields = this.state.fields;
    let shallowArr = [...fields[key]];
    if(key === 'actors') {
      shallowArr[index][0] = { ...shallowArr[index][0], data: data || [] }; 
    } else {
      shallowArr[index] = { ...shallowArr[index], data: data || [] };
    }
    fields[key] = shallowArr;
    this.setState({ fields });
  };

  getCountryGroup = (res) => {
    let countryList = [];
    const resData = res;
    resData.length && resData.forEach((element, index) => {
      const list = element.country?.map(item => item);
      countryList.push({["countryGroup" +  index] : list});
    });
    countryList.length && this.setState({countryGroupList: countryList});
  }

  renderCountryGroupList = (rootIndex) => {
    const { countryGroupList } = this.state;
    const cArr = countryGroupList.length && countryGroupList[rootIndex]['countryGroup' + rootIndex]?.map(countryItem => countryItem);
    const c = cArr?.length && cArr.map((ct) => ct?.title);
    return translationService.arrayToStringView(c);
  }

  render() {
    const { permissionAddEdit, permissionViewOnly } = this.props;
    let {
      sections,
      globalSections,
      selectedSecTab,
      selectedGlobalSecTab,
      fields,
      defaultData,
      selectedLangData,
      showNavToAssignedLang,
      translationStatus,
      error,
      markAsDone,
      isLocked,
      lockedBy,
      showModel,
      language
    } = this.state;
    return (
      <Fragment>
        <Locked
          lock={!permissionViewOnly && isLocked}
          lockedBy={lockedBy}
          clicked={this.toggleModel}>
            <TranslationInfo
              sections={sections}
              selectedSecTab={selectedSecTab}
              handleSecTab={this.handleSecTab}
              markAsDone={markAsDone}
              handleMarkAsDone={this.handleMarkAsDone}
              status={translationStatus}
              isLocked={isLocked}
              permissionAddEdit = {permissionAddEdit}
              permissionViewOnly = {permissionViewOnly}
              showNavToAssignedLang={showNavToAssignedLang}
            />
            {/* commneted below lines for global fields not in used(need to uncomment when implement global fields) */}
            {/* {sections[selectedSecTab].url === 'properties' && <div className="trans-sub-tab tab-list">
              <LeftTab
                className="tabs"
                orientation="horizontal"
                variant="scrollable"
                options={globalSections}
                selectedTab={selectedGlobalSecTab}
                showIcon={false}
                handleChange={this.handleGlobalSecTab}
              />
            </div> } */}
            <div className="lang-f-wrap">
              {Object.keys(fields)?.map((key, levelIndex) => (
                <Fragment key={key}>
                  {(key === "actors" || key === "others") && this.renderGlobalTextField(key)}
                  {sections[selectedSecTab].url === 'properties' && globalSections[selectedGlobalSecTab].url === 'globalFields' && 
                    <div className="col-12 lang-global-text">
                      <h4>
                        <span>{constantText.translations.group_country_text}</span> - 
                        {this.state.countryGroupList.length > 0 ? this.renderCountryGroupList(levelIndex) : constantText.translations.no_group_country_selected_text }</h4>
                    </div>}
                  <div className="col-12">
                    <div className="row form-f-row">
                      {fields[key].map((fieldsData, index) => (
                        <Fragment key={index}>
                          <div className="col-md-6 col-lg-6 col-xl-5">
                            {this.renderTranslationView(key, index, fieldsData, defaultData, 'renderView1')}
                          </div>
                          <div className={`col-md-6 col-lg-6 col-xl-7 ${!showNavToAssignedLang ? 'masterDataExist' : ''}`}>
                            {!showNavToAssignedLang && permissionAddEdit && (fieldsData?.isEditing || Array.isArray(fieldsData)) ? <>
                              {fieldsData && Array.isArray(fieldsData) ?
                                <div className="row actor-info-form">
                                    {fieldsData.map((field, ind) => (
                                        field.isEditing ? <div key={ind} className="col-md-6 p-remove edit-save-wrap">
                                          <TranslationFormFields
                                              fieldsData={field}
                                              handleChange={event => this.handleValueChange(key, ind, index, event.target.value)}
                                              onEditorValueChange={value => this.handleValueChange(key, ind, index, value)}
                                              handleMultiSelect={(event, id, name, value) => this.handleValueChange(key, ind, index, value)}
                                              handleCheckBox={(event, value) => this.handleValueChange(key, ind, index, value)}
                                              onBlur={this.autoSave}
                                              error={error}
                                              setSelectDataArr={value => this.setSelectDataArr(key, index, value)}
                                              isLocked={isLocked}
                                              language={language}
                                          />
                                        </div>:
                                        <div key={ind} className="col-md-6 p-remove edit-save-wrap">
                                          {this.renderTranslationView(key, index, fieldsData, selectedLangData, 'renderView3')}
                                        </div>
                                    ))}
                                </div> : 
                                (<TranslationFormFields
                                  fieldsData={fieldsData}
                                  handleChange={event => this.handleValueChange(key, null, index, event.target.value)}
                                  onEditorValueChange={value => this.handleValueChange(key, null, index, value)}
                                  handleMultiSelect={(event, id, name, value) => this.handleValueChange(key, null, index, value)}
                                  handleCheckBox={(event, value) => this.handleValueChange(key, null, index, value)}
                                  onBlur={this.autoSave}
                                  error={error}
                                  setSelectDataArr={value => this.setSelectDataArr(key, index, value)}
                                  isLocked={isLocked}
                                  language={language}
                              />)
                              }
                            </> :
                              this.renderTranslationView(key, index, fieldsData, selectedLangData, 'renderView2')
                            }
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
        </Locked>
        <CommonModel className='popup-wrap status-popup' state={showModel}
            showTitle={true} title={constantText.unlock_title_text}
            showIcon={true} icon={<LockIcon />}
            showDes={true} des={`${constantText.section_lock_with} ${lockedBy}, ${constantText.confirm_still_change}`}
            showBtn1={true} btn1Text={constantText.yes_text} btn1Action={() => this.lockUnlockTranslation(true, true)}
            showBtn2={true} btn2Text={constantText.no_text} btn2Action={this.toggleModel}
            handleClose={this.toggleModel}
          />
      </Fragment>
    );
  }
}

export default TranslationTvshow;
