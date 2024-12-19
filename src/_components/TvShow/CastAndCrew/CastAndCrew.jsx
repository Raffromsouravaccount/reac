import React, { Component } from "react";

//Common Components
import FormRender from '../../Common/FormHelper/FormRender';
import checkValidity from '../../Common/FormHelper/FieldValidator';
import { CommonModel } from '../../Common/Model/CommonModel';
import LeftTab from '../../Common/LeftTab/CommonLeftTab';
import ButtonField from "../../Common/ButtonField/ButtonField";
import BadgeBox from "../../Common/BadgeBox/BadgeBox";
import Lock from '../../Common/Locked/Locked';

//Helper files
import { constantText } from '../../../_helpers/constants.text';
import { apiCalls } from "../../../_services/common.service";
import Config from "../../../Config/config";
import { formatCountryGroup, getSelectedGroup } from "../../../_helpers/util";

// CSS
import '../../../../public/css/Common/CastNCrew.css';
import '../../../../public/css/Common/GlobalField.css';

//Images
import MarkDone from "images/tick.svg";
import LockIcon from 'images/lock-icon.svg';
//images
import AccordianNormal from "images/arrow-icon.svg";


class CastAndCrew extends Component {
  constructor(props) {
    super(props);
    let { jsonData } = props;
    let { actors, actorsData, others, globalProperties, globalPropertiesData } = jsonData;
    this.state = {
      status: null,
      tabData: constantText.tvshow_cast_and_crew_header_arr,
      selectedTab: 0, tvShowId: null,
      actors, actorsData, others, globalProperties, globalPropertiesData,
      canMarkAsDone: true, showLockedPopup: false,tvShowGlobalPropertyIdArr:[]
    }
  }

  componentDidMount = async () => {
    this.fetchContentData()
    let { tvShowId } = this.props;
    if (tvShowId) {
      let response = await apiCalls(`${Config.tvShowCastAndCrew}/${tvShowId}`, "GET", {}, `/tvshow/edit/${tvShowId}`);
      if (response) {
        this.updatedDataValue(response);
      }
    }
  }

  fetchContentData = async () => {
    let { tvShowId } = this.props;
    let response = await apiCalls(`${Config.tvShowProperties}/${tvShowId}`, "GET", {});
    if (response) {
      this.setState({status: response?.contentState?.title})
    }
  };

  updatedDataValue = response => {
    let { actors, actorsData, others} = this.state;
    others = others ? others?.map(data => ({ ...data, value: response?.[data?.name] || data["value"] })) : others;

    let actorDta = response?.["3bb64421-f15f-4dda-adec-03c324c140a3"] || [];
    actors = (actorDta?.length > 0) ? actorDta?.map(dataObj => actorsData?.map(obj => (
      { ...obj, value: dataObj?.[obj?.name] || obj["value"] }
    ))) : actors;

    this.setState(prevState => ({
      actors, others
    }));
  }

  handleStateChange = (event, rootIndex, index, stepName) => {
    let { status } = this.state;
    if (status === constantText.contentConstants.published) {
      this.setState({ status: constantText.contentConstants.changed })
    }
    if (status === constantText.contentConstants.submittedToReview){
      this.setState({ status:constantText.contentConstants.draft })
    }
    if (status === constantText.contentConstants.unpublished) {
      this.setState({ status:constantText.contentConstants.draft })
    }
    let { value } = event?.target;
    let stepNameArr = this.state[stepName]?.slice();
    let shallowArr = [...stepNameArr];
    if (rootIndex != null) {
      let rootArr = [...shallowArr[rootIndex]];
      let { type, keyText, multiple, validation } = rootArr[index];
      let errorIndex= (type == "SearchableWithCreate")? multiple?
        value.findIndex(data=> !!checkValidity(data[keyText], validation, false).errorText): 0: -1;
      let { errorText } = (type == "SearchableWithCreate") ? { errorText: (errorIndex> -1)?
        multiple? checkValidity(value[errorIndex][keyText], validation, false).errorText: 
        checkValidity(value?.[keyText], validation, false).errorText:"" } : checkValidity(value, validation, false);
      rootArr[index] = { ...rootArr[index], value, errorText };
      shallowArr[rootIndex] = rootArr;
      this.setState(prevState => ({ [stepName]: shallowArr }));
    }
    else {
      let { type, keyText, multiple, validation } = shallowArr[index];
      let errorIndex= (type == "SearchableWithCreate")? multiple?
        value.findIndex(data=> !!checkValidity(data[keyText], validation, false).errorText): 0: -1;
      let { errorText } = (type == "SearchableWithCreate") ? { errorText: (errorIndex> -1)?
          multiple? checkValidity(value[errorIndex][keyText], validation, false).errorText: 
          checkValidity(value[keyText], validation, false).errorText:"" } : checkValidity(value, validation, false);
      shallowArr[index] = { ...shallowArr[index], value, errorText };
      this.setState(prevState => ({ [stepName]: shallowArr }));
    }
  };

