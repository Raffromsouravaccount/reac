import React from 'react';
import { shallow, mount } from 'enzyme';

import CommonLeftTab from '../../../../_components/Common/LeftTab/CommonLeftTab'
import { constantText } from '../../../../_helpers/constants.text';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
    options: [ 
        {label: "Content Properties", permissionKey: "collections", permissionSubKey: "contentPropertiesModule", permissionName: "canUpdate", sectionName: "properties"},
        {label: "License Module", permissionKey: "collections", permissionSubKey: "licenceModule", permissionName: "canUpdate", sectionName: "licencing"},
        {label: "Images", permissionKey: "collections", permissionSubKey: "imagesModule", permissionName: "canUpdate", sectionName: "image"}
    ]
}

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<CommonLeftTab {...baseProps} />)
    return wrapper;
}

describe('CommonLeftTab', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders AppliedFilter default', () => {
        expect(wrapper.exists()).toBe(true);
    })
})