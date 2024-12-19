import React, { Component } from "react";
import { connect } from "react-redux";

//Services
import { apiCalls } from "../../../../_services/common.service";

//Helper Files
import Config from "../../../../Config/config";
import { getLocalData } from "../../../../_helpers/util";
import { constantText } from "../../../../_helpers/constants.text";
import FormRender from "../../../Common/FormHelper/FormRender";
import checkValidity from "../../../Common/FormHelper/FieldValidator";
import { formValidityCheck } from "../../../Common/FormHelper/FormValidSetter";
import BadgeBox from "../../../Common/BadgeBox/BadgeBox";
import Lock from "../../../Common/Locked/Locked";
import LockedPopup from "../../../CreateMovie/LockedPopup";
//Json
import SeoJson from "../../Schema/Seo.json";
//Images
import MarkDone from "images/tick.svg";

const DEFAULT_JSON = (json) => {
  if (json && json.length) {
    return json.map((item) => {
      (item.value =
        item.type === "checkbox"
          ? false
          : item.type === "dropdown"
          ? null
          : ""),
        (item.touched = 0);
      item.valid = true;
      return item;
    });
  }
};
class Seo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      JSONSchema: DEFAULT_JSON(SeoJson) || [],
      collectionId: null,
      formIsValid: false,
      action: "Draft",
      lockedBy: "",
      isDone: false,
      readyToDone: true,
      isUpdate: false,
      showStatePopup: false,
      showLockedPopup: false,
      status: null
    };
  }
  componentDidMount() {
    let { collectionId } = this.props;
    this.setState({ collectionId: collectionId || null }, () => {
      this.fillSeo();
      this.getCollectionData(collectionId)
    });
  }

  getCollectionData = async contentId => {
    let response = await apiCalls(`${Config.collectionProperties}/${contentId}`, 'GET', {});
    if (response) {
      let { contentState } = response;
      this.setState({ status: contentState?.title })
    }
  }


  fillSeo = async () => {
    const { collectionId, JSONSchema } = this.state;
    const url = `${Config.collectionSeo}/${collectionId}`;
    const response = await apiCalls(url, "GET", {});
    if (response && response[0]) {
      const contentData = response[0];
      const copyJSON = [...JSONSchema];
      copyJSON.forEach((item) => {
        const value = contentData[item?.name];
        item.value =
          item.type === "dropdown" ? (value === "" ? null : value) : value;
        item.touched = 0;
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

  handleMarkAsDone = (mode) => {
    const { selectedTab } = this.props;
    this.props?.markAsDone(selectedTab, mode);
  };

  autoSave = async (elemIndex) => {
    const { JSONSchema, action, collectionId } = this.state;
    let { state, currentTabData } = this.props;
    let { isDone, isLocked, lockedBy } = currentTabData || {};
    const copyJSON = [...JSONSchema];
    const updatedElement = copyJSON[elemIndex];
    if (updatedElement.valid && isLocked !== true && updatedElement?.touched) {
      const url = `${Config.collectionSeo}/${collectionId}`;

      const putData = {};
      putData[updatedElement?.name] = updatedElement?.value;
      await apiCalls(
        url,
        "PUT",
        putData,
        `/collection/edit/${collectionId}`,
        false
      );
      //updated element's touched property
      updatedElement.touched = 0;
      this.setState({ isUpdate: true, JSONSchema: copyJSON });
    }
  };
  InputChanger = (event, elemIndex) => {
    const copyJSON = [...this.state.JSONSchema];
    const updatedElement = copyJSON[elemIndex];
    let { status } = this.state;
    if (status === constantText.collectionConstants.published) {
      this.setState({status : constantText.castProfile.changed})
    }
    if (status === constantText.contentConstants.unpublished || status === constantText.contentConstants.scheduled || status === constantText.contentConstants.needWork) {
      this.setState({ status: constantText.contentConstants.draft });
    }
    if (updatedElement.type === "file") {
      updatedElement.value = event.target.value;
      updatedElement.file = event.target.files[0];
    } else {
      updatedElement.value =
        updatedElement?.type === "checkbox"
          ? event.target.checked
          : event?.target.value;
    }
    //check validity
    const { isValid, errorText } = checkValidity(
      updatedElement.value,
      updatedElement.validation
    );
    updatedElement.valid = isValid;
    updatedElement.errorText = errorText;
    //updated element's touched property
    updatedElement.touched = 1;
    const { formValidity } = formValidityCheck(copyJSON);
    this.setState({ JSONSchema: copyJSON, formIsValid: formValidity }, () => {
      this.handleMarkAsDone(false);
      this.checkIfMarkAsDone();
      if (updatedElement.type === "checkbox") {
        this.autoSave(elemIndex);
      }
    });
  };
  checkIfMarkAsDone = () => {
    const form = [...this.state.JSONSchema];
    let formIsValid = true;
    let elementValid = true;
    form.forEach((element) => {
      let { isValid } = checkValidity(element.value, element.validation);
      elementValid = isValid;
      formIsValid = elementValid && formIsValid;
    });
    this.setState({ readyToDone: formIsValid });
  };

  showHideStatePopup = () => {
    let { showLockedPopup } = this.state;
    this.setState({
      showLockedPopup: !showLockedPopup
    });
  };

  unLockProperties = () => {
    this.showHideStatePopup();
    this.props?.unLockedSession(this.props?.selectedTab);
  }


  render() {
    const {
      JSONSchema,
      readyToDone,
      showLockedPopup,
      status
    } = this.state;
    let { currentTabData } = this.props;
    let { isDone, isLocked, lockedBy } = currentTabData || {};
    return (
      <Lock
        lock={isLocked}
        lockedBy={lockedBy}
        clicked={this.showHideStatePopup}
      >
        <div className="whitebox">
          <div className="drag-drop-wrap">
            <div className="ccm-head flex align-items-center justify-content-between">
              <h4>{constantText.seo_details_text}</h4>
              <div className="status-head flex align-items-center">
                {status && <BadgeBox className="create-movie-stage" status={status} />}
                <div className="autosave">
                  {constantText.all_fields_auto_save_text}
                </div>
                <div
                  data-test="handleMarkDone"
                  onClick={() => {
                    if (readyToDone && !isLocked && !isDone)
                      this.handleMarkAsDone(true);
                  }}
                  id={isLocked ? 'disabled-mark-done-div' : ''}
                  className={`mark-done ${isDone ? "mark-active " : readyToDone ? "mark-fill-active" : ""} auto-mark-done`}
                >
                  <span>
                    <MarkDone />
                  </span>
                  Mark as Done
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="row input-space-35">
                <FormRender
                  data-test="inputChanger"
                  form={JSONSchema}
                  onChange={this.InputChanger}
                  handleBlur={this.autoSave}
                  isDisable={isLocked}
                />
              </div>
            </div>
          </div>
        </div>
        <LockedPopup
          className="popup-wrap status-popup"
          lockedBy={lockedBy}
          state={showLockedPopup}
          lockedBy={lockedBy}
          doneAction={this.unLockProperties}
          cancelAction={this.showHideStatePopup}
        />
      </Lock>
    );
  }
}

export default Seo;
