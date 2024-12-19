import React from 'react';
import { shallow, mount } from 'enzyme';

import InputField from '../../../../_components/Common/InputField/InputField';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
    onChange: jest.fn()
}

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<InputField {...baseProps} />)
    return wrapper;
}

describe('InputField', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders InputField default', () => {
        expect(wrapper.exists()).toBe(true);
    })

})