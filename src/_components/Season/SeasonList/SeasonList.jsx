import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Season from "./SeasonCard/SeasonCard";

const SeasonList = ({
  assignedData = [],
  reArrangeHandler,
  handleConditionRoute,
  showHideClonePopup,
  meta,
  tvShow,
  matchParams = {},
  id = 0,
  contentIdKey,
  LanguageArr = [],
  isViewMode = false,
}) => {
  let itemList =
    assignedData.length > 0 ? (
      assignedData?.map((item, index) => {
        return (
          <Draggable
            key={item[contentIdKey] + "_" + index}
            draggableId={"draggable-" + item[contentIdKey]}
            index={index}
          >
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.draggableProps}>
                <Season
                  isViewMode={isViewMode}
                  data={item}
                  tvShow={tvShow}
                  showHideClonePopup={showHideClonePopup}
                  matchParams={matchParams}
                  handleConditionRoute={handleConditionRoute}
                  LanguageArr={LanguageArr}
                  draggable={provided}
                />
              </div>
            )}
          </Draggable>
        );
      })
    ) : (
      <p className="align-center">{meta.noItemsText}</p>
    );

  return (
    <DragDropContext onDragEnd={reArrangeHandler}>
      <Droppable droppableId={`droppable-${id}`}>
        {(provided, _) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {itemList}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default SeasonList;
