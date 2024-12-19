import React from 'react';
import { shallow, mount } from 'enzyme';

import Editor from '../../../../_components/Common/Editor/Editor'
import ReactQuill from 'react-quill';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
    onEditorValueChange: jest.fn()
}

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<Editor {...baseProps} />)
    return wrapper;
}

describe('Editor', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders Editor default', () => {
        expect(wrapper.exists()).toBe(true);
    })
})