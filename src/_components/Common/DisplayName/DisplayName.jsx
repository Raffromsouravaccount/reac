import React, { Component, Fragment } from "react";
import { constantText } from "../../../_helpers/constants.text";
import { getSelectedGroup } from "../../../_helpers/util";
import ButtonField from "../ButtonField/ButtonField";
import checkValidity from "../FormHelper/FieldValidator";
import FormRender from "../FormHelper/FormRender";

class DisplayName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disableGlobalFields: true,
      disableSaveButton: false,
      jsonFields: [],
    };
  }

  componentWillReceiveProps = (nextProps) => {
    let jsonFields = [];
    if (nextProps.assignedData?.length) {
      nextProps.assignedData.forEach((items) => {
        const { title } = items;
        let titleFields =
          JSON.parse(JSON.stringify(this.props?.jsonFields?.default)) || [];
        titleFields = titleFields.map((field) => {
          field = { ...field };
          field.value = title[field.name] || field.value;
          return field;
        });
        let itemsData = { title: titleFields, id: items.id };
        if (items.country?.length) {
          itemsData["country"] = JSON.parse(
            JSON.stringify(this.props?.jsonFields?.group)
          );
          itemsData["country"].value = items.country;
        }
        jsonFields.push(itemsData);
      });
      this.setState({ jsonFields });
    }
  };

  componentDidMount = () => {
    let jsonFields = JSON.parse(JSON.stringify(this.state.jsonFields));
    jsonFields.push({
      title: JSON.parse(JSON.stringify(this.props?.jsonFields?.default)),
    });
    this.setState({ jsonFields });
  };

  addGroup = () => {
    let jsonFields = JSON.parse(JSON.stringify(this.state.jsonFields));
    let globalFields = {
      title: JSON.parse(JSON.stringify(this.props?.jsonFields?.default)),
      country: JSON.parse(JSON.stringify(this.props?.jsonFields?.group)),
    };
    jsonFields.push(globalFields);
    this.setState({ jsonFields }, () => {
      this.disableSave();
    });
  };

  removeGroup = (index) => {
    let jsonFields = JSON.parse(JSON.stringify(this.state.jsonFields));
    jsonFields.splice(index, 1);
    this.setState({ jsonFields }, () => {
      this.disableSave();
    });
  };

  inputChange = (e, index, subIndex, country) => {
    let { disableSaveButton } = this.state;
    const { value } = e.target;
    let jsonFields = JSON.parse(JSON.stringify(this.state.jsonFields));
    if (country) {
      jsonFields[index]["country"].value = value;
      disableSaveButton = !value.length ? true : false;
    } else {
      const { errorText } = checkValidity(
        value,
        jsonFields[index]["title"][subIndex].validation || {},
        false
      );
      jsonFields[index]["title"][subIndex] = {
        ...jsonFields[index]["title"][subIndex],
        value,
        errorText,
      };
      disableSaveButton = errorText.length ? true : false;
    }
    this.setState({ jsonFields }, () => {
      this.disableSave(disableSaveButton);
    });
  };

  setSelectDataArr = (value, indx, index) => {
    const { jsonFields } = this.state;
    const copyJSON = [...jsonFields];
    const updatedElement = copyJSON[indx]["country"];
    if (value.length) {
      const groupName = [];
      value.forEach((group) => {
        group?.countries.forEach((item) => {
          const obj = { ...item };
          obj.group = group?.title;
          groupName.push(obj);
        });
      });
      if (updatedElement) updatedElement.data = groupName;
    }
    this.setState({ jsonFields: copyJSON });
  };

  selectGroup = (event, indx, index, group) => {
    const { jsonFields } = this.state;
    const copyFormFieldsJson = JSON.parse(JSON.stringify(jsonFields));
    const copyElement = { ...copyFormFieldsJson[indx]["country"] };
    const copyOptions = [...copyElement.data];
    copyElement.value = getSelectedGroup(
      event,
      group,
      copyOptions,
      copyElement.value
    );
    copyFormFieldsJson[indx]["country"] = copyElement;
    this.setState({ jsonFields: copyFormFieldsJson });
  };

  saveDisplayName = () => {
    let jsonFields = JSON.parse(JSON.stringify(this.state.jsonFields));
    jsonFields = jsonFields.map((field) => {
      let fieldObj = { ...field };
      fieldObj.title = {};
      field.title.forEach((item) => {
        fieldObj.title[`${item.name}`] = item.value;
      });
      if (fieldObj.country) {
        fieldObj.country = fieldObj.country.value.map((item) => item.id);
      }
      return fieldObj;
    });
    this.props?.saveDisplayName(jsonFields);
  };

  disableSave = (disable) => {
    const { jsonFields } = this.state;
    const jsonFieldsCopy = JSON.parse(JSON.stringify(jsonFields));
    if (disable) {
      this.setState({ disableSaveButton: true });
    } else {
      let disableSaveButton = false;
      for (let i = 0; i < jsonFieldsCopy.length; i++) {
        if (
          jsonFieldsCopy[i].country &&
          !jsonFieldsCopy[i].country.value.length
        ) {
          disableSaveButton = true;
          break;
        }
        if (
          jsonFieldsCopy[i].title.filter(
            (item) => item.errorText && item.errorText.length
          ).length
        ) {
          disableSaveButton = true;
          break;
        }
      }
      this.setState({ disableSaveButton });
    }
  };

  render() {
    const { isLocked } = this.props;
    const { disableSaveButton, jsonFields, disableGlobalFields } = this.state;
    return (
      <div className="movie-f-wrap">
        <div className="whitebox m-b-30">
          <div className="col-12 p-all-15">
            <div className="global-wrap">
              {jsonFields?.map((field, indx) =>
                !field.country ? (
                  <Fragment key={indx}>
                    <div className="global-row">
                      <div className="row input-space-35">
                        <FormRender
                          form={field.title}
                          onChange={(e, index) =>
                            this.inputChange(e, indx, index)
                          }
                          isDisable={isLocked}
                        />
                      </div>
                    </div>
                    {!disableGlobalFields && <div className="global-row">
                      <div className="add-plush-row top-title">
                        <div className="top-text">
                          {constantText.global_title_display_name}
                        </div>
                        <div className="add-another-f-btn create-btn">
                          <div
                            className={` auto-add-${indx} add-btn-field flex align-items-center`}
                            id="addMultipleFieldsBtn" data-test="addGroup"
                            onClick={this.addGroup}
                          >
                            <span className="plush-icon-btn"></span>
                          </div>
                        </div>
                      </div>
                    </div>}
                  </Fragment>
                ) : (
                  !disableGlobalFields && <div className="global-row" key={indx}>
                    <div className="add-plush-row top-title">
                      <div className="top-text">
                        {constantText.global_set_display_name} - {indx}
                      </div>
                      <div className="add-another-f-btn create-btn">
                        <div
                          className={`remove-btn auto-delete-${indx} add-btn-field flex align-items-center`}
                          id="addRemoveMultipleFieldsBtn"
                          onClick={() => this.removeGroup(indx)}
                        >
                          <span className="plush-icon-btn"></span>
                        </div>
                      </div>
                    </div>
                    <div className="row input-space-35">
                      <FormRender
                        form={[field.country]}
                        onChange={(e, index) =>
                          this.inputChange(e, indx, index, true)
                        }
                        selectGroup={(e, group) =>
                          this.selectGroup(e, indx, null, group)
                        }
                        setSelectDataArr={(value, index) =>
                          this.setSelectDataArr(value, indx, index)
                        }
                        isDisable={isLocked}
                      />
                    </div>
                    <div className="row input-space-35">
                      <FormRender
                        form={field.title}
                        onChange={(e, index) =>
                          this.inputChange(e, indx, index)
                        }
                        isDisable={isLocked}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="row input-space-35">
              <div className="col-4">
                <ButtonField
                  className="zee-btn-field zee-full"
                  variant="contained"
                  color="primary"
                  buttonText={
                    constantText.create_movie_image_create_set_save_text
                  }
                  disabled={disableSaveButton}
                  onClick={() => this.saveDisplayName()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default DisplayName;
