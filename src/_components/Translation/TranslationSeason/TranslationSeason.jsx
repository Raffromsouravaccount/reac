import React, { Component, Fragment } from "react";
import Config from "../../../Config/config";
import { constantText } from "../../../_helpers/constants.text";
import TranslationView from "../Layout/TranslationView";
import SeasonContentPropertiesJson from "../Schema/Season/ContentProperties.json";
import SeasonGlobalContentPropertiesJson from "../Schema/Season/GlobalContentProperties.json";
import SeasonCastNCrewJson from "../Schema/Season/CastNCrew.json";
import SeasonTemplateJson from "../Schema/Season/Template.json";
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
import LeftTab from '../../Common/LeftTab/CommonLeftTab';

class TranslationSeason extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: this.props.params,
      showNavToAssignedLang: this.props.showNavToAssignedLang,
      language: this.props.language,
      sections: constantText.translations.season_sections,
      globalSections: constantText.translations.season_global_sections,
      templateSections: constantText.translations.season_template_sections,
      selectedSecTab: 0,
      selectedGlobalSecTab: 0,
      selectedTemplateSecTab: 0,
      fields: JSON.parse(JSON.stringify(SeasonContentPropertiesJson)),
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
      templateMasterData: [],
      templateTypeId: '',
      isDoneParent: false,
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
    const { params, sections, selectedSecTab, language, fields, globalSections, selectedGlobalSecTab, masterData, templateTypeId, templateSections, selectedTemplateSecTab } = this.state;
    const section = sections[selectedSecTab];
    const globalSection = globalSections[selectedGlobalSecTab];
    const templateSection = templateSections[selectedTemplateSecTab];
    let response, masterDataResponse = [];
    if(isDefaultData && section.url == "castAndCrew" && masterData?.length === 0) {
      const res = await translationService.getContentType();
      masterDataResponse = res && res?.data;
    }
    const lng = isDefaultData ? String(Config.defaultLanguageCode) : String(language?.code);
    if(section.url === "properties" && globalSection.url === "globalFields") {
      response = await translationService.getShowDetails('season', params?.seasonId, lng, globalSection.url);
    } else if(section.url === "template") {
      const templateTypeId = await this.getTemplateTypeId(templateSection.url);
      response = await translationService.getShowDetails('template', params?.seasonId, lng, sections[selectedSecTab].url, templateTypeId);
    } else {
      response = await translationService.getShowDetails('season', params?.seasonId, lng, sections[selectedSecTab].url);
    }
    if (response && response.data) {
      let respData;
      if(section.url == "properties") {
        respData = response.data[0];
      } else if (section.url == "template") {
        respData = response.data;
      } else if (section.url == "castAndCrew") {
        respData = await translationService.mapCastAndCrewValues(response.data, fields, masterDataResponse);
      }
      isDefaultData 
        ? this.setState({ defaultData: respData, masterData: masterDataResponse}) 
        : this.updateValues(response.data);
    } else if (isDefaultData && Object.keys(this.state.defaultData).length) {
      this.setState({ defaultData: {} });
    } else {
      const { defaultData} = this.state;
      let fields;
      /**
       * condition for clear data if already exists
       */
      section.url == "properties" ? fields = JSON.parse(JSON.stringify(SeasonContentPropertiesJson)) : "";
      section.url == "castAndCrew" ? fields = JSON.parse(JSON.stringify(SeasonCastNCrewJson)) : "";

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
      if(section.url == "castAndCrew" || (section.url == "properties" && globalSection.url == "globalFields") || section.url == "template") {
        const res = await this.getPropertiesData();
        if(res && res.data) {
          transStatus = res.data[0]?.translationStatus || transStatus;
          this.getSeasonStatus();
        }
      }
      if(section.url == "properties" && globalSection.url == "globalFields") {
        fields = JSON.parse(JSON.stringify(SeasonGlobalContentPropertiesJson));
        if (Object.keys(defaultData).length === 0) {
          fields.title_summary = fields?.title_summary.map(field => {
            field["isDisabled"] = true;
            field["isEditDisabled"] = true;
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
          let p = true;
          field.map(el => {
            let canUpdate = el.isEditDisabled;
            if((el.hasOwnProperty('id') && el.id) || el.name === "character") {
              el.isEditing = false;
            } 
            if (el.value !== '' && (el.name === "actor" || el.name === "character") && !canUpdate) {
              el.isEditDisabled = false;
              p = false;
            } else if (el.value == '' && el.name === "character" && !canUpdate) {
              el.isEditDisabled = p;
            }
            canUpdate ? el.isEditDisabled = canUpdate : '';
            return el;
          })
          fields.actors.push(field);
        });
      }
    } else if (sections[selectedSecTab].url === 'properties' && globalSection.url === 'globalFields') {
        const response = await this.getPropertiesData();
        if(response && response.data) {
          dataObj = response.data;
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
    } else if (sections[selectedSecTab].url === 'template') {
      const response = await this.getPropertiesData();
      if(response && response.data) {
        dataObj = response.data[0];
      }
      const templateDataObj = resData;
      fields.title_summary = this.updateTemplatePropertiesValue(fields.title_summary, templateDataObj);
    }
    const selectedLangData = sections[selectedSecTab].url === 'castAndCrew' ? mappedDataObj : dataObj;
    this.getSeasonStatus();
    this.setState({ fields: JSON.parse(JSON.stringify(fields)), selectedLangData, isUpdating: true, translationStatus: dataObj && dataObj?.translationStatus || "0", isDoneParent: (dataObj && dataObj?.isDone?.isDone || false)});
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
    const {translationStatus, isDoneParent} = this.state;
    let markDone;
    if(translationStatus === "0") {
      markDone = 1;
    } else if (translationStatus === "1"  || translationStatus === "2") {
      markDone = 2;
    }
    if((translationStatus === "1"  || translationStatus === "2") && isDoneParent) {
      markDone = 3;
    }
    return markDone;
  }

  updatePropertiesValue = (stateArr, updatedObj) => {
    const { globalSections, selectedGlobalSecTab, sections, selectedSecTab } = this.state;
    const globalSection = globalSections[selectedGlobalSecTab];
    let updatedData = stateArr?.map((data) => {
      const name = updatedObj[data["name"]];
      const val = Array.isArray(name) ? name : name?.value;
      const inherit = Array.isArray(name) ? true : name?.inherited;
      const canUpdate = Array.isArray(name) ? false : !name?.canUpdate;
      const dataObj = {
        ...data,
        value: val || "",
        errorMsg: '',
        isEditing: false,
        inherited: inherit ?? true,
        isEditDisabled: canUpdate,
        ...(globalSection.url === 'globalFields' && {gId: updatedObj["id"] || ""}),
      };
      return dataObj;
    });
    return updatedData;
  };

  updateTemplatePropertiesValue = (stateArr, updatedObj) => {
    let updatedData = stateArr?.map((data) => {
      const dataObj = {
        ...data,
        value: updatedObj[data["name"]] || "",
        isDisabled: false
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
      'season', params.seasonId, String(language?.code), 'properties'
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
      this.lockSections(params?.seasonId);
    });
  }

  lockSections = async (seasonId) => {
    const { sections, selectedSecTab, language, fields } = this.state;
    const section = sections[selectedSecTab];
    const paramsData = {  
      seasonId : seasonId,
      isLocked: true,
      sectionName: `${String(language?.code)}_properties`
    };
    const response= await this.markAsDoneNLockedAction(paramsData);
    response && console.log('Lock is updated!');
  }

  autoSave = async (isDoneMark, ...saveParams) => {
    const { isLocked, sections, selectedSecTab, globalSections, selectedGlobalSecTab, language, params, fields, isUpdating, updatedFields, globalFieldEditIndex, templateTypeId } = this.state;
    const section = sections[selectedSecTab];
    const globalSection = globalSections[selectedGlobalSecTab];
    const { error, formattedData } = (section.url === 'properties' && globalSection.url === 'globalFields') ? translationService.formatAllData(globalSection.url, fields, false) : translationService.formatAllData(section.url, fields, false);
    let data = {};
    const updatedDataSet = saveParams && saveParams[3];
    if(section.url === 'properties' && globalSection.url === 'titleSummary' && updatedDataSet) {
      const d = formattedData[updatedDataSet['name']];
      const c = updatedDataSet['name'];
      data = c ? { [c]: d } : {}
    } else if (section.url === 'properties' && globalSection.url === 'globalFields' && updatedDataSet) {
      const s = globalFieldEditIndex?.slice(-1);
      const fData = formattedData?.filter((el,index) => {
        if(index == s) {
          return el;
        }
      })[0];
      const d = fData[updatedDataSet['name']];
      const c = updatedDataSet['name'];
      data = c ? { [c]: d, ...(!!fData?.id && {"id": fData?.id}), ...((s > 0 && fData?.id === "") && {"sequenceNumber": s})} : {}
    } else if (section.url === 'template') {
      const d = formattedData[updatedFields['name']];
      const c = updatedFields['name'];
      data = c ? { [c]: d, 'subTypeId': templateTypeId } : {}
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
    url = section.url !== 'template' ? `${Config.season[initialUrl]}/${params.seasonId}?langCode=${String(language?.code)}` : `${Config.templateTranslation}/${params.seasonId}?langCode=${String(language?.code)}`;
    this.updation = true;
    if (!isLocked && Object.keys(paramsData).length) {
      let response = await apiCalls(url, method, paramsData, null, false, false, this.autoSaveError);
      if (response && this.updation) {
        const transStatus = response?.translationStatus;
        if(saveParams.length) {
          const stepName = saveParams[0];
          const rootIndex = saveParams[1];
          const index = saveParams[2];
          const shallowArr = saveParams && fields[stepName];
          if(typeof index == 'number' && index >= 0) {
            const actorData = response?.['actorCharacter'];
            const name = shallowArr[rootIndex][index]?.name;
            const value = actorData[rootIndex][name];
            const inherited = actorData[rootIndex]?.inherited;
            shallowArr[rootIndex][index] = { ...shallowArr[rootIndex][index], value, inherited };
            index !== 0 ? shallowArr[rootIndex][0] = { ...shallowArr[rootIndex][0], inherited } : '';
          } else {
            const rFields = response?.[updatedDataSet['name']];
            const value = rFields?.value;
            const inherited = rFields?.inherited;
            shallowArr[rootIndex] = { ...shallowArr[rootIndex], value, inherited };
          }
          fields[stepName] = shallowArr;
          this.setState({ fields, translationStatus: transStatus });
        } else {
          transStatus && this.setState({translationStatus: transStatus});
        }
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
      seasonId : params?.seasonId,
      isDone: true,
      sectionName: `${String(language?.code)}_properties`
    };
    const res = await this.markAsDoneNLockedAction(paramsData);
    if (res) { 
      this.setState({ markAsDone: 3 }, () => { this.props.updateMarkAsDoneAction(true)});
    }
  }

  markAsDoneNLockedAction= async data=> {
    const response= await apiCalls(Config.season?.action, "POST", data);
    return response;
  }

  autoSaveError= error=> {
    if(error?.data?.message== constantText.locked_by_another_text) {
      showSuccessErrorMsg(error?.data?.message, null, "Alert", true, null, null, this.getSeasonStatus);
    }
  }

  getSeasonStatus= async()=> {
    let { params, sections, selectedSecTab, language }= this.state;
    const section = sections[selectedSecTab];
    const sName = `${String(language?.code)}_properties`;
    const { userID } = getLocalData("userData");
    const response= await apiCalls(`${Config.season?.action}/${params?.seasonId}`, "GET", null, null, false);
    if(response && response.length> 0) {
      let locked, lockBy, markDone, validateCounter = 1;
      response?.map(data=> {
        const {sectionName, isDone, isLocked, lockedByUser } = data;
        const {id, firstName, lastName}= lockedByUser || {};
        if(sName === sectionName) {
          locked = (isLocked && (id!= userID))? true: false;
          lockBy = isLocked? `${firstName} ${lastName}`: "";
          markDone = isDone ? 3 : this.validateMarkAsDoneShowAction();
          validateCounter = 0;
        }
        if(validateCounter) {
          markDone = this.validateMarkAsDoneShowAction();
        }
      });
      this.setState(prevState=> ({isLocked: locked, lockedBy: lockBy, markAsDone: markDone}));
    } else {
      this.checkIfMarkAsDone();
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
  handleSubSecTab = (event, selectedSubSecTab) => {
    const {sections, selectedSecTab} = this.state;
    const section = sections[selectedSecTab];
    if(section.url === 'properties' && selectedSubSecTab != this.state.selectedGlobalSecTab) {
      this.commonTabHandler(selectedSubSecTab, 1);
    } else if (selectedSubSecTab != this.state.selectedTemplateSecTab) {
      this.commonTabHandler(selectedSubSecTab, 2);
    }
  }

  commonTabHandler = (selectedTab, tabIndex) => {
    const {sections, globalSections, selectedSecTab, selectedGlobalSecTab} = this.state;
    const section = sections[tabIndex === 0 ? selectedTab : selectedSecTab];
    const globalSection = globalSections[tabIndex === 1 ? selectedTab : selectedGlobalSecTab];
    let fields = {};
    section.url == "properties" && globalSection.url == "titleSummary" ? fields = JSON.parse(JSON.stringify(SeasonContentPropertiesJson)) : "";
    section.url == "castAndCrew" ? fields = JSON.parse(JSON.stringify(SeasonCastNCrewJson)) : "";
    section.url == "properties" && globalSection.url == "globalFields" ? fields = JSON.parse(JSON.stringify(SeasonGlobalContentPropertiesJson)) : "";
    section.url == "template" && selectedTab != this.state.selectedTemplateSecTab ? fields = JSON.parse(JSON.stringify(SeasonTemplateJson)) : "";
    this.setState({ 
      ...(tabIndex === 0 && {selectedSecTab: selectedTab}), 
      ...(tabIndex === 1 && {selectedGlobalSecTab: selectedTab}),
      ...(tabIndex === 2 && {selectedTemplateSecTab: selectedTab}),
      fields, selectedLangData: {} }, async () => {
      await this.fetchContentData(true);
      await this.fetchContentData();
    });
  }

  getTemplateTypeId = async (templateSection) => {
    const {templateMasterData, templateSections, selectedTemplateSecTab} = this.state;
    let tempData = templateMasterData, tempSections = [...templateSections];
    if(templateMasterData.length === 0) {
      tempSections = [];
      const res = await translationService.getContentType('EpisodeSubType');
      tempData = res && res?.data;
      tempData.map(t => {
        if (t.isApplicableForTemplate == 1) {
          const tabItem = {};
          tabItem["label"] = t['title'];
          tabItem["url"] = t['title']?.toLowerCase()?.split(' ').join('');
          tempSections.push(tabItem);
        }
      });
    }
    const sectionUrl = selectedTemplateSecTab === 0 ? tempSections.length && tempSections[0]?.url : templateSection;
    const tempId = tempData.length && tempData.filter(tData => tData.title?.toLowerCase()?.split(' ').join('') == sectionUrl)[0]?.id;
    this.setState({templateMasterData: tempData, templateTypeId: tempId, templateSections: tempSections});
    return tempId;
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
            <div key={i} className={`col-md-6 ${(renderView === 'actorsRender' && field?.name === 'character') ? 'd-none' : '' }`}>
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
    const c = cArr.length && cArr.map((ct) => ct?.title);
    return translationService.arrayToStringView(c);
  }

  editButtonHandler = (key, rootIndex, index, fieldsData) => {
    this.actionButtonsHandler(key, rootIndex, index, fieldsData, 'edit', true);
  }

  saveButtonHandler = (key, rootIndex, index, fieldsData) => {
    this.autoSave(1, key, rootIndex, index, fieldsData);
    this.actionButtonsHandler(key, rootIndex, index, fieldsData, 'save', false);
  }

  actionButtonsHandler = (key, rootIndex, index, fieldsData, action, edit) => {
    let fields = this.state.fields;
    let specialField;
    if(typeof index == 'number' && index >= 0 && (fields[key][rootIndex][index].name === fieldsData[index].name)) {
        specialField = [...fields[key][rootIndex]];
        (action === 'save' || action === 'edit') 
          ? specialField[index]['initialValue'] = specialField[index].value
          : specialField[index].value = specialField[index]['initialValue'], specialField[index].errorMsg = '';
        specialField[index].isEditing = edit;
        specialField[index]["isEdit"] = edit;
    } else if(fields[key][rootIndex].name === fieldsData.name) {
        specialField = {...fields[key][rootIndex]};
        (action === 'save' || action === 'edit')
          ? specialField['initialValue'] = specialField.value
          : specialField.value = specialField['initialValue'], specialField.errorMsg = '';
        specialField.isEditing = edit;
        specialField["isEdit"] = edit;
    }
    fields[key][rootIndex] = specialField;
    this.setState({fields});
  }

  cancelButtonHandler = (key, rootIndex, index, fieldsData) => {
    this.actionButtonsHandler(key, rootIndex, index, fieldsData, 'cancel', false);
  }

  render() {
    const { permissionAddEdit, permissionViewOnly } = this.props;
    let {
      sections,
      globalSections,
      templateSections,
      selectedSecTab,
      selectedGlobalSecTab,
      selectedTemplateSecTab,
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
              <LeftTab className="tabs" orientation="horizontal" variant="scrollable"  options={globalSections} selectedTab={selectedGlobalSecTab} showIcon={false} handleChange={this.handleSubSecTab} />
            </div> } */}
            {sections[selectedSecTab].url === 'template' && <div className="trans-sub-tab tab-list">
              <LeftTab className="tabs" orientation="horizontal" variant="scrollable"  options={templateSections} selectedTab={selectedTemplateSecTab} showIcon={false} handleChange={this.handleSubSecTab} />
            </div> }
            <div className="lang-f-wrap">
              {Object.keys(fields)?.map((key, levelIndex) => (
                <Fragment key={key}>
                  {(key === "actors" || key === "others") && this.renderGlobalTextField(key)}
                  {((sections[selectedSecTab].url === 'properties' && globalSections[selectedGlobalSecTab].url === 'globalFields')) &&
                    <div className="col-12 lang-global-text">
                      <h4>
                        <span>{constantText.translations.group_country_text}</span> - 
                        {this.state.countryGroupList.length > 0 ? this.renderCountryGroupList(levelIndex) : constantText.translations.no_group_country_selected_text}
                      </h4>
                    </div>}
                  {((sections[selectedSecTab].url === 'template' && Object.keys(this.state.defaultData).length === 0 && key === 'title_summary')) &&
                    <div className="col-12 lang-global-text">
                      <h4>{constantText.translations.no_template_data_text}</h4>
                    </div>}
                  <div className="col-12">
                    <div className="row form-f-row">
                      {fields[key].map((fieldsData, index) => (
                        <Fragment key={index}>
                          <div className="col-md-6 col-lg-6 col-xl-5">
                            {this.renderTranslationView(key, index, fieldsData, defaultData, 'objDataRender')}
                          </div>
                          <div className={`col-md-6 col-lg-6 col-xl-7 tr-before-edit-wrap tr-after-edit-wrap ${!showNavToAssignedLang ? 'masterDataExist' : ''} ${fieldsData.hasOwnProperty('inherited') && (!fieldsData.inherited ? 'inheritedTranslation' : '') || ''}`}>
                            {!showNavToAssignedLang && permissionAddEdit && (fieldsData?.isEditing || Array.isArray(fieldsData)) ? <>
                              {fieldsData && Array.isArray(fieldsData) ?
                                <div className="row actor-info-form">
                                    {fieldsData.map((field, ind) => (
                                        field.isEditing ? <div key={ind} className={`col-md-6 p-remove edit-save-wrap ${ind === 0 && field.hasOwnProperty('inherited') && (!field.inherited ? 'inheritedTranslation' : '') || ''}`}>
                                          <TranslationFormFields
                                              fieldsData={field}
                                              handleChange={event => this.handleValueChange(key, ind, index, event.target.value)}
                                              onEditorValueChange={value => this.handleValueChange(key, ind, index, value)}
                                              handleMultiSelect={(event, id, name, value) => this.handleValueChange(key, ind, index, value)}
                                              handleCheckBox={(event, value) => this.handleValueChange(key, ind, index, value)}
                                              onBlur={sections[selectedSecTab].url === 'template' ? this.autoSave : () => {}}
                                              error={error}
                                              setSelectDataArr={value => this.setSelectDataArr(key, index, value)}
                                              isLocked={isLocked}
                                              language={language}
                                          />
                                          {field?.isEdit && <>
                                            <span onClick = {() => this.cancelButtonHandler(key, index, ind, fieldsData)} className="editSaveButton f-save f-cancel">Cancel</span>
                                            <span onClick = {() => this.saveButtonHandler(key, index, ind, fieldsData)} className={`editSaveButton ${!!field?.errorMsg ? 'disabled': ''}`}>Save</span> 
                                            </>
                                          }
                                        </div>:
                                        <div key={ind} className={`col-md-6 p-remove edit-save-wrap ${ind === 0 && field.hasOwnProperty('inherited') && (!field.inherited ? 'inheritedTranslation' : '') || ''}`}>
                                          {this.renderTranslationView(key, index, field, selectedLangData, 'actorsRender')}
                                          {!field?.id && !field?.isEditDisabled && <span className={`editSaveButton ${isLocked ? 'disabled': ''}`} onClick = {() => this.editButtonHandler(key, index, ind, fieldsData)} >Edit</span>}
                                          {!field?.id && field?.isEditDisabled && <span className={`editSaveButton ${isLocked ? 'disabled': 'edit-info-icon tooltip-sec'}`}>Edit
                                            <i className="tooltip-box">{constantText.translations.no_translation_available_text}</i>
                                          </span>}
                                        </div>
                                    ))}
                                </div> : 
                                (<TranslationFormFields
                                  fieldsData={fieldsData}
                                  handleChange={event => this.handleValueChange(key, null, index, event.target.value)}
                                  onEditorValueChange={value => this.handleValueChange(key, null, index, value)}
                                  handleMultiSelect={(event, id, name, value) => this.handleValueChange(key, null, index, value)}
                                  handleCheckBox={(event, value) => this.handleValueChange(key, null, index, value)}
                                  onBlur={sections[selectedSecTab].url === 'template' ? this.autoSave : () => {}}
                                  error={error}
                                  setSelectDataArr={value => this.setSelectDataArr(key, index, value)}
                                  isLocked={isLocked}
                                  language={language}
                              />)
                              }
                              {fieldsData?.isEdit && fieldsData?.type != 'dropDown' && <>
                                  <span onClick = {() => this.cancelButtonHandler(key, index, null, fieldsData)} className="editSaveButton f-save f-cancel">Cancel</span>
                                  <span onClick = {() => this.saveButtonHandler(key, index, null, fieldsData)} className={`editSaveButton f-save ${!!fieldsData?.errorMsg ? 'disabled': ''}`}>Save</span>
                                </>
                              }
                            </> :<>
                              {this.renderTranslationView(key, index, fieldsData, selectedLangData, 'objDataRender')}
                              {!showNavToAssignedLang && fieldsData?.type != 'dropDown' && !fieldsData?.isEditDisabled &&
                                <span className={`editSaveButton ${isLocked ? 'disabled': ''}`} onClick = {() => this.editButtonHandler(key, index, null, fieldsData)}>Edit</span>
                              }
                              {!showNavToAssignedLang && fieldsData?.type != 'dropDown' && fieldsData?.isEditDisabled &&
                              <span className={`editSaveButton ${isLocked ? 'disabled': 'edit-info-icon tooltip-sec'}`} >Edit
                                <i className="tooltip-box">{constantText.translations.no_translation_available_text}</i>
                              </span>
                              }
                              </>
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

export default TranslationSeason;
