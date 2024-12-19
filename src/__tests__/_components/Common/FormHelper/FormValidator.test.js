import React from 'react';
import { shallow, mount } from 'enzyme';

import checkValidity from '../../../../_components/Common/FormHelper/FieldValidator';
import * as validatorFn from '../../../../_components/Common/FormHelper/FieldValidator';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
  checkDeep: true
}

const setup = (props = {}) => {
  const wrapper = shallow(<checkValidity {...baseProps} />)
  return wrapper;
}

describe('checkValidity', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup();
  })
  it('Should renders checkValidity default', () => {
    expect(wrapper.exists()).toBe(true);
  })

  test("test return value of checkValidity", () => {
    const mockRes = {"errorText": "", "isValid": true}
    expect(validatorFn.checkValidity()).toEqual(mockRes);
  });

});