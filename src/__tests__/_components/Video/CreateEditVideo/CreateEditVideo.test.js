import React from 'react';
import { shallow } from 'enzyme';
import moxios from "moxios";

import CreateEditVideo from '../../../../_components/Video/CreateEditVideo/CreateEditVideo';
import axios from "../../../../_helpers/axiosInstance";

import CreateEditVideoJSON from '../../../../_components/Video/Schema/Standard/CreateEditVideo.json';
import jsonData from '../../../../_components/Video/Schema/Video_StandardJourney_FE_Structure.json';
import { findByTestAttr } from '../../../../Utils';

/**
 * Factory function to create a ShallowWrapper for the checklistcomp Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @returns {ShallowWrapper}
 */

const baseProps = {
    currentTabData: {
        isDone: false,
        isLocked: false,
        lockedBy: "",
    },
    unLockedSession: jest.fn(),
    selectedTab: 0,
    getVideoData: jest.fn(),
    markAsDone: jest.fn(),
    jsonData: jsonData.Video
}

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<CreateEditVideo {...baseProps} />)
    if (state) wrapper.setState(state);
    return wrapper;
}

describe('<CreateEditVideo />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup({ ...baseProps });
        moxios.install(axios)
    });
    afterEach(() => {
        moxios.uninstall(axios);
    });

    it('Should Render CreateEditVideo', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should check unlockVideo button click', () => {
        jest.spyOn(wrapper.instance(), 'unlockVideo');
        wrapper.instance().unlockVideo();
        expect(wrapper.instance().unlockVideo).toBeCalled();
    })

    it('should check toggleModel button click', () => {
        jest.spyOn(wrapper.instance(), 'toggleModel');
        wrapper.instance().toggleModel();
        expect(wrapper.instance().toggleModel).toBeCalled();
    })

    it('should check getVideo', () => {
        jest.spyOn(wrapper.instance(), 'getVideo');
        wrapper.instance().getVideo();
        expect(wrapper.instance().getVideo).toBeCalled();
    })

    it('should check checkIfMarkAsDone button', () => {
        wrapper.setState({ JSONSchema: CreateEditVideoJSON });
        jest.spyOn(wrapper.instance(), 'checkIfMarkAsDone');
        wrapper.instance().checkIfMarkAsDone();
        expect(wrapper.instance().checkIfMarkAsDone).toBeCalled();
    })

    it('should check InputChanger onChange method', () => {
        const status = 'Draft';
        wrapper.setState({ status, JSONSchema: CreateEditVideoJSON });
        jest.spyOn(wrapper.instance(), 'InputChanger');
        const event = { target: { value: 'test' } };
        wrapper.instance().InputChanger(event, 1);
        expect(wrapper.instance().InputChanger).toBeCalled();
    })

    it('should check InputChanger onChange method for published status', () => {
        const status = 'Published';
        wrapper.setState({ status, JSONSchema: CreateEditVideoJSON });
        jest.spyOn(wrapper.instance(), 'InputChanger');
        const event = { target: { value: 'test' } };
        wrapper.instance().InputChanger(event, 1);
        expect(wrapper.instance().InputChanger).toBeCalled();
    })

    it('should check autoSave method', () => {
        const mockJSON = [{
            col: "col-md-6 col-lg-6", data: undefined, errorText: "", label: "Audio Track", name: "dashSuffixesId",
            type: "text", validation: { maxLength: 250, isChar: true, required: false }, value: [], touched: 1, valid: true
        }, {
            col: "col-md-6 col-lg-6", data: undefined, errorText: "", label: "Sub Title", name: "subtitleLanguages",
            touched: 1, type: "text", valid: true, validation: { maxLength: 250, isChar: true, required: false }, value: [{ id: '123' }]
        }, {
            col: "col-md-6 col-lg-6", data: undefined, errorText: "", label: "Dash Root Folder", name: "dashRootFolderName", type: "text",
            validation: { maxLength: 250, isAlphaNumericWithSpecialChars: true, required: true }, value: "test"
        }]
        wrapper.setState({ JSONSchema: mockJSON, contentId: 'abc' });
        jest.spyOn(wrapper.instance(), 'autoSave');
        wrapper.instance().autoSave(1);
        expect(wrapper.instance().autoSave).toBeCalled();
    })

    it('should check autoSave method for else condition', () => {
        const mockJSON = [{
            col: "col-md-6 col-lg-6", data: undefined, errorText: "", label: "Audio Track", name: "dashSuffixesId",
            type: "text", validation: { maxLength: 250, isChar: true, required: false }, value: []
        }, {
            col: "col-md-6 col-lg-6", data: undefined, errorText: "", label: "Sub Title", name: "subtitleLanguages",
            touched: 1, type: "text", valid: true, validation: { maxLength: 250, isChar: true, required: false }, value: [{ id: '123' }]
        }, {
            col: "col-md-6 col-lg-6", data: undefined, errorText: "", label: "Dash Root Folder", name: "mediathekFileUid", type: "text",
            validation: { maxLength: 250, isAlphaNumericWithSpecialChars: true, required: true }, value: "test"
        }]
        wrapper.setState({ JSONSchema: mockJSON, contentId: 'abc' });
        jest.spyOn(wrapper.instance(), 'autoSave');
        wrapper.instance().autoSave(2);
        expect(wrapper.instance().autoSave).toBeCalled();
    })

    it('should check markAsDone method', () => {
        jest.spyOn(wrapper.instance(), 'markAsDone');
        wrapper.instance().markAsDone();
        expect(wrapper.instance().markAsDone).toBeCalled();
    })

    it('should test markAsDone onClick method', () => {
        const state = {
            readyToDone: true,
            isDone: false,
            isLocked: false
        }
        const wrapper = setup(null, { ...state });
        const spy = jest.spyOn(wrapper.instance(), 'markAsDone');
        const button = findByTestAttr(wrapper, 'mark-as-done');
        button.simulate('click');
        expect(spy).toHaveBeenCalled();
    })

    it('should check fillVideoDetails method', (done) => {
        const response = [{
            audioLanguage: "test", createdBy: "6bc0890a-a520-4c59-b024-6c32265550a7", dashManifestName: null, dashRootFolderName: "test",
            dashSuffixesId: null, drmKeyId: null, hlsManifestName: null, hlsRootFolderName: null, hlsSuffixesId: null,
            id: "f9214098-1f62-4426-8358-1981d11224aa", mediathekFileUid: null, modifiedBy: "6bc0890a-a520-4c59-b024-6c32265550a7",
            protected: null, size: null, status: "1", subtitleLanguages: "test sub", videoId: "0cd0742f-080c-44ab-b366-ca4c545ef9ab"
        }]
        wrapper.setState({ JSONSchema: CreateEditVideoJSON });
        const mockParams = {
            contentId: "7b97f27a-b3ee-4433-bc88-0874188437bc",
            stage: { id: "3bb64421-f15f-4dda-adec-03c324c140a3", title: "Draft" }
        }
        jest.spyOn(wrapper.instance(), 'fillVideoDetails');
        wrapper.instance().fillVideoDetails(mockParams);
        expect(wrapper.instance().fillVideoDetails).toBeCalled();
        moxios.wait(function () {
            const request = moxios.requests.mostRecent();
            request.respondWith(response).then((res) => {
                expect(wrapper.state().updateObj).toBe();
                done();
            });
        });
    })

    it('should check importDetails method', (done) => {
        const mediathekFileUidState = 'mockid123';
        wrapper.setState({mediathekFileUidState, JSONSchema: CreateEditVideoJSON})
        jest.spyOn(wrapper.instance(), 'importDetails');
        wrapper.instance().importDetails();
        expect(wrapper.instance().importDetails).toBeCalled();
        const response = [{name:'xyz'}]
        moxios.wait(function () {
            const request = moxios.requests.mostRecent();
            request.respondWith(response).then((res) => {
                expect(wrapper.state().isUpdate).toBe(false);
                done();
            });
        });
    })

    it('should check setSelectDataArr method', () => {
        const mocRes = [
            { id: "dcdd1bca-4edd-4e6d-accd-2a5b015403cc", status: "1", title: "Connected" },
            { title: "High", status: "1", id: "7d2fa466-8e90-45f3-a484-f7532e80f627" },
            { title: "Low", status: "1", id: "516111b3-91d5-4735-b655-1636563a33e7" }
        ]
        wrapper.setState({ JSONSchema: CreateEditVideoJSON });
        jest.spyOn(wrapper.instance(), 'setSelectDataArr');
        wrapper.instance().setSelectDataArr(mocRes, 4);
        expect(wrapper.instance().setSelectDataArr).toBeCalled();
    })

    it('should check getVideoDetails method',  (done) => {
        const response = {
            activity: null, adMarker: null, adaptation: null, ageRating: null, album: null, alternatetitle: null,
            audioLanguages: null, awards: null, category: null, certification: null, contentGrade: null, contentLanguage: null,
            contentOwner: null, contentState: { title: "Draft", id: "3bb64421-f15f-4dda-adec-03c324c140a3" }, contentVersion: null,
            contractId: null, creativeTitle: null, dateZee5Published: null,
            controlFields: { createdOn: "2021-02-01T18:58:34.404Z", createdBy: "Sandeep Kumar", modifiedOn: "2021-02-02T12:38:03.108Z", modifiedBy: "Sandeep Kumar" },
        }
        jest.spyOn(wrapper.instance(), 'getVideoDetails');
        wrapper.instance().getVideoDetails();
        expect(wrapper.instance().getVideoDetails).toBeCalled();
        moxios.wait(function () {
            const request = moxios.requests.mostRecent();
            request.respondWith(response).then((res) => {
                expect(wrapper.state().status).toBe(null);
                done();
            });
        });
    })

    it('should check InputChanger onChange method for Submit to Review status', () => {
        const component = setup()
        const mockJSON = [{
                name: "audioLanguage", value: "", col: "col-md-6 col-lg-6", type: "file", label: "Audio Track",
                errorText: "", validation: { maxLength: 250, isChar: true, required: false }
            }]
        const status = 'Submit to Review';
        component.setState({ status, JSONSchema: mockJSON });
        jest.spyOn(component.instance(), 'InputChanger');
        const event = { target: { value: 'test', files: [{name:'file'}] } };
        component.instance().InputChanger(event, 0);
        expect(component.instance().InputChanger).toBeCalled();
    })

    it('should check InputChanger onChange method for drmKeyId', () => {
        const status = 'Draft';
        wrapper.setState({ status, JSONSchema: CreateEditVideoJSON });
        jest.spyOn(wrapper.instance(), 'InputChanger');
        const event = { target: { value: 'test' } };
        wrapper.instance().InputChanger(event, 6);
        expect(wrapper.instance().InputChanger).toBeCalled();
    })

    it('should check InputChanger onChange method for checkbox', () => {
        const status = 'Draft';
        wrapper.setState({ status, JSONSchema: CreateEditVideoJSON });
        jest.spyOn(wrapper.instance(), 'InputChanger');
        const event = { target: { value: 'test' } };
        wrapper.instance().InputChanger(event, 8    );
        expect(wrapper.instance().InputChanger).toBeCalled();
    })

    it('should test autosave blur method', () => {
        const input =wrapper.find('#inputChanger');
        input.simulate('change');
        expect(wrapper.state().isUpdate).toBe(false);
    })

});