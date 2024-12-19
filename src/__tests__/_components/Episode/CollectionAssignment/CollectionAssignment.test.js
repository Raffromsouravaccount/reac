import React from 'react';
import { shallow } from 'enzyme';

import CollectionAssignment from '../../../../_components/Episode/CollectionAssignment/CollectionAssignment';
import * as commonService from '../../../../_services/common.service';
import { constantText } from '../../../../_helpers/constants.text';

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
    "showMarkDone": true
}
const contentId = 'ffaec43c-7e63-42a6-86ea-5b4104f5c6a3';

const setup = (props = { match: { params: { episodeId: contentId } }, history: { goBack: () => { } } }, state = null) => {
    const wrapper = shallow(<CollectionAssignment {...props} />)
    if (state) wrapper.setState(state);
    return wrapper;
}
describe('<CollectionAssignment />', () => {
    let wrapper;
    beforeEach(() => {
        commonService.apiCalls = jest.fn().mockReturnValue([{}])
        wrapper = setup();
    })
    it('Should renders CollectionAssignment default', () => {
        expect(wrapper.exists()).toBe(true);
    })
    it('should test removeCollection', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'removeCollection');
        testComp.removeCollection();
        expect(testComp.removeCollection).toHaveBeenCalledTimes(1);
    })
    it('should test removeCollection if state locked', () => {
        const testComp = wrapper.instance();
        testComp.setState({ isLocked: true })
        jest.spyOn(testComp, 'removeCollection');
        testComp.removeCollection();
        expect(testComp.removeCollection).toHaveBeenCalledTimes(1);
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
    it('should test goBack', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'goBack');
        testComp.goBack();
        expect(testComp.goBack).toHaveBeenCalledTimes(1);
    })
    it('should test renderAssignedContents', () => {
        const testComp = wrapper.instance();
        testComp.setState({ option })
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
    it('should test componentWillUnmount', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'componentWillUnmount');
        testComp.componentWillUnmount();
        expect(testComp.componentWillUnmount).toHaveBeenCalledTimes(1);
    })
    it('should test getAssignedCollections', () => {
        const testComp = wrapper.instance();
        testComp.setState({ contentId })
        jest.spyOn(testComp, 'getAssignedCollections');
        testComp.getAssignedCollections();
        expect(testComp.getAssignedCollections).toHaveBeenCalledTimes(1);
    })
    it('should test autoSaveError', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'autoSaveError');
        testComp.autoSaveError();
        expect(testComp.autoSaveError).toHaveBeenCalledTimes(1);
    })
    it('should test autoSaveError with locked message', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'autoSaveError');
        testComp.autoSaveError({data: {message: constantText.locked_by_another_text}});
        expect(testComp.autoSaveError).toHaveBeenCalledTimes(1);
    })
    it('should test getEpisodeCollectionAssignmentStatus', () => {
        const testComp = wrapper.instance();
        testComp.setState({ contentId: contentId, userID: '123' })
        jest.spyOn(testComp, 'getEpisodeCollectionAssignmentStatus');
        testComp.getEpisodeCollectionAssignmentStatus();
        expect(testComp.getEpisodeCollectionAssignmentStatus).toHaveBeenCalledTimes(1);
    })
    it('should test markAsDone', () => {
        const testComp = wrapper.instance();
        testComp.setState({ contentId: contentId, markDoneEnabled: true })
        jest.spyOn(testComp, 'markAsDone');
        testComp.markAsDone();
        expect(testComp.markAsDone).toHaveBeenCalledTimes(1);
    })
    it('should test markAsDone false', () => {
        const testComp = wrapper.instance();
        testComp.setState({ contentId: contentId, markDoneEnabled: true })
        jest.spyOn(testComp, 'markAsDone');
        jest.spyOn(testComp, 'markAsDoneNLockedAction');
        testComp.markAsDone(true);
        expect(testComp.markAsDone).toHaveBeenCalledTimes(1);
        expect(testComp.markAsDoneNLockedAction).toHaveBeenCalledTimes(1);
    })
    it('should test unLockedSession', () => {
        const testComp = wrapper.instance();
        testComp.setState({ contentId: contentId })
        jest.spyOn(testComp, 'unLockedSession');
        testComp.unLockedSession();
        expect(testComp.unLockedSession).toHaveBeenCalledTimes(1);
    })
    it('should test populateDataToState', () => {
        const testComp = wrapper.instance();
        testComp.setState({ option: option })
        jest.spyOn(testComp, 'populateDataToState');
        testComp.populateDataToState();
        expect(testComp.populateDataToState).toHaveBeenCalledTimes(1);
    })
    it('should test toggleModal close', () => {
        const testComp = wrapper.instance();
        testComp.setState({ option: option })
        jest.spyOn(testComp, 'toggleModal');
        testComp.toggleModal(false);
        expect(testComp.toggleModal).toHaveBeenCalledTimes(1);
    })
    it('should test toggleModal open lock', () => {
        const testComp = wrapper.instance();
        testComp.setState({ option: option })
        jest.spyOn(testComp, 'toggleModal');
        testComp.toggleModal(true, 'lock', {});
        expect(testComp.toggleModal).toHaveBeenCalledTimes(1);
    })
    it('should test toggleModal open removeItem', () => {
        const testComp = wrapper.instance();
        testComp.setState({ option: option })
        jest.spyOn(testComp, 'toggleModal');
        testComp.toggleModal(true, 'removeItem', {});
        expect(testComp.toggleModal).toHaveBeenCalledTimes(1);
    })
    it('should test switchToAddCollection', () => {
        const testComp = wrapper.instance();
        testComp.setState({ isLocked: true })
        jest.spyOn(testComp, 'switchToAddCollection');
        testComp.switchToAddCollection();
        expect(testComp.switchToAddCollection).toHaveBeenCalledTimes(1);
    })
    it('should test switchToAddCollection if not locked', () => {
        const testComp = wrapper.instance();
        testComp.setState({ isLocked: false })
        jest.spyOn(testComp, 'switchToAddCollection');
        testComp.switchToAddCollection();
        expect(testComp.switchToAddCollection).toHaveBeenCalledTimes(1);
    })
    it('should test closeAddCollection', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'closeAddCollection');
        testComp.closeAddCollection();
        expect(testComp.closeAddCollection).toHaveBeenCalledTimes(1);
    })
    it('should test addContentHandler', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'addContentHandler');
        testComp.addContentHandler([{}]);
        expect(testComp.addContentHandler).toHaveBeenCalledTimes(1);
    })
    it('should test updateCollections', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'updateCollections');
        testComp.updateCollections({}, {}, option);
        expect(testComp.updateCollections).toHaveBeenCalledTimes(1);
    })
    it('should test updateMarkDoneStatus', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'updateMarkDoneStatus');
        testComp.updateMarkDoneStatus(true);
        expect(testComp.updateMarkDoneStatus).toHaveBeenCalledTimes(1);
    })
    it('should test updateIsDone', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'updateIsDone');
        testComp.updateIsDone(true);
        expect(testComp.updateIsDone).toHaveBeenCalledTimes(1);
    })
    it('should test reArrangeContents', () => {
        const testComp = wrapper.instance();
        jest.spyOn(testComp, 'reArrangeContents');
        testComp.reArrangeContents({}, [], option);
        expect(testComp.reArrangeContents).toHaveBeenCalledTimes(1);
    })
    it('should test removeCollectionsFromDB', () => {
        const testComp = wrapper.instance();
        testComp.setState({ contentId: contentId })
        jest.spyOn(testComp, 'removeCollectionsFromDB');
        testComp.removeCollectionsFromDB(option, { id: "" });
        expect(testComp.removeCollectionsFromDB).toHaveBeenCalledTimes(1);
    })
})
