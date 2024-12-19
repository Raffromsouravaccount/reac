import React from 'react';
import { shallow } from 'enzyme';

import Seo from '../../../../_components/Collection/CreateCollection/Seo/Seo';
import { findByTestAttr } from '../../../../Utils';
import { jest } from '@jest/globals';

/**
* Factory function to create a ShallowWrapper for the License Component.
* @function setup
* @param {object} props - Component props specific to this setup.
* @param {object} state - Initial state for setup.
* @returns {ShallowWrapper}
*/

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<Seo />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('Seo', () => {
  let wrapper;
  const props = {
    currentTabData: {
      isLocked: false,
      isDone: false
    },
    markAsDone: jest.fn(),
    unLockedSession: jest.fn()
  }
  const json = [
    {
      col: "col-md-6 col-lg-6", errorText: "", label: "SEO Title", name: "SEOTitle", touched: 1, type: "text",
      valid: true, validation: { isAlphaNumericWithSpecialChars: true, maxLength: 250 }, value: "test"
    },
    {
      col: "col-md-6 col-lg-6", errorText: "", label: "Meta Title", name: "metaTitle", touched: 0, type: "text",
      valid: true, validation: { isAlphaNumericWithSpecialChars: true, maxLength: 250 }, value: ""
    },
    {
      col: "col-md-6 col-lg-6", errorText: "", label: "Meta Description", name: "metaDescription", touched: 0, type: "textarea",
      valid: true, validation: { isAlphaNumericWithSpecialChars: true, maxLength: 500 }, value: ""
    }
  ]
  beforeEach(() => {
    wrapper = setup();
    wrapper.setProps({ ...props });
    wrapper.setState({ JSONSchema: json, readyToDone: true })
  });

  it('Should render Seo default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should test componentDidMount', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
  });

  it('should test getCollectionData', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getCollectionData');
    instance.getCollectionData();
    expect(instance.getCollectionData).toHaveBeenCalledTimes(1);
  });

  it('should test fillSeo', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'fillSeo');
    instance.fillSeo();
    expect(instance.fillSeo).toHaveBeenCalledTimes(1);
  });

  it('should test autoSave', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'autoSave');
    instance.autoSave(0);
    expect(instance.autoSave).toBeCalled();
  });

  it('should test autoSave else condition', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'autoSave');
    instance.autoSave();
    expect(instance.autoSave).toBeCalled();
  });

  it('should test showHideStatePopup', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'showHideStatePopup');
    instance.showHideStatePopup();
    expect(instance.showHideStatePopup).toHaveBeenCalledTimes(1);
  });

  it('should test checkIfMarkAsDone', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'checkIfMarkAsDone');
    instance.checkIfMarkAsDone();
    expect(instance.checkIfMarkAsDone).toHaveBeenCalledTimes(1);
  });

  it('should test handleMarkAsDone', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleMarkAsDone');
    instance.handleMarkAsDone();
    expect(instance.handleMarkAsDone).toHaveBeenCalledTimes(1);
  });

  it('should test unLockProperties', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'unLockProperties');
    instance.unLockProperties();
    expect(instance.unLockProperties).toHaveBeenCalledTimes(1);
  });

  it('should test InputChanger', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'InputChanger');
    const event = { target: {name: 'SEOTitle', value: 'mock'}}
    instance.InputChanger(event, 0);
    expect(instance.InputChanger).toBeCalled();
  });

  it('should test InputChanger for published', () => {
    wrapper.setState({ status: 'Published' });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'InputChanger');
    const event = { target: {name: 'SEOTitle', value: 'mock'}}
    instance.InputChanger(event, 0);
    expect(instance.InputChanger).toBeCalled();
  });
  
  it('should test InputChanger for unpublished', () => {
    wrapper.setState({ status: 'Unpublished' });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'InputChanger');
    const event = { target: {name: 'SEOTitle', value: 'mock'}}
    instance.InputChanger(event, 0);
    expect(instance.InputChanger).toBeCalled();
  });

  it("should InputChanger onChange method", () => {
    const spy = jest.spyOn(wrapper.instance(), "InputChanger");
    const event = { target: { value: "test" } };
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, "inputChanger");
    button.simulate("change", event, 1);
    expect(spy).toHaveBeenCalled();
  });
  
  it("should handleMarkAsDone onClick method", () => {
    const spy = jest.spyOn(wrapper.instance(), "handleMarkAsDone");
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, "handleMarkDone");
    button.simulate("click");
    expect(spy).toBeCalled();
  });
})