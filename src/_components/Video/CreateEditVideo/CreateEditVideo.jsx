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

import { DEFAULT_JSON } from "../../../_helpers/util";

import MarkDone from "images/tick.svg";
import LockIcon from "images/lock-icon.svg";
import "../../../../public/css/Common/CreateEditVideo.css";
import BadgeBox from "../../Common/BadgeBox/BadgeBox";

class CreateEditVideo extends Component {
  constructor(props) {
    super(props);
    const {jsonData}= props;
    this.state = {
      contentId: this.props.contentId,
      JSONSchema: DEFAULT_JSON(jsonData),
      error: false,
      checkedBox: true,
      isMarkDone: false,
      showModel: false,
      readyToDone: false,
      isUpdate: false,
      showStatePopup: false,
      status: null,
      mediathekFileUidState: null,
    };
  }

  async componentDidMount() {
    const requestParams = {
      contentId: this.props.contentId,
      stage: this.props.stage,
    };
    await this.getVideoDetails();
    await this.fillVideoDetails(requestParams);
  }

  getVideoDetails = async () => {
    let { contentId } = this.props;
    let url = `${Config.videoProperties}/${contentId}`;
    let response = await apiCalls(url, 'GET', {});
    if (response) {
      let { contentState } = response;
      this.setState({ status: contentState?.title })
    }
  }

