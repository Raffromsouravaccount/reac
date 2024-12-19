import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';

import TitleSummary from '../../../../../_components/Season/SeasonProperties/Steps/TitleSummary';
import { findByTestAttr } from '../../../../../Utils';
import Adapter from 'enzyme-adapter-react-16';
import { expect, it, jest } from '@jest/globals';
import ViewSeason from '../../../../../_components/Common/ViewDetail/ViewSeason';


/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<TitleSummary {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('TitleSummary', () => {
  Enzyme.configure({ adapter: new Adapter() });
  let wrapper;
  const baseProps = {
    handleChange: jest.fn(),
    setSelectDataArr: jest.fn(),
    handleTab: jest.fn(),
    specialCategory: [{mockValue: "test"}],
    global: [{globalMock: 'test', value: 'global'}],
    disabled: false,
    addRemoveMultipleFields: jest.fn(),
    selectGroup: jest.fn()
  }

  beforeEach(() => {
    wrapper = setup();
    wrapper.setProps({ ...baseProps });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should renders TitleSummary default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should test render', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'render');
    instance.render();
    expect(instance.render).toHaveBeenCalledTimes(1);
  });


  it('should render <FormRender /> components', () => {
    expect(wrapper.find(ViewSeason)).toHaveLength(2);
  });

  it('should test FormRender', () => {
    const onBlur = jest.fn();
    const onChange = jest.fn();
    const setSelectDataArr = jest.fn();
    const handleAutoCreateInput = jest.fn();
    const selectGroup = jest.fn();
    let ViewSeasonComp = shallow(<ViewSeason />);
    expect(ViewSeasonComp.find(ViewSeason))
    onBlur.mockClear();
    onChange.mockClear();
    setSelectDataArr.mockClear();
    handleAutoCreateInput.mockClear();
    selectGroup.mockClear();
  });

  it('should check onChange method of handleChange', () => {
    wrapper.find('#viewSeaonTitleSummary').simulate('change');
    expect(baseProps.handleChange).toHaveBeenCalled();
  })

  it('should check setSelectDataArr', () => {
    const myFakeCallback = () => {};
    wrapper.find('#viewSeaonTitleSummary').prop('setSelectDataArr')(myFakeCallback)
  })

  it('should check handleTab onClick method', () => {
    wrapper.find('.next-step-btn').simulate('click');
    expect(baseProps.handleTab).toHaveBeenCalled();
  })

  it('should check addRemoveMultipleFieldsBtn method', () => {
    wrapper.find('#addRemoveMultipleFieldsBtn').simulate('click');
    expect(baseProps.addRemoveMultipleFields).toBeCalled();
  })
  
  it('should check onChange method of handleChange', () => {
    wrapper.find('#viewSeasonSpecialCategory').simulate('change');
    expect(baseProps.handleChange).toHaveBeenCalled();
  })

  it('should check setSelectDataArr method', () => {
    const myFakeCallback = () => {};
    wrapper.find('#viewSeasonSpecialCategory').prop('setSelectDataArr')(myFakeCallback)
  })

  it('should check onChange method of selectGroup', () => {
    const myFakeCallback = () => {};
    wrapper.find('#viewSeasonSpecialCategory').prop('selectGroup')(myFakeCallback)
  })
  
})