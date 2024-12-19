import React from "react";
import { shallow } from "enzyme";
import moxios from "moxios";
import FieldsSelector from "../../../../../_components/CreateMovie/CastNCrew/SubComponents/FieldsSelector";
import { storeFactory, findByTestAttr } from '../../../../../Utils';

import { expect, it, jest } from "@jest/globals";
import axios from "../../../../../_helpers/axiosInstance";

const setup = (props = {}) => {
    const wrapper = shallow(<FieldsSelector {...props} />);
    return wrapper;
};

const baseProps = {
    field: { type: "text", name: "first name", multiline: true },
    handleChange: jest.fn(),
    handleMultiSelect: jest.fn(),
    onBlur: jest.fn(),
    onKeyPress: jest.fn(),
    keyText: "India",
    moreText: true,
    limitTags: 2,
    name: "",
    groupIndex: 1,
    disableCloseOnSelect: jest.fn(),
    disabled: false,
};

describe("render FieldsSelector", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = setup({ ...baseProps });
        moxios.install(axios);
    });
    afterEach(() => {
        moxios.uninstall(axios);
    });

    it("Should renders FieldsSelector default", () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should check for dropDown', () => {
        const baseProps = {
            field: { type: "dropDown", name: "first name", multiline: true },
            handleChange: jest.fn(),
            handleMultiSelect: jest.fn(),
            onBlur: jest.fn(),
            onKeyPress: jest.fn(),
            keyText: "India",
            moreText: true,
            limitTags: 2,
            name: "",
            groupIndex: 1,
            disableCloseOnSelect: jest.fn(),
            disabled: false,
        };
        const wrapper = setup({ ...baseProps });
        const button = findByTestAttr(wrapper, 'SearchableWithCreatedropDown');
        button.simulate('change');
        expect(baseProps.handleMultiSelect).toHaveBeenCalled();
    })

    it('should check for SearchableWithCreate', () => {
        const baseProps = {
            field: { type: "SearchableWithCreate", name: "first name", multiline: true },
            handleChange: jest.fn(),
            handleMultiSelect: jest.fn(),
            onBlur: jest.fn(),
            onKeyPress: jest.fn(),
            keyText: "India",
            moreText: true,
            limitTags: 2,
            name: "",
            groupIndex: 1,
            disableCloseOnSelect: jest.fn(),
            disabled: false,
        };
        const wrapper = setup({ ...baseProps });
        const button = findByTestAttr(wrapper, 'SearchableWithCreateBtn');
        button.simulate('change');
        expect(baseProps.handleMultiSelect).toHaveBeenCalled();
    })

    it('should check onClick method of handleChange', () => {
        const baseProps = {
            field: { type: "text", name: "first name", multiline: true },
            handleChange: jest.fn()
        };
        const wrapper = setup({ ...baseProps });
        const button =  findByTestAttr(wrapper, 'inputField');
        button.simulate('change'); 
        expect(baseProps.handleChange).toHaveBeenCalled();
    })
});
