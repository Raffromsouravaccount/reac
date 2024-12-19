import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import Config from "../../../Config/config";

import { constantText } from "../../../_helpers/constants.text";

import TranslationView from "../Layout/TranslationView";

import VideoContentPropertiesJson from "../Schema/Video/ContentProperties.json";
import VideoCastNCrewJson from "../Schema/Video/CastNCrew.json";
import { translationService } from "../../../_services/translation.service";
import {
  alphanumericValidate,
  characterValidateAllLang,
  maxLength,
  numberValidate,
} from "../../../_helpers/validation";
import { apiCalls } from "../../../_services/common.service";
import TranslationInfo from "../Layout/TranslationInfo";
import { getLocalData, setLocalData } from "../../../_helpers/util";
import Locked from "../../Common/Locked/Locked";
import LockIcon from 'images/lock-icon.svg';
import { CommonModel } from '../../Common/Model/CommonModel';
import TranslationFormFields from '../Layout/TranslationFormFields';
import { showSuccessErrorMsg } from '../../../_actions/alertMessages.action';

class TranslationVideo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      masterData: [],
      params: this.props.params,
      showNavToAssignedLang: this.props.showNavToAssignedLang,
      language: this.props.language,
      sections: constantText.translations.video_sections,
      selectedSecTab: 0,
      fields: JSON.parse(JSON.stringify(VideoContentPropertiesJson)),
      defaultData: {}, // default language content
      selectedLangData: {}, // selected lang
      error: false,
      masterDataa: {},
      isUpdating: false,
      isLocked:false,
      lockedBy:"",
      showModel:false,
      markAsDone: 1,  // 1 for disable markAsDone, 2 for enable markAsDone, 3 for mark as done true
      updatedFields: {},
      translationStatus: 0,
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

  fetchContentData = async (isDefaultData = false) => {
    const { params, sections, selectedSecTab, language, fields, masterData } = this.state;

    const response = await translationService.getVideoDetails(params.videoId, isDefaultData ? String(Config.defaultLanguageCode) : String(language?.code), sections[selectedSecTab].url);
    
    const section = sections[selectedSecTab];
    let masterDataResponse = [];
    if(section.url == "castAndCrew" && masterData?.length === 0) {
      const res = await translationService.getContentType();
      masterDataResponse = res && res?.data;
    }
    if (response && response.data) {
      isDefaultData ? this.setState({ defaultData: section.url == "properties" ? response.data[0] : await translationService.mapCastAndCrewValues(response.data, fields, masterDataResponse), masterData: masterDataResponse}) : this.updateValues(response.data);
    } else if (isDefaultData && Object.keys(this.state.defaultData).length) {
      this.setState({ defaultData: {} });
    } else {
      const { defaultData} = this.state;
      let fields;

      /**
       * condition for clear data if already exists
       */
      section.url == "properties" ? fields = JSON.parse(JSON.stringify(VideoContentPropertiesJson)) : "";
      section.url == "castAndCrew" ? fields = JSON.parse(JSON.stringify(VideoCastNCrewJson)) : "";

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
      if(section.url == "castAndCrew") {
        const res = await this.getPropertiesData();
        if(res && res.data) {
          transStatus = res.data[0]?.translationStatus || transStatus;
          this.getVideoStatus();
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
    const { userID } = getLocalData("userData");
    if (!resData) {
      return;
    }
    let dataObj, mappedDataObj;
    const { sections, selectedSecTab, masterData, params} = this.state;
    let fields = this.state.fields;
    if (sections[selectedSecTab].url === 'properties') {
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
      if (mappedDataObj && mappedDataObj.actors && mappedDataObj.actors.length) {
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
    }
    const selectedLangData = sections[selectedSecTab].url === 'properties' ? dataObj : mappedDataObj;
    this.getVideoStatus();
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

  validateMarkAsDoneVideoAction = () => {
    const {translationStatus} = this.state;
    let markDone;
    if(translationStatus === "0") {
      markDone = 1;
    } else if (translationStatus === "1" || translationStatus === "2") {
      markDone = 2;
    }
    return markDone;
  }

  updatePropertiesValue = (stateArr, updatedObj) => {
    let updatedData = stateArr?.map((data) => {
      const dataObj = {
        ...data,
        value: updatedObj[data["name"]] || "",
        errorMsg: '',
      };

      return dataObj;
    });
    return updatedData;
  };

  manageCondition = (stepName, name, value) => {
    if (name == "Primary Gener" || name == "Secondary Genre") {
      let updatedKey =
        name == "Primary Gener" ? "Secondary Genre" : "Primary Gener";
      stepName.map((obj) =>
        obj.label == updatedKey
          ? (obj["data"] = obj["data"]?.filter(
            (dataVal) => !value.includes(dataVal) && dataVal
          ))
          : obj
      );
    } else if (name == "Dubbed Language Title") {
      stepName.map((obj) =>
        obj.label == "Original Language"
          ? value.length > 0
            ? (obj.required = true)
            : (obj.required = false)
          : obj
      );
    }
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
    let fields = JSON.parse(JSON.stringify(this.state.fields));
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
      this.manageCondition(fields[stepName], shallowArr[rootIndex]["label"], value);
    }

    fields[stepName] = shallowArr;
    this.setState({ fields, ...(!index && {updatedFields: shallowArr[rootIndex]}) }, () => {
      if (shallowArr[rootIndex]["type"] == "dropDown") {
        this.autoSave();
      }
    });
  };

  getPropertiesData = async () => {
    const { language, params} = this.state;
    const response = await translationService.getVideoDetails(
      params.videoId, String(language?.code), 'properties'
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
      this.lockSections(params?.videoId);
    });
  }

  lockSections = async (videoId) => {
    const { sections, selectedSecTab, language, fields } = this.state;
    const section = sections[selectedSecTab];
    const paramsData = {  
      videoId : videoId,
      isLocked: true,
      sectionName: `${String(language?.code)}_properties`
    };
    await this.markAsDoneNLockedAction(paramsData);
  }

  /**
   * Function for save data.
   * Called on value change and blur
   * Based on selected section generates api url
   */
  autoSave = async (isDoneMark) => {
    const { isLocked, sections, selectedSecTab, language, params, fields, isUpdating, updatedFields } = this.state;
    const section = sections[selectedSecTab];
    const { error, formattedData } = translationService.formatAllData(section.url, fields, false);
    let data;
    if(section.url === 'properties') {
      const d = formattedData[updatedFields['name']];
      const c = updatedFields['name'];
      data = c ? { [c]: d } : {}
    } else {
      let actorCharacter = [...formattedData.actors]
      data = { actorCharacter }
    }
    if (error) {
      console.log("Error in auto save");
      return false;
    }

    let url = "",
      method = "PUT",
      paramsData = {};
      paramsData = data;
      url = `${Config.video.translation}/${params.videoId}?langCode=${String(language?.code)}`;

    if (!isLocked && Object.keys(paramsData).length) {
      let response = await apiCalls(url, method, paramsData, null, false, false, this.autoSaveError);
      if (response) {
        const transStatus = response?.translationStatus;
        transStatus && this.setState({translationStatus: transStatus});
        isDoneMark === 3 ? '' : this.checkIfMarkAsDone();
        this.props.updateMarkAsDoneAction(isDoneMark === 3);
      }
    }
  };

  checkIfMarkAsDone() {
    const { fields, selectedSecTab } = this.state;
    this.setState({ markAsDone: this.validateMarkAsDone(fields) });
  }

  handleMarkAsDone = async (selectedTab) => {
    const {sections, selectedSecTab, params, language} = this.state;
    const section = sections[selectedSecTab];
    const paramsData = {  
      videoId : params?.videoId,
      isDone: true,
      sectionName: `${String(language?.code)}_properties`
    };
    const res = await this.markAsDoneNLockedAction(paramsData);
    if (res) { 
      this.setState({ markAsDone: 3 }, () => { this.props.updateMarkAsDoneAction(true)});
    }
  }

  markAsDoneNLockedAction= async data=> {
    const response= await apiCalls(Config.video.action, "POST", data);
    return response;
  }

  autoSaveError= error=> {
    if(error?.data?.message== constantText.locked_by_another_text) {
      showSuccessErrorMsg(error?.data?.message, null, "Alert", true, null, null, this.getVideoStatus);
    }
  }

  getVideoStatus= async()=> {
    let { params, sections, selectedSecTab, language }= this.state;
    const section = sections[selectedSecTab];
    const sName = `${String(language?.code)}_properties`;
    const { userID } = getLocalData("userData");
    const response= await apiCalls(`${Config.video.action}/${params?.videoId}`, "GET", null, null, false);
    if(response && response.length> 0) {
      let locked, lockBy, markDone;
      response?.map(data=> {
        const {sectionName, isDone, isLocked, lockedByUser } = data;
        const {id, firstName, lastName}= lockedByUser || {};
        if(sName === sectionName) {
          locked = (isLocked && (id!= userID))? true: false;
          lockBy = isLocked? `${firstName} ${lastName}`: "";
          markDone = isDone ? 3 : this.validateMarkAsDoneVideoAction();
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
      const section = this.state.sections[selectedSecTab];
      let fields = {};
      section.url == "properties" ? fields = JSON.parse(JSON.stringify(VideoContentPropertiesJson)) : "";
      section.url == "castAndCrew" ? fields = JSON.parse(JSON.stringify(VideoCastNCrewJson)) : "";
      this.setState({ selectedSecTab, fields, selectedLangData: {} }, async () => {
        await this.fetchContentData(true);
        await this.fetchContentData();
      });
    }
  };

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

  render() {
    const { permissionAddEdit, permissionViewOnly } = this.props;
    let {
      sections,
      selectedSecTab,
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
            <div className="lang-f-wrap">
              {Object.keys(fields)?.map((key) => (
                <Fragment key={key}>
                  {(key === "actors" || key === "others") && this.renderGlobalTextField(key)}
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

export default TranslationVideo;
