import React, { Component, Fragment } from "react";
import Drawer from '@material-ui/core/Drawer';

//SubComponents
import AssignedAssets from '../../../Common/AssignedAssets/AssignedAssets'
import AddAssets from './AddAssets/AddAssets'
//Common Component
import LeftTab from '../../../Common/LeftTab/CommonLeftTab'
import Lock from "../../../Common/Locked/Locked";
import { CommonModel } from '../../../Common/Model/CommonModel';
import { removeAllDynamicAddfields } from '../../../Common/CommonFunction/CommonFuntion';
//Helper files
import { constantText } from '../../../../_helpers/constants.text';
import headerTabsJson from '../../Schema/AssignAssets/HeaderTabs.json'
//Services
import { collectionService } from '../../../../_services/collection.service';
import { apiCalls } from "../../../../_services/common.service";

import Config from "../../../../Config/config";

//Images
import MarkDone from "images/tick.svg";

//css
import './AssignAssets.css';
import RearrangeContents from "../../../Common/RearrangeContents/RearrangeContents";
import { permissionObj } from "../../../../_helpers/permission";
import ButtonField from "../../../Common/ButtonField/ButtonField";
import BadgeBox from "../../../Common/BadgeBox/BadgeBox";

class CollectionAssignAssets extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collectionId: this.props.collectionId,
      language: this.props.language,
      markDoneEnabled: true,
      showFilterDrawer: false,
      commanModal: null,
      addingNewAsset: false,
      searchText: '',
      status: null,
      selectedTab: 2,
      headerTabs: JSON.parse(JSON.stringify(headerTabsJson)),
      languageArr: []
    }
  }

  getAssignAssets = async () => {
    if (!this.state.collectionId) {
      return;
    }
    const currentTab = this.state.headerTabs[this.state.selectedTab]
    const requestParams = {
      collectionId: this.state.collectionId,
      type: currentTab.name
    }
    //getting existing assignAssets item if exist
    return await collectionService.get_assign_assets(requestParams)
  }

  componentDidMount() {
    let currentTab = { ...this.state.headerTabs[this.state.selectedTab] }
    this.getCollectionData();
    this.getAssignAssets()
      .then(assets => {
        if (assets?.length) {
          this.populateDataToState(assets)
          this.updateMarkDoneStatus(true)
        }
      })
    currentTab.fetched = true
    this.updateTabState(currentTab)
    this.getAllLanguage()
  }

  getAllLanguage = async () => {
    let response = await apiCalls(`${Config.masterUrl}/Language`, "GET", {}, `/collections`, false)
    if (response) { this.setState({ languageArr: response }) }
  }

  getCollectionData = async () => {
    let { collectionId } = this.props
    let response = await apiCalls(`${Config.collectionProperties}/${collectionId}`, 'GET', {});
    if (response) {
      let { contentState } = response;
      this.setState({ status: contentState?.title })
    }
  }

  componentDidUpdate() {
    let currentTab = { ...this.state.headerTabs[this.state.selectedTab] }
    if ((!this.state[currentTab.name] || this.state[currentTab.name].length <= 0) && !currentTab.fetched) {
      this.getAssignAssets()
        .then(assignedAssets => {
          if (assignedAssets) {
            this.populateDataToState(assignedAssets)
          }
        })
      currentTab.fetched = true
      this.updateTabState(currentTab)
    }
  }

  updateTabState = (updatedTab) => {
    this.setState((prevState) => {
      prevState.headerTabs[this.state.selectedTab] = updatedTab
      return {
        headerTabs: prevState.headerTabs
      }
    })
  }

  populateDataToState = (contentData) => {
    const data = {};
    const currentTab = this.state.headerTabs[this.state.selectedTab];
    data[currentTab.name] = contentData || [];
    this.setState({ ...data });
  }

  unLockAssignAssets = async (action) => {
    this.toggleModal(false);
    if (action) {
      const res = await Promise.all([
        this.props.unLockedSession(this.props?.selectedTab),
        this.getAssignAssets()
      ]);
      if (res && res[1] && res[1].length) { this.populateDataToState(res[1]) }
    }
  }

  toggleModal = (flag, action, data) => {
    const currentTab = this.state.headerTabs[this.state.selectedTab]
    if (!flag) {
      this.setState({ commanModal: null })
      return;
    }
    let properties = null
    switch (action) {
      case 'lock':
        const { currentTabData } = this.props;
        properties = {
          btn1Action: () => this.unLockAssignAssets(true),
          des: `${constantText.section_lock_with} ${currentTabData.lockedBy}, ${constantText.confirm_still_change}`
        }
        break;
      case 'removeItem':
        properties = {
          title: currentTab.deleteTitle,
          btn1Action: () => this.removeAsset(data),
          des: currentTab.deleteModalDescription
        }
        break;
      default:
        return null;
    }
    const commanModal = <CommonModel className='popup-wrap status-popup'
      {...properties}
      state
      btn2Action={() => this.toggleModal(false)}
      handleClose={() => this.toggleModal(false)} />
    this.setState({ commanModal })
  }

  switchToAddAsset = () => {
    this.setState({ addingNewAsset: true })
  }

  closeAddAsset = () => {
    this.setState({ addingNewAsset: false })
  }


  addAssetHandler = (newContents) => {
    let currentTab = this.state.headerTabs[this.state.selectedTab]
    const contentData = newContents.map(item => item[currentTab.contentIdKey]);
    this.updateAssignAssets(newContents, contentData, currentTab);
  }

  updateAssignAssets = async (newContents, contentData, currentTab) => {
    let response = false;
    const assignedContentId = new Set([...contentData]);
    const requestBody = {
      collectionId: this.state.collectionId,
      assetContentType: currentTab.name,
      assetId: [...assignedContentId]
    }
    response = await collectionService.post_assign_assets(requestBody, this.props.autoSaveError);
    // handle response
    if (response) {
      const index = this.state.headerTabs.findIndex(item => item.name == 'rearrangeAsset');
      this.setState((prevState) => {
        if (index >= 0) { prevState.headerTabs[index]['fetched'] = false }
        return {
          headerTabs: prevState.headerTabs,
          rearrangeAsset: [],
          [currentTab.name]: prevState[currentTab.name] ? [...newContents, ...prevState[currentTab.name]] : newContents
        }
      })
      this.updateMarkDoneStatus(true)
      this.updateIsDone(false)
    }
  }

  updateMarkDoneStatus = (flag) => {
    this.setState({ markDoneEnabled: flag })
  }

  updateIsDone = (flag) => {
    this.props.markAsDone(this.props?.selectedTab, flag);
  }

  markDone = async () => {
    if (!this.state.markDoneEnabled) {
      return false;
    }
    this.updateIsDone(true);
  }

  searchAssets = (ev) => {
    const { value } = ev.target;
    this.setState({ searchText: value });
  }

  optionClickedHandler = (event, selectedTab) => {
    if (selectedTab === this.state.selectedTab) {
      return;
    }
    let stateQuery = { selectedTab };
    if (selectedTab == 0) {
      let headerTabs = this.state.headerTabs;
      headerTabs[0].fetched = false;
      stateQuery['headerTabs'] = headerTabs;
      stateQuery[headerTabs[0].name] = [];
    }
    this.setState(stateQuery);
  }

  toggleFilterDrawer = () => {

  }

  removeAsset = (data) => {
    let currentTab = this.state.headerTabs[this.state.selectedTab];
    this.removeAssetsFromDB(currentTab, data);
    this.toggleModal(false);
  }

  removeAssetsFromDB = async (currentTab, item) => {
    const requestbody = {
      assignedAssetId: item[currentTab.contentIdKey],
      assetContentType: currentTab.name
    };
    const response = await collectionService.delete_assign_assets(requestbody, this.state.collectionId, this.props.autoSaveError);
    if (response && response.status === 200) {
      this.updateIsDone(false);
      this.setState((prevState) => {
        const assets = {};
        this.state.headerTabs.forEach(tab => {
          if (this.state[tab.name]) {
            assets[tab.name] = prevState[tab.name].filter((element) => element[currentTab.contentIdKey] !== item[currentTab.contentIdKey]);
          }
        })
        return assets;
      })
    }
  }

  reArrangeHandler = async (event) => {
    const { source, destination } = event
    if (!destination || source.index == destination.index) {
      return;
    }
    const currentTab = this.state.headerTabs[this.state.selectedTab]
    let assetsList = [...this.state[currentTab.name]]
    const assetsListCopy = JSON.parse(JSON.stringify([...this.state[currentTab.name]]))
    let content = assetsList.splice(source.index, 1)
    assetsList.splice(destination.index, 0, content[0]);

    // update on server

    if (currentTab.name === 'rearrangeAsset') {
      const contentData = assetsList.map((item, index) => {
        return {
          assetContentType: item.assetContentType,
          newSequence: index + 1
        }
      });
      this.updateRelatedContentRearrangeContent(assetsListCopy, contentData, currentTab);
    } else {
      const contentData = assetsList.map(item => item[currentTab.contentIdKey]);
      this.reArrangeAssets(assetsListCopy, contentData, currentTab)
    }
    // update state
    this.setState({ [currentTab.name]: assetsList })

  }

  updateRelatedContentRearrangeContent = async (contentList, contentData, currentTab) => {
    let response = false;
    let requestBody = {
      collectionId: this.state.collectionId,
      assignedContent: contentData
    }
    response = await collectionService.update_related_content_rearrange_content(requestBody, this.props.autoSaveError);
    // handle response
    if (response) {
      this.updateMarkDoneStatus(true)
      this.updateIsDone(false)
    } else {
      this.setState({ [currentTab.name]: contentList })
    }
  }


  reArrangeAssets = async (assetsList, contentData, currentTab) => {
    const requestBody = {
      assetContentType: currentTab.name,
      rearrangeArray: [...contentData]
    }
    const response = await collectionService.rearrange_assign_assets(requestBody, this.state.collectionId, this.props.autoSaveError)
    if (response && response.status === 200) {
      this.updateIsDone(false)
    } else {
      this.setState({ [currentTab.name]: assetsList })
    }
  }

  titleChangeHandler = (event, index, sectionName) => {
    const { value } = event.target;
    const assignedData = [...this.state[sectionName]];
    assignedData[index]['newTitle'] = value;
    this.setState({ [sectionName]: assignedData });
  }

  updateChangedTitle = async (event, index, sectionName) => {
    const currentTab = { ...this.state.headerTabs[this.state.selectedTab] }
    const content = { ...this.state[sectionName][index] };
    let assetsListCopy = JSON.parse(JSON.stringify([...this.state[sectionName]]));
    if (assetsListCopy[index].newTitle) { delete assetsListCopy[index].newTitle }
    if (!content.newTitle?.length) {
      return;
    }
    const contentData = [{
      assetContentType: content.assetContentType,
      newTitle: content.newTitle
    }];
    const response = this.updateRelatedContentRearrangeContent(assetsListCopy, contentData, currentTab);
    if (response) {
      this.setState(prevState => {
        prevState[sectionName][index].title = content.newTitle;
        delete prevState[sectionName][index].newTitle;
        return {
          [sectionName]: prevState[sectionName]
        }
      })
    }
  }

  renderAssignedAssets = () => {
    const { currentTabData, isViewMode } = this.props;
    const { headerTabs, selectedTab, searchText } = this.state;
    const tab = headerTabs[selectedTab]
    let assignedData = this.state[tab?.name] || [];
    const searchDisable = !!assignedData.length;
    if (searchText && searchText.length) {
      assignedData = assignedData.filter(item => String(item.title).toLowerCase().includes(String(searchText).toLowerCase()));
    }
    switch (tab?.name) {
      case 'movies':
      case 'collections':
      case 'videos':
      case 'tvShows':
      case 'seasons':
      case 'episodes':
        return (
          <AssignedAssets
            languageArr={this.state.languageArr}
            isViewMode={isViewMode}
            contentIdKey={tab.contentIdKey}
            assignedData={[...assignedData]}
            removeAsset={(event, data) => this.toggleModal(true, 'removeItem', data)}
            addAssets={this.switchToAddAsset}
            onSearch={this.searchAssets}
            searchDisable={searchDisable}
            searchText={searchText}
            reArrangeHandler={this.reArrangeHandler}
            meta={tab}
            isLocked={currentTabData?.isLocked} />)

      case 'rearrangeAsset':
        return (
          <RearrangeContents
            dragDisabled={isViewMode}
            inputDisabled={isViewMode || currentTabData?.isLocked}
            assignedData={[...assignedData]}
            reArrangeHandler={this.reArrangeHandler}
            meta={tab}
            titleChanged={this.titleChangeHandler}
            updateChangedTitle={this.updateChangedTitle}
          />)

      default:
        return null
    }
  }

  renderAddAsset = () => {
    const { currentTabData } = this.props;
    const tab = this.state.headerTabs[this.state.selectedTab]
    const assignedData = this.state[tab.name] || []
    switch (tab.name) {
      case 'movies':
      case 'collections':
      case 'videos':
      case 'tvShows':
      case 'seasons':
      case 'episodes':
        return (
          <AddAssets
            languageArr={this.state.languageArr}
            contentIdKey={tab.contentIdKey}
            id={this.state.collectionId}
            added={this.addAssetHandler}
            meta={tab}
            closeAddAsset={this.closeAddAsset}
            assignedData={[...assignedData]}
            isLocked={currentTabData?.isLocked} />)
      default:
        return null
    }
  }

  componentWillUnmount() {
    removeAllDynamicAddfields(this.state)
  }

  render() {
    const { collectionId, addingNewAsset, markDoneEnabled, headerTabs, selectedTab, commanModal, showFilterDrawer, status } = this.state;
    if (!collectionId) {
      return null;
    }

    const { currentTabData, isViewMode } = this.props;
    const { isDone, isLocked, lockedBy } = currentTabData || {};
    const { canUpdate } = permissionObj?.collections?.assignAsset;

    return (
      <Fragment>
        {addingNewAsset ? this.renderAddAsset() :
          <Lock
            lock={isLocked && !isViewMode}
            lockedBy={lockedBy}
            clicked={() => this.toggleModal(true, 'lock')}>
            <div className="whitebox assign-assets-block">
              <div className="drag-drop-wrap">
                <div className="ccm-head flex align-items-center justify-content-between">
                  <h4>{constantText.assign_assets_text}</h4>
                  <div className="status-head flex align-items-center">
                    {status && <BadgeBox className="create-movie-stage" status={status} />}
                    {!isViewMode && <div className="autosave">{constantText.all_fields_auto_save_text}</div>}
                    {!isViewMode ?
                      <div
                        onClick={() => (markDoneEnabled && !isDone && !isLocked) ? this.markDone() : {}}
                        disabled={isLocked}
                        className={`mark-done ${isDone ? "mark-active" : markDoneEnabled ? "mark-fill-active" : ""} auto-mark-done`}>
                        <span>
                          <MarkDone />
                        </span>
                        {constantText.mark_as_done_text}
                      </div>
                      :
                      <div className="edit-btn">
                        <ButtonField className="zee-btn-field zee-full MuiButton-containedPrimary"
                          buttonText={constantText.edit_collection}
                          disabled={!canUpdate()}
                          onClick={() => canUpdate() ? this.props.handleRoute(`/collection/edit/${collectionId}`) : ""}
                        />
                      </div>
                    }
                  </div>
                </div>
                <div className="cr-mov-tab ralated-tabs">
                  <LeftTab
                    className="tabs"
                    orientation="horizontal"
                    variant="scrollable"
                    options={[...headerTabs]}
                    selectedTab={selectedTab}
                    showIcon={false}
                    handleChange={this.optionClickedHandler} />
                </div>
                {this.renderAssignedAssets()}
              </div>
            </div>
            {commanModal}
          </Lock>}
        <div className="sidebarBox">
          <Drawer
            open={showFilterDrawer}
            anchor="right"
            onClose={this.toggleFilterDrawer}>
            {/* <FilterDrawer /> */}
          </Drawer>
        </div>
      </Fragment >
    )
  }
}

export default CollectionAssignAssets;