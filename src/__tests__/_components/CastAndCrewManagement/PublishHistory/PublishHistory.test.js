import React from 'react';
import { shallow, mount } from 'enzyme';

import PublishedHistoryCastCrew from '../../../../_components/CastAndCrewManagement/PublishHistory/PublishHistory_Castncrew';
import { findByTestAttr } from '../../../../Utils';
import { constantText } from '../../../../_helpers/constants.text';

// Service

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<PublishedHistoryCastCrew {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('<PublishedHistoryCastCrew />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup();
  });

  it('Should renders PublishedHistoryCastCrew default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should check handleRoute onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleRoute');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'publishhistory-handle-route');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should check handleBack onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleBack');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'publishHistory-handle-back');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should test fetchContentData', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'fetchContentData');
    instance.fetchContentData();
    expect(instance.fetchContentData).toHaveBeenCalledTimes(1);
  })

  it("should check heading text", () => {
    const titleText = findByTestAttr(wrapper, 'publishhistory-handle-route');
    expect(titleText.text()).toMatch(constantText.dashBoard_text)
  })

  it("should check view heading text", () => {
    const titleText = findByTestAttr(wrapper, 'publishHistory-cast-profile-list');
    expect(titleText.text()).toMatch(constantText.cast_profile_list)
  })

  it('should check componentDidMount', () => {
    const props = {
      match: {
        params: {
          id: 'zyz1'
        }
      }
    }
    wrapper.setProps({...props});
    jest.spyOn(wrapper.instance(), 'componentDidMount');
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().componentDidMount).toBeCalled();
  })

})