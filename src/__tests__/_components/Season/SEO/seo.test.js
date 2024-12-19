import React from "react";
import { shallow } from "enzyme";

import SeoDetails from "../../../../_components/Season/SeoDetails/SeoDetails";
import BadgeBox from "../../../../_components/Common/BadgeBox/BadgeBox";
import { findByTestAttr } from "../../../../Utils";
import jsonData from "../../../../_components/Season/Schema/Season_StandardJourney_FE_Structure.json";

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
            },
            jsonData : jsonData
        }
        wrapper = setup({ ...props });
    });

    it("Should render SeoDetails default", () => {
        expect(wrapper.exists()).toBe(true);
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

    it('should test handleSave', () => {
        const seoJson = [{
            col: "col-md-6 col-lg-6", data: undefined, errorText: "", label: "SEO Meta Description", name: "metaDescription",
            touched: 0, type: "textarea", valid: true, validation: {required: true, maxLength: 500, isAlphaNumericWithSpecialChars: true}, value: "meta"
        }]
        wrapper.setState({ JSONSchema: seoJson });
        jest.spyOn(wrapper.instance(), 'handleSave');
        wrapper.instance().handleSave(0);
        expect(wrapper.instance().handleSave).toBeCalled();
    })
    it('should test autoSaveGlobal', () => {
      const seoJson = [{
          col: "col-md-6 col-lg-6", data: undefined, errorText: "", label: "SEO Meta Description", name: "metaDescription",
          touched: 0, type: "textarea", valid: true, validation: {required: true, maxLength: 500, isAlphaNumericWithSpecialChars: true}, value: "meta"
      }]
      wrapper.setState({ JSONSchema: seoJson });
      jest.spyOn(wrapper.instance(), 'autoSaveGlobal');
      wrapper.instance().autoSaveGlobal(0);
      expect(wrapper.instance().autoSaveGlobal).toBeCalled();
  })


});
