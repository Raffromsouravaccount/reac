import React from 'react';
import { shallow, mount } from 'enzyme';

import { ImageLoad } from '../../../../_components/Common/ImageLoad/ImageLoad'

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<ImageLoad />)
    return wrapper;
}

describe('ImageLoad', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders ImageLoad default', () => {
        expect(wrapper.exists()).toBe(true);
    })

})