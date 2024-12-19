import React from 'react';
import { shallow, mount } from 'enzyme';

import ImagePreview from '../../../../_components/Common/ImagePreview/ImagePreview';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
    show: true,
    imageUrl: "mockUrl"
}

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<ImagePreview {...baseProps} />)
    return wrapper;
}

describe('ImagePreview', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders ImagePreview default', () => {
        expect(wrapper.exists()).toBe(true);
    })
})