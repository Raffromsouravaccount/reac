import React from 'react';
import { shallow } from 'enzyme';

import { LoginPage } from '../../../_components/LoginPage/LoginPage';
import { storeFactory, findByTestAttr } from '../../../Utils';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (initialState = {}, props = {}, state = {}) => {
    const store = storeFactory(initialState);
    const wrapper = shallow(<LoginPage store={store} {...props} />).dive();
    return wrapper;
}

const initialState = {}

describe('CreateProfile', () => {
    let wrapper;
    let wrapperInstance;
    beforeEach(() => {
        wrapper = setup(initialState);
        wrapperInstance = wrapper.dive();
    });

    it('Should renders LoginPage default', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should check componentDidMount', () => {
        jest.spyOn(wrapperInstance.instance(), 'componentDidMount');
        wrapperInstance.instance().componentDidMount();
        expect(wrapperInstance.instance().componentDidMount).toBeCalled();
    })
    
    it('should check handleADFSLogin', () => {
        jest.spyOn(wrapperInstance.instance(), 'handleADFSLogin');
        wrapperInstance.instance().handleADFSLogin();
        expect(wrapperInstance.instance().handleADFSLogin).toBeCalled();
    })
    
    it('should check handleGoogleLogin', () => {
        jest.spyOn(wrapperInstance.instance(), 'handleGoogleLogin');
        wrapperInstance.instance().handleGoogleLogin();
        expect(wrapperInstance.instance().handleGoogleLogin).toBeCalled();
    })

});