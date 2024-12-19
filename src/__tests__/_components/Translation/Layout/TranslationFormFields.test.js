import React from 'react';
import { shallow, mount } from 'enzyme';
import { storeFactory } from './../../../../Utils';
import TranslationFormFields from './../../../../_components/Translation/Layout/TranslationFormFields';

const setup = (props = {}, state = null) => {
    const store = storeFactory ({});
    const wrapper = shallow(<TranslationFormFields store={store} {...props} />).dive();
    if (state) wrapper.setState(state);
    return wrapper;
}

const initialProps = {
    fieldsData: {
        "alphabetOnly": false,
        "isEditing": true,
        "label": "Profile Name",
        "maxTextLength": 250,
        "minTextLength": 0,
        "name": "castName",
        "numeric": false,
        "required": false,
        "text": false,
        "type": "text",
        "value": "trans1",
    }
};

describe('<TranslationFormFields />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup({...initialProps});
    });
    it('Sholud render TranslationFormFields', () => {
        expect(wrapper.exists()).toBe(true);
    });
    it('Should render componentDidMount', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'componentDidMount');
        instance.componentDidMount();
        expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
    });
    it('Should render textEditor', () => {
        const data = {
            fieldsData :{
            "alphabetOnly": false,
            "isEditing": true,
            "label": "Profile Bio",
            "maxTextLength": 250,
            "minTextLength": 0,
            "name": "castProfileBio",
            "numeric": false,
            "required": false,
            "text": false,
            "type": "texteditor",
            "value": "trans1",
            }
        }
        setup({...data});
    });
    it('Should render dropdown', () => {
        const data = {
            fieldsData :{
                "name": "castTag",
                "label": "Tag/Badge",
                "type": "dropDown",
                "path": "/master/TagBadge",
                "data": [],
                "keyText": "title",
                "value": ["hello"],
                "multiple": true,
                "required": false,
                "isEditing": false,
                "isEditDisabled": true
            }
        }
        setup({...data});
    });
    it('Should render serverCalls', () => {
        const name = 'aba';
        const url = '/master/MovieThematicGenre';
        const instance = wrapper.instance();
        jest.spyOn(instance, 'serverCalls');
        instance.serverCalls(name, url);
        expect(instance.serverCalls).toHaveBeenCalled();
    });
});