  handleSearchableInput = async (value, rootIndex, index, sectionName) => {
    let { tvShowId } = this.props;
    let shallowArr = [...this.state[sectionName]];
    let response = await apiCalls(`${Config.castnamesUrl}?castName=${value}`, "GET", {}, `/tvshow/edit/${tvShowId}`, false) || [];
    (rootIndex != null) ? (shallowArr[rootIndex][index]["data"] = response) : (shallowArr[index]["data"] = response);
    this.setState(prevState => ({ [sectionName]: shallowArr }));
  }

  setSelectDataArr = (sectionName, rootIndex, index, data) => {
    let shallowArr = [...this.state[sectionName]];
    data = (sectionName == "globalProperties") ? formatCountryGroup(data) : data;
    (rootIndex != null) ? (shallowArr[rootIndex][index]["data"] = data) : (shallowArr[index]["data"] = data);
    this.setState(prevState => ({ [sectionName]: shallowArr }));
  };

  checkError = () => {
    let { actors, others, globalProperties } = this.state;
    let error = false;
    actors?.map(nestedArr => nestedArr?.map(data => (data.errorText && (error = true))));
    others?.map(data => (data.errorText && (error = true)));
    globalProperties?.map(nestedArr => nestedArr?.map(data => (data.errorText && (error = true))));
    return error;
  }

  formatData = (sectionName, shallowArr) => {
    let updateData = [];
    shallowArr?.filter(nestedArr => {
      let hasValue = false;
      for (let obj of nestedArr) {
        let { name, value } = obj;
        if ((name == "castName" && !!value?.castName) || (name != "castName" && value?.length > 0)) hasValue = true;
      }
      if (hasValue) {
        let updatedObj = {};
        for (let obj of nestedArr) {
          updatedObj[obj?.value?.id? "id": obj?.name] = (obj?.name == "groupCountry") ? obj?.value?.map(data => data?.id)
          : obj?.value?.id? obj?.value?.id: (obj?.value?.[obj.keyText] || obj.value);
        }
        updateData.push(updatedObj);
      }
    });
    return (sectionName == "globalProperties") ? { "globalProperties": updateData } :
      { "3bb64421-f15f-4dda-adec-03c324c140a3": updateData };
  }

  handleBlur = async (rootIndex, index, sectionName) => {
    let { tvShowId } = this.props;
    let shallowArr = [...this.state[sectionName]] || [];
    let field = (rootIndex != null) ? shallowArr[rootIndex][index] : shallowArr[index];
    let updatedData = (rootIndex != null) ? this.formatData(sectionName, shallowArr) : { [field?.name]: field.value};
    let { errorText } = field;
    if (!errorText) {
      const response = await apiCalls(`${Config.tvShowCastAndCrew}/${tvShowId}`, "PUT", updatedData, null, false, false,
        this.props?.autoSaveError);
      if (response) {
        this.props.markAsDone(this.props?.selectedTab, false);
      }
    }
  }

  selectGroup = (event, group, rootIndex, index, sectionName) => {
    let shallowArr = [...this.state[sectionName]];
    let { data } = (rootIndex != null) ? shallowArr[rootIndex][index] : shallowArr[index];
    let selectedData = [];
    selectedData = getSelectedGroup(event, group, data, selectedData);

    (rootIndex != null) ? (shallowArr[rootIndex][index]["value"] = selectedData) : (shallowArr[index]["value"] = selectedData);
    this.setState(prevState => ({ [sectionName]: shallowArr }));
  };

  addRemoveMultipleFields = (name, index) => {
    let shallowArr = this.state?.[name]?.slice() || [];
    let { actorsData, globalPropertiesData } = this.state;
    if (index > 0) {
      shallowArr.splice(index, 1);
    } else {
      let dataArr = (name == "actors") ? actorsData : (name == "globalProperties") ? globalPropertiesData : [];
      shallowArr.push(dataArr);
    }
    this.setState((prevState) => ({ [name]: shallowArr }), ()=> (index> 0 && this.handleBlur(0, 0, name)));
  };

  markAsDone = () => {
    this.props?.markAsDone(this.props?.selectedTab, true);
  };

  showHideLockPopup = () => {
    let { showLockedPopup } = this.state;
    this.setState(prevState => ({ showLockedPopup: !showLockedPopup }));
  }

  unLockCastNCrew = () => {
    this.showHideLockPopup();
    this.props.unLockedSession(this.props?.selectedTab);
  }



  handleTab = (event, selectedTab) => {
    const tabData = [...this.state.tabData]
    this.setState({ selectedTab, tabData })
  };


