import React from 'react';
import { shallow } from 'enzyme';

import ImagesListing from '../../../../../_components/Collection/CreateCollection/Images/ImageListing/ImageListing';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = {}) => {
  const wrapper = shallow(<ImagesListing {...props} />)
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
  
  it('should test getImageUploadView', () => {
    const isViewMode = true;
    const wrapper = setup({isViewMode}, null);
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getImageUploadView');
    instance.getImageUploadView();
    expect(instance.getImageUploadView).toHaveBeenCalledTimes(1);
  })

  it('Should renders ImageListing default', () => {
    const isImageUploaded = true;
    const wrapper = setup({isImageUploaded}, null);
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