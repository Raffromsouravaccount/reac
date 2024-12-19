import React from "react";

import FieldSelector from "./FieldsSelector";

const others = ({
  metadata,
  castList,
  handleChange,
  handleMultiSelect,
  handleKeyPress,
  onBlur, disabled,
  inputSearchHandler = () => {}
}) => {
  return (
    <div className="row input-space-35">
      {metadata.attributes.map((field, index) => (
        <FieldSelector
          key={index + "_" + field.name}
          field={{
            ...field
          }} id="FieldSelector"
          name={field.name}
          disabled={disabled}
          searchInput={(value)=> inputSearchHandler(value, index, index)}
          handleMultiSelect={(event, value) => handleMultiSelect(event, index, value)}
          handleChange={(event) => handleChange(event, index, field.name)}
          onKeyPress={(event) => handleKeyPress(event, index, field.name)}
          onBlur={(event) => onBlur(event, index, field.name)}
          disableCloseOnSelect={false}
          limitTags={1}
          moreText={"more"}
          keyText={"castName"}
          index={index}
        />
      ))}
    </div>
  );
};

export default React.memo(others);