  render() {
    const { tabData, selectedTab, actors, others, globalProperties, canMarkAsDone, showLockedPopup, status } = this.state;
    let { currentTabData } = this.props;
    let { isDone, isLocked, lockedBy } = currentTabData || {};
    return (
      <div className="create-movie">
        <Lock lock={isLocked} lockedBy={lockedBy} clicked={this.showHideLockPopup}>
          <div className="whitebox m-b-30">
            <div className="ccm-head flex align-items-center justify-content-between m-b-0">
              <h4>{constantText.cast_crew_text}</h4>
              <div className="status-head flex align-items-center">
              {status && <BadgeBox className="create-movie-stage" status={status} />}
                <div className="autosave">{constantText.all_fields_auto_save_text}</div>
                <div data-test="markIsDoneButton"
                  className={`mark-done ${isDone ? "mark-active" : canMarkAsDone ? "mark-fill-active" : ""} auto-mark-done`}
                  onClick={() => {
                    if (canMarkAsDone && !isLocked && !isDone)
                      this.markAsDone();
                  }}>
                  <span><MarkDone /></span> {constantText.mark_as_done_text}
                </div>
              </div>
            </div>
            <div className="cr-mov-tab p-b-30">
              <LeftTab className="tabs" orientation="horizontal" variant="scrollable" options={tabData}
                data-test="handle-tab-method" selectedTab={selectedTab} showIcon={false} handleChange={this.handleTab} />
            </div>

            {(selectedTab == 0) &&
              <div className="movieForm-tab">
                <div className="movie-f-wrap col-12">
                  <div className="actor-row">
                    {actors?.map((actorFields, actorIndex) => (
                      <div className="add-plush-row" key={actorIndex}>
                        <div className="row">
                          <FormRender
                            data-test={'casNCrewForm'}
                            id="casNCrewForm"
                            form={actorFields}
                            groupIndex={actorIndex}
                            onChange={(event, index) => this.handleStateChange(event, actorIndex, index, 'actors')}
                            handleAutoCreateInput={(value, index) => this.handleSearchableInput(value, actorIndex, index, 'actors')}
                            handleBlur={index => this.handleBlur(actorIndex, index, 'actors')} isDisable={isLocked}
                          />
                        </div>
                        <div className={`${actorIndex > 0 ? "remove" : "add"}-btn create-btn auto-create-button-${actorIndex}`}>
                          <ButtonField buttonText={actorIndex > 0 ? "-" : "+"} data-test="addRemoveMultipleFieldsBtn"
                            onClick={() => this.addRemoveMultipleFields("actors", actorIndex)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="row input-space-35">
                    <FormRender
                      form={others}
                      data-test="formrender-handlechnage"
                      onChange={(event, index) => this.handleStateChange(event, null, index, 'others')}
                      handleAutoCreateInput={(value, index) => this.handleSearchableInput(value, null, index, 'others')}
                      handleBlur={index => this.handleBlur(null, index, 'others')}
                      isDisable={isLocked}
                    />
                  </div>
                </div>
              </div>
            }
            {(selectedTab == 1) &&
              <div className="movie-f-wrap col-12">
                 <div className="global-wrap">
                    {globalProperties?.map((globalGroupFields, globalIndex) => (
                        <div className="global-row" key={globalIndex}>
                          <div className="add-plush-row top-title">
                          <div className="top-text">{`${constantText.global_fields_cast_and_crew} ${globalIndex >= 0 ? ` - ${globalIndex + 1}` : ''}`}</div>
                              <div className="add-another-f-btn create-btn">
                                <div className={`${globalIndex > 0 ? `remove-btn auto-delete-${globalIndex}` : 'auto-button-add'} add-btn-field flex align-items-center`}
                                    data-test="addRemoveGlobalMultipleFieldsBtn"  onClick={() => {}}>
                                  <span className="plush-icon-btn"></span>
                                </div>
                              </div>
                          </div>

                          <div className="row input-space-35">
                            <FormRender
                              form={[]}
                              groupIndex={globalIndex}
                              setSelectDataArr={(value, index) => this.setSelectDataArr("globalProperties", globalIndex, index, value)}
                              onChange={(event, index) => this.handleStateChange(event, globalIndex, index, 'globalProperties')}
                              handleAutoCreateInput={(value, index) => this.handleSearchableInput(value, globalIndex, index, 'globalProperties')}
                              selectGroup={(event, group, index) => this.selectGroup(event, group, globalIndex, index, 'globalProperties')}
                              handleBlur={index => {}}
                              isDisable={isLocked}
                            />
                          </div>
                      </div>
                    ))}
                    </div>

                  </div>
                }
          </div>
        </Lock>
        <CommonModel className="popup-wrap status-popup" state={showLockedPopup}
          showTitle={true} title={constantText.unlock_title_text}
          showIcon={true} icon={<LockIcon />}
          showDes={true} des={`${constantText.section_lock_with} ${lockedBy}, ${constantText.confirm_still_change}`}
          showBtn1={true} btn1Text={constantText.yes_text} btn1Action={this.unLockCastNCrew}
          showBtn2={true} btn2Text={constantText.no_text} btn2Action={this.showHideLockPopup}
          handleClose={this.showHideLockPopup}
        />
      </div>


    );
  }
}

export default CastAndCrew;
