import React, { Component, Fragment } from "react";

import { constantText } from "../../../_helpers/constants.text";

import LockIcon from 'images/lock-icon.svg';

import Locked from "../../Common/Locked/Locked";
import TranslationView from "../Layout/TranslationView";
import TranslationInfo from "../Layout/TranslationInfo";
import { CommonModel } from './../../Common/Model/CommonModel';
import TranslationFormFields from "../Layout/TranslationFormFields";

import ContentPropertiesJson from "../Schema/Collection/ContentProperties.json";

import Config from "../../../Config/config";
import { getLocalData } from "../../../_helpers/util";
import { apiCalls } from "../../../_services/common.service";
import { translationHelper } from "../../../_helpers/translation";
import { showSuccessErrorMsg } from './../../../_actions/alertMessages.action';

class TranslationCollection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            params: this.props.params,
            showNavToAssignedLang: this.props.showNavToAssignedLang,
            language: this.props.language,
            sections: constantText.translations.collection_sections,
            selectedSecTab: 0,
            fields: JSON.parse(JSON.stringify(ContentPropertiesJson)),
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
        const { params, sections, selectedSecTab, language } = this.state;
        let languageCode = String(language?.code);
        isDefaultData ? languageCode = String(Config.defaultLanguageCode) : "";
        const url = `${Config.collectionTranslation}/${params.collectionId}?langCode=${languageCode}`;

        const response = await apiCalls(url, "GET");
        if (response) {
            isDefaultData ? this.setState({ defaultData: response[0] }) : this.updateValues(response);
        } else if (isDefaultData && Object.keys(this.state.defaultData).length) {
            this.setState({ defaultData: {} });
        } else {
            let fields;
            // condition for clear data if already exists
            const section = sections[selectedSecTab];
            section.url == "properties" ? fields = JSON.parse(JSON.stringify(ContentPropertiesJson)) : "";
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

    updateValues = (resData) => {
        const { userID } = getLocalData("userData");
        if (!resData) {
            return;
        }
        const dataObj = resData[0];
        const { sections, selectedSecTab } = this.state;
        let fields = this.state.fields;
        if (sections[selectedSecTab].url === 'properties') {
            fields.CreateSummary = translationHelper.updatePropertiesValue(
                fields.CreateSummary,
                dataObj
            );
        }
        this.getCollectionStatus();
        this.setState({
            fields: JSON.parse(JSON.stringify(fields)),
            selectedLangData: dataObj,
            isUpdating: true,
            translationStatus: dataObj?.translationStatus || 0
        });
    };

    formatAllData = (sectionType, fields, checkRequired) => {
        if (sectionType == 'properties') {
            let allData = JSON.parse(JSON.stringify(fields.CreateSummary));
            let dataError = translationHelper.checkError([...allData], checkRequired);
            let formattedData = translationHelper.getFormattedData(allData, true);
            let error = !!dataError;
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

        let method = "PUT", paramsData = {};

        if (section.url === 'properties') {
            paramsData = data;
        }

        if (!lock.isLocked && Object.keys(paramsData).length) {
            const url = `${Config.collectionTranslation}/${params.collectionId}?langCode=${String(language?.code)}`;
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
        selectedSecTab === 0 && this.setState({ markAsDone: translationHelper.validateMarkAsDone(fields) });
    }

    handleSecTab = (event, selectedSecTab) => {
        if (selectedSecTab != this.state.selectedSecTab) { }
    };

    handleMarkAsDone = async (selectedTab) => {
        const {params, language} = this.state;
        const paramsData = {
            collectionId : params?.collectionId,
            isDone: true,
            sectionName: `${String(language?.code)}_properties`
        };
        const res = await this.markAsDoneNLockedAction(paramsData);
        (res || !!res) && this.setState({markAsDone: 3}, () => { this.props.updateMarkAsDoneAction(true)});

    }

    markAsDoneNLockedAction= async data=> {
        const response= await apiCalls(Config.collectionAction, "POST", data);
        return response;
    }

    handleValueChange = (stepName, index, value) => {
        let fields = JSON.parse(JSON.stringify(this.state.fields));
        const shallowArr = fields[stepName];
        let errorMsg = null;

        let { text, numeric, maxTextLength, type } = shallowArr[index];
        (type === 'texteditor' && value.trim() === "<p><br></p>") ? value = value.replace("<p><br></p>", "") : value;
        errorMsg = translationHelper.validateError(text, numeric, maxTextLength, value);
        shallowArr[index] = { ...shallowArr[index], value, errorMsg };

        fields[stepName] = shallowArr;
        this.setState({ fields, updatedFields: shallowArr[index] }, () => {
            if (shallowArr[index]["type"] == "dropDown") {
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
        const { params, lock } = this.state;
        const lockObj = JSON.parse(JSON.stringify(lock));
        lockObj.isLocked = false;
        lockObj.openLockModel = false;
        this.setState({ lock: lockObj }, () => {
            this.lockSections(params?.collectionId);
        });
    }

    lockSections = async (collectionId) => {
        const { language } = this.state;
        const paramsData = {  
            collectionId,
            isLocked: true,
            sectionName: `${String(language?.code)}_properties`
        };
        const response= await this.markAsDoneNLockedAction(paramsData);
        response && console.log('Lock is updated!');
    }

    autoSaveError= error=> {
        if(error?.data?.message== constantText.locked_by_another_text) {
          showSuccessErrorMsg(error?.data?.message, null, "Alert", true, null, null, this.getCollectionStatus);
        }
    }

    getCollectionStatus= async()=> {
        let { params, lock, sections, selectedSecTab, language, fields }= this.state;
        const section = sections[selectedSecTab];
        const sName = `${String(language?.code)}_${section.url}`;
        const { userID } = getLocalData("userData");
        const response= await apiCalls(`${Config.collectionAction}/${params?.collectionId}`, "GET", null, null, false);
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

    renderTranslationView = (key, index, fieldsData, contentData = {}) => {
        return (
            <TranslationView
                labelAndValue={{ label: fieldsData.label, value: contentData[fieldsData.name] || '' }}
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
                                <div className="col-12">
                                    <div className="row form-f-row">
                                        {fields[key].map((field, index) => (
                                            <Fragment key={index}>
                                                <div className="col-md-6 col-lg-6 col-xl-5">
                                                    {this.renderTranslationView(key, index, field, defaultData)}
                                                </div>
                                                <div className="col-md-6 col-lg-6 col-xl-7">
                                                    {!showNavToAssignedLang && permissionAddEdit ? (

                                                        <TranslationFormFields
                                                            fieldsData={field}
                                                            handleChange={event => this.handleValueChange(key, index, event.target.value)}
                                                            onEditorValueChange={value => this.handleValueChange(key, index, value)}
                                                            onBlur={this.autoSave}
                                                            error={error}
                                                            isLocked={lock.isLocked}
                                                        />
                                                    ) :
                                                        this.renderTranslationView(key, index, field, selectedLangData)
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

export default TranslationCollection;
