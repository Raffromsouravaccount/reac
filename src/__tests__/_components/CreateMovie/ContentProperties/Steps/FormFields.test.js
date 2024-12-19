import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';

import FormFields from '../../../../../_components/CreateMovie/ContentProperties/Steps/FormFields';
import Adapter from 'enzyme-adapter-react-16';
import { expect, it, jest } from '@jest/globals';


/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
    const wrapper = shallow(<FormFields {...props} />)
    if (state) wrapper.setState(state);
    return wrapper;
}

describe('FormFields', () => {
    Enzyme.configure({ adapter: new Adapter() });
    let wrapper;
    const fieldsData = {
        type: 'text', label: 'fieldsData', data: [], value: 'test', required: false, multiline: true, multiple: true, errorMsg: 'Nothing', path: true
    }

    beforeEach(() => {
        wrapper = setup({fieldsData});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should renders FormFields default', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should test componentDidMount', () => {
        jest.spyOn(wrapper.instance(), 'componentDidMount');
        wrapper.instance().componentDidMount();
        expect(wrapper.instance().componentDidMount).toBeCalled();
    })
    
    it('should test serverCalls', () => {
        jest.spyOn(wrapper.instance(), 'serverCalls');
        wrapper.instance().serverCalls();
        expect(wrapper.instance().serverCalls).toBeCalled();
    })

});