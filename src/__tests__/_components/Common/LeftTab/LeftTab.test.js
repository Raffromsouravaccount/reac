import React from 'react';
import { shallow, mount } from 'enzyme';

import LeftTab from '../../../../_components/Common/LeftTab/LeftTab';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
    options: [
    {label: "Profile Details", name: "profile", permissionKey: "cast", permissionSubKey: "profile", permissionName: "canUpdate"},
    {label: "Images", name: "image", permissionKey: "cast", permissionSubKey: "images", permissionName: "canUpdate"}],
    className: 'mock-class',
    handleChange: jest.fn()
}

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<LeftTab {...baseProps} />)
    return wrapper;
}

describe('LeftTab', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders LeftTab default', () => {
        expect(wrapper.exists()).toBe(true);
    })

    it('should check onChange method', () => {
        wrapper.find('.mock-class').simulate('change');
        expect(baseProps.handleChange).toHaveBeenCalled();
    })
})