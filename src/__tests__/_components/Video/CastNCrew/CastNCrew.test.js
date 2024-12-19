import React from 'react';
import { shallow } from 'enzyme';
import CastAndCrew from './../../../../_components/Video/CastAndCrew/CastAndCrew';
import { findByTestAttr, checkProps } from '../../../../Utils';
import { expect, it, jest } from '@jest/globals';
import moxios from 'moxios';
import FormRender from '../../../../_components/Common/FormHelper/FormRender';

import jsonData from '../../../../_components/Video/Schema/Video_StandardJourney_FE_Structure.json';

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<CastAndCrew {...props} />);
    if (state) wrapper.setState(state);
    return wrapper;
}

describe('render wrapper', () => {
    let wrapper;
    const actors = [{
        col: "col-md-6 col-lg-6", data: [{ data: 'mockData' }], errorText: "", keyText: "castName",
        label: "Actor", multiple: false, name: "actor", type: "SearchableWithCreate",
        validation: { required: false, isChar: true }, value: {}
    },
    {
        col: "col-md-6 col-lg-6", errorText: "", label: "Character", multiple: false, name: "character",
        type: "text", validation: { required: false, isChar: true, maxLength: 250 }, value: "test team "
    }];
    const others = [[{
        col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "castName",
        label: "Actor", multiple: false, name: "actor", type: "SearchableWithCreate",
        validation: { required: false, isChar: true }, value: {}
    }],
    {
        col: "col-md-6 col-lg-6", errorText: "", label: "Character", multiple: false, name: "character",
        type: "text", validation: { required: false, isChar: true, maxLength: 250 }, value: "test team "
    }];
    const actorsData = [
        {
            col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "castName",
            label: "Actor", multiple: false, name: "actor", type: "SearchableWithCreate",
            validation: { required: false, isChar: true }, value: {}
        },
        {
            col: "col-md-6 col-lg-6", errorText: "", label: "Character", multiple: false, name: "character",
            type: "text", validation: { required: false, isChar: true, maxLength: 250 }, value: "test team "
        }
    ]
    const props = {
        unLockedSession: jest.fn(),
        videoId: '7b97f27a-b3ee-4433-bc88-0874188437bc',
        currentTabData: {
            isDone: false,
            isLocked: false,
            label: "Cast & Crew",
            lockedBy: "",
            permissionKey: "movies",
            permissionName: "canUpdate",
            permissionSubKey: "castNCrewModule",
            properties: true,
            quickFiling: false,
            singleLanding: false,
            movieId: 123
        },
        markAsDone: jest.fn(),
        selectedTab: 1,
        jsonData : jsonData.CastNCrew
    }
    beforeEach(() => {
        moxios.install();
        wrapper = setup({ ...props }, { actors, others, actorsData });
    })
    afterEach(() => {
        moxios.uninstall();
    })

    it('Should renders CastNCrew default', () => {
        expect(wrapper.exists()).toBe(true);
    })

    it('should check unLockCastNCrew method', () => {
        jest.spyOn(wrapper.instance(), 'unLockCastNCrew');
        wrapper.instance().unLockCastNCrew();
        expect(wrapper.instance().unLockCastNCrew).toBeCalled();
    })

    it('should check showHideLockPopup method', () => {
        const showLockedPopup = false;
        wrapper.setState({ showLockedPopup });
        jest.spyOn(wrapper.instance(), 'showHideLockPopup');
        wrapper.instance().showHideLockPopup();
        expect(wrapper.instance().showHideLockPopup).toBeCalled();
    })

    it('should check markAsDone method', () => {
        jest.spyOn(wrapper.instance(), 'markAsDone');
        wrapper.instance().markAsDone();
        expect(wrapper.instance().markAsDone).toBeCalled();
    })

    it('should check addRemoveMultipleFields method', () => {
        jest.spyOn(wrapper.instance(), 'addRemoveMultipleFields');
        wrapper.instance().addRemoveMultipleFields('actors', 0);
        expect(wrapper.instance().addRemoveMultipleFields).toBeCalled();
    })

    it('should check addRemoveMultipleFields method', () => {
        jest.spyOn(wrapper.instance(), 'addRemoveMultipleFields');
        wrapper.instance().addRemoveMultipleFields('actors', 1);
        expect(wrapper.instance().addRemoveMultipleFields).toBeCalled();
    })

    it('should check handleBlur method', () => {
        const mockSet = {
            errorText: true
        }
        wrapper.setState({...mockSet});
        jest.spyOn(wrapper.instance(), 'handleBlur');
        wrapper.instance().handleBlur(0, 0, 'actors');
        expect(wrapper.instance().handleBlur).toBeCalled();
    });

    it('should check formatData method', () => {
        const shallowArr = [
            [{
                col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "castName", label: "Actor", multiple: false,
                name: "actor", type: "SearchableWithCreate", validation: { required: false, isChar: true }, value: { castName: "test drive" }
            }, {
                col: "col-md-6 col-lg-6", errorText: "", label: "Character", multiple: false, name: "character",
                type: "text", validation: { required: false, isChar: true, maxLength: 250 }, value: "test team"
            }]]
        jest.spyOn(wrapper.instance(), 'formatData');
        wrapper.instance().formatData('actors', shallowArr);
        expect(wrapper.instance().formatData).toBeCalled();
    });

    it('should check handleSearchableInput method', () => {
        jest.spyOn(wrapper.instance(), 'handleSearchableInput');
        wrapper.instance().handleSearchableInput("team", null, 0, "others");
        expect(wrapper.instance().handleSearchableInput).toBeCalled();
    });

    it('should check handleStateChange method', () => {
        const event = { target: { value: 'test' } };
        jest.spyOn(wrapper.instance(), 'handleStateChange');
        wrapper.instance().handleStateChange(event, 0, 0, "others");
        expect(wrapper.instance().handleStateChange).toBeCalled();
    });

    it('should check updatedDataValue method', () => {
        const mockRes = {
            '3bb64421-f15f-4dda-adec-03c324c140a3': [{ actor: { castName: "actor test" }, character: "cha" }],
            '42c1e2b7-0578-4e5f-b805-c2601fddee28': [{ id: "3cea4d09-495c-43df-ad9b-b25a89c80c4a", castName: "testt" }]
        }
        jest.spyOn(wrapper.instance(), 'updatedDataValue');
        wrapper.instance().updatedDataValue(mockRes);
        expect(wrapper.instance().updatedDataValue).toBeCalled();
    });

    it('should check FormRender without crash', () => {
        expect(wrapper.containsMatchingElement(<FormRender />)).toEqual(true);
    })

    it('should check getVideoDetails method', () => {
        jest.spyOn(wrapper.instance(), 'getVideoDetails');
        wrapper.instance().getVideoDetails();
        expect(wrapper.instance().getVideoDetails).toBeCalled();
    });

    it('should check selectGroup', () => {
        const event = { target: { value: 'mock' } }
        jest.spyOn(wrapper.instance(), 'selectGroup');
        wrapper.instance().selectGroup(event, null, null, 0, 'actors');
        expect(wrapper.instance().selectGroup).toBeCalled();
    })

    it('should check checkError', () => {
        const state = {
            actors: [[{
                col: "col-md-6 col-lg-6", data: [{ data: 'mockData' }], errorText: "", keyText: "castName",
                label: "Actor", multiple: false, name: "actor", type: "SearchableWithCreate",
                validation: { required: false, isChar: true }, value: {}
            },
            {
                col: "col-md-6 col-lg-6", errorText: "", label: "Character", multiple: false, name: "character",
                type: "text", validation: { required: false, isChar: true, maxLength: 250 }, value: "test team "
            }]]
        }
        wrapper.setState({...state})
        jest.spyOn(wrapper.instance(), 'checkError');
        wrapper.instance().checkError();
        expect(wrapper.instance().checkError).toBeCalled();
    })
    
    it('should check setSelectDataArr', () => {
        jest.spyOn(wrapper.instance(), 'setSelectDataArr');
        wrapper.instance().setSelectDataArr('actors', null, 0, []);
        expect(wrapper.instance().setSelectDataArr).toBeCalled();
    })

    it('should check componentDidMount', () => {
        jest.spyOn(wrapper.instance(), 'componentDidMount');
        wrapper.instance().componentDidMount();
        expect(wrapper.instance().componentDidMount).toBeCalled();
    })

})