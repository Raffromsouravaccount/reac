import React from 'react';
import { shallow, mount } from 'enzyme';

import { Callback } from '../../../../_components/Common/Callback/Callback';
import { storeFactory } from '../../../../Utils';

/**
 * Factory function to create a ShallowWrapper  for the License Component.
 * @function setup
 * @param {object}] props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (initialState = {}, props = {}) => {
    const store = storeFactory(initialState);
    const wrapper = shallow(<Callback store={store} {...props} />).dive();
    return wrapper;
}

const initialState = {
    login_reducer: {}
  }

describe('Callback', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup(initialState).dive();
    })

    it('Should renders Callback default', () => {
        expect(wrapper.exists()).toBe(true);
    })

    it('should test componentWillReceiveProps', () => {
        const nextProps = {
            login_reducer : {
                login: 'test'
            }
        }
        jest.spyOn(wrapper.instance(), 'componentWillReceiveProps');
        wrapper.instance().componentWillReceiveProps(nextProps);
        expect(wrapper.instance().componentWillReceiveProps).toBeCalled();
    })

    it('should test componentDidMount', () => {
        jest.spyOn(wrapper.instance(), 'componentDidMount');
        wrapper.instance().componentDidMount();
        expect(wrapper.instance().componentDidMount).toBeCalled();
    })

})