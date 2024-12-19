import React from 'react'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Content from './Content'
//Helpers
import { constantText } from '../../../_helpers/constants.text';


const RearrangeContents = ({
  class1 = "",
  assignedData = [],
  reArrangeHandler,
  meta,
  titleChanged,
  dragDisabled = false,
  inputDisabled = false,
  updateChangedTitle }) => {
  let contentList = assignedData.length > 0 ? assignedData?.map((item, index) => {
    return (
      <Draggable
        isDragDisabled={dragDisabled}
        key={item.relatedContentType + '_' + index}
        draggableId={"draggable-" + index}
        index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}>
            <Content
              item={item}
              canChangeTitle={!(String(item.relatedContentType || "").toLowerCase().includes('collection') || item.assetContentType == 'Collection')}
              inputLabel={item.title ? constantText.new_title : constantText.enter_new_title}
              changeHandler={(event) => titleChanged(event, index, meta.name)}
              onBlurHandler={(event) => updateChangedTitle(event, index, meta.name)}
              inputName={item.type + '_' + index}
              inputDisabled={inputDisabled}
              draggable={provided} />
          </div>
        )}
      </Draggable>
    )
  })
    : <div className="no-data-box flex align-items-center justify-content-center">{meta?.noItemsText}</div>

  return (
    <div className={`whitebox related-content-page ${class1}`}>
      < DragDropContext onDragEnd={reArrangeHandler} >
        <Droppable droppableId="droppable-1">
          {(provided, _) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {contentList}
              {provided.placeholder}
            </div>)}
        </Droppable>
      </DragDropContext >
    </div>
  )
}

export default RearrangeContents