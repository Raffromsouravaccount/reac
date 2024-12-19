import React from "react";

import FieldSelector from "./FieldsSelector";

//Helper files
import ButtonField from "../../../Common/ButtonField/ButtonField";

const actors = ({
  metadata,
  castList,
  handleChange,
  handleMultiSelect,
  handleKeyPress,
  onBlur,
  manageActors, disabled,
  inputSearchHandler = () => {}
}) => {
  const actors = metadata?.attributes?.map((object, index) => {
    const actor = [];
    Object.keys(object).forEach(property => {
      actor.push(
        < FieldSelector
          key={index + '_' + object[property].name}
          field={{
            ...object[property],
          }}
          name={object[property].name}
          searchInput={(value, index)=> inputSearchHandler(value, index, object[property].name)}
          handleMultiSelect={(event, value) => { handleMultiSelect(event, index, value, object[property].name) }}
          handleChange={(event) => handleChange(event, index, object[property].name)}
          onBlur={(event) => { onBlur(event, index, object[property].name) }}
          disableCloseOnSelect={false}
          limitTags={1}
          moreText={'more'}
          keyText={'castName'}
          index={index}
          disabled={disabled}
        />
      );
    })
    return (
      <div className="add-plush-row" key={index}>
        <div className="row">{actor}</div>
        <div className={`${index > 0 ? "remove" : "add"}-btn create-btn`}>
          <ButtonField id="manageActors"
            autoId={`${index}`}
            buttonText={index > 0 ? "-" : "+"}
            onClick={(event) => {
              manageActors(event, index);
            }}
          />
        </div>
      </div>
    );
  });

  return <div className="actor-row">{actors}</div>;
};

export default React.memo(actors);
