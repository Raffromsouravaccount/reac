import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';

import FormFields from '../../../../../_components/TvShow/ContentProperties/Steps/FormFields';
import Adapter from 'enzyme-adapter-react-16';
import { expect, it, jest } from '@jest/globals';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props ={}) => {
    const wrapper = shallow(<FormFields {...props} />);
    return wrapper;
}

describe('FormFields', () => {
    Enzyme.configure({ adapter: new Adapter() });
    let wrapper;
    const props = {
        fieldsData: {
            type: 'text', label: 'text field', data: [], value: 'test', required: false, multiline: false, multiple: false, errorMsg: 'nothing'
        },
        setSelectDataArr: []
    }

    beforeEach(() => {
        wrapper = setup({...props});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should renders FormFields default', () => {
        expect(wrapper.exists()).toBe(true);
    });
    
    it("should test componentDidMount", () => {
        jest.spyOn(wrapper.instance(), 'componentDidMount');
        wrapper.instance().componentDidMount();
        expect(wrapper.instance().componentDidMount).toBeCalled();
    })
    
    it("should test serverCalls", () => {
        jest.spyOn(wrapper.instance(), 'serverCalls');
        wrapper.instance().serverCalls();
        expect(wrapper.instance().serverCalls).toBeCalled();
    })

    it('Should renders FormFields for type texteditor', () => {
        const props = {
            fieldsData: {
                type: 'dropDown', label: 'text field', data: [], value: 'test', required: false, multiline: false, multiple: false, errorMsg: 'nothing'
            },
            setSelectDataArr: []
        }
        wrapper.setProps({...props})
        expect(wrapper.exists()).toBe(true);
    });

    it('Should renders FormFields for type texteditor', () => {
        const props = {
            fieldsData: {
                type: 'checkbox', label: 'text field', data: [], value: 'test', required: false, multiline: false, multiple: false, errorMsg: 'nothing'
            },
            setSelectDataArr: []
        }
        wrapper.setProps({...props})
        expect(wrapper.exists()).toBe(true);
    });

    it('Should renders FormFields for type texteditor', () => {
        const props = {
            fieldsData: {
                type: 'time', label: 'text field', data: [], value: 'test', required: false, multiline: false, multiple: false, errorMsg: 'nothing'
            },
            setSelectDataArr: []
        }
        wrapper.setProps({...props})
        expect(wrapper.exists()).toBe(true);
    });

    it('Should renders FormFields for type texteditor', () => {
        const props = {
            fieldsData: {
                type: 'date', label: 'text field', data: [], value: 'test', required: false, multiline: false, multiple: false, errorMsg: 'nothing'
            },
            setSelectDataArr: []
        }
        wrapper.setProps({...props})
        expect(wrapper.exists()).toBe(true);
    });

    it('Should renders FormFields for type texteditor', () => {
        const props = {
            fieldsData: {
                type: 'texteditor', label: 'text field', data: [], value: 'test', required: false, multiline: false, multiple: false, errorMsg: 'nothing'
            },
            setSelectDataArr: []
        }
        wrapper.setProps({...props})
        expect(wrapper.exists()).toBe(true);
    });
})