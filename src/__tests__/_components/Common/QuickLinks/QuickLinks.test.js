import React from 'react';
import { shallow, mount } from 'enzyme';

import QuickLinks from '../../../../_components/Common/QuickLinks/QuickLinks';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const data = [{
    enable: true, icon: "", path: "/translation", permissionKey: "collections", permissionName: "canView",
    permissionSubKey: "translation", text: "Translations"
},
{
    enable: true, icon: "", path: "/published-history-collection", permissionKey: "collections",
    permissionName: "canView", permissionSubKey: "publishHistory", text: "Published History"
}]
const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<QuickLinks {...props} options={data} />)
    return wrapper;
}

describe('QuickLinks', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders QuickLinks default', () => {
        expect(wrapper.exists()).toBe(true);
    })
});