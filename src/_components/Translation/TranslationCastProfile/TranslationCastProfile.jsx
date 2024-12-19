import React, { Component, Fragment } from "react";

import { constantText } from "../../../_helpers/constants.text";

import LockIcon from 'images/lock-icon.svg';

import Locked from "../../Common/Locked/Locked";
import TranslationView from "../Layout/TranslationView";
import TranslationInfo from "../Layout/TranslationInfo";
import { CommonModel } from './../../Common/Model/CommonModel';
import TranslationFormFields from "../Layout/TranslationFormFields";

import CastProfileJson from "../Schema/CastAndCrew/Profile.json";
import Config from "../../../Config/config";
import { getLocalData } from "../../../_helpers/util";
import { apiCalls } from "../../../_services/common.service";
import { translationHelper } from "../../../_helpers/translation";
import { translationService } from "../../../_services/translation.service";
import { showSuccessErrorMsg } from './../../../_actions/alertMessages.action';

class TranslationCastProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            params: this.props.params,
            showNavToAssignedLang: this.props.showNavToAssignedLang,
            language: this.props.language,
            sections: constantText.translations.castProfile_sections,
            selectedSecTab: 0,
            fields: JSON.parse(JSON.stringify(CastProfileJson)),
            masterData: {},
            defaultData: {}, // default language content
            selectedLangData: {}, // selected lang
            error: "",
            isUpdating: false,
            markAsDone: 1,
            lock: {
                openLockModel: false,
                isLocked: false,
                lockedBy: "",
                lockedByEmail: ""
            },
            translationStatus: 0,
            updatedFields: {},
        };
    }

    async componentDidMount() {
        this.fetchContentData(true);
        this.fetchContentData();
    }

    componentWillReceiveProps(nextProps) {
        const { showNavToAssignedLang, language } = nextProps;
        if (String(this.state.language?.code) != String(language?.code)) {
            this.setState({ showNavToAssignedLang, language: language, selectedLangData: {} }, () => {
                this.fetchContentData();
            });
        }
    }

    fetchContentData = async (isDefaultData = false) => {
        const { params, sections, selectedSecTab, language, defaultData } = this.state;
        let languageCode = String(language?.code);
        isDefaultData ? languageCode = String(Config.defaultLanguageCode) : "";
        const listing = sections[selectedSecTab].url;
        const url = `${Config.createProfileUrl}/translation/${params.castId}/${languageCode}`;

        const response = await apiCalls(url, "GET");
        if (response) {
            isDefaultData ? this.setState({ defaultData: this.mapResponseData(response) }) : this.updateValues(response);
        } else if (isDefaultData && Object.keys(this.state.defaultData).length) {
            this.setState({ defaultData: {} });
        } else {
            let fields;
            // condition for clear data if already exists
            const section = sections[selectedSecTab];
            section.url == "profile" ? fields = JSON.parse(JSON.stringify(CastProfileJson)) : "";
            const castRelationship = defaultData?.castRelationship || [];
            if (castRelationship.length) {
                fields = JSON.parse(JSON.stringify(fields));
                let demoObj = JSON.parse(JSON.stringify(fields.relationShip[0]));
                fields.relationShip = [];
                castRelationship.forEach((element, index) => {
                    fields.relationShip.push(demoObj);
                });
            };

            const lock = {
                openLockModel: false,
                isLocked: false,
                lockedBy: "",
                lockedByEmail: ""
            }
            const stateDetails = {
                lock: lock,
                markAsDone: 1,
                isUpdating: false
            }
            // set data if changes available in fields
            fields ? stateDetails['fields'] = fields : "";
            this.setState(stateDetails);
        }
    };

    mapResponseData = (res) => {
        const dataObj = {...res};
        const {fields} = this.state;
        let relationShip = [];
        let demoObj = JSON.parse(JSON.stringify(fields.relationShip[0]));
        Object.keys(dataObj).length && Object.keys(dataObj).map(field => {
            if(field === 'castRelationship' && dataObj[field]) {
                dataObj[field].length && dataObj[field].map(element => {
                    let fieldObj = JSON.parse(JSON.stringify(demoObj));
                    fieldObj = fieldObj.map((item) => {
                      if (element.hasOwnProperty(item.keyText)) {
                        item.value = element[item.keyText];
                      } else {
                        item.value = element[item.name] || '';
                      }
                      return item;
                    });
                    relationShip.push(fieldObj);
                });
                fields['relationShip'] = relationShip;
            }
        });
        return dataObj;
    }

    getMasterDataForSelect = (url) => {
        translationService.getMasterData(url).then(response => {
            if (response) {
                if (url === '/castLists') {
                    response = response.items.map((cast) => {
                        return {
                            castName: cast.contentData.castName || "N/A",
                            castId: cast.castId,
                        };
                    });
                };
                let { masterData } = this.state;
                masterData[url] = response;
                this.setState({ masterData })
            }
        })

    }

    getMasterData = (path) => {
        if (this.state.masterData[path]) {
            return this.state.masterData[path];
        }
        this.getMasterDataForSelect(path);
        return [];
    }

    updateValues = (resData) => {
        const { userID } = getLocalData("userData");
        if (!resData) {
            return;
        }
        const dataObj = resData;
        const { sections, selectedSecTab } = this.state;
        let fields = this.state.fields;
        if (sections[selectedSecTab].url === 'profile') {
            fields.createProfile = translationHelper.updatePropertiesValue(
                fields.createProfile,
                dataObj
            );
            if (dataObj && dataObj.castRelationship && dataObj.castRelationship.length) {
                let demoObj = JSON.parse(JSON.stringify(fields.relationShip[0]));
                fields.relationShip = [];
                dataObj.castRelationship.forEach((element, index) => {
                  let fieldObj = JSON.parse(JSON.stringify(demoObj));
                  fieldObj = fieldObj.map((item) => {
                    if (element.hasOwnProperty(item.keyText)) {
                      item.value = element[item.keyText];
                    }
                    return item;
                  });
                  fields.relationShip.push(fieldObj);
                });
            }
        }
        this.getCastStatus();
        this.setState({
            fields: JSON.parse(JSON.stringify(fields)),
            selectedLangData: resData,
            isUpdating: true,
            translationStatus: dataObj?.translationStatus || 0
        });
    };

    formatAllData = (sectionType, fields, checkRequired) => {
        if (sectionType == 'profile') {
            const relationShip = JSON.parse(JSON.stringify(fields.relationShip));
            let allData = JSON.parse(JSON.stringify(fields.createProfile));
            let dataError = translationHelper.checkError([...allData], checkRequired);
            let formattedData = translationHelper.getFormattedData(allData, true);
            let relationShipError = false;
            let relationShipData = [];
            relationShip.forEach(element => {
                relationShipError ? "" : relationShipError = translationHelper.checkError([...element], checkRequired);
                let formattedData = translationHelper.getFormattedData(element, false);
                if (formattedData.castRelatedTo && formattedData.castRelation) {
                    relationShipData = [...relationShipData, formattedData];
                }
            });
            relationShipData.length ? formattedData['castRelationship'] = [...relationShipData] : "";
            let error = !!dataError || !!relationShipError;
            return { error, formattedData };
        }
        return { error: true, formattedData: {} };
    }

    autoSave = async (isDoneMark) => {
        const { lock, sections, selectedSecTab, language, params, fields, isUpdating, updatedFields } = this.state;
        const section = sections[selectedSecTab];
        const { error, formattedData } = this.formatAllData(section.url, fields, false);

        const d = formattedData[updatedFields['name']];
        const c = updatedFields['name'];
        const data = c ? { [c]: d } : {};

        if (error) {
            return false;
        }

        let method = isUpdating ? "PUT" : "PUT",
            paramsData = {};

        if (section.url === 'profile') {
            paramsData = data;
        }

        if (!lock.isLocked && Object.keys(paramsData).length) {
            const url = `${Config.createProfileUrl}/translation/${params.castId}/${String(language?.code)}`;
            let response = await apiCalls(url, method, paramsData, null, false, false, this.autoSaveError);
            if (response) {
                const transStatus = response?.translationStatus;
                typeof transStatus === "number" && String(transStatus) && this.setState({translationStatus: transStatus});
                isDoneMark === 3 ? '' : this.checkIfMarkAsDone();
                this.props.updateMarkAsDoneAction(isDoneMark === 3);
            }
        }
    };

    checkIfMarkAsDone() {
        const { fields, selectedSecTab } = this.state;
        selectedSecTab === 0 && this.setState({ markAsDone: translationHelper.validateMarkAsDone(fields) });
    }

    handleSecTab = (event, selectedSecTab) => {
        if (selectedSecTab != this.state.selectedSecTab) { }
    };

    handleMarkAsDone = async (selectedTab) => {
        // handle marks as done
        const {params, language} = this.state;
        const paramsData = {
            castProfileId : params?.castId,
            isDone: true,
            lang: String(language?.code),
            sectionName: 'profile'
        };
        const res = await this.markAsDoneNLockedAction(paramsData);
        (res || !!res) && this.setState({markAsDone: 3}, () => { this.props.updateMarkAsDoneAction(true)});
    }

    markAsDoneNLockedAction= async data=> {
        const response= await apiCalls(Config.castActionUrl, "POST", data);
        return response;
    }

    handleValueChange = (stepName, rootIndex, index, value) => {
        let fields = JSON.parse(JSON.stringify(this.state.fields));
        const shallowArr = fields[stepName];
        let errorMsg = null;
        if (typeof index == 'number' && index >= 0) {
            let { text, numeric, maxTextLength } = shallowArr[rootIndex][index];
            errorMsg = translationHelper.validateError(text, numeric, maxTextLength, value);
            shallowArr[rootIndex][index] = { ...shallowArr[rootIndex][index], value, errorMsg };
        } else {
            let { text, numeric, maxTextLength, type } = shallowArr[rootIndex];
            (type === 'texteditor' && value.trim() === "<p><br></p>") ? value = value.replace("<p><br></p>", "") : value;
            errorMsg = translationHelper.validateError(text, numeric, maxTextLength, value);
            shallowArr[rootIndex] = { ...shallowArr[rootIndex], value, errorMsg };
        }
        fields[stepName] = shallowArr;
        this.setState({ fields, updatedFields: shallowArr[rootIndex] }, () => {
            if (shallowArr[rootIndex]["type"] == "dropDown") {
                this.autoSave();
            }
        });
    };

    toggleLockModel = (ev, lock) => {
        const lockObj = JSON.parse(JSON.stringify(this.state.lock));
        if (lock) {
            this.getLock();
        } else {
            lockObj.openLockModel = !lockObj.openLockModel;
            this.setState(prevState => {
                return { lock: lockObj }
            });
        }
    }

    getLock = async () => {
        const {params}=this.state;
        const lockObj = JSON.parse(JSON.stringify(this.state.lock));
        lockObj.isLocked = false;
        lockObj.openLockModel = false;
        this.setState({ lock: lockObj }, () => {
            this.lockSections(params?.castId);
        });
    }

    lockSections = async (castId) => {
        const { language } = this.state;
        const paramsData = {  
            castProfileId: castId,
            isLocked: true,
            lang: String(language?.code),
            sectionName: 'profile'
        };
        const response= await this.markAsDoneNLockedAction(paramsData);
        response && console.log('Lock is updated!');
    }

    autoSaveError= error=> {
        if(error?.data?.message== constantText.locked_by_another_text) {
          showSuccessErrorMsg(error?.data?.message, null, "Alert", true, null, null, this.getCastStatus);
        }
    }

    getCastStatus= async()=> {
        let { params, lock, sections, selectedSecTab, language, fields }= this.state;
        const section = sections[selectedSecTab];
        const sName = `${String(language?.code)}_${section.url}`;
        const { userID } = getLocalData("userData");
        const response= await apiCalls(`${Config.castActionUrl}/${params?.castId}`, "GET", null, null, false);
        if(response && response.length> 0) {
          let shallowArr= {...lock}, markDone;
          response?.map(data=> {
            const {sectionName, isDone, isLocked, lockedByUser } = data;
            const {id, firstName, lastName}= lockedByUser || {};
            if(sName === sectionName) {
                shallowArr = {...shallowArr,
                    isLocked: (isLocked && (id!= userID))? true: false,
                    lockedBy: isLocked? `${firstName} ${lastName}`: ""
                };
                markDone = isDone ? 3 : translationHelper.validateMarkAsDone(fields);
            }
          });
          this.setState(prevState=> ({lock: shallowArr, markAsDone: markDone}));
        }
    }

    setSelectDataArr = (key, rootIndex, index, data) => {
        let fields = this.state.fields;
        let shallowArr = [...fields[key]];
        if(key === 'relationShip') {
            shallowArr[rootIndex][index] = { ...shallowArr[rootIndex][index], data: data || [] };
        } else {
            shallowArr[rootIndex] = { ...shallowArr[rootIndex], data: data || [] };
        }
        fields[key] = shallowArr;
        this.setState((prevState) => ({ fields }));
    }

    getTranslationViewValue = (key, rootIndex, field, contentData, renderView) => {
        if(renderView === 'renderView1' || renderView === 'renderView2') { 
            if(Array.isArray(contentData[field.name] || contentData[field.name + 'Names'])) {
                return translationService.arrayToStringView(contentData[field.name + 'Names'], field.keyText) 
            }
        } 
        if(key === 'relationShip') {
            let value = "";
            const relationObj = Object.keys(contentData).length && contentData.hasOwnProperty('castRelationship') &&  contentData?.castRelationship && contentData?.castRelationship[rootIndex];
            if (field.keyText) {
                value = relationObj && relationObj[field.keyText] || "";
            }
            return value;
        }
        return contentData[field.name] || '' 
    }

    renderTranslationView = (key, rootIndex, index, field, contentData = {}, checkRelationShip, renderView) => {
        if (key === 'relationShip' && !checkRelationShip) {
            return (
                <div className="row actor-info m-minus-30">
                    {field.map((rField, rIndex) => (
                        <div key={rIndex} className="col-md-6">
                            {this.renderTranslationView(key, rootIndex, rIndex, rField, contentData, true, renderView)}
                        </div>
                    ))}
                </div>
            )
        }
        return (
            <TranslationView
                labelAndValue={{ 
                    label: field.label, 
                    value: this.getTranslationViewValue(key, rootIndex, field, contentData, renderView)}}
            />
        )
    }

    renderTranslationFormField = (lock, key, rootIndex, index, field, error, checkRelationShip) => {
        if (key === 'relationShip' && !checkRelationShip) {
            return (
                <div className="row actor-info-form actor-info-form-cast">
                    {field.map((rField, rIndex) => (
                        <div key={rIndex} className="col-md-6 p-remove">
                            {rField?.isEditing ?
                                this.renderTranslationFormField(lock, key, rootIndex, rIndex, rField, error, true):
                                this.renderTranslationView(key, rootIndex, index, rField, this.state.selectedLangData, true, 'renderView3')
                            }
                        </div>
                    ))}
                </div>
            )
        }
        return (
            <TranslationFormFields
                fieldsData={field}
                handleChange={event => this.handleValueChange(key, rootIndex, index, event.target.value)}
                onEditorValueChange={value => this.handleValueChange(key, rootIndex, index, value)}
                handleMultiSelect={(event, id, name, value) => this.handleValueChange(key, rootIndex, index, value)}
                onBlur={this.autoSave}
                error={error}
                //getMasterData={this.getMasterData}
                setSelectDataArr={value => this.setSelectDataArr(key, rootIndex, index, value)}
                isLocked={lock.isLocked}
                language={this.state.language}
            />
        )
    }

    render() {
        const {
            showNavToAssignedLang,
            permissionAddEdit,
            permissionViewOnly
        } = this.props;

        let {
            lock,
            sections,
            selectedSecTab,
            fields,
            error,
            defaultData,
            selectedLangData,
            markAsDone,
            translationStatus
        } = this.state;
        return (
            <Fragment>
                <Locked
                    lock={!permissionViewOnly && lock.isLocked}
                    lockedBy={lock.lockedBy}
                    clicked={this.toggleLockModel}>
                    <TranslationInfo
                        sections={sections}
                        selectedSecTab={selectedSecTab}
                        handleSecTab={this.handleSecTab}
                        markAsDone={markAsDone}
                        handleMarkAsDone={this.handleMarkAsDone}
                        status={translationStatus}
                        isLocked={lock.isLocked}
                        permissionAddEdit={permissionAddEdit}
                        permissionViewOnly = {permissionViewOnly}
                        showNavToAssignedLang={showNavToAssignedLang}
                    />
                    <div className="lang-f-wrap">
                        {Object.keys(fields)?.map((key) => (
                            <Fragment key={key}>
                                {(key === "relationShip") &&
                                    <div className="col-12 lang-global-text">
                                        <h4>{constantText.translations.relationship_sec_text}</h4>
                                    </div>
                                }
                                <div className="col-12">
                                    <div className="row form-f-row">
                                        {fields[key].map((field, index) => (
                                            <Fragment key={index}>
                                                <div className="col-md-6 col-lg-6 col-xl-5">
                                                    {this.renderTranslationView(key, index, null, field, defaultData, null, 'renderView1')}
                                                </div>
                                                <div className={`col-md-6 col-lg-6 col-xl-7 ${!showNavToAssignedLang ? 'masterDataExist' : ''}`}>
                                                    {!showNavToAssignedLang && permissionAddEdit && (field?.isEditing || Array.isArray(field)) ?
                                                        this.renderTranslationFormField(lock, key, index, null, field, error): 
                                                        this.renderTranslationView(key, index, null, field, selectedLangData, null, 'renderView2')
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

                {lock.openLockModel &&
                    <CommonModel className='popup-wrap status-popup' state={lock.openLockModel}
                        showTitle={true} title={constantText.unlock_title_text}
                        showIcon={true} icon={<LockIcon />}
                        showDes={true} des={`${constantText.section_lock_with} ${lock.lockedBy}, ${constantText.confirm_still_change}`}
                        showBtn1={true} btn1Text={constantText.yes_text} btn1Action={(e) => this.toggleLockModel(e, true)}
                        showBtn2={true} btn2Text={constantText.no_text} btn2Action={this.toggleLockModel}
                        handleClose={this.toggleLockModel}
                    />
                }
            </Fragment>
        );
    }
}

export default TranslationCastProfile;
