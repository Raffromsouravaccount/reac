import React from 'react';
import { shallow, mount } from 'enzyme';

import Locked from '../../../../_components/Common/Locked/Locked'

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
    lock: true
}

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<Locked {...baseProps} />)
    return wrapper;
}

describe('Locked', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders Locked default', () => {
        expect(wrapper.exists()).toBe(true);
    })
})