import React from 'react';
import { shallow } from 'enzyme';
import moxios from 'moxios';
import Actors from '../../../../../_components/CreateMovie/CastNCrew/SubComponents/Actors';

import { expect, it, jest } from '@jest/globals';
import axios from "../../../../../_helpers/axiosInstance";

const setup = (props = {}) => {
    const wrapper = shallow(<Actors {...props} />);
    return wrapper;
}

const baseProps = {
    metadata: {
        attributes: [{
            actor: {
                col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "castName", label: "Actor", multiple: false, name: "actor",
                type: "SearchableWithCreate", validation: { required: false, isAlphaNumericWithSpecialChars: true }, value: null
            }, 
            character: {
                col: "col-md-6 col-lg-6", errorText: "", label: "Character", maxLength: 250, multiple: false, name: "character",
                type: "text", validation: { required: false, isChar: true, maxLength: 250 }, value: ""
            }
        }],
        label: "Actors", multiple: true, name: "3bb64421-f15f-4dda-adec-03c324c140a3"
    },
    handleChange: jest.fn(),
    handleMultiSelect: jest.fn(),
    onBlur: jest.fn(),
    manageActors: jest.fn()
}

describe('render Actors', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = setup({ ...baseProps });
        moxios.install(axios);
    })
    afterEach(() => {
        moxios.uninstall(axios);
    });

    it('Should renders Actors default', () => {
        expect(wrapper.exists()).toBe(true);
    })

    it('should check onClick method of manageActors', () => {
        wrapper.find('#manageActors').simulate('click');
        expect(baseProps.manageActors).toHaveBeenCalled();
    })
})
