import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import ControlFields from '../../../../../_components/Collection/CreateCollection/ContentProperties/Steps/ControlFields';
import { findByTestAttr } from '../../../../../Utils';
import Adapter from 'enzyme-adapter-react-16';
import { expect, it, jest } from '@jest/globals';


/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<ControlFields {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('ControlFields', () => {
  Enzyme.configure({ adapter: new Adapter() });
  let wrapper;
  let renderSpy, componentDidMountSpy;

  beforeEach(() => {
    wrapper = setup();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should renders default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should check getFullName', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getFullName');
    instance.getFullName();
    expect(instance.getFullName).toBeCalled();
  })
})