import React from 'react';
import { shallow, mount } from 'enzyme';

import ViewCastNCrew from '../../../_components/CastAndCrewManagement/ViewCastNCrew';
import { findByTestAttr } from '../../../Utils';

import LeftTab from '../../../_components/Common/LeftTab/CommonLeftTab';
import QuickLinks from '../../../_components/Common/QuickLinks/QuickLinks';
// Service

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<ViewCastNCrew {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('ViewCastNCrew', () => {
  let wrapper;
  let instance;
  const props = {
    match: {
      url: 'rul',
      params: {id: '123'}
    }
  }
  beforeEach(() => {
    wrapper = setup();
    wrapper.setProps({ ...props });
    instance = wrapper.instance();
  });

  it('Should renders ViewCastNCrew default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should check view heading text", () => {
    const titleText = findByTestAttr(wrapper, 'cast-view-castNcrew');
    expect(titleText.text()).toMatch('Profile Details')
  })

  it('should test mark as done', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'markAsDone');
    instance.markAsDone();
    expect(instance.markAsDone).toHaveBeenCalledTimes(1);
  })

  it('should test lockedsession', () => {
    wrapper.setState({ leftTab: [{isLocked: true}]})
    const instance = wrapper.instance();
    jest.spyOn(instance, 'lockedSession');
    instance.lockedSession(0);
    expect(instance.lockedSession).toHaveBeenCalledTimes(1);
  })

  it('should test lockedsession check condition', () => {
    wrapper.setState({ leftTab: [{isDone: true},{isLocked: true}]})
    const instance = wrapper.instance();
    jest.spyOn(instance, 'lockedSession');
    instance.lockedSession(1);
    expect(instance.lockedSession).toHaveBeenCalledTimes(1);
  })

  it('should check handleCastListRoute onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleCastListRoute');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'view-cast-handle-route');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should test linksClickHandler', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'linksClickHandler');
    instance.linksClickHandler();
    expect(instance.linksClickHandler).toHaveBeenCalledTimes(1);
  })
  
  it('should check componentDidMount method', () => {
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toBeCalled();
  })
  
  it('should check getExternalId method', () => {
    jest.spyOn(instance, 'getExternalId');
    instance.getExternalId();
    expect(instance.getExternalId).toBeCalled();
  })
  
  it('should check handleRoute method', () => {
    jest.spyOn(instance, 'handleRoute');
    instance.handleRoute();
    expect(instance.handleRoute).toBeCalled();
  })

})