import React from 'react';
import { shallow, mount } from 'enzyme';

import OtherLangModel from '../../../../_components/Common/Model/OtherLangModel'

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
const baseProps = {
    languageList : [
    { code: "ar", id: "14b29f2c-d179-400f-b524-d3a80248c8cc", title: "Arabic" },
    { code: "as", id: "7f7a0f2a-dae7-4535-bc56-86545d384268", title: "Assamese" },
    { code: "id", id: "1007afb0-65ea-4978-bd51-21b0f3b05c20", title: "Bahasa (Indonesia)" }
],  
    showBtn1: true, 
    showBtn2: true,
    btn2Action : jest.fn(),
    btn1Action : jest.fn(),
    selectLanguage: jest.fn()
}

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<OtherLangModel {...baseProps} />)
    return wrapper;
}

describe('OtherLangModel', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    })

    it('Should renders OtherLangModel default', () => {
        expect(wrapper.exists()).toBe(true);
    })

    it('should check onClick btn1Action ', () => {
        wrapper.find('#btn1ActionBtn').simulate('click');
        expect(baseProps.btn1Action).toHaveBeenCalled();
    })

    it('should check onClick btn2Action ', () => {
        wrapper.find('#btn2ActionBtn').simulate('click');
        expect(baseProps.btn2Action).toHaveBeenCalled();
    })
})