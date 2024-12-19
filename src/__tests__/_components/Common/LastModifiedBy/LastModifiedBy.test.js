import React from 'react';
import { shallow, mount } from 'enzyme';

import {LastModifiedBy} from '../../../../_components/Common/LastModifiedBy/LastModifiedBy';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
    data: [{mockName:'test'}]
}

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<LastModifiedBy {...baseProps} />)
    return wrapper;
}

describe('LastModifiedBy', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders LastModifiedBy default', () => {
        expect(wrapper.exists()).toBe(true);
    })
})