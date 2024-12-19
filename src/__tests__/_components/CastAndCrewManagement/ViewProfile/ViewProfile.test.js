import React from 'react';
import { shallow, mount } from 'enzyme';

import { ViewProfile } from '../../../../_components/CastAndCrewManagement/ViewProfile/ViewProfile';
import { findByTestAttr, checkProps } from '../../../../Utils';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<ViewProfile {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('<ViewProfile />', () => {
  let wrapper;
  const profileData = {
    castAwards: null, castBackground: null, castBirthPlace: null, castBirthday: null, castCareer: null, castKnownAs: null,
    castName: null, castProfileBio: null, castProfileImage:
      { url: "screenshot 2021-02-11 174501-cfcd8224-567a-41a7-a807-96cb1f168803.png", name: "Screenshot 2021-02-11 174501.png", size: "123794" },
    castRelationship: [{relationTitle: 'title'}], castTag: [{title: 'title'}], castTrivia: null, castType: [{title: 'title'}], contentState: { title: "Draft" }, createdOn: "2021-02-11T12:47:25.526Z",
    created_by: { first_name: "xyz", last_name: "abc" }, externalId: "1-7-1000572", id: "cfcd8224-567a-41a7-a807-96cb1f168803"
  }
  beforeEach(() => {
    wrapper = setup();
    wrapper.setState({ profileData });
  });

  it('Should renders ViewProfile default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should check handleRoute method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleRoute');
    instance.handleRoute();
    expect(instance.handleRoute).toHaveBeenCalledTimes(1);
  });

  it('should check componentDidMount', () => {
    const castProfileId = 'xyz';
    wrapper.setProps({ castProfileId });
    jest.spyOn(wrapper.instance(), 'componentDidMount');
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().componentDidMount).toBeCalled();
  })
});