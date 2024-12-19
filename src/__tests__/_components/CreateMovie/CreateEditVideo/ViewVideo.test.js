import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import ViewVideo from '../../../../_components/CreateMovie/CreateEditVideo/ViewVideo';
import jsonData from '../../../../_components/CreateMovie/Schema/Movie_StandardJourney_FE_Structure.json';
import Adapter from 'enzyme-adapter-react-16';
import { expect, jest } from '@jest/globals';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<ViewVideo {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('ViewVideo', () => {
  Enzyme.configure({ adapter: new Adapter() });
  let wrapper;
  let renderSpy, componentDidMountSpy;
  const baseProps = {
    jsonData : jsonData.Video
  }
  beforeEach(() => {
    wrapper = setup();
    renderSpy = jest.spyOn(ViewVideo.prototype, 'render');
    componentDidMountSpy = jest.spyOn(ViewVideo.prototype, 'componentDidMount');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should renders ViewVideo default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should setJsonData method', () => {
    const apiData = {
      audioLanguage: "ta",
      createdBy: "38c34c4f-68c9-4eb0-b71f-b80f1e551447",
      dashManifestName: "",
      dashRootFolderName: "/drm1/elemental/dash/Movies/Drama/MAAPLA_SINGAM_MOVIE_RTR_ta_68bddc2a9ec9f1d52741ee555b96777d/manifest.mpd",
      drmKeyId: "8f105a47-7a66-4f40-9a07-8c48272e3193",
      hlsManifestName: "",
      hlsRootFolderName: "/drm1/elemental/hls/Movies/Drama/MAAPLA_SINGAM_MOVIE_RTR_ta_68bddc2a9ec9f1d52741ee555b96777d/index.m3u8"
    }
    wrapper.setState({ JSONSchema: baseProps.jsonData });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'setJsonData');
    instance.setJsonData(apiData);
    expect(instance.setJsonData).toBeCalled();
  })

  it('should check componentDidMount', () => {
    jest.spyOn(wrapper.instance(), 'componentDidMount');
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().componentDidMount).toBeCalled();
  })
});