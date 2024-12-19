import React from 'react';
import { shallow } from 'enzyme';

import RelatedContent from '../../../../_components/Episode/RelatedContent/RelatedContent';
import * as commonService from '../../../../_services/common.service';
import { constantText } from '../../../../_helpers/constants.text';

let option = {
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
        match: { params: { episodeId: contentId } },
        history: { goBack: () => { } }
    },
    state = { selectedTab: 0, options: [option, option], collections: [{}] }
) => {
    const wrapper = shallow(<RelatedContent {...props} />)
    if (state) wrapper.setState(state);
    return wrapper;
}

describe('<RelatedContent />', () => {
    let wrapper;
    beforeEach(() => {
        commonService.apiCalls = jest.fn().mockReturnValue([{}])
        wrapper = setup();
    })
    it('Should renders RelatedContent default', () => {
        expect(wrapper.exists()).toBe(true);
    })
    it('should test getRelatedContent', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'getRelatedContent');
        testComp.getRelatedContent();
        expect(testComp.getRelatedContent).toHaveBeenCalledTimes(1);
    })
    it('should test getRelatedContent for rearrangeContent', () => {
        option.name = 'rearrangeContent';
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'getRelatedContent');
        testComp.getRelatedContent();
        expect(testComp.getRelatedContent).toHaveBeenCalledTimes(1);
    })
    it('should test getRelatedContent for displayName', () => {
        option.name = 'displayName';
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'getRelatedContent');
        testComp.getRelatedContent();
        expect(testComp.getRelatedContent).toHaveBeenCalledTimes(1);
    })
    it('should test componentDidMount', () => {
        option.name = 'collections';
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'componentDidMount');
        testComp.componentDidMount();
        expect(testComp.componentDidMount).toHaveBeenCalledTimes(1);
    })
    it('should test componentDidUpdate', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'componentDidUpdate');
        testComp.componentDidUpdate();
        expect(testComp.componentDidUpdate).toHaveBeenCalledTimes(1);
    })
    it('should test lock autoSaveError', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'autoSaveError');
        testComp.autoSaveError({ data: { message: constantText.locked_by_another_text } });
        expect(testComp.autoSaveError).toHaveBeenCalledTimes(1);
    })
    it('should test autoSaveError', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'autoSaveError');
        testComp.autoSaveError();
        expect(testComp.autoSaveError).toHaveBeenCalledTimes(1);
    })
    it('should test getEpisodeRelatedContentStatus', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'getEpisodeRelatedContentStatus');
        testComp.getEpisodeRelatedContentStatus();
        expect(testComp.getEpisodeRelatedContentStatus).toHaveBeenCalledTimes(1);
    })
    it('should test markAsDone true', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'markAsDone');
        testComp.markAsDone(true);
        expect(testComp.markAsDone).toHaveBeenCalledTimes(1);
    })
    it('should test markAsDone false', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'markAsDone');
        testComp.markAsDone();
        expect(testComp.markAsDone).toHaveBeenCalledTimes(1);
    })
    it('should test unLockedSession', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'unLockedSession');
        testComp.unLockedSession();
        expect(testComp.unLockedSession).toHaveBeenCalledTimes(1);
    })
    it('should test markAsDoneNLockedAction', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'markAsDoneNLockedAction');
        testComp.markAsDoneNLockedAction();
        expect(testComp.markAsDoneNLockedAction).toHaveBeenCalledTimes(1);
    })
    it('should test updateOption', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'updateOption');
        testComp.updateOption([option]);
        expect(testComp.updateOption).toHaveBeenCalledTimes(1);
    })
    it('should test populateDataToState', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'populateDataToState');
        testComp.populateDataToState();
        expect(testComp.populateDataToState).toHaveBeenCalledTimes(1);
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
    it('should test switchToAdd', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'switchToAdd');
        testComp.switchToAdd();
        expect(testComp.switchToAdd).toHaveBeenCalledTimes(1);
    })
    it('should test addContentHandler', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'addContentHandler');
        testComp.addContentHandler([]);
        expect(testComp.addContentHandler).toHaveBeenCalledTimes(1);
    })
    it('should test updateRelatedContentRearrangeContent', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'updateRelatedContentRearrangeContent');
        testComp.updateRelatedContentRearrangeContent();
        expect(testComp.updateRelatedContentRearrangeContent).toHaveBeenCalledTimes(1);
    })
    it('should test updateRelatedContents', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'updateRelatedContents');
        testComp.updateRelatedContents();
        expect(testComp.updateRelatedContents).toHaveBeenCalledTimes(1);
    })
    it('should test searchRelatedContent', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'searchRelatedContent');
        testComp.searchRelatedContent();
        expect(testComp.searchRelatedContent).toHaveBeenCalledTimes(1);
    })
    it('should test toggleFilterDrawer', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'toggleFilterDrawer');
        testComp.toggleFilterDrawer();
        expect(testComp.toggleFilterDrawer).toHaveBeenCalledTimes(1);
    })
    it('should test tabSwitched when selected tab is not 0', () => {
        const testComp = wrapper.instance();
        testComp.setState({ selectedTab: 1 })
        jest.spyOn(testComp, 'tabSwitched');
        testComp.tabSwitched({}, 0);
        expect(testComp.tabSwitched).toHaveBeenCalledTimes(1);
    })
    it('should test tabSwitched when click on same selected tab', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'tabSwitched');
        testComp.tabSwitched({}, 0);
        expect(testComp.tabSwitched).toHaveBeenCalledTimes(1);
    })
    it('should test tabSwitched to another tab', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'tabSwitched');
        testComp.tabSwitched({}, 1);
        expect(testComp.tabSwitched).toHaveBeenCalledTimes(1);
    })
    it('should test updateMarkDoneStatus', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'updateMarkDoneStatus');
        testComp.updateMarkDoneStatus();
        expect(testComp.updateMarkDoneStatus).toHaveBeenCalledTimes(1);
    })
    it('should test removeContent', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'removeContent');
        testComp.removeContent();
        expect(testComp.removeContent).toHaveBeenCalledTimes(1);
    })
    it('should test removeContentsFromDB', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'removeContentsFromDB');
        testComp.removeContentsFromDB(option, { id: "" });
        expect(testComp.removeContentsFromDB).toHaveBeenCalledTimes(1);
    })
    it('should test reArrangeHandler when locked', () => {
        const testComp = wrapper.instance();
        testComp.setState({ option, isLocked: true })
        jest.spyOn(testComp, 'reArrangeHandler');
        testComp.reArrangeHandler({ source: { index: 0 }, destination: { index: 1 } });
        expect(testComp.reArrangeHandler).toHaveBeenCalledTimes(1);
    })
    it('should test reArrangeHandler when not locked', () => {
        const testComp = wrapper.instance();
        testComp.setState({ option, isLocked: false })
        jest.spyOn(testComp, 'reArrangeHandler');
        testComp.reArrangeHandler({ source: { index: 0 }, destination: { index: 1 } });
        expect(testComp.reArrangeHandler).toHaveBeenCalledTimes(1);
    })
    it('should test reArrangeContents', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'reArrangeContents');
        testComp.reArrangeContents();
        expect(testComp.reArrangeContents).toHaveBeenCalledTimes(1);
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
    it('should test addDisplayNameHandler', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'addDisplayNameHandler');
        testComp.addDisplayNameHandler();
        expect(testComp.addDisplayNameHandler).toHaveBeenCalledTimes(1);
    })
    it('should test renderAssignedContents', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'renderAssignedContents');
        testComp.renderAssignedContents();
        expect(testComp.renderAssignedContents).toHaveBeenCalledTimes(1);
    })
    it('should test renderAddContent', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'renderAddContent');
        testComp.renderAddContent();
        expect(testComp.renderAddContent).toHaveBeenCalledTimes(1);
    })
    it('should test goBack', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'goBack');
        testComp.goBack();
        expect(testComp.goBack).toHaveBeenCalledTimes(1);
    })
    it('should test componentWillUnmount', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'componentWillUnmount');
        testComp.componentWillUnmount();
        expect(testComp.componentWillUnmount).toHaveBeenCalledTimes(1);
    })
})
