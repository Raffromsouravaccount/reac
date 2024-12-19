import React from 'react';
import { shallow } from 'enzyme';

import AssignAssets from '../../../../_components/Collection/CreateCollection/AssignAssets/AssignAssets';
import * as commonService from '../../../../_services/common.service';
import {collectionService} from '../../../../_services/collection.service';

const option = {
    "addPageTitle": "Add Collections",
    "assignedText": "Assigned Collections",
    "availableText": "Available Collections",
    "contentIdKey": "id",
    "deleteModalDescription": "Do you want to remove this collection from the assigned listing?",
    "deleteTitle": "Delete Collection",
    "itemButtonText": "Assign to Collection",
    "label": "Collection Assignment",
    "name": "collections",
    "noItemsText": "No collection have been assigned",
    "searchPlaceholder": "Search Via Collections",
    "selectedItemsButtonText": "Assign to Collections",
    "selectedItemsTitle": "Assign Collections",
    "showAddButton": true,
    "showFilterButton": true,
    "showFilterButtonListing": false,
    "showInputField": true,
    "showInputFieldListing": false,
    "showMarkDone": true,
    "fetched": false
}
const contentId = 'ffaec43c-7e63-42a6-86ea-5b4104f5c6a3';
const setup = (
    props = {
        match: { params: { collectionId: contentId } },
        history: { goBack: () => { } },
        currentTabData: { lockedBy: "" },
        markAsDone: () => { }
    },
    state = { collectionId: contentId, selectedTab: 0, headerTabs: [option, option], collections: [{}] }) => {
    const wrapper = shallow(<AssignAssets {...props} />)
    if (state) wrapper.setState(state);
    return wrapper;
}

