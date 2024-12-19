import React from 'react';
import { shallow, mount } from 'enzyme';

import AddSchedule from '../../../../_components/Common/PublishContent/AddSchedule';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<AddSchedule {...props} addSchedule={jest.fn()}/>)
    return wrapper;
}

describe('AddSchedule', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders AddSchedule default', () => {
        expect(wrapper.exists()).toBe(true);
    })
});