import React from 'react';
import { shallow, mount } from 'enzyme';

import NoInternet from '../../../../_components/Common/NoInternet/NoInternet'

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<NoInternet {...props} />)
    return wrapper;
}

describe('NoInternet', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders NoInternet default', () => {
        expect(wrapper.exists()).toBe(true);
    })
})