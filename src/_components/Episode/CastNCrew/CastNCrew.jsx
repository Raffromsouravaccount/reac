import React, { Component } from "react";

//Common Components
import ViewSeason from "../../Common/ViewDetail/ViewSeason";
import checkValidity from '../../Common/FormHelper/FieldValidator';
import LeftTab from '../../Common/LeftTab/CommonLeftTab';
import { CommonModel } from '../../Common/Model/CommonModel';
import BadgeBox from "../../Common/BadgeBox/BadgeBox";
import ButtonField from '../../Common/ButtonField/ButtonField';
import Lock from '../../Common/Locked/Locked';

//Helper files
import { constantText } from '../../../_helpers/constants.text';
import { apiCalls } from "../../../_services/common.service";
import Config from "../../../Config/config";
import { formatCountryGroup } from "../../../_helpers/util";
import { permissionObj } from '../../../_helpers/permission';

//CSS
import '../../../../public/css/Common/CastNCrew.css';
import '../../../../public/css/Common/EditAndSaveField.css';
import '../../../../public/css/Common/GlobalField.css';

//Images
import MarkDone from "images/tick.svg";
import LockIcon from 'images/lock-icon.svg';
import AccordianNormal from "images/arrow-icon.svg";
class CastNCrew extends Component {
  constructor(props) {
    super(props);
    const { jsonData } = props;
    let { actors, actorsData, others, globalProperties, globalPropertiesData } = jsonData;
    this.state = {
      tabData: constantText.tvshow_cast_and_crew_header_arr,
      selectedTab: 0, seasonId: null, currentIndex: null, prevIndex: null,
      actors: actors?.map(nestedData => nestedData?.map(data => ({ ...data, inherited: true }))),
      actorsData: actorsData?.map(data => ({ ...data, inherited: "true" })),
      others: others?.map(data => ({ ...data, inherited: "true" })),
      globalProperties, globalPropertiesData,
      response: {}, canMarkAsDone: true, viewOnly: false, showLockedPopup: false
    }
  }

  componentDidMount = () => {
    let { tvShowId, seasonId, episodeId, stage, viewOnly } = this.props;
    if (tvShowId && seasonId && episodeId) {
      this.setState(prevState => ({ viewOnly: !!viewOnly}), async () => {
         let response = await apiCalls(`${Config.episode?.castAndCrew}/${tvShowId}/${seasonId}/${episodeId}`, "GET", {}, this.props.match.url);
          this.updatedDataValue(response || {});
      });
    }
  }

  updatedDataValue = response => {
    let { actors, actorsData, others, globalProperties, globalPropertiesData } = this.state;
    others = others ? others?.map(data => ({
      ...data, value: response?.[data?.name]?.value || data["value"],
      initialValue: response?.[data?.name]?.value || data["value"],
      inherited: response?.[data?.name]?.inherited || "true"
    })) : others;

    let actorDta = response?.["3bb64421-f15f-4dda-adec-03c324c140a3"]?.value || [];
    let actorInherit = response?.["3bb64421-f15f-4dda-adec-03c324c140a3"]?.inherited || "true";
    actors = (actorDta?.length > 0) ? actorDta?.map(dataObj => actorsData?.map(obj => ({
      ...obj, value: dataObj?.[obj?.name] || obj["value"],
      initialValue: dataObj?.[obj?.name] || obj["value"], inherited: actorInherit
    }
    ))) : actors?.map(nestedData => nestedData?.map(obj => ({ ...obj, initialValue: obj["value"], inherited: actorInherit })));

    globalProperties = (response?.globalProperties?.length > 0) ? response?.globalProperties?.map(dataObj =>
      (globalPropertiesData?.map(obj => (
        { ...obj, value: dataObj?.[obj?.name] || obj["value"], initialValue: dataObj?.[obj?.name] || obj["value"] }
      )))) : globalProperties?.map(nestedData => nestedData?.map(obj => ({ ...obj, initialValue: obj["value"] })));

    this.setState(prevState => ({
      actors, others, globalProperties
    }))
  }

