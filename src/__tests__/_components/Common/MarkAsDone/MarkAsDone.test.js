import React from 'react';
import { shallow, mount } from 'enzyme';

import MarkAsDone from '../../../../_components/Common/MarkAsDone/MarkAsDone'

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
    state: 2,
    handleMarkAsDone: jest.fn()
}

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<MarkAsDone {...baseProps} />)
    return wrapper;
}

describe('MarkAsDone', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders MarkAsDone default', () => {
        expect(wrapper.exists()).toBe(true);
    })

    it('should check handleMarkAsDone onClick method', () => {
        wrapper.find('#markAsDoneBtn').simulate('click');
        expect(baseProps.handleMarkAsDone).toHaveBeenCalled();
    })
})