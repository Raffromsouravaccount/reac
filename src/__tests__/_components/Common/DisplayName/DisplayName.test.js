import React from 'react';
import { shallow } from 'enzyme';

import DisplayName from '../../../../_components/Common/DisplayName/DisplayName';
import { findByTestAttr } from '../../../../Utils';

const baseProps = {
    jsonFields: {
        default: [{
            "name": "clip",
            "value": "",
            "col": "col-md-4 col-lg-4",
            "type": "text",
            "label": "Clip Display Name",
            "errorText": "",
            "validation": {
                "required": false,
                "maxLength": 250,
                "isChar": true
            }
        }],
        group: {
            "name": "GroupCountry",
            "value": [],
            "col": "col-md-4 col-lg-4",
            "type": "dropdownAsync",
            "data": [],
            "multiple": true,
            "groupBy": "group",
            "label": "Country / Group",
            "keyText": "title",
            "path": "user/country-group",
            "errorText": "",
            "validation": {
                "required": false
            }
        }
    },
    saveDisplayName: jest.fn()
}

const jsonFields = [{
    default: [{ name: "clip", value: "", col: "col-md-4 col-lg-4", type: "text", label: "Clip Display Name" }],
    groups: [{ name: "clip", value: "", col: "col-md-4 col-lg-4", type: "text", label: "Clip Display Name" }],
    country: { data: [{ name: 'test' }], value: [{ name: 'test' }] },
    title: [[{ name: 'title', value: 'title' }]]
}]

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<DisplayName {...props} />);
    if (state) wrapper.setState(state);
    return wrapper;
}

