import React from 'react';
import { shallow, mount } from 'enzyme';
import TranslationStatus from './../../../../_components/Translation/Layout/TranslationStatus';

const setup = (props = {}, state = null) => {
    const wrapper = shallow(<TranslationStatus {...props} />);
    if (state) wrapper.setState(state);
    return wrapper;
}

const initialProps = {
    languageList: [
        {"castProfileId": null, "code": "ar", "isDone": true, "isLocked": null, "title": "Arabic", "selectedFromDialog": false, "translationStatus": 0}, 
        {"castProfileId": null, "code": "as", "isDone": false, "isLocked": null, "selectedFromDialog": true, "title": "Assamese", "translationStatus": 1}, 
        {"castProfileId": null, "code": "fr", "isDone": true, "isLocked": null, "selectedFromDialog": true, "title": "French", "translationStatus": 2}
    ],
    handleLanguageIcon: jest.fn(),
    onClick: jest.fn(),
};

describe('<TranslationStatus />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup({...initialProps});
    });
    it('Sholud render TranslationStatus', () => {
        expect(wrapper.exists()).toBe(true);
    });
});