import React from 'react';
import { shallow, mount } from 'enzyme';

import ViewUser from '../../../_components/User/ViewUser';
import { findByTestAttr, checkProps } from '../../../Utils';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<ViewUser {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('<ViewUser />', () => {
  let wrapper;
  const props = {
    match: {
      isExact: true, params: { id: "de17ce3c-eb7f-42ec-bcfc-18a0a74fc767" },
      path: "/user/view/:id", url: "/user/view/de17ce3c-eb7f-42ec-bcfc-18a0a74fc767"
    }
  }
  beforeEach(() => {
    wrapper = setup({ props });
  });

  it('Should renders ViewUser default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should check handleRoute onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleRoute');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'handle-view-user-route');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should check handleRoute onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleRoute');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'handle-route-link');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })
})