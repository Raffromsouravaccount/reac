import React, { Component } from "react";

//Common Components
import FormRender from '../../Common/FormHelper/FormRender';
import checkValidity from '../../Common/FormHelper/FieldValidator';
import { CommonModel } from '../../Common/Model/CommonModel';
import ButtonField from "../../Common/ButtonField/ButtonField";
import BadgeBox from "../../Common/BadgeBox/BadgeBox";
import Lock from '../../Common/Locked/Locked';

//Helper files
import { constantText } from '../../../_helpers/constants.text';
import { apiCalls } from "../../../_services/common.service";
import Config from "../../../Config/config";
import { formatCountryGroup, getSelectedGroup } from "../../../_helpers/util";

// CSS
import './CastAndCrew.css';

//Images
import MarkDone from "images/tick.svg";
import LockIcon from 'images/lock-icon.svg';


class CastAndCrew extends Component {
  constructor(props) {
    super(props);
    const {jsonData}= props;
    let { actors, actorsData, others } = jsonData;
    this.state = {
      videoId: null,
      status: null,
      actors, actorsData, others,
      canMarkAsDone: true, showLockedPopup: false
    }
  }

  componentDidMount = async () => {
    let { videoId } = this.props;
    if (videoId) {
      this.getVideoDetails();
      let response = await apiCalls(`${Config.videoCastAndCrew}/${videoId}`, "GET", {}, `/video/edit/${videoId}`);
      if (response) {
        this.updatedDataValue(response);
      }
    }
  }

  getVideoDetails = async () => {
    let { videoId } = this.props;
    let url = `${Config.videoProperties}/${videoId}`;
    let response = await apiCalls(url, 'GET', {});
    if (response) {
      let { contentState } = response;
      this.setState({ status: contentState?.title })
    }
  }

  updatedDataValue = response => {
    let { actors, actorsData, others } = this.state;
    others = others ? others?.map(data => ({ ...data, value: response?.[data?.name] || data["value"] })) : others;

    let actorDta = response?.["3bb64421-f15f-4dda-adec-03c324c140a3"] || [];
    actors = (actorDta?.length > 0) ? actorDta?.map(dataObj => actorsData?.map(obj => (
      { ...obj, value: dataObj?.[obj?.name] || obj["value"] }
    ))) : actors;
    this.setState(prevState => ({
      actors, others
    }))
  }

  handleStateChange = (event, rootIndex, index, stepName) => {
    let { value } = event.target;
    let stepNameArr = this.state[stepName].slice();
    let shallowArr = [...stepNameArr];
    if (rootIndex != null) {
      let rootArr = [...shallowArr[rootIndex]];
      let { type, validation } = rootArr[index];
      let { errorText } =  checkValidity(value?.castName?value?.castName:value, validation, false);
      rootArr[index] = { ...rootArr[index], value, errorText };
      shallowArr[rootIndex] = rootArr;
      this.setState(prevState => ({ [stepName]: shallowArr }));
    }
    else {
      let { type, validation } = shallowArr[index];
      let result;
      if(Array.isArray(value)) {
        value.forEach(item => {
          result = checkValidity(item.castName, validation, false);
        })
      } else {
        result = checkValidity(value?.castName ? value?.castName :value, validation, false);
      }
      let errorText=result?.errorText?result?.errorText:"";
      // let {errorText} = checkValidity( Array.isArray(value) ?value[0]?.castName: value?.castName?value?.castName:value, validation, false);
      shallowArr[index] = { ...shallowArr[index], value, errorText };
      this.setState(prevState => ({ [stepName]: shallowArr }));
    }
  };

