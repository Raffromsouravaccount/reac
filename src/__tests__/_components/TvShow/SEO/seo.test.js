import React from "react";
import { shallow } from "enzyme";

import SeoDetails from "../../../../_components/TvShow/SeoDetails/SeoDetails";
import BadgeBox from "../../../../_components/Common/BadgeBox/BadgeBox";
import { findByTestAttr } from "../../../../Utils";

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = { }, state = null) => {
  const wrapper = shallow(<SeoDetails {...props} />);
  if (state) wrapper.setState(state);
  return wrapper;
};

describe("<SeoDetails/>", () => {
  let wrapper;
  const props = {
    currentTabData: {
      isDone: false,
      isLocked: false,
      label: "Seo Details",
      lockedBy: "",
      properties: true,
      quickFiling: false,
      singleLanding: false,
      tvShowId: 123
    },
    match: { params: { id: "123" } },
    unLockedSession: jest.fn(),
    markAsDone: jest.fn()
  }
  beforeEach(() => {
    wrapper = setup({...props});
  });
  const event = { target: { name: 'mock', value: 'test' } };
  it("Should render SeoDetails default", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should test componentDidMount", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "componentDidMount");
    instance.componentDidMount();
    expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
  });

  it("should test fetchContentData", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "fetchContentData");
    instance.fetchContentData();
    expect(instance.fetchContentData).toHaveBeenCalledTimes(1);
  });

  it("should test generateUrlStructure", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "generateUrlStructure");
    instance.generateUrlStructure();
    expect(instance.generateUrlStructure).toHaveBeenCalledTimes(1);
  });

  it("should test fillSeoDetails", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "fillSeoDetails");
    instance.fillSeoDetails();
    expect(instance.fillSeoDetails).toHaveBeenCalledTimes(1);
  });

  it('should check selectGroup method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'selectGroup');
    instance.selectGroup(event, 'AFRICA_MA', "0");
    expect(instance.selectGroup).toHaveBeenCalled();
  });

  it("should test fillSeoDetailsGlobal", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "fillSeoDetailsGlobal");
    instance.fillSeoDetailsGlobal();
    expect(instance.fillSeoDetailsGlobal).toHaveBeenCalledTimes(1);
  });

  it("Should renders BadgeBox default", () => {
    expect(wrapper.containsMatchingElement(<BadgeBox />)).toEqual(false);
  });

  it("should test handleMarkAsDone", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "handleMarkAsDone");
    instance.handleMarkAsDone();
    expect(instance.handleMarkAsDone).toHaveBeenCalledTimes(1);
  });

  it("should test markAsDone", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "markAsDone");
    instance.markAsDone();
    expect(instance.markAsDone).toHaveBeenCalledTimes(1);
  });
  it("should test removeLock", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "removeLock");
    instance.removeLock();
    expect(instance.removeLock).toHaveBeenCalledTimes(1);
  });

  it('should test autoSave method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'autoSave');
    instance.autoSave(0);
    expect(instance.autoSave).toHaveBeenCalledTimes(1);
  });

  it("should test showHideStatePopup", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "showHideStatePopup");
    instance.showHideStatePopup();
    expect(instance.showHideStatePopup).toHaveBeenCalledTimes(1);
  });
  it("should test checkIfMarkAsDone", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "checkIfMarkAsDone");
    instance.checkIfMarkAsDone();
    expect(instance.checkIfMarkAsDone).toHaveBeenCalledTimes(1);
  });

  it('should test autoSaveGlobal method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'autoSaveGlobal');
    instance.autoSaveGlobal(0,0,'CastandCrew');
    expect(instance.autoSaveGlobal).toHaveBeenCalledTimes(1);
  });

  it("should test addRemoveMultipleFields", () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, "addRemoveMultipleFields");
    instance.addRemoveMultipleFields(0);
    expect(instance.addRemoveMultipleFields).toHaveBeenCalledTimes(1);
  });

});
