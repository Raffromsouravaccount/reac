import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';

import ControlFields from '../../../../../_components/TvShow/ContentProperties/Steps/ControlFields';
import { findByTestAttr} from '../../../../../Utils';
import Adapter from 'enzyme-adapter-react-16';
import { expect, it, jest,toHaveClass } from '@jest/globals';


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
  const baseProps = {
    handleTab: jest.fn(),
    controlFieldsData: {
      createdAt: "2021-02-17T11:10:48.972Z",
      lastModifiedOn: "2021-02-17T11:10:48.972Z",
      archivedBy: "test",
      dateNeedWork: "test",
      unpublishedBy: "test",
      archivedAt: "2021-02-17T11:10:48.972Z",
      publishedBy:'me'
    }
  }

  beforeEach(() => {
    wrapper = setup();
    wrapper.setProps({ ...baseProps });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should renders ControlFields default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should have an con-field-wrap class', () => {
    const wrapper = shallow(<ControlFields />);
    expect(wrapper.find("div.con-field-wrap").length).toBe(1);
  });

  it('should test render', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'render');
    instance.render();
    expect(instance.render).toHaveBeenCalledTimes(1);
  });

  it('should test getFullName', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getFullName');
    instance.getFullName();
    expect(instance.getFullName).toHaveBeenCalledTimes(1);
  });

  it('should test getControlFieldsByPropName', () => {
    const controlFieldsData = {
      scheduleHistory: [{name:'scheduleHistory', value:"mockValue"}]
    }
    wrapper.setProps({ controlFieldsData });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getControlFieldsByPropName');
    instance.getControlFieldsByPropName('scheduleHistory');
    expect(instance.getControlFieldsByPropName).toHaveBeenCalledTimes(1);
  });

  it('should test getControlFieldsByPropName else condition', () => {
    const controlFieldsData = {
      scheduleHistory: []
    }
    wrapper.setProps({ controlFieldsData });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getControlFieldsByPropName');
    instance.getControlFieldsByPropName('scheduleHistory', 'scheduleHistory');
    expect(instance.getControlFieldsByPropName).toHaveBeenCalledTimes(1);
  });


  it('should test controlFieldsData Data',()=>{
  const controlFieldsData=[
      {
        createdAt: "2021-01-29T10:29:15.145Z",
        createdBy:{
          first_name: "Test",
          last_name: ""
        },
        lastModifiedBy:{
          first_name: "Test",
          last_name: ""
        },
        lastModifiedOn: "2021-01-29T10:29:15.145Z"
      }
  ]
  const instance = wrapper.instance();
  jest.spyOn(instance, 'getControlFieldsByPropName');
  instance.getControlFieldsByPropName('controlFields', null, controlFieldsData);
  expect(instance.getControlFieldsByPropName).toBeCalled();
  });

  it('should check handleTab onClick method', () => {
    wrapper.find('.prev-step-btn').simulate('click');
    expect(baseProps.handleTab).toHaveBeenCalled();
  })
 
})

