import React, { Component } from "react";

//Services
import { apiCalls } from "../../../_services/common.service";
//Helper Files
import Config from "../../../Config/config";
import { formValidityCheck } from "../../Common/FormHelper/FormValidSetter";
import Lock from "../../Common/Locked/Locked";
import checkValidity from "../../Common/FormHelper/FieldValidator";
import { CommonModel } from "../../Common/Model/CommonModel";
import { constantText } from "../../../_helpers/constants.text";
import FormRender from "../../Common/FormHelper/FormRender";
import { maxLength } from "../../../_helpers/validation";
import { DEFAULT_JSON } from "../../../_helpers/util"

import MarkDone from "images/tick.svg";
import LockIcon from "images/lock-icon.svg";
import "../../../../public/css/Common/CreateEditVideo.css";
import BadgeBox from "../../Common/BadgeBox/BadgeBox";

class EpisodeVideo extends Component {
  constructor(props) {
    super(props);
    let { episodeId, journeyType, jsonData } = props;
    this.state = {
      episodeId,
      JSONSchema: DEFAULT_JSON((journeyType == "2" )? jsonData[0].section : jsonData ),
      error: false,
      checkedBox: true,
      isMarkDone: false,
      showModel: false,
      readyToDone: false,
      isUpdate: false,
      showStatePopup: false,
      status: null,
      mediathekFileUidState: null,
      addContentData: {
        "updateType": 0,
        "externalId": ""
      },
      externalId: '',
      showMapContentModal: false,
      noDataFoundModel: false,
      dataFoundModel: false,
      showMapContentConfirmation: false,
      updateType: null,
      transcodingUid: ''
    };
  }

  async componentDidMount() {
    const requestParams = {
      episodeId: this.props.episodeId,
      stage: this.props.stage
    };
    this.getEpisodeDetails();
    await this.fillEpisodeVideoDetails(requestParams);
  }

  getEpisodeDetails = async () => {
    let { episodeId } = this.props;
    let url = `${Config.episode.video}/${episodeId}`;
    let response = await apiCalls(url, 'GET', {});
    if (response) {
      let { contentState } = response;
      this.setState({ status: contentState?.title, externalId: response?.externalId })
    }
  }

  setSelectDataArr = (res, index) => {
    const copySelect = [...this.state.JSONSchema];
    copySelect[index].data = res;
    this.setState({ filters: copySelect });
  };

  addContent = (jsonSchema) => {
    if(jsonSchema && jsonSchema.length  && !jsonSchema.find(item => item.name == 'mediathekFileUid')?.value?.length) {
      return
    }
    this.setState({
      addContentData: {
        ...this.state.addContentData,
        "externalId": this.props.externalId,
        "updateType": 1
      },
      showMapContentModal: !this.state.showMapContentModal,
      externalId: this.props.externalId
    })
  }

  // when click the import button get the data
  mapTranscodingContent = async (value) => {
    const { mediathekFileUidState, updateType } = this.state;
    const id = mediathekFileUidState;
    if (id !== null && id !== "") {
      const { JSONSchema } = this.state;
      const { language } = this.props;
      const url = `${Config.transcoding}/${id}`;
      let data = { ...this.state.addContentData };
      const response = await apiCalls(url, "PATCH", data, {});
      const copyJSON = [...JSONSchema];
      if (response && value) {
        const contentData = response;
        copyJSON.forEach((item) => {
          const value = contentData[item?.name];
          item.value = item.type === "dropdownAsync" ? value === "" ? null : value : item.type === "checkbox" ? !!value : value || "";
          if (item.name === 'drmKeyId') {
            const pIndex = copyJSON.findIndex(field => field.name == 'protected')
            if (pIndex >= 0) {
              if (item.value === "") {
                copyJSON[pIndex].disabled = true
              } else {
                copyJSON[pIndex].disabled = false
              }
            }
          }
          if (item.name === "mediathekFileUid") {
            item.value = id
          }
        });
        //checking form validity
        const { formValidity } = formValidityCheck(copyJSON);
        let updateObj = {
          formIsValid: formValidity,
          JSONSchema: copyJSON,
        };
        this.setState(updateObj, this.checkIfMarkAsDone);
        // save data to database
        this.props.refreshActionStatus();
        this.setState({
          isUpdate: true,
          JSONSchema: copyJSON,
          showMapContentModal: !this.state.showMapContentModal,
          dataFoundModel: !this.state.dataFoundModel
        });
        this.fillEpisodeVideoDetails({ episodeId: this.props.episodeId })
      } else {
        this.setState({
          showMapContentModal: !this.state.showMapContentModal,
          noDataFoundModel: !this.state.noDataFoundModel
        })
      }
    }
  }

