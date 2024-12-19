import React from 'react';
import { shallow, mount } from 'enzyme';

import UseDebounce from '../../../../_components/Common/UseDebounce/UseDebounce';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
}

const setup = (props = {}) => {
  const wrapper = shallow(<UseDebounce {...baseProps} />)
  return wrapper;
}

describe('UseDebounce', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup();
  })
  it('Should renders UseDebounce default', () => {
    expect(wrapper.exists()).toBe(true);
  })
})
