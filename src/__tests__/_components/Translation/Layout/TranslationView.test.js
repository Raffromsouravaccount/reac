import React from 'react';
import { shallow, mount } from 'enzyme';
import TranslationView from './../../../../_components/Translation/Layout/TranslationView';

const setup = (props = {}, state = null) => {
    const wrapper = shallow(<TranslationView {...props} />);
    if (state) wrapper.setState(state);
    return wrapper;
}

const initialProps = {
    labelAndValue: {
        "label": "Cast Type", "value": "Background Score, Choreographer"
    }
};

describe('<TranslationView />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup({...initialProps});
    });
    it('Sholud render TranslationView', () => {
        expect(wrapper.exists()).toBe(true);
    });
});