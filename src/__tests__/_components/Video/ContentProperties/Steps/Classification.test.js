import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import Classification from '../../../../../_components/Video/ContentProperties/Steps/Classification';
import { expect, it, jest } from '@jest/globals';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<Classification {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('Classification', () => {
  let wrapper;
  const baseProps = {
    handleChange: jest.fn(),
    addRemoveAwards: jest.fn(),
    handleTab: jest.fn(),
    handleSearchableInput: jest.fn(),
    classification: {
      col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "title", label: "Content Rating", multiple: false,
      name: "rating", path: "/master/ContentRating", type: "dropdownAsync", validation: { required: false }, value: null
    },
    setSelectDataArr: jest.fn(),
    awards : [{
      col: "col-md-6 col-lg-6", data: [], errorText: "", isChanged: false, keyText: "castName", label: "Recipient Name", multiple: true,
      name: "awardRecipient", path: "/cast-names", type: "SearchableWithCreate", validation: { required: false, isChar: true }, value: []
    },
    {
      col: "col-md-6 col-lg-6", data: [], errorText: "", isChanged: false, keyText: "title", label: "Award Category", multiple: true,
      name: "awardsCategory", path: "/master/AwardCategory", type: "dropdownAsync", validation: { required: false }, value: []
    }]
  }

  beforeEach(() => {
    wrapper = setup({ ...baseProps });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should renders Classification default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should check onChange method', () => {
    wrapper.find('#formRender').simulate('change');
    expect(baseProps.handleChange).toHaveBeenCalled();
  })
  it('should check onClick method', () => {
    const button = wrapper.find('#addRemoveMultipleFieldsBtn').first();
    button.simulate('click');
    expect(baseProps.addRemoveAwards).toHaveBeenCalled();
  })

  it('should check onChange method', () => {
    const button = wrapper.find('#awardForm').first();
    button.simulate('change');
    expect(baseProps.handleChange).toHaveBeenCalled();
  })

  it('should check setSelectDataArr method', () => {
    const button = wrapper.find('#awardForm').first();
    button.props().setSelectDataArr();
  })

  it('should check setSelectDataArr method', () => {
    const button = wrapper.find('#formRender');
    button.props().setSelectDataArr();
  })

  it('should check onClick method', () => {
    const button = wrapper.find('.prev-step-btn').first();
    button.simulate('click');
    expect(baseProps.handleTab).toHaveBeenCalled();
  })
  
  it('should check onClick method', () => {
    const button = wrapper.find('.next-step-btn').first();
    button.simulate('click');
    expect(baseProps.handleTab).toHaveBeenCalled();
  })

})