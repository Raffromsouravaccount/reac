import React from 'react';
import { shallow } from 'enzyme';
import moxios from "moxios";

import ViewCastAndCrew from '../../../../_components/Video/CastAndCrew/ViewCastAndCrew';
import axios from "../../../../_helpers/axiosInstance";
import ViewDetails from '../../../../_components/Common/ViewDetail/ViewDetails';
import jsonData from '../../../../_components/Video/Schema/Video_StandardJourney_FE_Structure.json';


/**
 * Factory function to create a ShallowWrapper for the checklistcomp Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @returns {ShallowWrapper}
 */

const baseProps = {
    videoId: '7b97f27a-b3ee-4433-bc88-0874188437bc',
    jsonData: jsonData.CastNCrew
}

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<ViewCastAndCrew {...baseProps} />)
    if (state) wrapper.setState(state);
    return wrapper;
}

describe('<ViewCastAndCrew />', () => {
    let wrapper;
    const actors = [{
        col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "castName",
        label: "Actor", multiple: false, name: "actor", type: "SearchableWithCreate",
        validation: { required: false, isChar: true }, value: {}
    },
    {
        col: "col-md-6 col-lg-6", errorText: "", label: "Character", multiple: false, name: "character",
        type: "text", validation: { required: false, isChar: true, maxLength: 250 }, value: "test team "
    }];
    const others = [{
        col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "castName",
        label: "Actor", multiple: false, name: "actor", type: "SearchableWithCreate",
        validation: { required: false, isChar: true }, value: {}
    },
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
        }]
    beforeEach(() => {
        wrapper = setup({ ...baseProps }, { actors, others, actorsData });
        moxios.uninstall(axios);
    });
    afterEach(() => {
        moxios.uninstall(axios);
    });

    it('Should Render component', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should check updatedDataValue method', () => {
        const mockRes = {
            '3bb64421-f15f-4dda-adec-03c324c140a3': [{actor: {castName: "actor test"},character: "cha"}],
            '42c1e2b7-0578-4e5f-b805-c2601fddee28': [{id: "3cea4d09-495c-43df-ad9b-b25a89c80c4a", castName: "testt"}]
        }
        jest.spyOn(wrapper.instance(), 'updatedDataValue');
        wrapper.instance().updatedDataValue(mockRes);
        expect(wrapper.instance().updatedDataValue).toBeCalled();
    })

    it('should check viewDetails component rendering', () => {
        expect(wrapper.containsMatchingElement(<ViewDetails />)).toEqual(true);
    })
});