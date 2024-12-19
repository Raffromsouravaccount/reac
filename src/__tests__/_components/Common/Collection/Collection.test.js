import React from 'react';
import { shallow, mount } from 'enzyme';

import Collection from '../../../../_components/Common/Collection/Collection';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
    showCheckbox: true,
    showDelete: true,
    deleteHandler: jest.fn(),
    buttonHandler: jest.fn(),
    showButton: true,
    isLocked: false,
    data: {isChecked: false}
}

const setup = (props = {}) => {
    const wrapper = shallow(<Collection {...baseProps} />);
    return wrapper;
}

describe('Collection', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders Collection default', () => {
        expect(wrapper.exists()).toBe(true);
    })

    it('should check click method', () => {
        wrapper.find('#deleteHandlerBtn').simulate('click');
        expect(baseProps.deleteHandler).toHaveBeenCalled();
    })

    it('should check click method buttonHandler', () => {
        wrapper.find('#buttonHanlder').simulate('click');
        expect(baseProps.buttonHandler).toHaveBeenCalled();
    })

})