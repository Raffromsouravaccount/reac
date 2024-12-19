import React from 'react'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Collection from '../Collection/Collection'
import Movie from '../Movie/Movie'
import ButtonField from '../ButtonField/ButtonField'

import { constantText } from '../../../_helpers/constants.text';

import FilterIcon from "images/filter-icon.svg";
import TvShow from '../TvShow/TvShow';
import Video from '../Video/Video';
import Season from '../Season/Season';
import Episode from '../Episode/Episode'

const AssignedAssets = ({
  assignedData = [],
  removeAsset,
  addAssets,
  toggleFilterDrawer,
  onSearch,
  searchText,
  reArrangeHandler,
  meta,
  contentIdKey,
  searchDisable,
  isViewMode = false,
  showHeader = true,
  hideDraggable = false,
  isLocked,
  languageArr }) => {
  let itemList = assignedData.length > 0 ? assignedData?.map((item, index) => {
    return (
      <Draggable
        isDragDisabled={isViewMode || isLocked}
        key={item[contentIdKey] + "_" + index}
        draggableId={"draggable-" + item[contentIdKey]}
        index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}>
            { meta.name === 'collections' &&
              <Collection
                hideDraggable={hideDraggable}
                isViewMode={isViewMode}
                data={item}
                showDelete
                deleteHandler={removeAsset}
                isLocked={isLocked}
                draggable={provided} />}
            { meta.name === 'movies' &&
              <Movie
                isViewMode={isViewMode}
                data={item}
                showDelete
                deleteHandler={removeAsset}
                isLocked={isLocked}
                draggable={provided} />}
            { meta.name === 'tvShows' &&
              <TvShow
                languageArr={languageArr}
                isViewMode={isViewMode}
                data={item}
                showDelete
                deleteHandler={removeAsset}
                isLocked={isLocked}
                draggable={provided} />}
            { meta.name === 'videos' &&
              <Video
                isViewMode={isViewMode}
                data={item}
                showDelete
                deleteHandler={removeAsset}
                isLocked={isLocked}
                draggable={provided} />}
            { meta.name === 'seasons' &&
              <Season
                languageArr={languageArr}
                isViewMode={isViewMode}
                data={item}
                showDelete
                deleteHandler={removeAsset}
                isLocked={isLocked}
                draggable={provided} />}
            { meta.name === 'episodes' &&
              <Episode
                languageArr={languageArr}
                isViewMode={isViewMode}
                data={item}
                showDelete
                deleteHandler={removeAsset}
                isLocked={isLocked}
                draggable={provided} />}    
          </div>
        )}
      </Draggable>
    )
  })
    : <div className="no-data-box flex align-items-center justify-content-center">{meta.noItemsText}</div>

  return (
    <div>
      { showHeader &&
        <div className="user-head">
          <div className="s-form flex justify-content-between col-md-12">
            <input
              type="text"
              autoComplete="off"
              className="auto-search"
              id="searchVal"
              placeholder={meta.assignedSearchPlaceholder}
              value={searchText}
              disabled={!searchDisable}
              onChange={onSearch}
            />
            {(meta.showAddButton && !isViewMode) &&
              <div className="filter-w">
                <div
                  className={`btn-create-user auto-content ${isLocked ? "disabled" : ""} `}
                  onClick={addAssets}>
                  {meta.addButtonText}
                </div>
              </div>
            }
            {meta.showFilterButton ? <div className="filter-w">
              <ButtonField
                color="secondary"
                className="filter-btn"
                Icon={FilterIcon}
                buttonText={constantText.filter_button_text}
                onClick={toggleFilterDrawer}
              />
            </div> : null}
          </div>
        </div>
      }
      < DragDropContext onDragEnd={reArrangeHandler} >
        <Droppable droppableId="droppable-1">
          {(provided, _) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {itemList}
              {provided.placeholder}
            </div>)}
        </Droppable>
      </DragDropContext >
    </div>
  )
}

export default AssignedAssets