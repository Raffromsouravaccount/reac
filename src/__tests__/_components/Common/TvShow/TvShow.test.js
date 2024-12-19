import React from 'react';
import { shallow, mount } from 'enzyme';

import TvShow from '../../../../_components/Common/TvShow/TvShow';

/**
 * Factory function to create a ShallowWrapper for the License Component.
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
  data: {
    TvShowImages: [],
    contentState: "3bb64421-f15f-4dda-adec-03c324c140a3",
    contentState_populated: { title: "Draft" },
    countries: "xyz",
    dateZee5Published: null,
    externalId: "undefined1000001",
    journeyType: "1",
    lastModifiedBy_populated: { first_name: "Sandeep", last_name: "Kumar" },
    lastModifiedOn: "2021-01-19T09:47:07.296Z",
    licenceExpDays: [],
    movieCountry: [],
    originCountry: null,
    subtype: null,
    subtype_populated: null,
    title: "No Title",
    tvShowId: "9cd1d026-e792-47fa-b512-2ef68533afe1",
    ShowLicenses: [{demo:'value'}],
    checkBoxHandler: jest.fn()
  }
}
const setup = (props = {}, state = {}) => {
  const wrapper = shallow(<TvShow {...baseProps} />)
  return wrapper;
}

describe('TvShow', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup();
  })
  it('Should renders TvShow default', () => {
    expect(wrapper.exists()).toBe(true);
  })

  it('should check Checkbox component', () => {
    expect(wrapper.find('#MuiCardActionArea-root').length).toBe(1);
  })

  it('should check click method', () => {
    wrapper.find('#deleteHandlerBtn').simulate('click');
    expect(baseProps.deleteHandler).toHaveBeenCalled();
    
  })

  it('should check click method buttonHandler', () => {
    wrapper.find('#buttonHanlder').simulate('click');
    expect(baseProps.buttonHandler).toHaveBeenCalled();
  })

  it('should check click method checkBoxHandler', () => {
    const checkBoxHandler = jest.fn();
    const wrapper = shallow(<TvShow {...baseProps}  handleCheckBox={checkBoxHandler}/>)
    wrapper.find('.zee-checkbox-field').simulate('click');
    expect(checkBoxHandler).not.toHaveBeenCalled();
  })
});