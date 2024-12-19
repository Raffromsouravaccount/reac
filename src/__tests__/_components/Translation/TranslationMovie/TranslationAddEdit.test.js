import React from 'react';
import { shallow, mount } from 'enzyme';
import TranslationAddEdit from './../../../../_components/Translation/TranslationMovie/TranslationAddEdit';
import { storeFactory } from './../../../../Utils/index';

const setup = (props = {}, state = null) => {
    const store = storeFactory({});
    const wrapper = shallow(<TranslationAddEdit store={store} {...props} />).dive();
    if (state) wrapper.setState(state);
    return wrapper;
}

const initialProps = {
    handleChange: jest.fn(),
    onEditorValueChange: jest.fn(),
    handleMultiSelect: jest.fn(),
    handleCheckBox: jest.fn(),
    setSelectDataArr: jest.fn()
}

describe('<TranslationAddEdit />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup({...initialProps});
    });
    it('Should renders Translation Add Edit default', () => {
        expect(wrapper.exists()).toBe(true);
    });
    it('Should test fieldsData', () => {
        const fieldsData = {"name":"title","value":"epis","originalValue":"","type":"text","label":"Title","charCountLimit":250,"maxTextLength":300,"required":false,"text":false,"numeric":false,"errorMsg":null};
        wrapper.setProps({fieldsData});
    });
    it('Should test fieldsData for CastNcrew', () => {
        const fieldsData = [{"name":"actor","type":"text","maxTextLength":250,"value":"Akshay","label":"Actor","required":false,"keyText":"castName","text":false,"numeric":false,"isEditing":false,"isEditDisabled":false,"inherited":true,"id":"642ab8b4-3eb3-47f2-b34e-5d50ba50f5bb"},{"name":"character","value":"hero","type":"text","maxTextLength":250,"label":"Character","required":false,"text":false,"numeric":false,"errorMsg":null}];
        wrapper.setProps({fieldsData});
    });
});