  setSelectDataArr = (res, index) => {
    const copySelect = [...this.state.JSONSchema];
    copySelect[index].data = res;
    this.setState({ filters: copySelect });
  };
  // when click the import button get the data
  importDetails = async () => {
    // 'MAAPLA_SINGAM_MOVIE_RTR_ta'
    const id = this.state.mediathekFileUidState;
    if (id !== null && id !== "") {
      const { JSONSchema } = this.state;
      const url = `${Config.movieVideoTranscoding}/${id}`;
      const response = await apiCalls(url, "GET", {});
      const copyJSON = [...JSONSchema];
      if (response) {
        const contentData = response;
        copyJSON.forEach((item) => {
          const value = contentData[item?.name];
          item.value =
            item.type === "dropdownAsync"
              ? value === ""
                ? null
                : value
              : item.type === "checkbox"
              ? !!value
              : value || "";
          if (item.name === "drmKeyId") {
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
        const { contentId } = this.state;
        const videoSaveUrl = `${Config.video.video}/${contentId}`;
        const urlProperties = `${Config.videoProperties}/${contentId}`;  
        let modifiedHlsId = [];
        contentData.hlsSuffixesId?.filter(data => modifiedHlsId.push(data.id))
        contentData.hlsSuffixesId = modifiedHlsId
        let modifiedDashId = [];
        contentData.dashSuffixesId?.filter(data => modifiedDashId.push(data.id))
        contentData.dashSuffixesId = modifiedDashId;
        const modifiedMssId = [];
        contentData.mssSuffixesId?.filter(data => modifiedMssId.push(data.id));
        contentData.mssSuffixesId = modifiedMssId;
        let contentDuration = contentData?.content_duration || null;
        delete contentData['content_duration'];
        await apiCalls(
          videoSaveUrl,
          "PUT",
          contentData,
          null,
          false,
          false,
          this.props.autoSaveError
        );
        if(contentDuration){
          contentDuration = new Date(contentDuration * 1000).toISOString().substr(11, 8);
          let videoData = {video: { duration : contentDuration}};
          await apiCalls(urlProperties, "PUT", videoData, 'null', false, false);
        }
        this.props.markAsDone(this.props?.selectedTab, false);
        this.setState({ isUpdate: true, JSONSchema: copyJSON });
      }
    }
  };

  fillVideoDetails = async (requestParams) => {
    const { contentId } = requestParams;
    const { JSONSchema } = this.state;
    const url = `${Config.video.video}/${contentId}`;
    const response = await apiCalls(url, "GET", {});
    const copyJSON = [...JSONSchema];
    if (response) {
      const contentData = response[0];
      copyJSON.forEach((item) => {
        const value = contentData[item?.name];
        item.value =
          item.type === "dropdownAsync"
            ? value === ""
              ? null
              : value
            : item.type === "checkbox"
            ? !!value
            : value || "";
        if (item.name === "drmKeyId") {
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
      const { contentId } = this.state;
      const url = `${Config.video.video}/${contentId}`;

      let putData = {};
      if (
        updatedElement.name === "dashSuffixesId" ||
        updatedElement.name === "hlsSuffixesId" ||
        updatedElement.name === 'mssSuffixesId'
      ) {
        putData[updatedElement?.name] = updatedElement.value.map(
          (data) => data.id
        );
      } else {
        putData[updatedElement?.name] = updatedElement?.value;
      }
      if (updatedElement?.name === "subtitleManifest") {
        putData[updatedElement.name] = updatedElement.value === 'True' ? true : updatedElement.value === 'False' ? false : null;
      }
      if (updatedElement.name === "mediathekFileUid") {
        this.setState({ mediathekFileUidState: updatedElement.value });
      }

      await apiCalls(
        url,
        "PUT",
        putData,
        null,
        false,
        false,
        this.props.autoSaveError
      );
      //updated element's touched property
      updatedElement.touched = 0;
      this.props.markAsDone(this.props?.selectedTab, false);
      this.setState({ isUpdate: true, JSONSchema: copyJSON });
    }
  };

  InputChanger = (event, elemIndex) => {
    const { status } = this.state;
    if (status === constantText.videoConstants.published) {
      this.setState({ status: constantText.videoConstants.changed });
    }
    if (status === constantText.videoConstants.submitToReview) {
      this.setState({ status: constantText.videoConstants.draft });
    }
    const copyJSON = [...this.state.JSONSchema];
    const updatedElement = copyJSON[elemIndex];
    if (updatedElement.type === "file") {
      updatedElement.value = event.target.value;
      updatedElement.file = event.target.files[0];
    } else {
      updatedElement.value = event.target.value;
    }
    //check validity
    const { isValid, errorText } = checkValidity(
      updatedElement.value,
      updatedElement.validation,
      false
    );
    if (updatedElement.name === "drmKeyId") {
      const pIndex = copyJSON.findIndex(field => field.name == 'protected')
      if (pIndex >= 0) {
        if (item.value === "") {
          copyJSON[pIndex].disabled = true
          copyJSON[pIndex].value = false;
        } else {
          copyJSON[pIndex].disabled = false
        }
      }
    }
    updatedElement.valid = isValid;
    updatedElement.errorText = errorText;
    //updated element's touched property
    updatedElement.touched = 1;
    const { formValidity } = formValidityCheck(copyJSON);
    this.setState({ JSONSchema: copyJSON, formIsValid: formValidity }, () => {
      this.checkIfMarkAsDone();
      if (
        updatedElement.type === "checkbox" ||
        updatedElement.type === "dropdownAsync"
      ) {
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

  render() {
    const {
      JSONSchema,
      readyToDone,
      status,
    } = this.state;

    let { currentTabData } = this.props;
    let { isDone, isLocked, lockedBy } = currentTabData;

    return (
      <div className="video-page">
        <Lock lock={isLocked} lockedBy={lockedBy} clicked={this.toggleModel}>
          <div className="whitebox">
            <div className="drag-drop-wrap">
              <div className="ccm-head flex align-items-center justify-content-between">
                <h4>{constantText.video_information_text}</h4>
                <div className="status-head flex align-items-center">
                  {status && (
                    <BadgeBox
                      className="create-movie-stage"
                      status={status}
                      dot={true}
                    />
                  )}
                  <div className="autosave">
                    {constantText.all_fields_auto_save_text}
                  </div>
                  <div
                    onClick={() =>
                      readyToDone && !isDone && !isLocked
                        ? this.markAsDone()
                        : {}
                    }
                    disabled={isLocked}
                    className={`mark-done ${
                      isDone
                        ? "mark-active"
                        : readyToDone
                        ? "mark-fill-active"
                        : ""
                    }`}
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
                    form={JSONSchema}
                    onChange={this.InputChanger}
                    isDisable={isLocked}
                    setSelectDataArr={this.setSelectDataArr}
                    serverCall={true}
                    sectionMultipleBlock={
                      <div className="col-md-6 col-lg-6">
                        <div className="p-b-20 p-t-10">
                          <a onClick={() => this.importDetails()}>
                            Import Details
                          </a>
                        </div>
                      </div>
                    }
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
      </div>
    );
  }
}

export default CreateEditVideo;
