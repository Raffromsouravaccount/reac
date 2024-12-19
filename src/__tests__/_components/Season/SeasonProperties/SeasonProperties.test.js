import React from 'react';
import { shallow } from 'enzyme';

import SeasonProperties from '../../../../_components/Season/SeasonProperties/SeasonProperties';
import jsonData from '../../../../_components/Season/Schema/Season_StandardJourney_FE_Structure.json'
import { findByTestAttr } from '../../../../Utils';
import { expect, jest } from '@jest/globals';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
    const wrapper = shallow(<SeasonProperties {...props} />)
    return wrapper;
}

describe('SeasonProperties', () => {
    let wrapper;
    const props = {
        currentTabData: {
            isDone: false,
            isLocked: false,
            label: "Content Properties",
            lockedBy: "",
            permissionKey: "tvShows",
            permissionName: "canUpdate",
            permissionSubKey: "SeasonProperties",
            properties: true,
            quickFiling: true,
            singleLanding: true,
        },
        tvShowId: '123',
        jsonData : jsonData
    }
    beforeEach(() => {
        wrapper = setup({ ...props });
    });

    it('Should renders Season Properties default', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should test ComponentDidMount', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'componentDidMount');
        instance.componentDidMount();
        expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
    });

    it('should test render', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'render');
        instance.render();
        expect(instance.render).toHaveBeenCalledTimes(1);
    });

    it('should test showHideLockPopup', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'showHideLockPopup');
        instance.showHideLockPopup();
        expect(instance.showHideLockPopup).toHaveBeenCalledTimes(1);
    });

    it('should test unLockProperties', () => {
        wrapper.setProps({ unLockedSession: jest.fn() })
        const instance = wrapper.instance();
        jest.spyOn(instance, 'unLockProperties');
        instance.unLockProperties();
        expect(instance.unLockProperties).toHaveBeenCalledTimes(1);
    });

    it('should test MarkAsDone', () => {
        wrapper.setProps({ markAsDone: jest.fn() })
        const instance = wrapper.instance();
        jest.spyOn(instance, 'markAsDone');
        instance.markAsDone();
        expect(instance.markAsDone).toHaveBeenCalledTimes(1);
    });

    it('should check handleStateChange with rootIndex', () => {
        wrapper.setProps({ markAsDone: jest.fn() })
        const event = { target: { value: 'test' } };
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleStateChange');
        instance.handleStateChange(event, null, 1, 'title_summary');
        expect(instance.handleStateChange).toBeCalled();
    });

    it('should test updateArrValue', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'updateArrValue');
        instance.updateArrValue();
        expect(instance.updateArrValue).toHaveBeenCalledTimes(1);
    });

    it('should test fetchContentData', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'fetchContentData');
        instance.fetchContentData();
        expect(instance.fetchContentData).toHaveBeenCalledTimes(1);
    });

    it('should test formatData else', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'formatData');
        instance.formatData();
        expect(instance.formatData).toHaveBeenCalledTimes(1);
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

    it('should check formatNestedData', () => {
        const relation = [[{
            col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "castName", label: "Related To", multiple: false,
            name: "castProfileId", path: "", type: "autocreate", validation: { required: false }, value: null
          }, {
            col: "col-md-6 col-lg-6", data: [
              { title: "Brother", status: "1", id: "395e01b0-e89c-4380-842f-e2a830e949be" },
              { title: "Brother in law", status: "1", id: "7669ee51-b8c9-4ff4-a344-e0aa7a46ba70" },
              { title: "Daughter", status: "1", id: "29985c69-aa70-4162-9e95-e110e35dff36" },
              { title: "Father", status: "1", id: "b1412bb0-0e97-4759-8b9a-bebf437498a5" }
            ], errorText: "", keyText: "title", label: "Relation", multiple: false, name: "relation",
            path: "/master/Relation", type: "dropdownAsync", validation: { required: false }, value: null
          }], [{
            col: "col-md-6 col-lg-6", data: [], errorText: "", keyText: "castName", label: "Related To", multiple: false,
            name: "castProfileId", path: "", type: "autocreate", validation: { required: false }, value: null
          }, {
            col: "col-md-6 col-lg-6", data: [
              { title: "Brother", status: "1", id: "395e01b0-e89c-4380-842f-e2a830e949be" },
              { title: "Brother in law", status: "1", id: "7669ee51-b8c9-4ff4-a344-e0aa7a46ba70" },
              { title: "Daughter", status: "1", id: "29985c69-aa70-4162-9e95-e110e35dff36" },
              { title: "Father", status: "1", id: "b1412bb0-0e97-4759-8b9a-bebf437498a5" }
            ], errorText: "", keyText: "title", label: "Relation", multiple: false, name: "relation",
            path: "/master/Relation", type: "dropdownAsync", validation: { required: false }, value: null
          }]];
        const dataArr = [{ castProfileId: 'zyx123', relation: relation }];
        const instance = wrapper.instance();
        jest.spyOn(instance, 'formatNestedData');
        instance.formatNestedData(dataArr);
        expect(instance.formatNestedData).toHaveBeenCalledTimes(1);
    })

    it('should test handleTab', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleTab');
        instance.handleTab();
        expect(instance.handleTab).toHaveBeenCalledTimes(1);
    });

    it('should test addRemoveMultipleFields', () => {
        const index = 1;
        const instance = wrapper.instance();
        jest.spyOn(instance, 'addRemoveMultipleFields');
        instance.addRemoveMultipleFields(index);
        expect(instance.addRemoveMultipleFields).toHaveBeenCalledTimes(1);
    });

    it('should test addRemoveMultipleFields else', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'addRemoveMultipleFields');
        instance.addRemoveMultipleFields();
        expect(instance.addRemoveMultipleFields).toHaveBeenCalledTimes(1);
    });

    it('should check checkError method', () => {
        const props = {
            setStage: jest.fn()
        }
        const dataArr = [
            {
                keyText: "title",
            },
        ];

        wrapper.setProps({ ...props });
        const instance = wrapper.instance();
        jest.spyOn(instance, 'checkError');
        instance.checkError(dataArr);
        expect(instance.checkError).toBeCalled();
    });

    it('should test handleSearchableInput', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleSearchableInput');
        instance.handleSearchableInput();
        expect(instance.handleSearchableInput).toHaveBeenCalledTimes(1);
    });

    it('should test  getControlFieldUI', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'getControlFieldUI');
        instance.getControlFieldUI();
        expect(instance.getControlFieldUI).toHaveBeenCalledTimes(1);
    });

    it('should test  getGlobalFieldsUI', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'getGlobalFieldsUI');
        instance.getGlobalFieldsUI();
        expect(instance.getGlobalFieldsUI).toHaveBeenCalledTimes(1);
    });

    it('should test  getClassificationUI', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'getClassificationUI');
        instance.getClassificationUI();
        expect(instance.getClassificationUI).toHaveBeenCalledTimes(1);
    });

    it('should test  getTitleSummaryUI', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'getTitleSummaryUI');
        instance.getTitleSummaryUI();
        expect(instance.getTitleSummaryUI).toHaveBeenCalledTimes(1);
    });

    it('should check markAsDone onclick method', () => {
        wrapper.setState({ canMarkAsDone: true });
        const spy = jest.spyOn(wrapper.instance(), 'markAsDone');
        wrapper.instance().forceUpdate();
        wrapper.update();
        const button = findByTestAttr(wrapper, 'markIsDoneButton');
        button.simulate('click');
        expect(spy).toHaveBeenCalled();
    })

    it('should test formatValue', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'formatValue');
        instance.formatValue([], true);
        expect(instance.formatValue).toBeCalled();
    });

    it('should test formatValue else', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'formatValue');
        instance.formatValue();
        expect(instance.formatValue).toBeCalled();
    });

    it('should test selectGroup', () => {
        const title_summary = [
            [{
                col: "col-md-6 col-lg-6",
                errorText: "",
                isChanged: false,
                label: "Skip Available",
                labelPlacement: "end",
                name: "skipAvailable",
                type: "checkbox",
                validation: { required: false },
                value: [{ test: 'test' }],
                data: [{ test: 'test' }]
            },
            {
                col: "col-md-6 col-lg-6",
                errorText: "",
                isChanged: false,
                label: "Intro Start Time",
                name: "introStartTime",
                type: "time",
                validation: { required: false },
                value: "13:20:23"
            }]]
        wrapper.setState({ title_summary });
        jest.spyOn(wrapper.instance(), 'selectGroup');
        wrapper.instance().selectGroup(null, '', 0, 0, 'title_summary');
        expect(wrapper.instance().selectGroup).toBeCalled();
    })

    it("should check setSelectDataArr method", () => {
        const data = [
            { title: "Celebration", status: "1", id: "d4818f6b-4866-46af-bb9b-674eb079ee61" },
            { title: "Chill", status: "1", id: "b2e61c3e-1cf7-4a41-a873-69d370d652ef" },
            { title: "Drive", status: "1", id: "536266d1-83d2-4106-a66c-9e03f56d821e" }
        ];
        const title_summary = [
            [{
                col: "col-md-6 col-lg-6",
                errorText: "",
                isChanged: false,
                label: "Skip Available",
                labelPlacement: "end",
                name: "skipAvailable",
                type: "checkbox",
                validation: { required: false },
                value: [{ test: 'test' }],
                data: [{ test: 'test' }]
            },
            {
                col: "col-md-6 col-lg-6",
                errorText: "",
                isChanged: false,
                label: "Intro Start Time",
                name: "introStartTime",
                type: "time",
                validation: { required: false },
                value: "13:20:23"
            }]]
        wrapper.setState({ title_summary });
        const instance = wrapper.instance();
        jest.spyOn(instance, "setSelectDataArr");
        instance.setSelectDataArr("title_summary", 0, 0, data);
        expect(instance.setSelectDataArr).toBeCalled();
    });

    it("should check setSelectDataArr method", () => {
        const data = [
            { title: "Celebration", status: "1", id: "d4818f6b-4866-46af-bb9b-674eb079ee61" },
            { title: "Chill", status: "1", id: "b2e61c3e-1cf7-4a41-a873-69d370d652ef" },
            { title: "Drive", status: "1", id: "536266d1-83d2-4106-a66c-9e03f56d821e" }
        ];
        const title_summary = [
            [{
                col: "col-md-6 col-lg-6",
                errorText: "",
                isChanged: false,
                label: "Skip Available",
                labelPlacement: "end",
                name: "skipAvailable",
                type: "checkbox",
                validation: { required: false },
                value: [{ test: 'test' }],
                data: [{ test: 'test' }]
            },
            {
                col: "col-md-6 col-lg-6",
                errorText: "",
                isChanged: false,
                label: "Intro Start Time",
                name: "introStartTime",
                type: "time",
                validation: { required: false },
                value: "13:20:23"
            }]]
        wrapper.setState({ title_summary });
        const instance = wrapper.instance();
        jest.spyOn(instance, "setSelectDataArr");
        instance.setSelectDataArr("title_summary", null, 0, data);
        expect(instance.setSelectDataArr).toBeCalled();
    });

    it('should check handleStateChange', () => {
        const title_summary = [
            [{
                col: "col-md-6 col-lg-6",
                errorText: "",
                isChanged: false,
                label: "Skip Available",
                labelPlacement: "end",
                name: "skipAvailable",
                type: "checkbox",
                validation: { required: false },
                value: [{ test: 'test' }],
                data: [{ test: 'test' }]
            },
            {
                col: "col-md-6 col-lg-6",
                errorText: "",
                isChanged: false,
                label: "Intro Start Time",
                name: "introStartTime",
                type: "time",
                validation: { required: false },
                value: "13:20:23"
            }]]
        wrapper.setState({ title_summary });
        const event = { target: { value: 'test' } };
        jest.spyOn(wrapper.instance(), 'handleStateChange');
        wrapper.instance().handleStateChange(event, 0, 0, 'title_summary');
        expect(wrapper.instance().handleStateChange).toBeCalled();
    })

    it('should check handleStateChange else condition', () => {
        const event = { target: { value: 'test' } };
        jest.spyOn(wrapper.instance(), 'handleStateChange');
        wrapper.instance().handleStateChange(event, null, 0, 'player');
        expect(wrapper.instance().handleStateChange).toBeCalled();
    })

    it('should check handleStateChange for published', () => {
        const status = 'Published';
        wrapper.setState({ status })
        const event = { target: { value: 'test' } };
        jest.spyOn(wrapper.instance(), 'handleStateChange');
        wrapper.instance().handleStateChange(event, null, 0, 'title_summary');
        expect(wrapper.instance().handleStateChange).toBeCalled();
    })

    it('should check handleStateChange for Unpublished', () => {
        const status = 'Unpublished';
        wrapper.setState({ status })
        const event = { target: { value: 'test' } };
        jest.spyOn(wrapper.instance(), 'handleStateChange');
        wrapper.instance().handleStateChange(event, null, 0, 'player');
        expect(wrapper.instance().handleStateChange).toBeCalled();
    })

    it('should check handleStateChange for Submitted To Review', () => {
        const status = 'Submitted To Review';
        wrapper.setState({ status })
        const event = { target: { value: 'test' } };
        jest.spyOn(wrapper.instance(), 'handleStateChange');
        wrapper.instance().handleStateChange(event, null, 0, 'title_summary');
        expect(wrapper.instance().handleStateChange).toBeCalled();
    })

    it('should check handleEditable', () => {
        const title_summary = [
            [{
                col: "col-md-6 col-lg-6",
                errorText: "",
                isChanged: false,
                label: "Skip Available",
                labelPlacement: "end",
                name: "skipAvailable",
                type: "checkbox",
                validation: { required: false },
                value: [{ test: 'test' }],
                data: [{ test: 'test' }]
            },
            {
                col: "col-md-6 col-lg-6",
                errorText: "",
                isChanged: false,
                label: "Intro Start Time",
                name: "introStartTime",
                type: "time",
                validation: { required: false },
                value: "13:20:23"
            }]]
        wrapper.setState({ title_summary });
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleEditable');
        instance.handleEditable(0, 0, 'title_summary');
        expect(instance.handleEditable).toBeCalled();
    })

    it('should check handleEditable else condition', () => {
        const title_summary = [
            [{
                col: "col-md-6 col-lg-6",
                errorText: "",
                isChanged: false,
                label: "Skip Available",
                labelPlacement: "end",
                name: "skipAvailable",
                type: "checkbox",
                validation: { required: false },
                value: [{ test: 'test' }],
                data: [{ test: 'test' }]
            },
            {
                col: "col-md-6 col-lg-6",
                errorText: "",
                isChanged: false,
                label: "Intro Start Time",
                name: "introStartTime",
                type: "time",
                validation: { required: false },
                value: "13:20:23"
            }]]
        const instance = wrapper.instance();
        wrapper.setState({ title_summary });
        jest.spyOn(instance, 'handleEditable');
        instance.handleEditable(null, 0, 'title_summary');
        expect(instance.handleEditable).toBeCalled();
    })

    it('should check handleSave method', () => {
        jest.spyOn(wrapper.instance(), 'handleSave');
        wrapper.instance().handleSave(0, 0, 'title_summary');
        expect(wrapper.instance().handleSave).toBeCalled();
      })
})