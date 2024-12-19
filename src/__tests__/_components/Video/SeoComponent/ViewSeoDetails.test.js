import React from "react";
import { shallow } from "enzyme";

import ViewSeoDetails from "../../../../_components/Video/SeoComponent/viewSeoDetails";

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = { match: { params: { id: "123" } } }, state = null) => {
  const wrapper = shallow(<ViewSeoDetails {...props} />);
  if (state) wrapper.setState(state);
  return wrapper;
};

describe("<ViewSeoDetails/>", () => {
  let wrapper;
  const JSONSchema = [{
    "name": "audioLanguage",
    "value": "",
    "col": "col-md-6 col-lg-6",
    "type": "text",
    "label": "Audio Track",
    "errorText": "",
    "validation": {
      "maxLength": 250,
      "isChar": true,
      "required": false
    }
  },
  {
    "name": "subtitleLanguages",
    "value": "",
    "col": "col-md-6 col-lg-6",
    "type": "text",
    "label": "Sub Title",
    "errorText": "",
    "validation": {
      "maxLength": 250,
      "isChar": true,
      "required": false
    }
  },
  {
    "name": "dashRootFolderName",
    "value": "",
    "col": "col-md-6 col-lg-6",
    "type": "text",
    "label": "Dash Root Folder",
    "errorText": "",
    "validation": {
      "maxLength": 250,
      "required": true
    }
  }]
  beforeEach(() => {
    const props = {
      currentTabData: {
        isDone: false,
        isLocked: false,
        label: "Cast & Crew",
        lockedBy: "",
        permissionKey: "movies",
        permissionName: "canUpdate",
        permissionSubKey: "castNCrewModule",
        properties: true,
        quickFiling: false,
        singleLanding: false,
        movieId: 123,
        markAsDone: jest.fn()
      }
    }
    wrapper = setup({...props});
  });

  it("Should render ViewSeoDetails default", () => {
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
    wrapper.setState({ JSONSchema });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'setJsonData');
    instance.setJsonData(apiData);
    expect(instance.setJsonData).toBeCalled();
  })
});