import React from 'react';
import { shallow } from 'enzyme';
import { storeFactory } from '../../../../../Utils';
import AddCollections from '../../../../../_components/Season/CreateSeason/CollectionAssignment/AddCollections/AddCollections';

const setup = (initialstate = {}, props = { contentIdKey: 'movieId' }) => {
    const store = storeFactory(initialstate);
    const wrapper = shallow(<AddCollections store={store} {...props} />).dive();
    return wrapper;
}
const initialState = {
    collection_reducer: {}
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