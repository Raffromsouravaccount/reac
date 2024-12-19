import React from 'react';
import { shallow } from 'enzyme';
import moxios from 'moxios';
import Others from '../../../../../_components/CreateMovie/CastNCrew/SubComponents/Others';

import { expect, it, jest } from '@jest/globals';
import axios from "../../../../../_helpers/axiosInstance";

const setup = (props = {}) => {
    const wrapper = shallow(<Others {...props} />);
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
        label: "Others", multiple: true, name: "3bb64421-f15f-4dda-adec-03c324c140a3"
    },
    handleChange: jest.fn(),
    handleMultiSelect: jest.fn(),
    onBlur: jest.fn(),
    manageActors: jest.fn(),
    inputSearchHandler: () => {},
    handleKeyPress: jest.fn()
}

describe('render Others', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = setup({ ...baseProps });
        moxios.install(axios);
    })
    afterEach(() => {
        moxios.uninstall(axios);
    });

    it('Should renders Others default', () => {
        expect(wrapper.exists()).toBe(true);
    })
    
    it('should check blur method of onBlur', () => {
        wrapper.find('#FieldSelector').simulate('blur');
        expect(baseProps.onBlur).toHaveBeenCalled();
    })

})
