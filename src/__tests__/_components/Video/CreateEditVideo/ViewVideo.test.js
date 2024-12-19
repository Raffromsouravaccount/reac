import React from 'react';
import { shallow } from 'enzyme';
import moxios from "moxios";

import ViewVideo from '../../../../_components/Video/CreateEditVideo/ViewVideo';
import axios from "../../../../_helpers/axiosInstance";

import CreateEditVideoJSON from '../../../../_components/Video/Schema/Standard/CreateEditVideo.json';

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
    selectedTab: 0
}

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<ViewVideo {...baseProps} />)
    if (state) wrapper.setState(state);
    return wrapper;
}

describe('ViewVideo', () => {
    let wrapper;
    const mockRes = {
        audioLanguage: "test", createdBy: "6bc0890a-a520-4c59-b024-6c32265550a7", dashManifestName: null,
        dashRootFolderName: null, dashSuffixesId: null, drmKeyId: null, hlsManifestName: null, hlsRootFolderName: null,
        hlsSuffixesId: null, id: "b7a650ef-e56d-4f17-b45c-a09e4548b849", mediathekFileUid: null, status: "1",
        modifiedBy: "6bc0890a-a520-4c59-b024-6c32265550a7", protected: null, size: null,  subtitleLanguages: null,
        videoId: "7b97f27a-b3ee-4433-bc88-0874188437bc"
    }
    beforeEach(() => {
        wrapper = setup({ ...baseProps });
        moxios.uninstall(axios);
    });
    afterEach(() => {
        moxios.uninstall(axios);
    });

    it('Should Render ViewVideo', () => {
        expect(wrapper.exists()).toBe(true);
    });
    
    it('should check getVideoDetails method', () => {
        jest.spyOn(wrapper.instance(), 'getVideoDetails');
        wrapper.instance().getVideoDetails();
        expect(wrapper.instance().getVideoDetails).toBeCalled();
    })
    
    it('should check setJsonData method', () => {
        wrapper.setState({ JSONSchema: CreateEditVideoJSON });
        jest.spyOn(wrapper.instance(), 'setJsonData');
        wrapper.instance().setJsonData(mockRes);
        expect(wrapper.instance().setJsonData).toBeCalled();
    })
})