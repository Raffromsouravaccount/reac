import React from 'react';
import { shallow, mount } from 'enzyme';

import ImageListing from '../../../../../_components/Season/Images/ImageListing/ImageListing';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<ImageListing {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('ImageListing', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup();
  });

  it('Should renders ImageListing default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should test handleMenu', () => {
    const handleMenuClick = jest.fn();
    const menuItemIndex = '0';
    const menuItem = {label: "View"};
    const wrapper = setup({handleMenuClick}, {menuItemIndex, menuItem });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleMenu');
    instance.handleMenu();
    expect(instance.handleMenu).toHaveBeenCalledTimes(1);
  })

  it('should test handleMenu', () => {
    const handleMenuClick = jest.fn();
    const menuItemIndex = '0';
    const menuItem = {label: "View"};
    const wrapper = setup({handleMenuClick}, {menuItemIndex, menuItem });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleMenu');
    instance.handleMenu(null, {DisplayName: 'Change Image'});
    expect(instance.handleMenu).toHaveBeenCalledTimes(1);
  })


  
  it('should test getImageUploadView', () => {
    const isViewMode = true;
    const wrapper = setup({isViewMode}, null);
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getImageUploadView');
    instance.getImageUploadView();
    expect(instance.getImageUploadView).toHaveBeenCalledTimes(1);
  })

});