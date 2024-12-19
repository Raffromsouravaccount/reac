import React from 'react';
import { shallow } from 'enzyme';
import { storeFactory } from "../../../../Utils";

import Header from '../../../../_components/Common/Header/Header'

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const baseProps = {
  clickScroll: jest.fn()
}

const setup = (initialState = {}, props = {}) => {
  const store = storeFactory(initialState);
  const wrapper = shallow(<Header store={store} {...baseProps} />).dive();
  return wrapper;
}

const initialState = {
  login_reducer: {}
}

describe('Header', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup(initialState);
  });

  it('render component without error', () => {
    expect(wrapper.exists()).toBe(true);
  })

  it("renders without crashing", () => {
    window.scrollTo = jest.fn()
  })

  it('should check clickScroll method', () => {
    const wrapperComp = wrapper.dive();
    const instance = wrapperComp.instance();
    jest.spyOn(instance, 'clickScroll');
    instance.clickScroll();
    expect(instance.clickScroll).toBeCalled();
  })

  it('should check handleScroll method', () => {
    const wrapperComp = wrapper.dive();
    const instance = wrapperComp.instance();
    jest.spyOn(instance, 'handleScroll');
    instance.handleScroll();
    expect(instance.handleScroll).toBeCalled();
  })

  it('should check handleLogout method', () => {
    const wrapperComp = wrapper.dive();
    const instance = wrapperComp.instance();
    jest.spyOn(instance, 'handleLogout');
    instance.handleLogout();
    expect(instance.handleLogout).toBeCalled();
  })

})