  fillEpisodeVideoDetails = async (requestParams) => {
    const { episodeId } = requestParams;
    const { JSONSchema } = this.state;
    const url = `${Config.episode.video}/${episodeId}`;
    const response = await apiCalls(url, "GET", {});
    const copyJSON = [...JSONSchema];
    if (response) {
      const contentData = response[0];
      copyJSON.forEach((item) => {
        const value = contentData[item?.name];
        item.value = item.type === "dropdownAsync" ? value === "" ? null : value : item.type === "checkbox" ? !!value : value || "";
        if (item.name === 'drmKeyId') {
          const pIndex = copyJSON.findIndex(field => field.name == 'protected')
          if (pIndex >= 0) {
            if (item.value === "") {
              copyJSON[pIndex].disabled = true
            } else {
              copyJSON[pIndex].disabled = false
            }
          }
        }
        if (item?.name === "subtitleManifest") {
          item.value = value === true ? "True" : value === false ? "False" : null
        }
        if(item.name === 'mediathekFileUid'){
          this.setState({ transcodingUid: value });
        }
      });

      //checking form validity
      const { formValidity } = formValidityCheck(copyJSON);
      let updateObj = {
        formIsValid: formValidity,
        JSONSchema: copyJSON,
      };
      this.setState(updateObj, this.checkIfMarkAsDone);
    }
  };

  markAsDone = async () => {
    this.props.markAsDone(this.props?.selectedTab, true);
  };

  autoSave = async (elemIndex) => {
    const { JSONSchema } = this.state;
    const copyJSON = [...JSONSchema];
    const updatedElement = copyJSON[elemIndex];
    if (updatedElement?.touched && updatedElement.valid) {
      const { episodeId } = this.state;
      const url = `${Config.episode.video}/${episodeId}`;

      const episodeVideo = {};
      if (updatedElement.name === 'dashSuffixesId' || updatedElement.name === 'hlsSuffixesId' || updatedElement.name === 'mssSuffixesId') {
        episodeVideo[updatedElement?.name] = updatedElement.value.map(data => {
          if(data.id && data.id !== null){
            return data.id
              }
            }
          );
      } else {
        episodeVideo[updatedElement?.name] = updatedElement?.value
      }
      if (updatedElement?.name === "subtitleManifest") {
        episodeVideo[updatedElement.name] = updatedElement.value ==='True' ? true : updatedElement.value === 'False' ? false : null;
      }
      if (updatedElement.name === "mediathekFileUid") {
        this.setState({ mediathekFileUidState: updatedElement.value });
      }
      await apiCalls(url, "PUT", episodeVideo, null, false, false, this.props.autoSaveError);
      //updated element's touched property
      updatedElement.touched = 0;
      this.props.markAsDone(this.props?.selectedTab, false);
      this.setState({ isUpdate: true, JSONSchema: copyJSON });
    }
  };

  InputChanger = (event, elemIndex) => {
    const { status } = this.state;
    if (status === constantText.contentConstants.published) {
      this.setState({ status: constantText.contentConstants.changed })
    }
    if (status === constantText.contentConstants.submitToReview) {
      this.setState({ status: constantText.contentConstants.draft })
    }
    if (status === constantText.contentConstants.unpublished) {
      this.setState({ status: constantText.contentConstants.draft })
    }
    const copyJSON = [...this.state.JSONSchema];
    const updatedElement = copyJSON[elemIndex];
    if (updatedElement?.type === "file") {
      updatedElement.value = event?.target?.value;
      updatedElement.file = event?.target?.files[0];
    } else {
      if (updatedElement) updatedElement.value = event?.target?.value
    }
    //check validity
    const { isValid, errorText } = checkValidity(
      updatedElement?.value,
      updatedElement?.validation, false
    );
    if (updatedElement?.name === 'drmKeyId') {
      const pIndex = copyJSON.findIndex(field => field.name == 'protected')
      if (pIndex >= 0) {
        if (item.value === "") {
          copyJSON[pIndex].disabled = true
          copyJSON[pIndex].value = false
        } else {
          copyJSON[pIndex].disabled = false
        }
      }
    }
    if (updatedElement) {
      updatedElement.valid = isValid;
      updatedElement.errorText = errorText;
      //updated element's touched property
      updatedElement.touched = 1;
    }
    if(updatedElement.name === 'mediathekFileUid') {
      this.setState({
        transcodingUid: event?.target?.value
      })
    }
    const { formValidity } = formValidityCheck(copyJSON);
    this.setState({ JSONSchema: copyJSON, formIsValid: formValidity }, () => {
      this.checkIfMarkAsDone();
      if (updatedElement?.type === "checkbox" || updatedElement?.type === "dropdownAsync") {
        this.autoSave(elemIndex);
      }
    });
  };

  showHideStatePopup = () => {
    const { showStatePopup } = this.state;
    this.setState({
      showStatePopup: !showStatePopup,
    });
  };

  checkIfMarkAsDone = () => {
    const form = [...this.state.JSONSchema];
    let formIsValid = true;
    let elementValid = true;
    form.forEach((element) => {
      if (element?.validation?.required !== false) {
        let { isValid } = checkValidity(element.value, element.validation);
        elementValid = isValid;
        if (
          element.value === false ||
          element.value === null ||
          element.value === ""
        ) {
          elementValid = isValid && false;
        }
        formIsValid = elementValid && formIsValid;
      }
    });
    this.setState({ readyToDone: formIsValid });
  };