  handleSearchableInput = async (value, rootIndex, index, sectionName) => {
    let { videoId } = this.props;
    let shallowArr = [...this.state[sectionName]];
    let response = await apiCalls(`${Config.castnamesUrl}?castName=${value}`, "GET", {}, `/video/edit/${videoId}`, false) || [];
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
        if ((name == "actor" && !!value?.castName) || (name != "actor" && value?.length > 0)) hasValue = true;
      }
      if (hasValue) {
        let updatedObj = {};
        for (let obj of nestedArr) {
          updatedObj[obj?.name] = (obj?.name == "groupCountry") ? obj?.value?.map(data => data?.id) : obj?.value;
        }
        updateData.push(updatedObj);
      }
    });
    return (sectionName == "globalProperties") ? { "globalProperties": updateData } :
      { "3bb64421-f15f-4dda-adec-03c324c140a3": updateData };
  }

  handleBlur = async (rootIndex, index, sectionName) => {
    let { videoId } = this.props;
    let shallowArr = [...this.state[sectionName]] || [];
    let field = (rootIndex != null) ? shallowArr[rootIndex][index] : shallowArr[index];
    let updatedData = (rootIndex != null) ? this.formatData(sectionName, shallowArr) : { [field?.name]: field.value };
    let { errorText } = field;
    if (!errorText) {
      const response = await apiCalls(`${Config.videoCastAndCrew}/${videoId}`, "PUT", updatedData, null, false, false,
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

  addRemoveMultipleFields = async (name, index) => {
    let shallowArr = this.state?.[name]?.slice() || [];
    let { actorsData } = this.state;
    let updatedArray=[];
    let { videoId } = this.props;

    if (index > 0) {
      shallowArr.splice(index, 1);
      for(let item of shallowArr){
        updatedArray.push({
          "actor":{
            castName:item[0]?.value?.castName,
            id:item[0]?.value?.id
          },
          "character":item[1]?.value
        })

      }
      let updatedObject={
        "3bb64421-f15f-4dda-adec-03c324c140a3":updatedArray
      }
      const response = await apiCalls(`${Config.videoCastAndCrew}/${videoId}`, "PUT", updatedObject, null, false, false,
      this.props?.autoSaveError);
    if (response) {
      this.props.markAsDone(this.props?.selectedTab, false);
    }
    } else {
      let dataArr = (name == "actors") ? actorsData : [];
      shallowArr.push(dataArr);
    }
    this.setState((prevState) => ({ [name]: shallowArr }));
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
    this.props?.unLockedSession(this.props?.selectedTab);
  }


  render() {
    const { tabData,  actors, others, globalProperties, canMarkAsDone, showLockedPopup, status } = this.state;
    let { currentTabData,stage } = this.props;
    let { isDone, isLocked, lockedBy } = currentTabData || {};
    return (
      <div className="create-movie">
        <Lock lock={isLocked} lockedBy={lockedBy} clicked={this.showHideLockPopup}>
          <div className="whitebox m-b-30">
            <div className="ccm-head flex align-items-center justify-content-between m-b-0">
              <h4>{constantText.cast_crew_text}</h4>
              <div className="status-head flex align-items-center">
                 <BadgeBox className="create-movie-stage" status={status ? status :stage?.title} />
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
            </div>
              <div className="movieForm-tab">
                <div className="movie-f-wrap col-12">
                  <div className="actor-row">
                    {actors?.map((actorFields, actorIndex) => (
                      <div className="add-plush-row" key={actorIndex}>
                        <div className="row">
                          <FormRender
                            data-test={'casNCrewForm'}
                            form={actorFields}
                            groupIndex={actorIndex}
                            onChange={(event, index) => this.handleStateChange(event, actorIndex, index, 'actors')}
                            handleAutoCreateInput={(value, index) => this.handleSearchableInput(value, actorIndex, index, 'actors')}
                            handleBlur={index => this.handleBlur(actorIndex, index, 'actors')} isDisable={isLocked}
                          />
                        </div>
                        <div className={`${actorIndex > 0 ? "remove" : "add"}-btn create-btn`}>
                          <ButtonField
                          data-test="addRemoveBtn"
                          buttonText={actorIndex > 0 ? "-" : "+"}
                            onClick={() => !isLocked ? this.addRemoveMultipleFields("actors", actorIndex) : ""}
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
