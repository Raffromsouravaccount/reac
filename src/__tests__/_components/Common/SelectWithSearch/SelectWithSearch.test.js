import React from 'react';
import { shallow, mount } from 'enzyme';

import SelectWithSearch from '../../../../_components/Common/SelectWithSearch/SelectWithSearch';
import * as selectFn from '../../../../_components/Common/SelectWithSearch/SelectWithSearch';

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
  const wrapper = shallow(<SelectWithSearch {...baseProps} />)
  return wrapper;
}

const value = [{code: "SG", group: "Others",
id: "1d79bf67-5b78-4ff6-8f72-26cd9b5b7c66",
status: "1", title: "Singapore"}]
const children = [{key: "0", props: {tabIndex: -1, role: "option", id: "mui-53269-option-0"},
ref: null,type: "li"}]

describe('SelectWithSearch', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup();
  })
  it('Should renders SelectWithSearch default', () => {
    expect(wrapper.exists()).toBe(true);
  })

  test("test return value of isEquivalent", () => {
    expect(selectFn.isEquivalent()).toEqual(true);
  });

  test("test return value of isEquivalent", () => {
    expect(selectFn.isEquivalent('sandeep', 'kumar')).toEqual(false);
  });

  test("test return value of checkStatus", () => {
    expect(selectFn.checkStatus()).toEqual(false);
  });

  test("test return value of checkStatus", () => {
    expect(selectFn.checkStatus("Others",value, children )).toEqual(true);
  });

});