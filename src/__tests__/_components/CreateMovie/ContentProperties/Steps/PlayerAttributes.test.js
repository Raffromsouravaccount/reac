import React from 'react';
import Enzyme, { shallow ,mount} from 'enzyme';

import PlayerAttributes from '../../../../../_components/CreateMovie/ContentProperties/Steps/PlayerAttributes';
import Adapter from 'enzyme-adapter-react-16';
import { expect, it, jest } from '@jest/globals';


/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<PlayerAttributes {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('PlayerAttributes', () => {
  Enzyme.configure({ adapter: new Adapter() });
  let wrapper;
  const baseProps = {
    skip_song: [{name: "broadcastState", value: null, col: "col-md-6 col-lg-6", type: "dropdownAsync", multiple: false}],
    handleChange: jest.fn(),
    handleSearchableInput: jest.fn(),
    setSelectDataArr: jest.fn(),
    handleTab: jest.fn(),
    disable: false,
    addRemoveSkipSong: jest.fn()
  }

  beforeEach(() => {
    wrapper = setup();
    wrapper.setProps({ ...baseProps });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should renders PlayerAttributes default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should check handleChange onChange method', () => {
    wrapper.find('#formRenderComp').first().simulate('change');
    expect(baseProps.handleChange).toHaveBeenCalled();
  })

  it('should check onChange method of setSelectDataArr', () => {
    const myFakeCallback = () => {};
    wrapper.find('#formRenderComp').first().prop('setSelectDataArr')(myFakeCallback)
  })

  it('should check onChange method of setSelectDataArr for skip_song', () => {
    const myFakeCallback = () => {};
    wrapper.find('#skipFormRender').first().prop('setSelectDataArr')(myFakeCallback)
  })

  it('should check handleChange onChange method for skip_song', () => {
    wrapper.find('#addRemoveMultipleFieldsBtn').first().simulate('click');
    expect(baseProps.addRemoveSkipSong).toHaveBeenCalled();
  })

  it('should check handleTab onClick method', () => {
    wrapper.find('.next-step-btn').simulate('click');
    expect(baseProps.handleTab).toHaveBeenCalled();
  })

  it('should check handleTab onClick method', () => {
    wrapper.find('.prev-step-btn').simulate('click');
    expect(baseProps.handleTab).toHaveBeenCalled();
  })


});