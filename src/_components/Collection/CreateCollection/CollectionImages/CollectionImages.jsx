import React, { Component } from 'react';

import CollectionImagesJSON from "../../Schema/CollectionImages.json";
import SelectWithSearch from "../../../Common/SelectWithSearch/SelectWithSearch";
import ButtonField from "../../../Common/ButtonField/ButtonField";
import InputField from "../../../Common/InputField/InputField";
import TagIcon from "images/tag-icon.svg";


class CollectionImages extends Component {

  getFormElement = (element) => {
    const { name, type, placeHolder, required, multiple,options } = element;

    switch (type) {
      case "text":
        return (
          <InputField
            className="zee-input-field"
            label={placeHolder}
            required={required}
            name={name}
          />
        );
        break;
        case "tagimage":
        return (
          <div className="img-tag flex align-items-center">
            <span className="tag-icon">
              <TagIcon />
            </span>{" "}
            Image Tags
          </div>
        );
        break;
      case "dropDown":
        return (
          <SelectWithSearch
            className="zee-SelectWSearch-field"
            name={name}
            data={options}
            limitTags={1}
            label={placeHolder}
            placeholder={placeHolder}
            moreText={"more"}
            keyText={"DisplayName"}
            required={required}
            multiple={multiple}
          />
        );
        break;
      default:
        return null;
        break;
    }
  };

  render() {
    return (
      <div>
        {CollectionImagesJSON.map((element) => this.getFormElement(element))}
        <ButtonField
                  className="zee-btn-field zee-full"
                  variant="contained"
                  color="primary"
                  buttonText={"Save"}
                  // onClick={() => { this.handleSubmit('update') }}
                />
      </div>
    );
  }
}

export default CollectionImages;