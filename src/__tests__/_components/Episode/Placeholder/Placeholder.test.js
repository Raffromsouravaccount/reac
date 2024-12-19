
import React from 'react';
import { shallow, ShallowWrapper, configure } from 'enzyme';
import moxios from 'moxios';

import { findByTestAttr } from '../../../../Utils';
import { constantText } from '../../../../_helpers/constants.text';
import axios from "../../../../_helpers/axiosInstance";

import Placeholder from '../../../../_components/Episode/Placeholder/Placeholder';
import BreadcrumbsComp from "../../../../_components/Common/BreadCrumbs/BreadCrumbs";

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
  match: {
    params: { id: 'xyz123', seasonId: 'test123' }
  }
}
const setup = (props = {}) => {
  const wrapper = shallow(<Placeholder {...baseProps} />);
  return wrapper;
}


describe("Placeholder Component", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = setup({...baseProps});
    moxios.install(axios)
  });
  afterEach(() => {
    moxios.uninstall(axios);
  });

  it("Should call componentDidMount()", () => {
    const instance = wrapper.instance();
    instance.componentDidMount();
    wrapper.setState({ seasonId: 134 });
  })

  it("Should call getPlaceholderData API", (done) => {
    const response = {
      response: {
        status: 201,
        data: {
          lastDate: null,
          totalEpisode: "1"
        }
      }
    }
    wrapper.instance().getPlaceholderData();
    moxios.wait(function () {
      const request = moxios.requests.mostRecent();
      request.respondWith(response).then((res) => {
        expect(wrapper.state().totalEpisode).toBe("1");
        done()
      });
    })
  })

  it("Should Render Placeholder Component", () => {
    expect(wrapper.exists()).toBe(true);
    // expect(wrapper).toMatchSnapshot();
  })

  it("Should Render Placeholder Wrapper", async () => {
    const placeholderWrapper = findByTestAttr(wrapper, 'placeholderWrapper');
    expect(placeholderWrapper.exists()).toBe(true);
  })

  it("Should Render Placeholder BreadcrumbsComp", async () => {
    const component = wrapper.find(BreadcrumbsComp);
    expect(component.length).toBe(1);
  })

  it("Should Render Placeholder Heading", async () => {
    const headingWrapper = findByTestAttr(wrapper, 'headingWrapper');
    const placeholderHeading = findByTestAttr(wrapper, 'placeholderHeading');
    expect(headingWrapper.exists()).toBe(true);
    expect(placeholderHeading.text()).toMatch(constantText.placeholderConstant.placeholder);
  })

  it("Should Render Placeholder Episode Property Heading", async () => {
    const episodePropertyWrapper = findByTestAttr(wrapper, 'episodePropertyWrapper');
    const episodePropertiesHeading = findByTestAttr(wrapper, 'episodePropertiesHeading');
    expect(episodePropertyWrapper.exists()).toBe(true);
    expect(episodePropertiesHeading.text()).toMatch(constantText.placeholderConstant.episodeProperties);
  })

  it("Should Render Placeholder Episode Property Form", async () => {
    const episodePropertiesForm = findByTestAttr(wrapper, 'episodePropertiesForm');
    expect(episodePropertiesForm.exists()).toBe(true);
  })

  it("Should Render Placeholder Global Property Form", async () => {
    const globalPropertyWrapper = findByTestAttr(wrapper, 'globalPropertyWrapper');
    const globalPropertyHeading = findByTestAttr(wrapper, 'globalPropertyHeading');
    const globalPropertiesForm = findByTestAttr(wrapper, 'globalPropertiesForm');
    expect(globalPropertyWrapper.exists()).toBe(true);
    expect(globalPropertyHeading.text()).toMatch(constantText.placeholderConstant.globalFieldsPlaceholder);
    expect(globalPropertiesForm.exists()).toBe(true);
  })

  it('should check formatData method', async () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'formatData');
    let shallowArr = [
      {
        "name": "assetType",
        "value": null,
        "col": "col-md-6 col-lg-6",
        "type": "dropdownAsync",
        "multiple": false,
        "label": "Asset Type",
        "keyText": "title",
        "path": "/master/EpisodeSubType",
        "data": [],
        "errorText": "",
        "validation": {
          "required": true
        }
      },
      {
        "name": "episodeNoStartFrom",
        "value": "",
        "col": "col-md-6 col-lg-6",
        "type": "text",
        "label": "Episode No start from",
        "helperText": "",
        "errorText": "",
        "validation": {
          "required": true,
          "charCountLimit": 250,
          "minValue": "",
          "maxLength": 300,
          "isDigit": true,
          "isAlphaNumericWithSpecialChars": true
        }
      },
    ]
    console.log(shallowArr)
    instance.formatData('episodeProperties', shallowArr);
    expect(instance.formatData).toHaveBeenCalled();
  })

})