describe('DisplayName', () => {
    let wrapper;
    beforeEach(() => {
        let jsonFields = [];
        jsonFields.push({ title: baseProps.jsonFields.default });
        let globalFields = {
            title: baseProps.jsonFields.default,
            country: baseProps.jsonFields.group
        };
        jsonFields.push(globalFields);
        wrapper = setup({ ...baseProps }, { jsonFields, disableSaveButton: false });
    })
    it('Should renders DisplayName default', () => {
        expect(wrapper.exists()).toBe(true);
    })

    it('should check addGroup method', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'addGroup');
        instance.addGroup();
        expect(instance.addGroup).toHaveBeenCalled();
    })

    it('should check removeGroup method', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'removeGroup');
        instance.removeGroup();
        expect(instance.removeGroup).toHaveBeenCalled();
    })

    it('should check componentWillReceiveProps method', () => {
        const nextProps = {
            assignedData: [{ title: { clip: "test" }, country: [{ name: 'test' }] }]
        }
        jest.spyOn(wrapper.instance(), 'componentWillReceiveProps');
        wrapper.instance().componentWillReceiveProps(nextProps);
        expect(wrapper.instance().componentWillReceiveProps).toBeCalled();
    })

    it('should check componentDidMount method', () => {
        jest.spyOn(wrapper.instance(), 'componentDidMount');
        wrapper.instance().componentDidMount();
        expect(wrapper.instance().componentDidMount).toBeCalled();
    })

    it('should check inputChange method', () => {
        const  jsonFields = [
            {title: [
                {name: "clip", value: "test", col: "col-md-4 col-lg-4", type: "text", label: "Clip Display Name"},
                {name: "webisode", value: "", col: "col-md-4 col-lg-4", type: "text", label: "Webisode Display Name"},
                {name: "preview", value: "", col: "col-md-4 col-lg-4", type: "text", label: "Preview Display Name"}
             ]},
             {title: [
                {name: "clip", value: "test", col: "col-md-4 col-lg-4", type: "text", label: "Clip Display Name"},
                {name: "webisode", value: "", col: "col-md-4 col-lg-4", type: "text", label: "Webisode Display Name"},
                {name: "preview", value: "", col: "col-md-4 col-lg-4", type: "text", label: "Preview Display Name"}
             ],
            country: {
                col: "col-md-4 col-lg-4",
                data: [{id: "2feeac02-7d14-45f0-b94a-2ae30235f79d", title: "India", code: "IN", status: "1", group: "Others"}],
                errorText: "", groupBy: "group", keyText: "title", label: "Country / Group", multiple: true, name: "GroupCountry",
                path: "user/country-group", type: "dropdownAsync", validation: {required: false},
                value: [{id: "2feeac02-7d14-45f0-b94a-2ae30235f79d", title: "India", code: "IN", status: "1", group: "Others"}]
            }}
        ]
        wrapper.setState({ jsonFields });
        const event = { target: { name: 'test', value: "test" } };
        jest.spyOn(wrapper.instance(), 'inputChange');
        wrapper.instance().inputChange(event, 1, 0, true);
        expect(wrapper.instance().inputChange).toBeCalled();
    })

    it('should check inputChange method else condition', () => {
        const event = { target: { name: 'test', value: "test" } };
        jest.spyOn(wrapper.instance(), 'inputChange');
        wrapper.instance().inputChange(event, 0, 0, false);
        expect(wrapper.instance().inputChange).toBeCalled();
    })

    it('should check setSelectDataArr method', () => {
        const value = [{
            countries: [{ id: 'xtazz', value: 'test' }],
            group: {
                col: "col-md-4 col-lg-4", data: [], errorText: "", groupBy: "group", keyText: "title", label: "Country / Group",
                multiple: true, name: "GroupCountry", path: "user/country-group", type: "dropdownAsync", validation: { required: false }, value: ""
            }
        }]
        jest.spyOn(wrapper.instance(), 'setSelectDataArr');
        wrapper.instance().setSelectDataArr(value, 0, 0);
        expect(wrapper.instance().setSelectDataArr).toBeCalled();
    })

    it('should check selectGroup method', () => {
        const  jsonFields = [
            {title: [
                {name: "clip", value: "test", col: "col-md-4 col-lg-4", type: "text", label: "Clip Display Name"},
                {name: "webisode", value: "", col: "col-md-4 col-lg-4", type: "text", label: "Webisode Display Name"},
                {name: "preview", value: "", col: "col-md-4 col-lg-4", type: "text", label: "Preview Display Name"}
             ]},
             {title: [
                {name: "clip", value: "test", col: "col-md-4 col-lg-4", type: "text", label: "Clip Display Name"},
                {name: "webisode", value: "", col: "col-md-4 col-lg-4", type: "text", label: "Webisode Display Name"},
                {name: "preview", value: "", col: "col-md-4 col-lg-4", type: "text", label: "Preview Display Name"}
             ],
            country: {
                col: "col-md-4 col-lg-4",
                data: [{id: "2feeac02-7d14-45f0-b94a-2ae30235f79d", title: "India", code: "IN", status: "1", group: "Others"}],
                errorText: "", groupBy: "group", keyText: "title", label: "Country / Group", multiple: true, name: "GroupCountry",
                path: "user/country-group", type: "dropdownAsync", validation: {required: false},
                value: [{id: "2feeac02-7d14-45f0-b94a-2ae30235f79d", title: "India", code: "IN", status: "1", group: "Others"}]
            }}
        ]
        wrapper.setState({jsonFields});
        const event = { target: { name: 'test', value: "test" } };
        jest.spyOn(wrapper.instance(), 'selectGroup');
        wrapper.instance().selectGroup(event, 1, 0, 'grp');
        expect(wrapper.instance().selectGroup).toBeCalled();
    })

    it('should check saveDisplayName method', () => {
        jest.spyOn(wrapper.instance(), 'saveDisplayName');
        wrapper.instance().saveDisplayName();
        expect(wrapper.instance().saveDisplayName).toBeCalled();
    })

    it('should check saveDisplayName onclick method', () => {
        const spy = jest.spyOn(wrapper.instance(), 'saveDisplayName');
        wrapper.instance().forceUpdate();
        wrapper.update();
        const button = wrapper.find('.zee-btn-field');
        button.simulate('click');
        expect(spy).toHaveBeenCalled();
    })

    it('should check addGroup onclick method', () => {
        const spy = jest.spyOn(wrapper.instance(), 'addGroup');
        wrapper.instance().forceUpdate();
        wrapper.update();
        const button = findByTestAttr(wrapper, 'addGroup');
        button.simulate('click');
        expect(spy).toHaveBeenCalled();
    })
})