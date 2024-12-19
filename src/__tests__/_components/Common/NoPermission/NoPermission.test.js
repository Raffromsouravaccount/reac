import React from 'react';
import { shallow, mount } from 'enzyme';

import NoPermission from '../../../../_components/Common/NoPermission/NoPermission';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<NoPermission {...props} />)
    return wrapper;
}

describe('NoPermission', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders NoPermission default', () => {
        expect(wrapper.exists()).toBe(true);
    })
})