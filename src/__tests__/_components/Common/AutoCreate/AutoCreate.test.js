import React from 'react';
import { shallow, mount } from 'enzyme';

import AutoCreate from '../../../../_components/Common/AutoCreate/AutoCreate';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const baseProps = {
    id: "auto-create", onChange: jest.fn(), className: "zee-SelectWSearch-field",
    data: [], disableCloseOnSelect: false, disabled: false, error: false,errorMsg: "",
    handleInputChange: jest.fn, keyText: "castName", label: "Related To",
    multiple: false, name: "castProfileId", onBlur: jest.fn(), placeholder: "",
    required: false, value: [{name: 'test', ketText: 'test'}],
}

const setup = (props = {}) => {
    const wrapper = shallow(<AutoCreate {...baseProps} />);
    return wrapper;
}

describe('AutoCreate', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup({...baseProps});
    })

    it('Should renders AutoCreate default', () => {
        expect(wrapper.exists()).toBe(true);
    })

    it('should check onChange method', () => {
        wrapper.find('#auto-create').simulate('change');
        expect(baseProps.onChange).toHaveBeenCalled();
    })

    it('should check onChange method', () => {
        wrapper.find('#auto-create').simulate('blur');
        expect(baseProps.onBlur).toHaveBeenCalled();
    })

    
})