import React from "react";

import InputField from '../InputField/InputField'

import List from "images/list.svg";
import { constantText } from "../../../_helpers/constants.text";

const Content = ({
  item,
  canChangeTitle = false,
  inputLabel,
  inputName,
  inputDisabled,
  draggable,
  changeHandler,
  onBlurHandler }) => {
  const contentTypeKey = Object.keys(item).find(elm => elm.includes('ContentType'));
  return (
    <div className="related-list m-b-30">
      <div className="row">
        <div className="col-md-8">
          <div className="whitebox flex align-items-center">
            <div className="flex right-icon">
              <span
                className="list"
                {...draggable?.dragHandleProps}>
                <List />
              </span>
            </div>
            <div className="left-text">
              <span>{item[contentTypeKey] == 'Tvshow' ? constantText.episodeConstant.tvShow : item[contentTypeKey]}</span>
              {item?.newTitle ? <strong> &gt;&gt; {item?.newTitle}</strong> : item?.title ? (<strong> &gt;&gt; {item?.title}</strong>) : null}
            </div>
          </div>
        </div>
        {canChangeTitle ?
          <div className="col-md-4">
            <InputField
              className="zee-input-field"
              name={inputName}
              label={inputLabel}
              value = {item.newTitle?.length >= 0 ? item.newTitle : item.title || ""}
              disabled={inputDisabled}
              onChange={changeHandler}
              onBlur={onBlurHandler} />
          </div> : null}
      </div>
    </div>
  );
};

export default React.memo(Content);