  async getVideo(params) {
    await this.props.getVideoData(params);
  }

  submItVideo = () => {
    let max = 250;
    const { formData } = this.state;
    const {
      audioLanguages,
      subtitleLanguages,
      drmKeyId,
      totalSizeInBytes,
      id,
    } = formData;

    if (
      maxLength(max, audioLanguages) ||
      maxLength(max, subtitleLanguages) ||
      maxLength(max, drmKeyId) ||
      maxLength(max, totalSizeInBytes) ||
      maxLength(max, id)
    ) {
      return this.setState({ error: true });
    }
  };

  toggleModel = () => {
    this.setState((prevState) => {
      return {
        showModel: !prevState.showModel,
      };
    });
  };

  unlockVideo = () => {
    this.toggleModel();
    this.props.unLockedSession(this.props?.selectedTab);
  };

  closeContentModal = () => {
    this.setState({
      showMapContentModal: !this.state.showMapContentModal
    })
  };
  closeNoDataFoundModel = () => {
    this.setState({
      noDataFoundModel: !this.state.noDataFoundModel
    })
  };
  closeDataFoundModel = () => {
    this.setState({
      dataFoundModel: !this.state.dataFoundModel
    })
  };


  render() {
    const {
      JSONSchema,
      readyToDone,
      status, showMapContentModal, showMapContentConfirmation
    } = this.state;

    let { currentTabData, stage } = this.props;
    let { isDone, isLocked, lockedBy } = currentTabData;

    return (
      <div className="video-page">
        <Lock lock={isLocked} lockedBy={lockedBy} clicked={this.toggleModel}>
          <div className="whitebox">
            <div className="drag-drop-wrap">
              <div className="ccm-head flex align-items-center justify-content-between">
                <h4>{constantText.video_information_text}</h4>
                <div className="status-head flex align-items-center">
                  {stage && <BadgeBox className="create-movie-stage" status={stage} />}
                  <div className="autosave">
                    {constantText.all_fields_auto_save_text}
                  </div>
                  <div
                    onClick={() => (readyToDone && !isDone && !isLocked) ? this.markAsDone() : {}}
                    disabled={isLocked} data-test="markAsDoneB-Btn"
                    className={`mark-done ${isDone ? "mark-active" : readyToDone ? "mark-fill-active" : ""} auto-mark-done`}
                  >
                    <span>
                      <MarkDone />
                    </span>
                    {constantText.mark_as_done_text}
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="row input-space-35">
                  <FormRender
                    form={JSONSchema} data-test="formRender"
                    onChange={this.InputChanger}
                    isDisable={isLocked}
                    setSelectDataArr={this.setSelectDataArr}
                    serverCall={true}
                    sectionMultipleBlock={
                      <div className="col-md-6 col-lg-6">
                        <div className="p-b-20 p-t-10">
                          <a onClick={() => this.addContent(JSONSchema)}>Import Details</a>
                        </div>
                      </div>}
                    handleBlur={(i) => this.autoSave(i)}
                  />
                </div>
              </div>
            </div>
          </div>
        </Lock>
        <CommonModel
          className="popup-wrap status-popup"
          state={this.state.showModel}
          showTitle={true}
          title={constantText.unlock_title_text}
          showIcon={true}
          icon={<LockIcon />}
          showDes={true}
          des={`${constantText.section_lock_with} ${this.state.lockedBy}, ${constantText.confirm_still_change}`}
          showBtn1={true}
          btn1Text={constantText.yes_text}
          btn1Action={this.unlockVideo}
          showBtn2={true}
          btn2Text={constantText.no_text}
          btn2Action={this.toggleModel}
          handleClose={this.toggleModel}
        />

        <CommonModel className='popup-wrap status-popup' state={this.state.dataFoundModel}
          showTitle={true} title={`${constantText.transcodingMappedSuccessTitle}`}
          showIcon={false}
          showDes={true} des={`${constantText.transcodingMappedSuccessMessage}`}
          showBtn1={true}
          btn1Text={constantText.ok}
          btn1Action={() => this.closeDataFoundModel()}
          showBtn2={false}
          handleClose={() => this.closeDataFoundModel()}
        />
        <CommonModel className='popup-wrap status-popup' state={this.state.noDataFoundModel}
          showTitle={true} title={`${constantText.no_result_only_text}`}
          showIcon={false}
          showDes={true} des={`${constantText.transcoding_data_not_found}`}
          showBtn1={true}
          btn1Text={constantText.ok}
          btn1Action={() => this.closeNoDataFoundModel()}
          showBtn2={false}
          handleClose={() => this.closeNoDataFoundModel()}
        />
        <CommonModel className='popup-wrap status-popup' state={showMapContentModal}
          showTitle={true} title={`Confirmation`}
          showIcon={false}
          showDes={false} des={`Do you want to map the UID ${this.state?.transcodingUid} with this assest (${this.state.externalId})?`}
          btn1Action={() => this.mapTranscodingContent(true)}
          btn2Action={() => this.closeContentModal()}
          handleClose={() => this.closeContentModal()}
        />
      </div>
    );
  }
}


export default EpisodeVideo;