  handleStateChange = (event, rootIndex, index, stepName) => {
    let { value } = event.target;
    let stepNameArr = this.state[stepName].slice();
    let shallowArr = [...stepNameArr];
    if (rootIndex != null) {
      let rootArr = [...shallowArr[rootIndex]];
      let { type, validation } = rootArr[index];
      let { errorText } = (type == "SearchableWithCreate") ? { errorText: rootArr[index]?.errorText } :
        checkValidity(value, validation, false);
      rootArr[index] = { ...rootArr[index], value, errorText };
      shallowArr[rootIndex] = rootArr;
      this.setState(prevState => ({ [stepName]: shallowArr }));
    }
    else {
      let { type, validation } = shallowArr[index];
      let { errorText } = (type == "SearchableWithCreate") ? { errorText: shallowArr[index]?.errorText } :
        checkValidity(value, validation, false);
      shallowArr[index] = { ...shallowArr[index], value, errorText };
      this.setState(prevState => ({ [stepName]: shallowArr }));
    }
  };

  handleSearchableInput = async (value, rootIndex, index, sectionName) => {
    let { seasonId } = this.props;
    let shallowArr = [...this.state[sectionName]];
    let response = await apiCalls(`${Config.castnamesUrl}?castName=${value}`, "GET", {}, `/tvshow/edit/${seasonId}`, false) || [];
    const { validation } = (rootIndex != null) ? shallowArr[rootIndex][index] : shallowArr[index];
    let { errorText } = checkValidity(value, validation, false);
    (rootIndex != null) ? (shallowArr[rootIndex][index]["data"] = response) : (shallowArr[index]["data"] = response);
    (rootIndex != null) ? (shallowArr[rootIndex][index]["errorText"] = errorText) : (shallowArr[index]["errorText"] = errorText);
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

  handleSave = async (rootIndex, index, sectionName) => {
    let { episodeId } = this.props;
    let shallowArr = [...this.state[sectionName]] || [];
    let field = (rootIndex != null) ? shallowArr[rootIndex][index] : shallowArr[index];
    let updatedData = (rootIndex != null) ? this.formatData(sectionName, shallowArr) : { [field?.name]: field.value};
    let { errorText } = field;
    if (!errorText) {
      const response = await apiCalls(`${Config.episode?.castAndCrew}/${episodeId}`, "PATCH", updatedData, null, false, false,
        this.props?.autoSaveError);
      if (response) {
        if (rootIndex != null) {
          shallowArr = shallowArr?.map(rootArr=> (rootArr?.map(data => ({ ...data, inherited: "false",
            initialValue: field?.value, editable: false }))));
          this.setState(prevState => ({ [sectionName]: shallowArr }));
        }
        else {
          shallowArr[index] = { ...shallowArr[index], initialValue: field?.value, inherited: "false", editable: false };
          this.setState(prevState => ({ [sectionName]: shallowArr }));
        }
        this.props.markAsDone(this.props?.selectedTab, false);
      }
    }
  }

  selectGroup = (event, group, rootIndex, index, sectionName) => {
    let { checked } = event?.target;
    let shallowArr = [...this.state[sectionName]];
    let { data, value } = (rootIndex != null) ? shallowArr[rootIndex][index] : shallowArr[index];

    let selectedData = [];
    if (checked) {
      const filterOptions = data.filter(item => item.group === group);
      selectedData = value ? [...new Map([...value, ...filterOptions].map(obj => [obj["id"], obj])).values()] :
        filterOptions;
    } else {
      selectedData = value.filter((item) => item.group !== group);
    }
    (rootIndex != null) ? (shallowArr[rootIndex][index]["value"] = selectedData) : (shallowArr[index]["value"] = selectedData);
    this.setState(prevState => ({ [sectionName]: shallowArr }));
  };

  handleEditable = (rootIndex, index, sectionName) => {
    if(sectionName){
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
    
  }

  addRemoveMultipleFields = (name, index) => {
    let shallowArr = this.state?.[name]?.slice() || [];
    let { actorsData, globalPropertiesData } = this.state;
    if (index > 0) {
      shallowArr.splice(index, 1);
    } else {
      let dataArr = (name == "actors") ? actorsData : (name == "globalProperties") ? globalPropertiesData : [];
      shallowArr.push(dataArr);
    }
    this.setState((prevState) => ({ [name]: shallowArr }), () => (index > 0 && this.handleSave(0, 0, name)));
  };

  markAsDone = () => {
    this.props.markAsDone(this.props?.selectedTab, true);
  };

  showHideLockPopup = () => {
    let { showLockedPopup } = this.state;
    this.setState(prevState => ({ showLockedPopup: !showLockedPopup }));
  }

  unLockCastNCrew = () => {
    this.showHideLockPopup();
    this.props.unLockedSession(this.props?.selectedTab);
  }

  handleTab = (event, selectedTab) => this.setState(prevState => ({ selectedTab }));

  render() {
    const { tabData, selectedTab, actors, others, globalProperties, canMarkAsDone, showLockedPopup, viewOnly,
      } = this.state;
    let { currentTabData, handleRoute, stage } = this.props;
    let { isDone, isLocked, lockedBy } = currentTabData || {};
    let { canUpdate } = permissionObj?.season?.castNCrewModule;
    return (
      <div className="create-movie">
        <Lock lock={viewOnly ? false : isLocked} lockedBy={lockedBy} clicked={this.showHideLockPopup}>
          <div className="whitebox m-b-30">
            <div className="ccm-head flex align-items-center justify-content-between m-b-0">
              <h4>{constantText.cast_crew_text}</h4>
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
                    className={`mark-done ${isDone ? "mark-active" : canMarkAsDone ? "mark-fill-active" : ""}`}
                    onClick={() => {
                      if (canMarkAsDone && !isLocked && !isDone)
                        this.markAsDone();
                    }}>
                    <span><MarkDone /></span> {constantText.mark_as_done_text}
                  </div>
                }
              </div>
            </div>
            <div className="cr-mov-tab p-b-30">
              <LeftTab className="tabs" orientation="horizontal" variant="scrollable" options={tabData}
                data-test="handle-tab-method" selectedTab={selectedTab} showIcon={false} handleChange={this.handleTab} />
            </div>

            {(selectedTab == 0) &&
              <div className="movieForm-tab">
                <div className="movie-f-wrap col-12">
                  <div className="actor-wrap">
                    {actors?.map((actorFields, actorIndex) => (
                      <div className="actor-row" key={actorIndex}>
                        <div className="add-plush-row topH">
                          <div className="top-text">
                            {`${constantText.actor_and_character_text_set} ${actorIndex >= 0 ? ` - ${actorIndex + 1}` : ''}`}
                          </div>
                          <div className="add-another-f-btn create-btn">
                            <div className={`${actorIndex > 0 ? 'remove-btn' : ''} add-btn-field flex align-items-center`}
                              onClick={() => (!isLocked && this.addRemoveMultipleFields("actors", actorIndex))}>
                              {!viewOnly && <span className="plush-icon-btn"></span>}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <ViewSeason allData={actorFields}
                            data-test={'casNCrewForm'}
                            onChange={(event, index) => this.handleStateChange(event, actorIndex, index, 'actors')}
                            handleAutoCreateInput={(value, index) => this.handleSearchableInput(value, actorIndex, index, 'actors')}
                            updateData={index => this.handleSave(actorIndex, index, 'actors')}
                            callBack={index => this.handleEditable(actorIndex, index, "actors")}
                            isDisable={!!isLocked} viewOnly={viewOnly} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="row">
                    <ViewSeason allData={others}
                      onChange={(event, index) => this.handleStateChange(event, null, index, 'others')}
                      handleAutoCreateInput={(value, index) => this.handleSearchableInput(value, null, index, 'others')}
                      updateData={index => this.handleSave(null, index, 'others')}
                      callBack={index => this.handleEditable(null, index, "others")}
                      isDisable={!!isLocked} viewOnly={viewOnly} />
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
                        <div className="top-text">
                          {`${constantText.global_fields_cast_and_crew} ${globalIndex >= 0 ? ` - ${globalIndex + 1}` : ''}`}
                        </div>
                        <div className="add-another-f-btn create-btn">
                          <div className={`${globalIndex > 0 ? 'remove-btn' : ''} add-btn-field flex align-items-center`}
                            onClick={() => {}}>
                            {!viewOnly && <span className="plush-icon-btn"></span>}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <ViewSeason allData={globalGroupFields}
                          onChange={(event, index) => {}}
                          handleAutoCreateInput={(value, index) => {}}
                          updateData={index => {}}
                          callBack={index => {}}
                          isDisable={!!isLocked} viewOnly={viewOnly} />
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

export default CastNCrew;