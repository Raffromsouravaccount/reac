import React from 'react'
import { shallow } from 'enzyme';
import { findByTestAttr, storeFactory } from '../../../../Utils';
import ViewLicenceModule from '../../../../_components/CreateMovie/LicenseModule/ViewLicenceModule';
import { expect, it, jest } from '@jest/globals';
import jsonData from '../../../../_components/CreateMovie/Schema/Movie_StandardJourney_FE_Structure.json';

const setup = (initialState = {}, props = {}) => {
  const store = storeFactory(initialState);
  const wrapper = shallow(<ViewLicenceModule store={store} {...props} />).dive();
  return wrapper;
}

const initialState = {
  movieMgmt_reducer: {}
}

describe('LicenseModule', () => {
  let wrapper;
  const baseProps = {
    jsonData: jsonData.License,
    markAsDone: jest.fn(),
    getLicenseData: jest.fn()
  }
  beforeEach(() => {
    const wrapperInstance = setup(initialState, { ...baseProps });
    wrapper = wrapperInstance.dive();
  });

  it('render component without error', () => {
    expect(wrapper.exists()).toBe(true);
  })

  it('should check componentDidMount method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toHaveBeenCalled();
  })

  it('should check componentWillReceiveProps method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentWillReceiveProps');
    instance.componentWillReceiveProps();
    expect(instance.componentWillReceiveProps).toHaveBeenCalled();
  })
  it('should check handleSearch method', () => {
    const event = {target: {name :'test', value: ""}};
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleSearch');
    instance.handleSearch(event);
    expect(instance.handleSearch).toHaveBeenCalled();
  })
  it('should check getExpiredLicense method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getExpiredLicense');
    instance.getExpiredLicense();
    expect(instance.getExpiredLicense).toHaveBeenCalled();
  })
  it('should check applyFilter method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'applyFilter');
    instance.applyFilter();
    expect(instance.applyFilter).toHaveBeenCalled();
  })
  
  
})
