import React from 'react';
import { shallow, mount } from 'enzyme';
import moxios from "moxios";
import axios from "../../../../_helpers/axiosInstance";
import { constantText } from '../../../../_helpers/constants.text';
import TranslationInfo from './../../../../_components/Translation/Layout/TranslationInfo';
import TranslationCollection from './../../../../_components/Translation/TranslationCollection/TranslationCollection';
import { CommonModel } from './../../../../_components/Common/Model/CommonModel';

const setup = (props = {}, state = null) => {
    const wrapper = shallow(<TranslationCollection {...props} />)
    if (state) wrapper.setState(state);
    return wrapper;
}
const initialState = {
    params:{
        collectionId: "5753e295-66e8-4a42-9f90-af14c3edadab"
    },
    showNavToAssignedLang: false,
    language: {
        code: 'hi'
    }
}

describe('<TranslationCollection />', () => {
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
    it('Should renders Translation Collection default', () => {
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
    it('should test fetchContentData',(done) => {
        const response = {
            response: {
              status: 200,
              data: [{"id":"71bca167-6ffe-480e-8027-da6f23572137","externalId":"1-3-100100","title":"No Title","note":null,"shortDescription":"<p>ff</p>","description":"<p>aa</p>","longDescription":"<p>ff</p>","subtype":"4117cc68-49f5-11eb-b378-0242ac130002","autoPlay":false,"tags":null,"languages":null,"contentCategoryId":null,"contentStateId":"3bb64421-f15f-4dda-adec-03c324c140a3","createdBy":"d2fa1282-5f91-4231-a2b4-f308caf5afc6","modifiedBy":"d2fa1282-5f91-4231-a2b4-f308caf5afc6","status":"1","lastModifiedBy":"d2fa1282-5f91-4231-a2b4-f308caf5afc6","lastModifiedOn":"2021-02-16T08:52:58.599Z","_created_on":"2021-02-16T08:51:26.672Z","_modified_on":"2021-02-16T08:52:58.599Z","_created_by":"d2fa1282-5f91-4231-a2b4-f308caf5afc6","_modified_by":"d2fa1282-5f91-4231-a2b4-f308caf5afc6","last_modified_by":"d2fa1282-5f91-4231-a2b4-f308caf5afc6","content_state_id":"3bb64421-f15f-4dda-adec-03c324c140a3","content_category_id":null}]
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
        const res = {"status":200,"message":"Success","data":[{"id":"71bca167-6ffe-480e-8027-da6f23572137","externalId":"1-3-100100","title":"No Title","note":null,"shortDescription":"<p>ff</p>","description":"<p>aa</p>","longDescription":"<p>ff</p>","subtype":"4117cc68-49f5-11eb-b378-0242ac130002","autoPlay":false,"tags":null,"languages":null,"contentCategoryId":null,"contentStateId":"3bb64421-f15f-4dda-adec-03c324c140a3","createdBy":"d2fa1282-5f91-4231-a2b4-f308caf5afc6","modifiedBy":"d2fa1282-5f91-4231-a2b4-f308caf5afc6","status":"1","lastModifiedBy":"d2fa1282-5f91-4231-a2b4-f308caf5afc6","lastModifiedOn":"2021-02-16T08:52:58.599Z","_created_on":"2021-02-16T08:51:26.672Z","_modified_on":"2021-02-16T08:52:58.599Z","_created_by":"d2fa1282-5f91-4231-a2b4-f308caf5afc6","_modified_by":"d2fa1282-5f91-4231-a2b4-f308caf5afc6","last_modified_by":"d2fa1282-5f91-4231-a2b4-f308caf5afc6","content_state_id":"3bb64421-f15f-4dda-adec-03c324c140a3","content_category_id":null}],"error":null};
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
    it('should test updateValues', () => {
        const res = [{"id":"d50be022-60a7-42d1-b5cf-23beca560992","collectionId":"71bca167-6ffe-480e-8027-da6f23572137","langCode":"as","title":"hu","shortDescription":null,"description":null,"longDescription":null,"translationStatus":"1","status":"1","createdBy":"e86244aa-1b36-4b58-bbe0-4968a840a438","modifiedBy":"e86244aa-1b36-4b58-bbe0-4968a840a438","_created_on":"2021-02-16T08:52:17.841Z","_modified_on":"2021-02-16T08:52:17.841Z","_created_by":"e86244aa-1b36-4b58-bbe0-4968a840a438","_modified_by":"e86244aa-1b36-4b58-bbe0-4968a840a438","languages":null,"isDone":{"isLocked":true,"isDone":false,"status":"1","createdBy":"e86244aa-1b36-4b58-bbe0-4968a840a438","modifiedBy":"e86244aa-1b36-4b58-bbe0-4968a840a438","lockedByUser":{"first_name":"Test","last_name":"Translator"}}}];
        const isDefaultData = false;
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'updateValues');
        instance.updateValues(res);
        expect(isDefaultData).toBeFalsy();
        expect(instance.updateValues).toHaveBeenCalledTimes(1);
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
        instance.lockSections(params?.collectionId);
        expect(instance.lockSections).toHaveBeenCalledWith(params?.collectionId);
        expect(instance.lockSections).toHaveBeenCalledTimes(1);
    });
    it('should test autoSave',  (done) => {
        const response = {
            response: {
              status: 200,
              data: {"id":"d50be022-60a7-42d1-b5cf-23beca560992","title":"hum","description":null,"_created_by":"e86244aa-1b36-4b58-bbe0-4968a840a438","_modified_by":"e86244aa-1b36-4b58-bbe0-4968a840a438","_created_on":"2021-02-16T08:52:17.841Z","_modified_on":"2021-02-16T08:59:49.174Z","collectionId":"71bca167-6ffe-480e-8027-da6f23572137","langCode":"as","shortDescription":null,"longDescription":null,"translationStatus":"1","status":"1"}
            }
        };
        const updatedFields = {
            "name": "title",
            "value": "hum",
            "originalValue": "",
            "type": "text",
            "label": "Collection Title",
            "maxTextLength": 250,
            "required": false,
            "text": false,
            "numeric": false
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
        const stepName = 'CreateSummary';
        const index = 0;
        const value = 'ff';
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleValueChange');
        instance.handleValueChange(stepName, index, value);
        expect(instance.handleValueChange).toHaveBeenCalledTimes(1);
    });
    it('should test getCollectionStatus',(done) => {
        const response = {
            response: {
              status: 200,
              data: [{"id":"ee546c07-43c5-40fd-a67a-8e7c09caf437","collectionId":"71bca167-6ffe-480e-8027-da6f23572137","sectionName":"Hi_properties","isLocked":true,"lockedBy":"e86244aa-1b36-4b58-bbe0-4968a840a438","lockedOn":"2021-02-16T09:15:24.643Z","isDone":true,"doneBy":"e86244aa-1b36-4b58-bbe0-4968a840a438","doneOn":"2021-02-16T09:15:27.167Z","createdBy":"e86244aa-1b36-4b58-bbe0-4968a840a438","modifiedBy":"e86244aa-1b36-4b58-bbe0-4968a840a438","status":"1","_created_on":"2021-02-16T09:15:24.644Z","_modified_on":"2021-02-16T09:15:27.168Z","lockedByUser":{"id":"e86244aa-1b36-4b58-bbe0-4968a840a438","firstName":"Test","lastName":"Translator"}},{"id":"c9b784b6-930f-4bbb-a4fa-fac3bdfe85c8","collectionId":"71bca167-6ffe-480e-8027-da6f23572137","sectionName":"as_properties","isLocked":true,"lockedBy":"e86244aa-1b36-4b58-bbe0-4968a840a438","lockedOn":"2021-02-16T08:52:17.834Z","isDone":true,"doneBy":"e86244aa-1b36-4b58-bbe0-4968a840a438","doneOn":"2021-02-16T09:02:54.576Z","createdBy":"e86244aa-1b36-4b58-bbe0-4968a840a438","modifiedBy":"e86244aa-1b36-4b58-bbe0-4968a840a438","status":"1","_created_on":"2021-02-16T08:52:17.835Z","_modified_on":"2021-02-16T09:02:54.576Z","lockedByUser":{"id":"e86244aa-1b36-4b58-bbe0-4968a840a438","firstName":"Test","lastName":"Translator"}}]
            }
        };
        const wrapper = setup({}, { ...initialState });
        const instance = wrapper.instance();
        jest.spyOn(instance, 'getCollectionStatus');
        instance.getCollectionStatus();
        expect(instance.getCollectionStatus).toHaveBeenCalledTimes(1);
        moxios.wait(function () {
            const request = moxios.requests.mostRecent();
            request.respondWith(response).then((res) => {
                done();
            });
        });
    });
});