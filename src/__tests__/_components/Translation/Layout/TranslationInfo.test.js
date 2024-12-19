import React from 'react';
import { shallow, mount } from 'enzyme';
import TranslationInfo from './../../../../_components/Translation/Layout/TranslationInfo';
import { constantText } from '../../../../_helpers/constants.text';

const setup = (props = {}, state = null) => {
    const wrapper = shallow(<TranslationInfo {...props} />);
    if (state) wrapper.setState(state);
    return wrapper;
}

const initialProps = {
    sections: constantText.translations.tvshow_sections,
    selectedSecTab: 0,
    status: 0,
    permissionAddEdit: true,
};

describe('<TranslationInfo />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup({...initialProps});
    });
    it('Sholud render TranslationInfo', () => {
        expect(wrapper.exists()).toBe(true);
    });
    it('Should check for castProfile and status 1', () => {
        const status = 1;
        const sections = constantText.translations.castProfile_sections;
        setup({...initialProps, status, sections});
    });
    it('Should check for status 2', () => {
        const status = 2;
        setup({...initialProps, status});
    });
});