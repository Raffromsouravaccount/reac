import React from 'react';
import { shallow, mount } from 'enzyme';

import { ViewFaqs } from '../../../../_components/CastAndCrewManagement/ViewFaqs/ViewFaqs';
import { findByTestAttr, checkProps } from '../../../../Utils';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = { match: { params: { id: "123" } } }, state = null) => {
  const wrapper = shallow(<ViewFaqs {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('<ViewFaqs/>', () => {
  let wrapper;
  const allfaq = [{ mockValue: 'vaue' },
  { data: 'value' }]
  beforeEach(() => {
    wrapper = setup();
    wrapper.setState({allfaq});
  });

  it('Should renders ViewFaqs default', () => {
    expect(wrapper.exists()).toBe(true);
  })

  it('Should test componentDidMount', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'fetchContentData');
    instance.componentDidMount();
    expect(instance.fetchContentData).toHaveBeenCalledTimes(1);
  });

  it('should check faqEdit button onclick method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleConditionRoute');
    instance.handleConditionRoute();
    expect(instance.handleConditionRoute).toHaveBeenCalledTimes(1);
  });

  it('should test toggleOpenClose div onclick method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'toggleOpenClose');
    instance.toggleOpenClose();
    expect(instance.toggleOpenClose).toHaveBeenCalledTimes(1);
  })

  it('should test componentWillReceiveProps', () => {
    const nextProps = {
      allfaq: [{}]
    }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentWillReceiveProps');
    instance.componentWillReceiveProps(nextProps);
    expect(instance.componentWillReceiveProps).toBeCalled();
  })

  it('should test lockedSession', () => {
    wrapper.setProps({ lockedSession: jest.fn() })
    const instance = wrapper.instance();
    jest.spyOn(instance, 'lockedSession');
    instance.lockedSession();
    expect(instance.lockedSession).toBeCalled();
  })

  it('should check toggleOpenClose button onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'toggleOpenClose');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'question-list').first();
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
});

})
