import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import PlayerAttributes from '../../../../../_components/Video/ContentProperties/Steps/PlayerAttributes';
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
    handleChange: jest.fn(),
    handleTab: jest.fn(),
    addRemoveSkipSong: jest.fn(),
    setSelectDataArr: jest.fn(),
    skip_song: [
      {
        col: "col-md-6 col-lg-6",
        errorText: null,
        isChanged: false,
        label: "Skip Song Start Time",
        name: "skipSongStartTime",
        type: "time",
        validation: { required: false },
        value: "14:19:19",
      },
      {
        col: "col-md-6 col-lg-6",
        errorText: "Skip Song End Time can not be less than Intro Start Time",
        isChanged: true,
        label: "Skip Song End Time",
        name: "skipSongEndTime",
        type: "time",
        validation: { required: false },
        value: null,
      }],
   }

  beforeEach(() => {
    wrapper = setup({...baseProps});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should renders PlayerAttributes default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should check onChange method', () => {
    wrapper.find('#handleChange').simulate('change');
    expect(baseProps.handleChange).toHaveBeenCalled();
  })

  it('should check onClick method', () => {
    wrapper.find('.prev-step-btn').simulate('click');
    expect(baseProps.handleTab).toHaveBeenCalled();
  })

  it('should check click method', () => {
    wrapper.find('.next-step-btn').simulate('click');
    expect(baseProps.handleTab).toHaveBeenCalled();
  })

  it('should check onChange method', () => {
    const button = wrapper.find('#handleChange');
    button.props().setSelectDataArr();
  })  

  it('should check addRemoveSkipSong onClick method', () => {
    const button = wrapper.find('#addRemoveMultipleFieldsBtn').first();
    button.simulate('click');
    expect(baseProps.addRemoveSkipSong).toHaveBeenCalled();
  })
  
  it('should check handleChange change method', () => {
    const button = wrapper.find('#formrender-handlechange').first();
    button.simulate('change');
    expect(baseProps.handleChange).toHaveBeenCalled();
  })

  it('should check setSelectDataArr method', () => {
    const button = wrapper.find('#formrender-handlechange').first();
    button.props().setSelectDataArr();
  })

})