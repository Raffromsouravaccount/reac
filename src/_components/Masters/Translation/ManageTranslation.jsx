import React, { Component } from "react";
import { connect } from "react-redux";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

//icons
import AngleLeftArrow from "images/angle-left-arrow.svg";

//Helper Files
import ButtonField from "../../Common/ButtonField/ButtonField";
import { masterConstants } from "../master.constant";
import { userActions } from "../../../_actions/user.action";
import { history } from "../../../_helpers/history";
import FormRender from "../../Common/FormHelper/FormRender";
import checkValidity from "../../Common/FormHelper/FieldValidator";
import {
  isValidatedForm,
  formValidityCheck,
  DEFAULT_JSON,
} from "../../Common/FormHelper/FormValidSetter";
//Json
import TranslationJSON from "./Schema/Translation.json";
const SET_LABEL = (json, buttonText) => {
  if (json && json.length) {
    return json.map((item) => {
      item.label = `${buttonText} in ${item.moreText}`;
      return item;
    });
  }
};
class ManageTranslation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formIsValid: false,
      translationValid: true,
      TranslationSchema: [],
      mode: null,
      data: null,
      moduleName: "",
      buttonText: "",
      apiKey: "",
      selectedStatus: "",
      UUID: null,
      formData: null,
      isDisabled: true,
    };
  }

  componentDidMount() {
    const paramsString = this.props.location?.search;
    const params = new URLSearchParams(paramsString);
    const mode = params.get("mode");
    const { location } = this.props;
    if (location?.state && ["Create", "Edit"].some((e) => e === mode)) {
      const {
        moduleName,
        buttonText,
        apiKey,
        formData,
        data,
        selectedStatus,
        UUID,
      } = location?.state;
      this.setState(
        {
          mode: mode,
          moduleName: moduleName,
          buttonText: buttonText,
          apiKey: apiKey,
          data: data,
          TranslationSchema: SET_LABEL(
            DEFAULT_JSON(TranslationJSON),
            buttonText
          ),
          formData: DEFAULT_JSON(formData),
          selectedStatus: selectedStatus || "",
          UUID: UUID || null,
        },
        this.fillDetails
      );
    } else {
      history.push(`/masters`);
    }
  }
  fillDetails = () => {
    const { mode, data, formData, TranslationSchema } = this.state;
    if (mode === "Edit") {
      const copyTranslation = [...TranslationSchema];
      const copyFormData = [...formData];
      copyFormData.forEach((item) => {
        item.value = item?.type === "checkbox" ? (data[item?.name] == "1" ? true : false) : data[item?.name] || "";
        item.touched = 1;
      });
      const formIsValid = isValidatedForm(copyFormData).formValidity;
      if (data?.translations && Array.isArray(data?.translations)) {
        data?.translations.forEach((item) => {
          const index = copyTranslation.findIndex((e) => e.name === item?.code);
          if (copyTranslation[index]) {
            copyTranslation[index].value = item?.title;
            copyTranslation[index].touched = 1;
          }
        });
      }
      const translationValid = isValidatedForm(copyTranslation).formValidity;
      this.setState({
        formData: copyFormData,
        translationValid: translationValid,
        formIsValid: formIsValid,
        TranslationSchema: copyTranslation,
      });
    }
  };
  TranslationChanger = (event, elemIndex) => {
    const copyJSON = [...this.state.TranslationSchema];
    const updatedElement = copyJSON[elemIndex];
    if (updatedElement) {
      updatedElement.value = event.target.value;
    }
    //check validity
    const { isValid, errorText } = checkValidity(
      updatedElement?.value,
      updatedElement?.validation
    );
    if (updatedElement) {
      updatedElement.valid = isValid;
      updatedElement.errorText = errorText;
      //updated element's touched property
      updatedElement.touched = 1;
    }
    const { formValidity } = formValidityCheck(copyJSON);
    this.setState({
      TranslationSchema: copyJSON,
      translationValid: formValidity,
    });
  };
  InputChanger = (event, elemIndex) => {
    const copyJSON = [...this.state.formData];
    const updatedElement = copyJSON[elemIndex];
    if (updatedElement?.type === "file") {
      updatedElement.value = event.target.value;
      updatedElement.file = event?.target?.files[0];
    } else if (updatedElement) {
      updatedElement.value =
        updatedElement?.type === "checkbox"
          ? event.target.value
          : event.target.value.trim()
          ? event.target.value
          : event.target.value.trim();
    }
    //check validity
    const { isValid, errorText } = checkValidity(
      updatedElement?.value,
      updatedElement?.validation
    );
    if (updatedElement) {
      updatedElement.valid = isValid;
      updatedElement.errorText = errorText;
      //updated element's touched property
      updatedElement.touched = 1;
    }
    const { formValidity } = formValidityCheck(copyJSON);
    this.setState({ formData: copyJSON, formIsValid: formValidity });
  };
  handleSave = async () => {
    const {
      translationValid,
      formIsValid,
      apiKey,
      selectedStatus,
      UUID,
      mode,
      formData,
      TranslationSchema,
    } = this.state;
    if (translationValid && formIsValid) {
      const { createMaster, updateMaster } = this.props;
      const redirectPath = `/manage-masters?module=${apiKey}`;
      let translationKey = "title";
      const postObj = {};
      postObj.type = apiKey;
      postObj.translations = [];
      formData.forEach((item) => {
        if(item?.type !== "sectionMultiple"){
          postObj[item?.name] = item?.name === "title" ? item?.value : item?.type === "checkbox" ? (item?.value ? "1" : "0") : item?.value;
        }
      });
      TranslationSchema.forEach((item) => {
        let obj = {};
        if (item?.value !== "") {
          obj.code = item?.name;
          obj[translationKey] = item?.value;
          postObj.translations.push(obj);
        }
      });

      if (mode === "Create") {
        const res = await createMaster(postObj, redirectPath, redirectPath);
      } else {
        const res = await updateMaster(
          UUID,
          postObj,
          redirectPath,
          redirectPath
        );
      }
    }
  };
  handleRoute = (route) => {
    history.push(route);
  };

  render() {
    let {
      mode,
      moduleName,
      buttonText,
      apiKey,
      TranslationSchema,
      formData,
      translationValid,
      formIsValid,
    } = this.state;

    return (
      <div>
        <div className="countrygroup d-wrap c-n">
          <div className="bread-crumb top-minus-20">
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
              <Link
                color="inherit"
                data-test="masters"
                onClick={() => this.handleRoute("/masters")}
              >
                {masterConstants.masterHeader}
              </Link>
              <Link
                color="inherit"
                data-test="master-module"
                onClick={() =>
                  this.handleRoute(`/manage-masters?module=${apiKey}`)
                }
              >
                {moduleName}
              </Link>
              <Typography color="textPrimary">{`${mode} ${buttonText}`}</Typography>
            </Breadcrumbs>
          </div>
          <div className="profile-head flex align-items-center justify-content-between">
            <div className="back-user-btn auto-back-btn">
              <span
                data-test="manage-master-backbtn"
                onClick={() =>
                  this.handleRoute(`/manage-masters?module=${apiKey}`)
                }
              >
                <AngleLeftArrow />
              </span>
              <strong>
                <span>{`${mode} ${buttonText}`}</span>
              </strong>
            </div>
          </div>

          <div className="create-u-form p-detail-w">
            <div className="create-u-head flex align-items-center justify-content-between">
              <div className="l-title">{`${buttonText} Details`}</div>
            </div>
            <div className="countrybox">
              <div className="row input-space-35">
                {formData && (
                  <FormRender
                    form={formData}
                    sectionMultipleBlock={
                      <div className="col-md-12 col-lg-12 m-b-20">
                        <div className="l-title">
                          {masterConstants?.assetTypeText}
                        </div>
                      </div>
                    }
                    onChange={this.InputChanger}
                  />
                )}
              </div>
            </div>
            <div className="create-u-head flex align-items-center justify-content-between">
              <div className="l-title">{`Language Translations`}</div>
            </div>
            <div className="countrybox">
              <div className="row input-space-35">
                <FormRender
                  form={TranslationSchema}
                  onChange={this.TranslationChanger}
                />
              </div>
              <div className="row">
                <div className="col-md-4">
                  <ButtonField
                    className="zee-btn-field zee-full"
                    variant="contained"
                    color="primary"
                    onClick={this.handleSave}
                    disabled={!(translationValid && formIsValid)}
                    buttonText={"Save"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const actionCreators = {
  createMaster: userActions.create_master_action,
  updateMaster: userActions.update_master_action,
};

export default connect(null, actionCreators)(ManageTranslation);
