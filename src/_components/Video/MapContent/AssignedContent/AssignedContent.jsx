import React, { Fragment } from 'react'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Video from '../../../Common/Video/Video'
//Constant files
import { constantText } from '../../../../_helpers/constants.text';

const assignedContent = ({
  list,
  unMapContent,
  reArrangeHandler,
  addContent,
  onSearch,
  toggleFilterDrawer,
  meta,
  searchText,
  isLocked,
  searchDisable,
  isViewMode = false
}) => {
  let itemList = list?.length > 0 ? list.map((item, index) => {
    return (
      <Draggable
        isDragDisabled={isViewMode || isLocked}
        key={item.videoId}
        draggableId={"draggable-" + item.videoId}
        index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}>
            <Video
              isViewMode={isViewMode}
              data={item}
              classes='mapcontent-grid'
              showDelete
              deleteHandler={unMapContent}
              isLocked={isLocked}
              draggable={provided} />
          </div>
        )}
      </Draggable>
    )
  })
    : <p className="align-center">No {meta?.label} have been assigned</p>

  return (
    <Fragment>
      <div className="user-head">
        <div className="s-form flex justify-content-between col-md-12">
          <input
            type="text"
            autoComplete="off"
            className="auto-search"
            id="searchVal"
            placeholder={meta?.placeholder || ""}
            disabled={!searchDisable}
            value={searchText}
            onChange={onSearch}
          />
          {!isViewMode &&
          <div className="filter-w">
            <div
              className={`btn-create-user ${isLocked ? "disabled" : ""} auto-addContent`}
              onClick={addContent}>
              {constantText.add_content_text}
            </div>
          </div>
          }
        </div>
      </div>
      < DragDropContext onDragEnd={reArrangeHandler} >
        <Droppable droppableId="droppable-1">
          {(provided, _) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {itemList}
              {provided.placeholder}
            </div>)}
        </Droppable>
      </DragDropContext >
    </Fragment>
  )
}

export default assignedContent