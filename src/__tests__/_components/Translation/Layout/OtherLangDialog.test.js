import React from 'react';
import { shallow, mount } from 'enzyme';
import OtherLangDialog from '../../../../_components/Translation/Layout/OtherLangDialog';
import { storeFactory } from './../../../../Utils';

const setup = (props = {}, state = null) => {
    const store = storeFactory ({});
    const wrapper = shallow(<OtherLangDialog store={store} {...props} />).dive();
    if (state) wrapper.setState(state);
    return wrapper;
}

const initialProps = {
    languageList: [
        {"castProfileId": null, "code": "ar", "isDone": null, "isLocked": null, "title": "Arabic", "selectedFromDialog": false, "translationStatus": 0}, 
        {"castProfileId": null, "code": "as", "isDone": null, "isLocked": null, "selectedFromDialog": true, "title": "Assamese", "translationStatus": 1}, 
        {"castProfileId": null, "code": "fr", "isDone": null, "isLocked": null, "selectedFromDialog": true, "title": "French", "translationStatus": 2}
    ],
    languages: [
        {"code": "hi","id": "7c59f385-57a4-4a04-ac7b-269ea2460abc", "label": "Hindi", "title": "Hindi"}, 
        {"id": "86e0e39c-6e0e-4f30-9400-f771ba0e503c", "title": "German", "code": "de", "label": "German"}
    ]
};

describe('<OtherLangDialog />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup({...initialProps});
    });
    it('Sholud render OtherLangDialog', () => {
        expect(wrapper.exists()).toBe(true);
    });
    it('Should render componentDidMount', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'componentDidMount');
        instance.componentDidMount();
        expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
    });
    it('Should render onLanguageSelectionFromDialog', () => {
        const index = 0;
        wrapper.setState({languageList: initialProps.languageList})
        const instance = wrapper.instance();
        jest.spyOn(instance, 'onLanguageSelectionFromDialog');
        instance.onLanguageSelectionFromDialog(index);
        expect(instance.onLanguageSelectionFromDialog).toHaveBeenCalledTimes(1);
    });
});