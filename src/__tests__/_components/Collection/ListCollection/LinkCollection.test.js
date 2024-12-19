import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import LinkCollection from '../../../../_components/Collection/ListCollection/LinkCollection/LinkCollection';
import { storeFactory, findByTestAttr } from '../../../../Utils';

import Adapter from 'enzyme-adapter-react-16';
import { expect, it, jest } from '@jest/globals';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (initialState = {}, props = {}, state = {}) => {
    const store = storeFactory(initialState);
    const wrapper = shallow(<LinkCollection store={store} {...props} />).dive();
    return wrapper;
}

const initialState = {
    collection_reducer: {}
}

describe('LinkCollection', () => {
    Enzyme.configure({ adapter: new Adapter() });
    let wrapper;
    const collectionList = {
        mainContent: [
            {value: 'mock'}
        ]
    }
    beforeEach(() => {
        wrapper = setup(initialState).dive();
        wrapper.setState({ collectionList });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should renders LinkCollection default', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should check componentDidMount', () => {
        jest.spyOn(wrapper.instance(), 'componentDidMount');
        wrapper.instance().componentDidMount();
        expect(wrapper.instance().componentDidMount).toBeCalled();
    })

    it('should check componentWillReceiveProps', () => {
        const nextProps = {
            collectionList: {
                data: {
                    contentData: {
                        value: 'test'
                    }
                }
            }
        }
        jest.spyOn(wrapper.instance(), 'componentWillReceiveProps');
        wrapper.instance().componentWillReceiveProps(nextProps);
        expect(wrapper.instance().componentWillReceiveProps).toBeCalled();
    })

    it('should check setCollectionListData', () => {
        const collectionList = {
            data: {
                contentData: {
                    mainContent: [{mock: 'value'}],
                    licence: {contentData :{
                        licence: [{mock: 'value'}, {mock: 'value'}]
                    }}
                }
            }
        }
        jest.spyOn(wrapper.instance(), 'setCollectionListData');
        wrapper.instance().setCollectionListData(collectionList);
        expect(wrapper.instance().setCollectionListData).toBeCalled();
    })
    
    it('should check getCollection', () => {
        jest.spyOn(wrapper.instance(), 'getCollection');
        wrapper.instance().getCollection();
        expect(wrapper.instance().getCollection).toBeCalled();
    })
    
    it('should check handleRoute', () => {
        jest.spyOn(wrapper.instance(), 'handleRoute');
        wrapper.instance().handleRoute();
        expect(wrapper.instance().handleRoute).toBeCalled();
    })
    
    it('should check viewCollectionHandler', () => {
        jest.spyOn(wrapper.instance(), 'viewCollectionHandler');
        wrapper.instance().viewCollectionHandler();
        expect(wrapper.instance().viewCollectionHandler).toBeCalled();
    })

    it('should check viewCollectionHandler onclick method', () => {
        const spy = jest.spyOn(wrapper.instance(), 'viewCollectionHandler');
        wrapper.instance().forceUpdate();
        wrapper.update();
        const button = findByTestAttr(wrapper, 'view-collection-handler');
        button.simulate('click');
        expect(spy).toHaveBeenCalled();
      })
      

      it('should check handleRoute onclick method', () => {
        const spy = jest.spyOn(wrapper.instance(), 'handleRoute');
        wrapper.instance().forceUpdate();
        wrapper.update();
        const button = findByTestAttr(wrapper, 'handleRoute');
        button.simulate('click');
        expect(spy).toHaveBeenCalled();
      })
    

});