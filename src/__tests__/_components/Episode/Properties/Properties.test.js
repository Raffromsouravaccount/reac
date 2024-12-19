import React from 'react';
import { shallow } from 'enzyme';
import Properties from '../../../../_components/Episode/Properties/Properties';
import jsonData from '../../../../_components/Episode/Schema/Standard/Properties.json';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
    currentTabData: {
        isLocked: false
    },
    markAsDone: jest.fn(),
    unLockedSession: jest.fn(),
    jsonData: jsonData
};

const setup = (props = {}) => {
    const wrapper = shallow(<Properties {...baseProps} />);
    return wrapper;
}

describe('Properties', () => {
    let wrapper;
    let instance;
    const stateArr = [
        {
            col: "col-md-6 col-lg-6",
            data: [],
            errorText: "",
            keyText: "title",
            label: "Special Category",
            multiple: true,
            name: "specialCategory",
            path: "/master/SpecialCategory",
            type: "dropdownAsync",
            validation: { required: false },
            value: [],
        },
        {
            col: "col-md-6 col-lg-6",
            data: [],
            errorText: "",
            groupBy: "group",
            keyText: "title",
            label: "Country/Group for Special Category",
            multiple: true,
            name: "specialCategoryCountry",
            path: "user/country-group",
            type: "dropdownAsync",
            validation: { required: false },
            value: [],
        }];

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
                value: [{ test: 'test' }],
                data: [{ test: 'test' }]
            },
            {
                col: "col-md-6 col-lg-6",
                errorText: "",
                isChanged: false,
                label: "indexNumber",
                labelPlacement: "end",
                name: "indexNumber",
                type: "text",
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
                value: "13:20:23",
            },
            {
                col: "col-md-6 col-lg-6",
                errorText: null,
                isChanged: false,
                label: "Intro End Time",
                name: "index",
                type: "time",
                validation: { required: false },
                value: null,
            }],
        userInfo: {
            RoleName: "System Admin"
        }
    };


    const updatedObj = {
        specialCategory: [],
        specialCategoryCountry: [],
        specialCategoryFrom: "",
        specialCategoryTo: "",
    };

    const dataObj = {
        duration: "13:34:46",
        introStartTime: "12:33:45",
        skipAvailable: true,
        contentState: {
            id: "3bb64421-f15f-4dda-adec-03c324c140a3",
            title: "Draft",
        },
    };

    beforeEach(() => {
        wrapper = setup({ ...baseProps });
        instance = wrapper.instance();
        wrapper.setState({ ...baseState });
    })

    it('Should renders Properties default', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should test componentDidMount method', () => {
        jest.spyOn(instance, 'componentDidMount');
        instance.componentDidMount();
        expect(instance.componentDidMount).toBeCalled();
    })

    it('should test fetchContentData method', () => {
        jest.spyOn(instance, 'fetchContentData');
        instance.fetchContentData();
        expect(instance.fetchContentData).toBeCalled();
    })

    it("should check updateArrValue method with params", () => {
        jest.spyOn(wrapper.instance(), "updateArrValue");
        wrapper.instance().updateArrValue(stateArr, updatedObj);
        expect(wrapper.instance().updateArrValue).toBeCalled();
    });
    it("should check updateArrValue method with params if condition", () => {
        const stateArr = [
            {
                col: "col-md-6 col-lg-6",
                data: [],
                errorText: "",
                keyText: "title",
                label: "Special Category",
                multiple: true,
                name: "audioLanguages",
                path: "/master/SpecialCategory",
                type: "dropdownAsync",
                validation: { required: false },
                value: [],
            }]
        jest.spyOn(wrapper.instance(), "updateArrValue");
        wrapper.instance().updateArrValue(stateArr, updatedObj);
        expect(wrapper.instance().updateArrValue).toBeCalled();
    });

    it("should test updateValues method with params", () => {
        jest.spyOn(wrapper.instance(), "updateValues");
        wrapper.instance().updateValues(dataObj);
        expect(wrapper.instance().updateValues).toBeCalled();
    });

    it('should check handleSearchableInput', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, "handleSearchableInput");
        instance.handleSearchableInput(null, 0, 0, 'player');
        expect(instance.handleSearchableInput).toBeCalled();
    })

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
        jest.spyOn(instance, 'selectGroup');
        instance.selectGroup(null, '', 0, 0, 'title_summary');
        expect(instance.selectGroup).toBeCalled();
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
        wrapper.setState({ title_summary });
        jest.spyOn(instance, 'handleEditable');
        instance.handleEditable(null, 0, 'title_summary');
        expect(instance.handleEditable).toBeCalled();
    })

    it('should check addRemoveMultipleFields', () => {
        const name = 'title_summary';
        jest.spyOn(instance, 'addRemoveMultipleFields');
        instance.addRemoveMultipleFields(name, 1);
        expect(instance.addRemoveMultipleFields).toBeCalled();
    })

    it('should check addRemoveMultipleFields with 0 index', () => {
        const name = 'title_summary';
        jest.spyOn(instance, 'addRemoveMultipleFields');
        instance.addRemoveMultipleFields(name, 0);
        expect(instance.addRemoveMultipleFields).toBeCalled();
    })

    it('should check formatValue', () => {
        const value = [{
            id: "9a6412f2-6862-47ef-8a07-9dde2a9a2731", status: "1", title: "Animation"
        }]
        const instance = wrapper.instance();
        jest.spyOn(instance, "formatValue");
        instance.formatValue(value, true);
        expect(instance.formatValue).toBeCalled();
    })

    it('should check formatValue else condition', () => {
        const value = [{
            id: "9a6412f2-6862-47ef-8a07-9dde2a9a2731", status: "1", title: "Animation"
        }]
        const instance = wrapper.instance();
        jest.spyOn(instance, "formatValue");
        instance.formatValue(value, false);
        expect(instance.formatValue).toBeCalled();
    })

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
        const data = [{
            col: "col-md-6 col-lg-6", data: [], errorText: "", isChanged: false, keyText: "castName", label: "Recipient Name", multiple: true,
            name: "awardRecipient", path: "/cast-names", type: "SearchableWithCreate", validation: { required: false, isChar: true }, value: []
        }, {
            col: "col-md-6 col-lg-6", data: [], errorText: "", isChanged: false, keyText: "title", label: "Award Category", multiple: true,
            name: "awardsCategory", path: "/master/AwardCategory", type: "dropdownAsync", validation: { required: false }, value: []
        }]
        const instance = wrapper.instance();
        jest.spyOn(instance, "formatNestedData");
        instance.formatNestedData(data, true);
        expect(instance.formatNestedData).toBeCalled();
    })
    
    it('should test handleSave', () => {
        const title_summary = [
            [{
                col: "col-md-6 col-lg-6",
                errorText: "",
                isChanged: false,
                label: "Skip Available",
                labelPlacement: "end",
                name: "audioLanguages",
                type: "checkbox",
                validation: { required: false },
                value: [{ test: 'test' }],
                data: [{ test: 'test' }],
                multiple: false
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
        jest.spyOn(instance, 'handleSave');
        instance.handleSave(0, 0, 'title_summary');
        expect(instance.handleSave).toBeCalled();
    })
    
    it('should check markAsDone', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, "markAsDone");
        instance.markAsDone();
        expect(instance.markAsDone).toBeCalled();
    })
    
    it('should check showHideLockPopup', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, "showHideLockPopup");
        instance.showHideLockPopup();
        expect(instance.showHideLockPopup).toBeCalled();
    })
    
    it('should check unLockProperties', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, "unLockProperties");
        instance.unLockProperties();
        expect(instance.unLockProperties).toBeCalled();
    })
    
    it('should check getControlFieldUI', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, "getControlFieldUI");
        instance.getControlFieldUI();
        expect(instance.getControlFieldUI).toBeCalled();
    })
    
    it('should check handleTab', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, "handleTab");
        instance.handleTab();
        expect(instance.handleTab).toBeCalled();
    })
    
    it('should check getGlobalFieldsUI', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, "getGlobalFieldsUI");
        instance.getGlobalFieldsUI();
        expect(instance.getGlobalFieldsUI).toBeCalled();
    })
    
    it('should check getQuickFilingSingleLandingEpisodeUI', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, "getQuickFilingSingleLandingEpisodeUI");
        instance.getQuickFilingSingleLandingEpisodeUI();
        expect(instance.getQuickFilingSingleLandingEpisodeUI).toBeCalled();
    })
    
    it('should check getClassificationUI', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, "getClassificationUI");
        instance.getClassificationUI();
        expect(instance.getClassificationUI).toBeCalled();
    })

    it('should check getPlayerAttributeUI', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, "getPlayerAttributeUI");
        instance.getPlayerAttributeUI();
        expect(instance.getPlayerAttributeUI).toBeCalled();
    })
});