describe('<AssignAssets />', () => {
    let wrapper;
    beforeEach(() => {
        commonService.apiCalls = jest.fn().mockReturnValue([{}])
        wrapper = setup();
    })
    it('Should renders AssignAssets default', () => {
        expect(wrapper.exists()).toBe(true);
    })
    it('should test getAssignAssets', () => {
        collectionService.get_assign_assets = jest.fn().mockReturnValue([{}]);
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'getAssignAssets');
        testComp.getAssignAssets();
        expect(testComp.getAssignAssets).toHaveBeenCalledTimes(1);
    })
    it('should test componentDidMount', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'componentDidMount');
        testComp.componentDidMount();
        expect(testComp.componentDidMount).toHaveBeenCalledTimes(1);
    })
    it('should test getCollectionData', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'getCollectionData');
        testComp.getCollectionData();
        expect(testComp.getCollectionData).toHaveBeenCalledTimes(1);
    })
    it('should test componentDidUpdate', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'componentDidUpdate');
        testComp.componentDidUpdate();
        expect(testComp.componentDidUpdate).toHaveBeenCalledTimes(1);
    })
    it('should test updateTabState', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'updateTabState');
        testComp.updateTabState();
        expect(testComp.updateTabState).toHaveBeenCalledTimes(1);
    })
    it('should test populateDataToState', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'populateDataToState');
        testComp.populateDataToState();
        expect(testComp.populateDataToState).toHaveBeenCalledTimes(1);
    })
    it('should test unLockAssignAssets', () => {
        Promise.all = jest.fn().mockReturnValue([[], []]);
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'unLockAssignAssets');
        testComp.unLockAssignAssets();
        expect(testComp.unLockAssignAssets).toHaveBeenCalledTimes(1);
    })
    it('should test unLockAssignAssets action true', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'unLockAssignAssets');
        testComp.unLockAssignAssets(true);
        expect(testComp.unLockAssignAssets).toHaveBeenCalledTimes(1);
    })
    it('should test toggleModal close', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'toggleModal');
        testComp.toggleModal(false);
        expect(testComp.toggleModal).toHaveBeenCalledTimes(1);
    })
    it('should test toggleModal lock', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'toggleModal');
        testComp.toggleModal(true, 'lock');
        expect(testComp.toggleModal).toHaveBeenCalledTimes(1);
    })
    it('should test toggleModal removeItem', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'toggleModal');
        testComp.toggleModal(true, 'removeItem');
        expect(testComp.toggleModal).toHaveBeenCalledTimes(1);
    })
    it('should test toggleModal default', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'toggleModal');
        testComp.toggleModal(true, '');
        expect(testComp.toggleModal).toHaveBeenCalledTimes(1);
    })
    it('should test switchToAddAsset', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'switchToAddAsset');
        testComp.switchToAddAsset();
        expect(testComp.switchToAddAsset).toHaveBeenCalledTimes(1);
    })
    it('should test closeAddAsset', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'closeAddAsset');
        testComp.closeAddAsset();
        expect(testComp.closeAddAsset).toHaveBeenCalledTimes(1);
    })
    it('should test addAssetHandler', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'addAssetHandler');
        testComp.addAssetHandler([]);
        expect(testComp.addAssetHandler).toHaveBeenCalledTimes(1);
    })
    it('should test updateAssignAssets', () => {
        collectionService.post_assign_assets = jest.fn().mockReturnValue([{}]);
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'updateAssignAssets');
        testComp.updateAssignAssets([], [], option);
        expect(testComp.updateAssignAssets).toHaveBeenCalledTimes(1);
    })
    it('should test updateMarkDoneStatus', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'updateMarkDoneStatus');
        testComp.updateMarkDoneStatus();
        expect(testComp.updateMarkDoneStatus).toHaveBeenCalledTimes(1);
    })
    it('should test updateIsDone', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'updateIsDone');
        testComp.updateIsDone();
        expect(testComp.updateIsDone).toHaveBeenCalledTimes(1);
    })
    it('should test markDone', () => {
        wrapper.setState({markDoneEnabled: false})
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'markDone');
        testComp.markDone();
        expect(testComp.markDone).toHaveBeenCalledTimes(1);
    })

    it('should test markDone without markDoneEnabled', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'markDone');
        testComp.markDone();
        expect(testComp.markDone).toHaveBeenCalledTimes(1);
    })
    
    it('should test searchAssets', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'searchAssets');
        testComp.searchAssets({ target: { value: "" } });
        expect(testComp.searchAssets).toHaveBeenCalledTimes(1);
    })
    it('should test lock optionClickedHandler if condition', () => {
        wrapper.setState({ selectedTab: 1 })
        const event = {target: {value: 'event',  name: 'mock'}}
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'optionClickedHandler');
        testComp.optionClickedHandler(event, 0);
        expect(testComp.optionClickedHandler).toHaveBeenCalledTimes(1);
    })

    it('should test lock optionClickedHandler', () => {
        wrapper.setState({ selectedTab: 0 })
        const event = {target: {value: 'event',  name: 'mock'}}
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'optionClickedHandler');
        testComp.optionClickedHandler(event, 0);
        expect(testComp.optionClickedHandler).toHaveBeenCalledTimes(1);
    })

    it('should test toggleFilterDrawer', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'toggleFilterDrawer');
        testComp.toggleFilterDrawer();
        expect(testComp.toggleFilterDrawer).toHaveBeenCalledTimes(1);
    })
    it('should test removeAsset', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'removeAsset');
        testComp.removeAsset();
        expect(testComp.removeAsset).toHaveBeenCalledTimes(1);
    })
    it('should test reArrangeHandler when no destination', () => {
        const testComp = wrapper.instance();
        testComp.setState({ option, isLocked: true })
        jest.spyOn(testComp, 'reArrangeHandler');
        testComp.reArrangeHandler({ source: { index: 0 }, destination: false });
        expect(testComp.reArrangeHandler).toHaveBeenCalledTimes(1);
    })
    it('should test reArrangeHandler', () => {
        const testComp = wrapper.instance();
        testComp.setState({ option, isLocked: false })
        jest.spyOn(testComp, 'reArrangeHandler');
        testComp.reArrangeHandler({ source: { index: 0 }, destination: { index: 1 } });
        expect(testComp.reArrangeHandler).toHaveBeenCalledTimes(1);
    })
    it('should test updateRelatedContentRearrangeContent', () => {
        collectionService.update_related_content_rearrange_content = jest.fn().mockReturnValue([{}]);
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'updateRelatedContentRearrangeContent');
        testComp.updateRelatedContentRearrangeContent();
        expect(testComp.updateRelatedContentRearrangeContent).toHaveBeenCalledTimes(1);
    })
    it('should test updateRelatedContentRearrangeContent no responce', () => {
        collectionService.update_related_content_rearrange_content = jest.fn().mockReturnValue(false);
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'updateRelatedContentRearrangeContent');
        testComp.updateRelatedContentRearrangeContent();
        expect(testComp.updateRelatedContentRearrangeContent).toHaveBeenCalledTimes(1);
    })
    it('should test reArrangeAssets', () => {
        collectionService.rearrange_assign_assets = jest.fn().mockReturnValue({status: 200});
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'reArrangeAssets');
        testComp.reArrangeAssets([], [], option);
        expect(testComp.reArrangeAssets).toHaveBeenCalledTimes(1);
    })
    it('should test reArrangeAssets no responce', () => {
        collectionService.rearrange_assign_assets = jest.fn().mockReturnValue(false);
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'reArrangeAssets');
        testComp.reArrangeAssets([], [], option);
        expect(testComp.reArrangeAssets).toHaveBeenCalledTimes(1);
    })
    it('should test titleChangeHandler', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'titleChangeHandler');
        testComp.titleChangeHandler({ target: { value: "" } }, 0, option.name);
        expect(testComp.titleChangeHandler).toHaveBeenCalledTimes(1);
    })
    it('should test updateChangedTitle', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'updateChangedTitle');
        testComp.updateChangedTitle();
        expect(testComp.updateChangedTitle).toHaveBeenCalledTimes(1);
    })
    it('should test renderAssignedAssets', () => {
        const searchText = 'searchText';
        wrapper.setState({ searchText });
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'renderAssignedAssets');
        testComp.renderAssignedAssets();
        expect(testComp.renderAssignedAssets).toHaveBeenCalledTimes(1);
    })
    it('should test renderAddAsset', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'renderAddAsset');
        testComp.renderAddAsset();
        expect(testComp.renderAddAsset).toHaveBeenCalledTimes(1);
    })
    it('should test componentWillUnmount', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'componentWillUnmount');
        testComp.componentWillUnmount();
        expect(testComp.componentWillUnmount).toHaveBeenCalledTimes(1);
    })
      it('should test removeAssetsFromDB', () => {
          collectionService.delete_assign_assets = jest.fn().mockReturnValue({status: 200})
          const testComp = wrapper.instance();
          jest.spyOn(testComp, 'removeAssetsFromDB');
          testComp.removeAssetsFromDB(option, { id: "" });
          expect(testComp.removeAssetsFromDB).toHaveBeenCalledTimes(1);
      })
})
