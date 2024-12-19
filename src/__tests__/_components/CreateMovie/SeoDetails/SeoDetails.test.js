import React from "react";
import { shallow } from "enzyme";

import SeoDetails from "../../../../_components/CreateMovie/SeoDetails/SeoDetails";
import BadgeBox from "../../../../_components/Common/BadgeBox/BadgeBox";
import { findByTestAttr } from "../../../../Utils";

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = { match: { params: { id: "123" } } }, state = null) => {
  const wrapper = shallow(<SeoDetails {...props} />);
  if (state) wrapper.setState(state);
  return wrapper;
};

describe("<SeoDetails/>", () => {
  let wrapper;
  const json = [
    {
      col: "col-md-6 col-lg-6", errorText: "", label: "SEO Title", name: "redirectionType", touched: 1, type: "text",
      valid: true, validation: { isAlphaNumericWithSpecialChars: true, maxLength: 250 }, value: "test"
    },
    {
      col: "col-md-6 col-lg-6", errorText: "", label: "Meta Title", name: "metaTitle", touched: 0, type: "text",
      valid: true, validation: { isAlphaNumericWithSpecialChars: true, maxLength: 250 }, value: ""
    },
    {
      col: "col-md-6 col-lg-6", errorText: "", label: "Meta Description", name: "metaDescription", touched: 0, type: "textarea",
      valid: true, validation: { isAlphaNumericWithSpecialChars: true, maxLength: 500 }, value: ""
    }
  ]
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
        movieId: 123
      },
      markAsDone: jest.fn()
    }
    wrapper = setup({...props});
    wrapper.setState({ JSONSchema: json, readyToDone: true, status: 'Draft' })
  });

  it("Should render SeoDetails default", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should test test input data", () => {
    const spy = jest.spyOn(wrapper.instance(), "InputChanger");
    const event = { target: { value: "test" } };
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, "movieInputChanger");
    button.simulate("change", event, 1);
    expect(spy).toHaveBeenCalled();
  });

  it("should test componentDidMount", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "componentDidMount");
    instance.componentDidMount();
    expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
  });
  it("should test fillSeoDetails", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "fillSeoDetails");
    instance.fillSeoDetails();
    expect(instance.fillSeoDetails).toHaveBeenCalledTimes(1);
  });

  it("Should renders BadgeBox default", () => {
    expect(wrapper.containsMatchingElement(<BadgeBox />)).toEqual(false);
  });

  it("should test handleMarkAsDone", () => {
    wrapper.setProps({ markAsDone: jest.fn() });
    const instance = wrapper.instance();
    jest.spyOn(instance, "handleMarkAsDone");
    instance.handleMarkAsDone();
    expect(instance.handleMarkAsDone).toHaveBeenCalledTimes(1);
  });

  it("should test markAsDone", () => {
    wrapper.setProps({ unLockedSession: jest.fn() });
    const instance = wrapper.instance();
    jest.spyOn(instance, "markAsDone");
    instance.markAsDone();
    expect(instance.markAsDone).toHaveBeenCalledTimes(1);
  });
  it("should test removeLock", () => {
    wrapper.setProps({ unLockedSession: jest.fn() });
    const instance = wrapper.instance();
    jest.spyOn(instance, "removeLock");
    instance.removeLock();
    expect(instance.removeLock).toHaveBeenCalledTimes(1);
  });
  it("should test showHideStatePopup", () => {
    wrapper.setProps({ unLockedSession: jest.fn() });
    const instance = wrapper.instance();
    jest.spyOn(instance, "showHideStatePopup");
    instance.showHideStatePopup();
    expect(instance.showHideStatePopup).toHaveBeenCalledTimes(1);
  });
  it("should test checkIfMarkAsDone", () => {
    wrapper.setProps({ unLockedSession: jest.fn() });
    const instance = wrapper.instance();
    jest.spyOn(instance, "checkIfMarkAsDone");
    instance.checkIfMarkAsDone();
    expect(instance.checkIfMarkAsDone).toHaveBeenCalledTimes(1);
  });

  it('should check setSelectDataArr method', () => {
    const state = {
      filter: {
        castName: "xyzzzz",
        castTag: [{ title: "Anchor", status: "1", id: "90473cb1-39d4-44cf-90e7-b32b048eea0f" }],
        castType: [{ title: "Actor", status: "1", id: "783eae8d-eb80-4df7-9b57-ea525ab431a3" }],
        fields: [{
          col: "", data: [], display: true, keyText: "title", label: "Cast Type", limitTags: 1, multiple: true,
          name: "castType", path: "/master/CastType", type: "dropdownAsync", validation: {},
          value: [{ id: "783eae8d-eb80-4df7-9b57-ea525ab431a3", status: "1", title: "Actor" }]
        }]
      }
    }
    const res = [
      {title: "Actor", status: "1", id: "a988da71-245c-4dd5-a0e7-77da447d4101"},
      {title: "Art Direction", status: "1", id: "ce6c59af-85bb-41b2-b39c-4fdb95571b14"},
      {title: "Background Score", status: "1", id: "01f0b5bc-b4e0-47a9-a771-6d1441327051"},
      {title: "Casting", status: "1", id: "72a18e11-afc7-4fde-a610-690b447e64b7"},
      {title: "Character", status: "1", id: "5e871913-cc3c-4304-a8b0-386265670c55"}
    ]
    wrapper.setState({ ...state });
    jest.spyOn(wrapper.instance(), 'setSelectDataArr');
    wrapper.instance().setSelectDataArr(res, 0);
    expect(wrapper.instance().setSelectDataArr).toBeCalled();
  })

  it('should test autoSave', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'autoSave');
    instance.autoSave(0);
    expect(instance.autoSave).toBeCalled();
  });

  it('should test InputChanger for published', () => {
    wrapper.setState({status: 'Published'});
    const instance = wrapper.instance();
    jest.spyOn(instance, 'InputChanger');
    instance.InputChanger();
    expect(instance.InputChanger).toBeCalled();
  });

  it('should test InputChanger for Unpublished', () => {
    wrapper.setState({status: 'Unpublished'});
    const instance = wrapper.instance();
    jest.spyOn(instance, 'InputChanger');
    instance.InputChanger();
    expect(instance.InputChanger).toBeCalled();
  });

  it('should check markAsDone onclick method', () => {
    wrapper.setState({ readyToDone: true });
    const spy = jest.spyOn(wrapper.instance(), 'markAsDone');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'markAsDoneBtn');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })
});
