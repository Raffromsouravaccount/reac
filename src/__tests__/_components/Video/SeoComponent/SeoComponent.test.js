import React from "react";
import { shallow } from "enzyme";

import SeoDetails from "../../../../_components/Video/SeoComponent/SeoDetails";
import BadgeBox from "../../../../_components/Common/BadgeBox/BadgeBox";
import { findByTestAttr } from "../../../../Utils";
import SeoJson from "../../../../_components/Video/Schema/SeoComponent/SeoDetails.json";
import jsonData from "../../../../_components/Video/Schema/Video_StandardJourney_FE_Structure.json";


/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
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
                label: "Cast & Crew",
                lockedBy: "",
                permissionKey: "movies",
                permissionName: "canUpdate",
                permissionSubKey: "castNCrewModule",
                properties: true,
                quickFiling: false,
                singleLanding: false,
                movieId: 123,
                markAsDone: jest.fn(),
               
            },
            jsonData: jsonData.Seo
        }

    beforeEach(() => {
        wrapper = setup({ ...props });
    });

    it("Should render SeoDetails default", () => {
        expect(wrapper.exists()).toBe(true);
    });

    it("should test test input data", () => {
        const spy = jest.spyOn(wrapper.instance(), "InputChanger");
        const event = { target: { value: "test" } };
        wrapper.instance().forceUpdate();
        wrapper.update();
        const button = findByTestAttr(wrapper, "seo-inputchanger").first();
        button.simulate("change", event, 0);
        expect(spy).toBeCalled();
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

    it('should test setSelectDataArr', () => {
        const res = [{ id: "3bb64421-f15f-4dda-adec-03c324c140a3", status: "1", title: "301 Permanent Redirection" },
        { id: "081cc5b2-a302-4bfb-8e5c-68544ae636e6", status: "1", title: "302 Temporary Redirection" }]
        wrapper.setState({ JSONSchema: SeoJson });
        jest.spyOn(wrapper.instance(), 'setSelectDataArr');
        wrapper.instance().setSelectDataArr(res, 4);
        expect(wrapper.instance().setSelectDataArr).toBeCalled();
    })

    it('should test autoSave', () => {
        const seoJson = [{
            col: "col-md-6 col-lg-6", data: undefined, errorText: "", label: "SEO Meta Description", name: "metaDescription",
            touched: 0, type: "textarea", valid: true, validation: {required: true, maxLength: 500, isAlphaNumericWithSpecialChars: true}, value: "meta"
        }]
        wrapper.setState({ JSONSchema: seoJson });
        jest.spyOn(wrapper.instance(), 'autoSave');
        wrapper.instance().autoSave(0);
        expect(wrapper.instance().autoSave).toBeCalled();
    })


});
