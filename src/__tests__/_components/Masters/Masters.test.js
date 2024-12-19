import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import Masters from '../../../_components/Masters/Masters';
import InlineLoader from '../../../_components/Common/InlineLoader/InlineLoader';
//Helpers
import { findByTestAttr } from '../../../Utils';
/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<Masters {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('<Masters />', () => {
  let wrapper;
  let renderSpy, componentDidMountSpy;

  const event = { target: { name: 'xyz', value: '123' }, preventDefault: jest.fn() }

  beforeEach(() => {
    wrapper = setup();
    renderSpy = jest.spyOn(Masters.prototype, 'render');
    componentDidMountSpy = jest.spyOn(Masters.prototype, 'componentDidMount');
  });
  it('Should renders Masters default', () => {
    expect(wrapper.exists()).toBe(true);
  });
  it('shallow called hooks', async () => {
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });
  it('Should render masterTitle', () => {
    const masterTitle = findByTestAttr(wrapper, 'master-title')
    expect(masterTitle.length).toBe(1);
  });
  it('Should renders InlineLoader default', () => {
    expect(wrapper.containsMatchingElement(<InlineLoader />)).toEqual(true);
  });

  it('should test ComponentDidMount',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
  });

  it('should test handleRoute',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleRoute');
    instance.handleRoute();
    expect(instance.handleRoute).toHaveBeenCalledTimes(1);
  });

  it('should test render',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'render');
    instance.render();
    expect(instance.render).toHaveBeenCalledTimes(2);
  });

  it('should check handleSearch', () => {
    jest.spyOn(wrapper.instance(), 'handleSearch');
    wrapper.instance().handleSearch(event);
    expect(wrapper.instance().handleSearch).toBeCalled();
});

});