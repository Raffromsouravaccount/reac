import React from 'react';
import { shallow, mount } from 'enzyme';
import moxios from "moxios";
import axios from "../../../../_helpers/axiosInstance";
import { constantText } from '../../../../_helpers/constants.text';
import TranslationInfo from './../../../../_components/Translation/Layout/TranslationInfo';
import TranslationCastProfile from './../../../../_components/Translation/TranslationCastProfile/TranslationCastProfile';
import { CommonModel } from './../../../../_components/Common/Model/CommonModel';

const setup = (props = {}, state = null) => {
    const wrapper = shallow(<TranslationCastProfile {...props} />)
    if (state) wrapper.setState(state);
    return wrapper;
}
const initialState = {
    params:{
        castId: "5753e295-66e8-4a42-9f90-af14c3edadab"
    },
    showNavToAssignedLang: false,
    language: {
        code: 'hi'
    }
}

describe('<TranslationCastProfile />', () => {
    let wrapper;
    const userData = {
        userID: "d2fa1282-5f91-4231-a2b4-f308caf5afc6"
    };
    beforeEach(() => {
        moxios.install(axios);
        wrapper = setup({}, {...initialState});
    });

    afterEach(() => {
        moxios.uninstall(axios);
    });

    it('Should renders Translation CastProfile default', () => {
        expect(wrapper.exists()).toBe(true);
    });
    it('Should get userID from localStorage', () => {
        Storage.prototype.getItem = jest.fn(() => userData.userID);
        const result = localStorage.getItem();
        expect(result).toEqual(userData.userID);
    });
    it('Sholud test componentDidMount', () => {
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'componentDidMount');
        instance.componentDidMount();
        expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
    });
    it('Sholud test componentWillReceiveProps', () => {
        const nextProps = {language: {code: 'gr'}, showNavToAssignedLang: true};
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'componentWillReceiveProps');
        instance.componentWillReceiveProps(nextProps);
        expect(instance.componentWillReceiveProps).toHaveBeenCalledTimes(1);
        expect(String(wrapper.state('language')?.code)).toBe(String(nextProps?.language?.code));
    });
    it('should test fetchContentData', async (done) => {
        const response = {
            response: {
              status: 200,
              data: {"id":"4c1420f0-8032-4769-80ad-b53e6f604b52","externalId":"1-7-1000663","castName":"Bandhan Bank","castKnownAs":null,"castProfileImage":null,"castTag":["5b44c8f7-1166-465f-a56c-ae03a08bb511","90473cb1-39d4-44cf-90e7-b32b048eea0f"],"castType":["a988da71-245c-4dd5-a0e7-77da447d4101"],"castBirthday":null,"castBirthPlace":null,"castAwards":null,"castBackground":null,"castTrivia":null,"castCareer":null,"castProfileBio":null,"castRelationship":[{"relationTitle":"Brother","castName":"Akshay Kumar","castProfileId":"e199cd8b-33f5-426f-bce0-06f7e21b7afa","relation":"395e01b0-e89c-4380-842f-e2a830e949be"}],"contentStateId":"3bb64421-f15f-4dda-adec-03c324c140a3","createdBy":"ce7859b7-b9d5-4603-bde2-2fe416d790ec","modifiedBy":"b34168f3-c0bd-48b4-a018-bb8949819d1d","profileStatus":"1","lastModifiedBy":"ce7859b7-b9d5-4603-bde2-2fe416d790ec","lastModifiedOn":"2021-02-15T07:55:26.697Z","_created_on":"2021-02-15T07:55:26.701Z","_modified_on":"2021-02-15T10:53:38.300Z","content_state_id":"3bb64421-f15f-4dda-adec-03c324c140a3","_created_by":"ce7859b7-b9d5-4603-bde2-2fe416d790ec","_modified_by":"b34168f3-c0bd-48b4-a018-bb8949819d1d","castTypeNames":[{"title":"Actor","id":"a988da71-245c-4dd5-a0e7-77da447d4101"}],"castTagNames":[{"id":"5b44c8f7-1166-465f-a56c-ae03a08bb511","title":"Artist"},{"id":"90473cb1-39d4-44cf-90e7-b32b048eea0f","title":"Anchor"}],"translationStatus":1}
            }
        };
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'fetchContentData'); 
        instance.fetchContentData(true);
        expect(instance.fetchContentData).toHaveBeenCalledWith(true);
        moxios.wait(function () {
            const request = moxios.requests.mostRecent();
            request.respondWith(response).then((res) => {
                done();
            });
        });
    });
    it('should test fetchContentData with defaultData', (done) => {
        const res = {"id":"4c1420f0-8032-4769-80ad-b53e6f604b52","externalId":"1-7-1000663","castName":"Bandhan Bank","castKnownAs":null,"castProfileImage":null,"castTag":["5b44c8f7-1166-465f-a56c-ae03a08bb511","90473cb1-39d4-44cf-90e7-b32b048eea0f"],"castType":["a988da71-245c-4dd5-a0e7-77da447d4101"],"castBirthday":null,"castBirthPlace":null,"castAwards":null,"castBackground":null,"castTrivia":null,"castCareer":null,"castProfileBio":null,"castRelationship":[{"relationTitle":"Brother","castName":"Akshay Kumar","castProfileId":"e199cd8b-33f5-426f-bce0-06f7e21b7afa","relation":"395e01b0-e89c-4380-842f-e2a830e949be"}],"contentStateId":"3bb64421-f15f-4dda-adec-03c324c140a3","createdBy":"ce7859b7-b9d5-4603-bde2-2fe416d790ec","modifiedBy":"b34168f3-c0bd-48b4-a018-bb8949819d1d","profileStatus":"1","lastModifiedBy":"ce7859b7-b9d5-4603-bde2-2fe416d790ec","lastModifiedOn":"2021-02-15T07:55:26.697Z","_created_on":"2021-02-15T07:55:26.701Z","_modified_on":"2021-02-15T10:53:38.300Z","content_state_id":"3bb64421-f15f-4dda-adec-03c324c140a3","_created_by":"ce7859b7-b9d5-4603-bde2-2fe416d790ec","_modified_by":"b34168f3-c0bd-48b4-a018-bb8949819d1d","castTypeNames":[{"title":"Actor","id":"a988da71-245c-4dd5-a0e7-77da447d4101"}],"castTagNames":[{"id":"5b44c8f7-1166-465f-a56c-ae03a08bb511","title":"Artist"},{"id":"90473cb1-39d4-44cf-90e7-b32b048eea0f","title":"Anchor"}],"translationStatus":1};
        const wrapper = setup({}, {...initialState, defaultData: res});
        const response = {
            response: {
              status: 200,
              data: null
            }
        };
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'fetchContentData'); 
        instance.fetchContentData(false);
        expect(instance.fetchContentData).toHaveBeenCalled();
        moxios.wait(function () {
            const request = moxios.requests.mostRecent();
            request.respondWith(response).then((res) => {
              done();
            });
          });
    });
    it('should test mapResponseData', () => {
        const response = {"id":"4c1420f0-8032-4769-80ad-b53e6f604b52","externalId":"1-7-1000663","castName":"Bandhan Bank","castKnownAs":null,"castProfileImage":null,"castTag":["5b44c8f7-1166-465f-a56c-ae03a08bb511","90473cb1-39d4-44cf-90e7-b32b048eea0f"],"castType":["a988da71-245c-4dd5-a0e7-77da447d4101"],"castBirthday":null,"castBirthPlace":null,"castAwards":null,"castBackground":null,"castTrivia":null,"castCareer":null,"castProfileBio":null,"castRelationship":[{"relationTitle":"Brother","castName":"Akshay Kumar","castProfileId":"e199cd8b-33f5-426f-bce0-06f7e21b7afa","relation":"395e01b0-e89c-4380-842f-e2a830e949be"}],"contentStateId":"3bb64421-f15f-4dda-adec-03c324c140a3","createdBy":"ce7859b7-b9d5-4603-bde2-2fe416d790ec","modifiedBy":"b34168f3-c0bd-48b4-a018-bb8949819d1d","profileStatus":"1","lastModifiedBy":"ce7859b7-b9d5-4603-bde2-2fe416d790ec","lastModifiedOn":"2021-02-15T07:55:26.697Z","_created_on":"2021-02-15T07:55:26.701Z","_modified_on":"2021-02-15T10:53:38.300Z","content_state_id":"3bb64421-f15f-4dda-adec-03c324c140a3","_created_by":"ce7859b7-b9d5-4603-bde2-2fe416d790ec","_modified_by":"b34168f3-c0bd-48b4-a018-bb8949819d1d","castTypeNames":[{"title":"Actor","id":"a988da71-245c-4dd5-a0e7-77da447d4101"}],"castTagNames":[{"id":"5b44c8f7-1166-465f-a56c-ae03a08bb511","title":"Artist"},{"id":"90473cb1-39d4-44cf-90e7-b32b048eea0f","title":"Anchor"}],"translationStatus":1};
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'mapResponseData');
        instance.mapResponseData(response);
        expect(instance.mapResponseData).toHaveBeenCalledTimes(1);
    });
    it('should test updateValues', () => {
        const res = {"castType":["a988da71-245c-4dd5-a0e7-77da447d4101"],"castTypeNames":[{"id":"a988da71-245c-4dd5-a0e7-77da447d4101","title":"अभिनेता"}],"castTag":["5b44c8f7-1166-465f-a56c-ae03a08bb511","90473cb1-39d4-44cf-90e7-b32b048eea0f"],"castTagNames":[{"id":"5b44c8f7-1166-465f-a56c-ae03a08bb511","title":"Artist"},{"id":"90473cb1-39d4-44cf-90e7-b32b048eea0f","title":"Anchor"}],"castRelationship":[{"relationTitle":"भाई","castName":"Akshay Kumar","castProfileId":"e199cd8b-33f5-426f-bce0-06f7e21b7afa","relation":"395e01b0-e89c-4380-842f-e2a830e949be"}],"castName":null,"castKnownAs":null,"castProfileImage":null,"castBirthday":null,"castBirthPlace":null,"castAwards":null,"castBackground":null,"castTrivia":null,"castCareer":null,"castProfileBio":null,"translationStatus":0};
        const isDefaultData = false;
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'updateValues');
        instance.updateValues(res);
        expect(isDefaultData).toBeFalsy();
        expect(instance.updateValues).toHaveBeenCalledTimes(1);
    });
    it('should test getMasterDataForSelect', () => {
        let url = '/castLists';
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'getMasterDataForSelect');
        instance.getMasterDataForSelect(url);
        expect(instance.getMasterDataForSelect).toHaveBeenCalledTimes(1);
    });
    it('should test getMasterData', () => {
        let url = '/castLists';
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'getMasterData');
        instance.getMasterData(url);
        expect(instance.getMasterData).toHaveBeenCalledTimes(1);
    });
    it('should render TranslationInfo', () => {
        const permissionAddEdit = true;
        const permissionViewOnly = false;
        const wrapper = setup({permissionAddEdit, permissionViewOnly}, {...initialState});
        expect(permissionAddEdit).toBeTruthy();
        expect(permissionViewOnly).toBeFalsy();
        expect(wrapper.containsMatchingElement(<TranslationInfo />)).toBe(true);
    });
    it('should test lockSections', () => {
        const wrapper = setup({}, {params: initialState.params });
        const instance = wrapper.instance();
        jest.spyOn(instance, 'lockSections');
        const params = wrapper.state('params');
        instance.lockSections(params?.castId);
        expect(instance.lockSections).toHaveBeenCalledWith(params?.castId);
        expect(instance.lockSections).toHaveBeenCalledTimes(1);
    });
    it('should test autoSave', async (done) => {
        const response = {
            response: {
              status: 200,
              data: {"id":"6ce9e9c4-d722-4528-9789-0763d583e91b","castProfileId":"9c11779c-d0c9-4a29-872e-36bb139b1dda","languageCode":"as","castName":" Priyanka Chopra","castKnownAs":null,"castBirthPlace":null,"castAwards":null,"castBackground":null,"castTrivia":null,"castCareer":null,"castProfileBio":null,"createdBy":"e86244aa-1b36-4b58-bbe0-4968a840a438","modifiedBy":"e86244aa-1b36-4b58-bbe0-4968a840a438","castProfileTranslationStatus":"0","_created_on":"2021-02-16T05:55:42.434Z","_modified_on":"2021-02-16T05:55:42.434Z","cast_profile_id":"9c11779c-d0c9-4a29-872e-36bb139b1dda","_created_by":"e86244aa-1b36-4b58-bbe0-4968a840a438","_modified_by":"e86244aa-1b36-4b58-bbe0-4968a840a438","translationStatus":1}
            }
        };
        const updatedFields = {
            "name": "castName",
            "label": "Profile Name",
            "type": "text",
            "value": "Priyanka Chopra",
            "required": false,
            "minTextLength": 0,
            "maxTextLength": 250,
            "text": false,
            "numeric": false,
            "alphabetOnly": false,
            "isEditing": true
        };
        const wrapper = setup({updateMarkAsDoneAction: jest.fn()}, {...initialState, updatedFields});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'autoSave');
        instance.autoSave();
        expect(instance.autoSave).toHaveBeenCalledTimes(1);
        moxios.wait(function () {
            const request = moxios.requests.mostRecent();
            request.respondWith(response).then((res) => {
              done();
            });
        });
    });
    it('should test checkIfMarkAsDone', () => {
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'checkIfMarkAsDone');
        instance.checkIfMarkAsDone();
        expect(instance.checkIfMarkAsDone).toHaveBeenCalledTimes(1);
    });
    it('should test handleMarkAsDone', () => {
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleMarkAsDone');
        instance.handleMarkAsDone();
        expect(instance.handleMarkAsDone).toHaveBeenCalledTimes(1);
    });
    it('should test markAsDoneNLockedAction', () => {
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'markAsDoneNLockedAction');
        instance.markAsDoneNLockedAction();
        expect(instance.markAsDoneNLockedAction).toHaveBeenCalledTimes(1);
    });
    it('should test autoSaveError', () => {
        const error = {
            data: {
                message: 'This section is locked by another user.'
            }
        }
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'autoSaveError');
        instance.autoSaveError(error);
        expect(instance.autoSaveError).toHaveBeenCalledTimes(1);
        expect(error?.data?.message).toEqual(constantText.locked_by_another_text);
    });
    it('should test handleSecTab', () => {
        const selectedSecTab = 0;
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleSecTab');
        instance.handleSecTab('e', selectedSecTab);
        expect(instance.handleSecTab).toHaveBeenCalledTimes(1);
    });
    it('should test toggleLockModel', () => {
        const lock = {
            openLockModel: false,
            isLocked: false,
            lockedBy: "",
            lockedByEmail: ""
        };
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'toggleLockModel');
        instance.toggleLockModel('e', lock);
        expect(instance.toggleLockModel).toHaveBeenCalledTimes(1);
    });
    it('should test toggleLockModel when lock not available', () => {
        const lock = false;
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'toggleLockModel');
        instance.toggleLockModel('e', lock);
        expect(instance.toggleLockModel).toHaveBeenCalledTimes(1);
    });
    it('should test getLock', () => {
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'getLock');
        instance.getLock();
        expect(instance.getLock).toHaveBeenCalledTimes(1);
    });
    it('should test setSelectDataArr', () => {
        const key = 'createProfile';
        const rootIndex = 0;
        const index = 1;
        const data = [{'title': 'hii'}];
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'setSelectDataArr');
        instance.setSelectDataArr(key, rootIndex, index, data);
        expect(instance.setSelectDataArr).toHaveBeenCalledTimes(1);
    });
    it('Sholud render Common Model', () => {
        const lock = {
            openLockModel: true,
            isLocked: true,
            lockedBy: "Abc",
            lockedByEmail: "aa@dd.com"
        };
        const wrapper = setup({}, {...initialState, lock});
        expect(wrapper.containsMatchingElement(<CommonModel />)).toBe(true);
        expect(wrapper.state('lock').openLockModel).toBeTruthy();
    });
    it('should test handleValueChange', () => {
        const stepName = 'createProfile';
        const index = null;
        const rootIndex = 0;
        const value = 'ff';
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleValueChange');
        instance.handleValueChange(stepName, rootIndex, index, value);
        expect(instance.handleValueChange).toHaveBeenCalledTimes(1);
    });
    it('should test handleValueChange for relationship', () => {
        const stepName = 'relationShip';
        const index = 1;
        const rootIndex = 0;
        const value = 'ff';
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleValueChange');
        instance.handleValueChange(stepName, rootIndex, index, value);
        expect(instance.handleValueChange).toHaveBeenCalledTimes(1);
    });
    it('should test getCastStatus', async (done) => {
        const response = {
            response: {
              status: 201,
              data: [{"id":"bc3b8206-a032-48db-8078-2bc6540a5eaf","castProfileId":"4c1420f0-8032-4769-80ad-b53e6f604b52","sectionName":"profile","isLocked":true,"lockedBy":"b34168f3-c0bd-48b4-a018-bb8949819d1d","lockedOn":"2021-02-15T10:01:09.122Z","isDone":false,"doneBy":null,"doneOn":null,"createdBy":"b34168f3-c0bd-48b4-a018-bb8949819d1d","modifiedBy":"b34168f3-c0bd-48b4-a018-bb8949819d1d","status":"1","_created_on":"2021-02-15T10:01:09.123Z","_modified_on":"2021-02-15T10:01:09.123Z","lockedByUser":{"id":"b34168f3-c0bd-48b4-a018-bb8949819d1d","firstName":"Tanuj","lastName":"Kumar"},"doneByUser":null}]
            }
        };
        const wrapper = setup({}, { ...initialState });
        const instance = wrapper.instance();
        jest.spyOn(instance, 'getCastStatus');
        instance.getCastStatus();
        expect(instance.getCastStatus).toHaveBeenCalledTimes(1);
        moxios.wait(function () {
            const request = moxios.requests.mostRecent();
            request.respondWith(response).then((res) => {
                done();
            });
        });
    });
});