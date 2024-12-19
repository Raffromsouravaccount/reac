import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import moxios from 'moxios';
import ManageImageTag from '../../../../_components/Masters/ManageImageTag/ManageImageTag';
//Helpers
import { findByTestAttr, storeFactory } from '../../../../Utils';
/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */


import axios from "../../../../_helpers/axiosInstance";

const setup = (initialState = {}, props = {}) => {
  const store = storeFactory(initialState);
  const wrapper = shallow(<ManageImageTag store={store} {...props} />).dive();
  return wrapper;
}

describe('<ManageTemplate />', () => {
  let wrapper;
  const initialStore = {
    user_reducer: {}
  };
  const event = { target: { name: 'xyz', value: '123',files: [{
    lastModified: 1602582862128,
    lastModifiedDate: 'Tue Oct 13 2020 15:24:22 GMT+0530 (India Standard Time)',
    name: "pjimage-5-1589546097.jpg",
    path: "pjimage-5-1589546097.jpg",
    size: 14626,
    type: "image/jpeg",
    webkitRelativePath: ""
  }] }, preventDefault: jest.fn() }
  beforeEach(() => {
    wrapper = setup(initialStore, null, null);
  });

  it('Should renders ManageImageTag default', () => {
    expect(wrapper.exists()).toBe(true);
  });
});