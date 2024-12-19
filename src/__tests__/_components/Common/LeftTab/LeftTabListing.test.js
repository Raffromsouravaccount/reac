import React from 'react';
import { shallow, mount } from 'enzyme';

import {LeftTabListing} from '../../../../_components/Common/LeftTab/LeftTabListing';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
    handleDropDownItem: jest.fn(),
    dropdownOptions: [{name:'mockValue'}],
    options: [
    {label: "Images", name: "image", permissionKey: "cast", permissionSubKey: "images", permissionName: "canUpdate"},
    {label: "Images", name: "image", permissionKey: "cast", permissionSubKey: "images", permissionName: "canUpdate"}]
}

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<LeftTabListing {...baseProps} />)
    return wrapper;
}

describe('LeftTabListing', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders LeftTabListing default', () => {
        expect(wrapper.exists()).toBe(true);
    })

    it('should check onClick method', () => {
        wrapper.find('#handleDropDownBtn').simulate('click');
        expect(baseProps.handleDropDownItem).toHaveBeenCalled();
    })
})