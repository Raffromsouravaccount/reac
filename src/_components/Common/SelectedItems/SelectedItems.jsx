import React from 'react'

import Cross from "images/cross.svg";

const selectedItems = ({ list, removed, assignContent, buttonText, title, isLocked, contentIdKey,isRelatedContent }) => {

  const items = list?.map((item) => {
    return (
      <li key={contentIdKey ? item[contentIdKey] : item?.movieId}>
      { isRelatedContent ?  item?.title : `${item?.title}(${ item?.externalId})`}
        <span onClick={(event) => { removed(event, item) }}><Cross /></span>
      </li>
    )
  })

  return (
    <div className="cr-mov-tab flex assign-move-tab justify-content-between align-items-center">
      <div className="flex align-items-center left-width">
        <strong>{title}</strong>
        <ul className="flex">
          {items}
        </ul>
      </div>
      <div className="user-head">
        <div className="s-form flex justify-content-between col-md-12">
          <div
            id="assignedContent"
            className={`btn-create-user ${isLocked ? "disabled" : ""} `}
            onClick={() => { assignContent(list) }}>
            {buttonText}
          </div>
        </div>
      </div>
    </div>
  )
}

export default selectedItems