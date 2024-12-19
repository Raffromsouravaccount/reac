import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import PublishedHistoryCollection from '../../../../_components/Collection/PublishHistory/Published_HistoryCollection';
import { findByTestAttr } from '../../../../Utils';
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
    const wrapper = shallow(<PublishedHistoryCollection {...props} />)
    if (state) wrapper.setState(state);
    return wrapper;
}

describe('PublishedHistoryCollection', () => {
    Enzyme.configure({ adapter: new Adapter() });
    let wrapper;
    let instance;
    const props = {
        match: {
            params: {
                id: 'xyz123'
            }
        },
        state: 'view'
    }
    const state = {
        content_obj: {
            createdAt: "2021-02-15T13:07:39.161Z", createdBy: {first_name: "Sandeep", last_name: "Kumar"},
            lastModifiedBy: {first_name: "Sandeep", last_name: "Kumar"}, lastModifiedOn: "2021-02-15T13:07:39.159Z"
        }
    }
    beforeEach(() => {
        wrapper = setup();
        instance = wrapper.instance();
        wrapper.setProps({ ...props });
        wrapper.setState({ ...state });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should renders PublishedHistoryCollection default', () => {
        expect(wrapper.exists()).toBe(true);
    });
    
    it('should test handleRoute method', () => {
        jest.spyOn(instance, 'handleRoute');
        instance.handleRoute();
        expect(instance.handleRoute).toBeCalled();
    })
    
    it('should test handleBack method', () => {
        jest.spyOn(instance, 'handleBack');
        instance.handleBack();
        expect(instance.handleBack).toBeCalled();
    })
    
    it('should test componentDidMount method', () => {
        jest.spyOn(instance, 'componentDidMount');
        instance.componentDidMount();
        expect(instance.componentDidMount).toBeCalled();
    })
    
    it('should test getCollectionData method', () => {
        jest.spyOn(instance, 'getCollectionData');
        instance.getCollectionData();
        expect(instance.getCollectionData).toBeCalled();
    })

    it('should check handleRoute onclick method for edit', () => {
        const spy = jest.spyOn(wrapper.instance(), 'handleRoute');
        wrapper.instance().forceUpdate();
        wrapper.update();
        const button = findByTestAttr(wrapper, 'handleRoute');
        button.simulate('click');
        expect(spy).toHaveBeenCalled();
      })

      it('should check handleRoute onclick method', () => {
        const spy = jest.spyOn(wrapper.instance(), 'handleRoute');
        wrapper.instance().forceUpdate();
        wrapper.update();
        const button = findByTestAttr(wrapper, 'handle-route');
        button.simulate('click');
        expect(spy).toHaveBeenCalled();
      })

      it('should check handleRoute onclick method for view ', () => {
        wrapper.setState({state: 'view' });
        const spy = jest.spyOn(wrapper.instance(), 'handleRoute');
        wrapper.instance().forceUpdate();
        wrapper.update();
        const button = findByTestAttr(wrapper, 'view-handleRoute');
        button.simulate('click');
        expect(spy).toHaveBeenCalled();
      })

      it('should check handleBack onclick method ', () => {
        const spy = jest.spyOn(wrapper.instance(), 'handleBack');
        wrapper.instance().forceUpdate();
        wrapper.update();
        const button = findByTestAttr(wrapper, 'handleBack');
        button.simulate('click');
        expect(spy).toHaveBeenCalled();
      })
});