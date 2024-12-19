import React from 'react';
import { shallow, mount } from 'enzyme';

import SelectedItems from '../../../../_components/Common/SelectedItems/SelectedItems';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
  assignContent: jest.fn(),
  removed: jest.fn()
}

const setup = (props = {}) => {
  const wrapper = shallow(<SelectedItems {...baseProps} />)
  return wrapper;
}

describe('SelectedItems', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup();
  })

  it('Should renders SelectedItems default', () => {
    expect(wrapper.exists()).toBe(true);
  })

  it('should check click method buttonHandler', () => {
    wrapper.find('#assignedContent').simulate('click');
    expect(baseProps.assignContent).toHaveBeenCalled();
  })
});