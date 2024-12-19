import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import QuickFiling from '../../../../_components/Video/ContentProperties/QuickFiling';
import { findByTestAttr } from '../../../../Utils';
import { expect, it, jest } from '@jest/globals';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
    const wrapper = shallow(<QuickFiling {...props} />)
    if (state) wrapper.setState(state);
    return wrapper;
}

describe('QuickFiling', () => {
    let wrapper;
    const baseProps = {
        match: {params: {id:'123'}},
        currentTabData: {
            isDone: false,
            isLocked: false,
            label: "Content Properties",
            lockedBy: "",
            permissionKey: "movies",
            permissionName: "canUpdate",
            permissionSubKey: "contentPropertiesModule",
            properties: true,
            quickFiling: true,
            singleLanding: true,
        },
        markAsDone: jest.fn()
    }
    const dataObj = {
        duration: "13:34:46", introStartTime: "12:33:45", skipAvailable: true,
        contentState: { id: "3bb64421-f15f-4dda-adec-03c324c140a3", title: "Draft" }
    };

    const stateArr = [
        {
            col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "title", label: "Special Category", multiple: true,
            name: "specialCategory", path: "/master/SpecialCategory", type: "dropdownAsync", validation: { required: false }, value: []
        },
        {
            col: "col-md-6 col-lg-6", data: [], errorText: "", groupBy: "group", keyText: "title", label: "Country/Group for Special Category", multiple: true,
            name: "specialCategoryCountry", path: "user/country-group", type: "dropdownAsync", validation: { required: false }, value: []
        }];

    const updatedObj = {
        specialCategory: [], specialCategoryCountry: [], specialCategoryFrom: "", specialCategoryTo: ""
    };

    const baseState = {
        player: [
          {
            col: "col-md-6 col-lg-6",
            errorText: "",
            isChanged: false,
            label: "Skip Available",
            labelPlacement: "end",
            name: "skipAvailable",
            type: "checkbox",
            validation: { required: false },
            value: true,
          },
          {
            col: "col-md-6 col-lg-6",
            errorText: "",
            isChanged: false,
            label: "Intro Start Time",
            name: "introStartTime",
            type: "time",
            validation: { required: false },
            value: "13:20:23",
          }],
          title_summary: [
            {
              col: "col-md-6 col-lg-6",
              errorText: "",
              isChanged: false,
              label: "Skip Available",
              labelPlacement: "end",
              name: "skipAvailable",
              type: "checkbox",
              validation: { required: false },
              value: [{test: 'test'}],
            },
            {
              col: "col-md-6 col-lg-6",
              errorText: "",
              isChanged: false,
              label: "Intro Start Time",
              name: "introStartTime",
              type: "time",
              validation: { required: false },
              value: "13:20:23",
            },
            {
              col: "col-md-6 col-lg-6",
              errorText: null,
              isChanged: false,
              label: "Intro End Time",
              name: "introEndTime",
              type: "time",
              validation: { required: false },
              value: null,
            },
          ],
          isLocked: true,
          lockedBy: 'test'
      };

    beforeEach(() => {
        wrapper = setup({ ...baseProps });
        wrapper.setState({ ...baseState });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should renders QuickFiling default', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should check componentDidMount', () => {
        jest.spyOn(wrapper.instance(), 'componentDidMount');
        wrapper.instance().componentDidMount();
        expect(wrapper.instance().componentDidMount).toBeCalled();
    })

    it("should check fetchContentData method", () => {
        jest.spyOn(wrapper.instance(), "fetchContentData");
        wrapper.instance().fetchContentData();
        expect(wrapper.instance().fetchContentData).toBeCalled();
    });

    it("should test updateValues method with params", () => {
        jest.spyOn(wrapper.instance(), "updateValues");
        wrapper.instance().updateValues(dataObj);
        expect(wrapper.instance().updateValues).toBeCalled();
    });

    it("should check updateArrValue method with params", () => {
        jest.spyOn(wrapper.instance(), "updateArrValue");
        wrapper.instance().updateArrValue(stateArr, updatedObj);
        expect(wrapper.instance().updateArrValue).toBeCalled();
    });
    
    it("should check handleChange method", () => {
        const event = {target : {name: 'test', value: 'test'}}
        jest.spyOn(wrapper.instance(), "handleChange");
        wrapper.instance().handleChange(event, 0, 0, 'title_summary');
        expect(wrapper.instance().handleChange).toBeCalled();
    });
    
    it("should check handleDate", () => {
        const event = {target : {name: 'test', value: 'test'}};
        jest.spyOn(wrapper.instance(), "handleDate");
        wrapper.instance().handleDate(event, 0, 0, 'title_summary');
        expect(wrapper.instance().handleDate).toBeCalled();
    });
    
    it("should check handleTime method", () => {
        jest.spyOn(wrapper.instance(), "handleTime");
        wrapper.instance().handleTime(null, 0, 0, 'title_summary');
        expect(wrapper.instance().handleTime).toBeCalled();
    });

    it("should check onEditorValueChange method", () => {
        jest.spyOn(wrapper.instance(), "onEditorValueChange");
        wrapper.instance().onEditorValueChange(null, 0, 0, 'title_summary');
        expect(wrapper.instance().onEditorValueChange).toBeCalled();
    });
    
    it("should check handleMultiSelect method", () => {
        jest.spyOn(wrapper.instance(), "handleMultiSelect");
        wrapper.instance().handleMultiSelect(null, null, 0, 0, 'title_summary');
        expect(wrapper.instance().handleMultiSelect).toBeCalled();
    });

    it('should check showHideLockPopup onclick method', () => {
        const props = {
          currentTabData: {
            isLocked: true
          }
        }
        wrapper.setProps({ ...props });
        const spy = jest.spyOn(wrapper.instance(), 'showHideLockPopup');
        wrapper.instance().forceUpdate();
        wrapper.update();
        const button = wrapper.find('.loc-icon');
        button.simulate('click');
        expect(spy).toHaveBeenCalled();
      })
    
      it('should check markAsDone onclick method', () => {
        wrapper.setState({ canMarkAsDaone: true });
        const spy = jest.spyOn(wrapper.instance(), 'markAsDone');
        wrapper.instance().forceUpdate();
        wrapper.update();
        const button = findByTestAttr(wrapper, 'markAsDoneBtn');
        button.simulate('click');
        expect(spy).toHaveBeenCalled();
      })
      
      it("should check handleTab method", () => {
        jest.spyOn(wrapper.instance(), "handleTab");
        wrapper.instance().handleTab();
        expect(wrapper.instance().handleTab).toBeCalled();
    });
    
    it("should check getQuickFilingUI method", () => {
        jest.spyOn(wrapper.instance(), "getQuickFilingUI");
        wrapper.instance().getQuickFilingUI();
        expect(wrapper.instance().getQuickFilingUI).toBeCalled();
    });
    
    it("should check getSinglePageUI method", () => {
        jest.spyOn(wrapper.instance(), "getSinglePageUI");
        wrapper.instance().getSinglePageUI();
        expect(wrapper.instance().getSinglePageUI).toBeCalled();
    });
    
    it("should check getControlFieldUI method", () => {
        jest.spyOn(wrapper.instance(), "getControlFieldUI");
        wrapper.instance().getControlFieldUI();
        expect(wrapper.instance().getControlFieldUI).toBeCalled();
    });
    
    it("should check getClassificationUI method", () => {
        jest.spyOn(wrapper.instance(), "getClassificationUI");
        wrapper.instance().getClassificationUI();
        expect(wrapper.instance().getClassificationUI).toBeCalled();
    });
    
    it("should check getTitleSummaryUI method", () => {
        jest.spyOn(wrapper.instance(), "getTitleSummaryUI");
        wrapper.instance().getTitleSummaryUI();
        expect(wrapper.instance().getTitleSummaryUI).toBeCalled();
    });

    it("should check showHideLockPopup method", () => {
        jest.spyOn(wrapper.instance(), "showHideLockPopup");
        wrapper.instance().showHideLockPopup(false);
        expect(wrapper.instance().showHideLockPopup).toBeCalled();
    });
    
    it("should check markAsDone method", () => {
        jest.spyOn(wrapper.instance(), "markAsDone");
        wrapper.instance().markAsDone();
        expect(wrapper.instance().markAsDone).toBeCalled();
    });
    
    it("should check markAsDone method for quick-filing", () => {
        wrapper.setProps({ state: 'quick-filing' });
        jest.spyOn(wrapper.instance(), "markAsDone");
        wrapper.instance().markAsDone();
        expect(wrapper.instance().markAsDone).toBeCalled();
    });
    
    it("should check markAsDone method for single-landing-page", () => {
        wrapper.setProps({ state: 'single-landing-page' });
        jest.spyOn(wrapper.instance(), "markAsDone");
        wrapper.instance().markAsDone();
        expect(wrapper.instance().markAsDone).toBeCalled();
    });
    
    it("should check autoSave method for quick-filing", () => {
        wrapper.setProps({ isLocked: false, state: 'quick-filing' });
        jest.spyOn(wrapper.instance(), "autoSave");
        wrapper.instance().autoSave();
        expect(wrapper.instance().autoSave).toBeCalled();
    });

    it('should check formatData', () => {
        const data = [{
          col: "col-md-6 col-lg-6", data: [], errorText: "", isChanged: false, keyText: "castName", label: "Recipient Name", multiple: true,
          name: "awardRecipient", path: "/cast-names", type: "SearchableWithCreate", validation: { required: false, isChar: true }, value: []
        }, {
          col: "col-md-6 col-lg-6", data: [], errorText: "", isChanged: false, keyText: "title", label: "Award Category", multiple: true,
          name: "awardsCategory", path: "/master/AwardCategory", type: "dropdownAsync", validation: { required: false }, value: []
        }]
        const instance = wrapper.instance();
        jest.spyOn(instance, "formatData");
        instance.formatData(data, true);
        expect(instance.formatData).toBeCalled();
      })

      it('should test checkError method', () => {
        const data = [{
          col: "col-md-6 col-lg-6",
          data: [{ title: "Brother", status: "1", id: "395e01b0-e89c-4380-842f-e2a830e949be" },
          { title: "Brother in law", status: "1", id: "7669ee51-b8c9-4ff4-a344-e0aa7a46ba70" },
          { title: "Daughter", status: "1", id: "29985c69-aa70-4162-9e95-e110e35dff36" },
          { title: "Father", status: "1", id: "b1412bb0-0e97-4759-8b9a-bebf437498a5" }],
          errorText: "", keyText: "title", label: "Relation", multiple: false, name: "relation",
          path: "/master/Relation", type: "dropdown", validation: { required: false }, value: null
        }];
        const instance = wrapper.instance();
        jest.spyOn(instance, 'checkError');
        const checkRequired = true;
        instance.checkError(data, checkRequired);
        expect(instance.checkError).toHaveBeenCalledTimes(1);
      })
})