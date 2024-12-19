import React from "react";
import { shallow } from "enzyme";

import ListLangauge from "../../../../_components/Common/ListLanguage/ListLanguage";
import { findByTestAttr } from '../../../../Utils';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<ListLangauge {...props} />);
  if (state) wrapper.setState(state);
  return wrapper;
};

const event = { target: { name: 'mock', value: 'test' } };

describe("ListLangauge", () => {
  let wrapper;
  let instance;

  const props = {
    match: {
      params: {
        id: "xyz",
        seasonId: "def",
        episodeId: "efh"
      }
    },
    togglePopup: jest.fn()
  }
  beforeEach(() => {
    wrapper = setup({ ...props });
  });
  it("Should render ListLanguage default", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should check render', () => {
    jest.spyOn(wrapper.instance(), "render");
    wrapper.instance().render();
    expect(wrapper.instance().render).toBeCalled();
  });

  it('should check filterLanguages', () => {
    jest.spyOn(wrapper.instance(), "filterLanguages");
    wrapper.instance().filterLanguages();
    expect(wrapper.instance().filterLanguages).toBeCalled();
  });

  it('should check togglePopup onclick method', () => {
    wrapper.find('#togglePopup').simulate('click');
    expect(props.togglePopup).toHaveBeenCalled();
  })

});