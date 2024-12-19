import React from 'react';
import { shallow } from 'enzyme';

import { storeFactory } from '../../../Utils';
import LinkVideos from '../../../_components/Video/LinkVideos/LinkVideos';
import { expect, it, jest } from '@jest/globals';

const setup = (initialState = {}, props = {}) => {
  const store = storeFactory(initialState);
  const wrapper = shallow(<LinkVideos store={store} {...props} />).dive();
  return wrapper;
}

const initialState = {
    videoMgmt_reducer: {},
    params:{
      contentId: "5753e295-66e8-4a42-9f90-af14c3edadab"
  }
}

describe('LinkVideos', () => {
  let wrapper;
  beforeEach(() => {
    const wrapperInstance = setup(initialState);
    wrapper = wrapperInstance.dive();
  });

  it('render component without error', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should test componentDidMount", () => {
    jest.spyOn(wrapper.instance(), "componentDidMount");
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().componentDidMount).toBeCalled();
  });

})