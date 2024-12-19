import React from 'react';
import { shallow, mount } from 'enzyme';

import ViewSeason from '../../../../_components/Common/ViewDetail/ViewSeason';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const allData = [
  {
    col: "col-md-6 col-lg-6", errorText: "", label: "URL Structure Edit",
    name: "sefUrl", type: "text", validation: { isUrl: true, maxLength: 100, required: false }
  },
  {
    col: "col-md-6 col-lg-6", errorText: "", label: "SEO Title Tag", name: "titleTag", multiple: true,
    type: "text", validation: { isAlphaNumericWithSpecialChars: true, maxLength: 100, required: false, value: [{ keyText: 'abc' }] }
  },
  {
    col: "col-md-6 col-lg-6", errorText: "", label: "SEO Title Tag", name: "titleTag", multiple: true,
    type: "checkbox", validation: { isAlphaNumericWithSpecialChars: true, maxLength: 100, required: false, value: [{ title: 'abc' }] }
  }
]

const setup = (props = {}, state = {}) => {
  const wrapper = shallow(<ViewSeason {...props} allData={allData} />)
  return wrapper;
}

describe('ViewSeason', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup();
  })
  it('Should renders ViewSeason default', () => {
    expect(wrapper.exists()).toBe(true);
  })
});