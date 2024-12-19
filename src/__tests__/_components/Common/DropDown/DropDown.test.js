import React from 'react';
import { shallow } from 'enzyme';

import DropDown from '../../../../_components/Common/DropDown/DropDown';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
    onEditorValueChange: jest.fn(),
    open: true,
    handleClose: true
}

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<DropDown {...baseProps} />);
    return wrapper;
}

describe('DropDown', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup({...baseProps});
    })

    it('Should renders DropDown default', () => {
        expect(wrapper.exists()).toBe(true);
    })
})