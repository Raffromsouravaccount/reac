import React from 'react';
import { shallow, mount } from 'enzyme';

import BreadCrumbs from '../../../../_components/Common/BreadCrumbs/BreadCrumbs';
import { storeFactory } from '../../../../Utils';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const baseProps = {
    links: [{color: "inherit", route: "/dashboard", text: "Dashboard"}],
    typography: [{color: "textPrimary", text: "Movies", label: "primary"}],
    handleRoute: jest.fn()
}

const setup = (props = {}) => {
    const wrapper = shallow(<BreadCrumbs {...baseProps} />);
    return wrapper;
}

describe('BreadCrumbs', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup({...baseProps});
    })

    it('Should renders BreadCrumbs default', () => {
        expect(wrapper.exists()).toBe(true);
    })
})