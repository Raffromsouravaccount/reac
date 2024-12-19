import React from 'react';
import { shallow } from 'enzyme';


import { storeFactory } from '../../../../Utils';
import AddAssets from '../../../../_components/Collection/CreateCollection/AssignAssets/AddAssets/AddAssets';

const setup = (initialstate = {}, props = { contentIdKey: 'movieId', meta: { name: 'movies' } }) => {
    const store = storeFactory(initialstate);
    const wrapper = shallow(<AddAssets store={store} {...props} />).dive();
    return wrapper;
}
const initialState = {
    collection_reducer: {},
    movieMgmt_reducer: {}
}

describe('render', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup(initialState);
    })
    it('render component without error', () => {
        expect(wrapper.exists()).toBe(true);
    })
    it('should contains props', () => {
        const output = setup(initialState);
        const testComp = output.dive().instance();
        expect(testComp.props.contentIdKey).toBe('movieId');
    })
})
