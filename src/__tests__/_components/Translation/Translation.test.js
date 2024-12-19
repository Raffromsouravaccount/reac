import React from 'react';
import { shallow, mount } from 'enzyme';
import { storeFactory } from '../../../Utils';

import Translation from './../../../_components/Translation/Translation';
import TranslationStatus from './../../../_components/Translation/Layout/TranslationStatus';
import OtherLangDialog from './../../../_components/Translation/Layout/OtherLangDialog';
import TranslationMovie from '../../../_components/Translation/TranslationMovie/TranslationMovie';
import LeftTab from './../../../_components/Common/LeftTab/CommonLeftTab';
import { CommonModel } from './../../../_components/Common/Model/CommonModel';
import TranslationCastProfile from './../../../_components/Translation/TranslationCastProfile/TranslationCastProfile';
import TranslationCollection from './../../../_components/Translation/TranslationCollection/TranslationCollection';
import TranslationTvshow from './../../../_components/Translation/TranslationTvshow/TranslationTvshow';
import { constantText } from './../../../_helpers/constants.text';
import TranslationVideo from './../../../_components/Translation/TranslationVideo/TranslationVideo';
import { translationService } from './../../../_services/translation.service';
import TranslationSeason from './../../../_components/Translation/TranslationSeason/TranslationSeason';
import TranslationEpisode from './../../../_components/Translation/TranslationEpisode/TranslationEpisode';


const setup = (initialState, props = {...matchProps}, state = null) => {
    const store = storeFactory(initialState);
    const wrapper = shallow(<Translation store={store} {...props} />).dive();
    if (state) wrapper.setState(state);
    return wrapper;
}

const initialState = {
    user_reducer: {
        userdetails: {
            translationLanguages: [
                {
                  "id": "7c59f385-57a4-4a04-ac7b-269ea2460abc",
                  "title": "Hindi",
                  "code": "hi"
                },
                {
                  "id": "eb4c9b92-0a9f-44fd-b4dd-f9e8f5628726",
                  "title": "French",
                  "code": "fr"
                }
            ],
        }
    }
};

const matchProps = {
    match:{
        params:{
            movieId: "5753e295-66e8-4a42-9f90-af14c3edadab"
        },
        url: "/movie/edit/5753e295-66e8-4a42-9f90-af14c3edadab/translation",
        path: "/movie/view/:movieId/translation",
    },
    location: {
        state: {
            language: [{title: 'Chinese', code: 'cr'}]
        }
    }
};

describe('<Translation />', () => {
    let wrapper;
    const userData = {
        userID: "d2fa1282-5f91-4231-a2b4-f308caf5afc6"
    };
    beforeEach(() => {
        wrapper = setup();
    });
    it('Should renders Translation default', () => {
        expect(wrapper.exists()).toBe(true);
    });
    it('Should get userID from localStorage', () => {
        Storage.prototype.getItem = jest.fn(() => userData.userID);
        const result = localStorage.getItem();
        expect(result).toEqual(userData.userID);
    });
    it('Sholud test componentDidMount', () => {
        const output = setup();
        const testComp = output.dive();
        const instance = testComp.instance();
        jest.spyOn(instance, 'componentDidMount');
        instance.componentDidMount();
        expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
    });
    it('Sholud test componentWillReceiveProps', () => {
        const nextProps = {
            userDetails: {...initialState.user_reducer.userdetails}
        };
        const userLanguages = nextProps.userDetails.translationLanguages;
        const translationPage = constantText.translations.pages.movie_text;
        const output = setup();
        const testComp = output.dive();
        const instance = testComp.instance();
        jest.spyOn(instance, 'componentWillReceiveProps');
        instance.componentWillReceiveProps(nextProps);
        expect(instance.componentWillReceiveProps).toHaveBeenCalledTimes(1);
        expect(nextProps.userDetails.translationLanguages).toBeTruthy();
        expect(translationService.permissionHandler(translationPage)?.edit()).toBeFalsy();
        expect(translationService.permissionHandler(translationPage)?.view()).toBeFalsy();
        expect(userLanguages.length > 0).toBeTruthy();
    });
    it('Sholud test onLangDialogClose', () => {
        const output = setup();
        const testComp = output.dive();
        const instance = testComp.instance();
        jest.spyOn(instance, 'onLangDialogClose');
        instance.onLangDialogClose();
        expect(instance.onLangDialogClose).toHaveBeenCalled();
    });
    it('Sholud test onLangDialogClose with langDialogSubmit', () => {
        const langDialogSubmit = true;
        const showLangDialog = true;
        const selectedLangTab = 0;
        const languageList = [{title: 'German', code: 'gr', selectedFromDialog: true}];
        const output = setup();
        const testComp = output.dive();
        const instance = testComp.instance();
        testComp.setState({selectedLangTab});
        jest.spyOn(instance, 'onLangDialogClose');
        instance.onLangDialogClose(showLangDialog, langDialogSubmit, languageList);
        expect(instance.onLangDialogClose).toHaveBeenCalled();
    });
    it('Sholud test other-lang-btn onClick', () => {
        const output = setup();
        const testComp = output.dive();
        const instance = testComp.instance();
        const spy = jest.spyOn(instance, 'onLangDialogClose');
        instance.forceUpdate();
        testComp.update();
        const button = testComp.find('.other-lang-btn');
        button.simulate('click');
        expect(spy).toHaveBeenCalled();
    });
    it('Sholud test handleRoute', () => {
        const showLanguageList = true;
        const permissionAddEdit = true;
        const output = setup();
        const testComp = output.dive();
        const instance = testComp.instance();
        testComp.setState({showLanguageList, permissionAddEdit});
        jest.spyOn(instance, 'handleRoute');
        instance.handleRoute();
        expect(instance.handleRoute).toHaveBeenCalled();
        expect(testComp.state('permissionAddEdit')).toBeTruthy();
        expect(testComp.state('showLanguageList')).toBeTruthy();
    });
    it('Sholud test handleRoute onClick', () => {
        const output = setup();
        const testComp = output.dive();
        const instance = testComp.instance();
        const spy = jest.spyOn(instance, 'handleRoute');
        instance.forceUpdate();
        testComp.update();
        const button = testComp.find('.back-user-btn > span');
        button.simulate('click');
        expect(spy).toHaveBeenCalled();
    });
    it('Sholud test handleLangTab', () => {
        const output = setup();
        const testComp = output.dive();
        const instance = testComp.instance();
        const selectedLangTab = testComp.state('selectedLangTab');
        jest.spyOn(instance, 'handleLangTab');
        instance.handleLangTab(selectedLangTab);
        expect(instance.handleLangTab).toHaveBeenCalled();
    });
    it('Sholud test onNavToAssignedLang', () => {
        const output = setup();
        const testComp = output.dive();
        const instance = testComp.instance();
        jest.spyOn(instance, 'onNavToAssignedLang');
        instance.onNavToAssignedLang();
        expect(instance.onNavToAssignedLang).toHaveBeenCalled();
    });
    it('Sholud test onNavToAssignedLang onClick', () => {
        const userLanguages = [{title: 'Hindi', code: 'hi'}];
        const output = setup();
        const testComp = output.dive();
        const instance = testComp.instance();
        testComp.setState({showNavToAssignedLang: true, userLanguages});
        const spy = jest.spyOn(instance, 'onNavToAssignedLang');
        instance.forceUpdate();
        testComp.update();
        expect(testComp.state('showNavToAssignedLang')).toBeTruthy();
        expect(testComp.state('userLanguages')?.length).toBeGreaterThanOrEqual(0);
        const button = testComp.find('.back-arrow-assign-lang');
        button.simulate('click');
        expect(spy).toHaveBeenCalled();
    });
    it('Sholud render getAssignedLanguages', () => {
        const showLanguageList = false;
        const userLanguages = [{title: 'Hindi', code: 'hi'}];
        const output = setup();
        const testComp = output.dive();
        const instance = testComp.instance();
        jest.spyOn(instance, 'getAssignedLanguages');
        testComp.setState({showLanguageList, userLanguages});
        expect(testComp.state('showLanguageList')).toBeFalsy();
        expect(testComp.state('userLanguages')).toHaveLength(1);
        instance.getAssignedLanguages();
        expect(instance.getAssignedLanguages).toHaveBeenCalled();
    });
    it('Sholud test onLanguageSelectionFromStatusView', () => {
        const output = setup();
        const testComp = output.dive();
        const instance = testComp.instance();
        jest.spyOn(instance, 'onLanguageSelectionFromStatusView');
        instance.onLanguageSelectionFromStatusView();
        expect(instance.onLanguageSelectionFromStatusView).toHaveBeenCalled();
    });
    it('Sholud test updateMarkAsDoneAction', () => {
        const output = setup();
        const testComp = output.dive();
        const instance = testComp.instance();
        jest.spyOn(instance, 'updateMarkAsDoneAction');
        instance.updateMarkAsDoneAction();
        expect(instance.updateMarkAsDoneAction).toHaveBeenCalled();
    });
    it('Sholud test getLangIcon', () => {
        const langIcons = constantText.langIcons;
        const output = setup();
        const testComp = output.dive();
        const instance = testComp.instance();
        testComp.setState({langIcons});
        jest.spyOn(instance, 'getLangIcon');
        const lang = {title: 'Hindi'};
        instance.getLangIcon(lang);
        expect(instance.getLangIcon).toHaveBeenCalledWith(lang);
    });
    it('Sholud render Common Model', () => {
        const markAsDoneDialogShow = true;
        const output = setup();
        const testComp = output.dive();
        testComp.setState({markAsDoneDialogShow});
        expect(testComp.state('markAsDoneDialogShow')).toBeTruthy();
        expect(testComp.containsMatchingElement(<CommonModel />)).toBe(true);
    });
    it('Should renders Translation Status', () => {
        const showLanguageList = true;
        const permissionViewOnly = true;
        const output = setup();
        const testComp = output.dive();
        testComp.setState({showLanguageList, permissionViewOnly})
        expect(testComp.state('showLanguageList')).toBeTruthy();
        expect(testComp.state('permissionViewOnly')).toBeTruthy();
        expect(testComp.containsMatchingElement(<TranslationStatus />)).toBe(true);
    });
    it('Should renders OtherLangDialog', () => {
        const showLangDialog = true;
        const output = setup();
        const testComp = output.dive();
        testComp.setState({showLangDialog})
        expect(testComp.state('showLangDialog')).toBeTruthy();
        expect(testComp.containsMatchingElement(<OtherLangDialog />)).toBe(true);
    });
    it('Should renders LeftTab', () => {
        const showLanguageList = false;
        const output = setup();
        const testComp = output.dive();
        testComp.setState({showLanguageList});
        expect(testComp.state('showLanguageList')).toBeFalsy();
        expect(testComp.containsMatchingElement(<LeftTab />)).toBe(true);
    });
    it('Should renders TranslationMovie Component', () => {
        const translationPage = constantText.translations.pages.movie_text;
        const languages = ['hi'];
        const showLanguageList = false;
        const output = setup();
        const testComp = output.dive();
        testComp.setState({translationPage, languages, showLanguageList});
        expect(testComp.state('showLanguageList')).toBeFalsy();
        expect(testComp.state('translationPage')).toEqual('movie');
        expect(testComp.state('languages')).toHaveLength(1);
        expect(testComp.containsMatchingElement(<TranslationMovie />)).toBe(true);
    });
    it('Should renders TranslationCastProfile Component', () => {
        const translationPage = constantText.translations.pages.cast_text;
        const languages = ['hi'];
        const showLanguageList = false;
        const output = setup();
        const testComp = output.dive();
        testComp.setState({translationPage, languages, showLanguageList});
        expect(testComp.state('showLanguageList')).toBeFalsy();
        expect(testComp.state('translationPage')).toEqual('cast');
        expect(testComp.state('languages')).toHaveLength(1);
        expect(testComp.containsMatchingElement(<TranslationCastProfile />)).toBe(true);
    });
    it('Should renders TranslationCollection Component', () => {
        const translationPage = constantText.translations.pages.collection_text;
        const languages = ['hi'];
        const showLanguageList = false;
        const output = setup();
        const testComp = output.dive();
        testComp.setState({translationPage, languages, showLanguageList});
        expect(testComp.state('showLanguageList')).toBeFalsy();
        expect(testComp.state('translationPage')).toEqual('collection');
        expect(testComp.state('languages')).toHaveLength(1);
        expect(testComp.containsMatchingElement(<TranslationCollection />)).toBe(true);
    });
    it('Should renders TranslationTvshow Component', () => {
        const translationPage = constantText.translations.pages.tvshow_text;
        const languages = ['hi'];
        const showLanguageList = false;
        const output = setup();
        const testComp = output.dive();
        testComp.setState({translationPage, languages, showLanguageList});
        expect(testComp.state('showLanguageList')).toBeFalsy();
        expect(testComp.state('translationPage')).toEqual('tvshow');
        expect(testComp.state('languages')).toHaveLength(1);
        expect(testComp.containsMatchingElement(<TranslationTvshow />)).toBe(true);
    });
    it('Should renders TranslationVideo Component', () => {
        const translationPage = constantText.translations.pages.video_text;
        const languages = ['hi'];
        const showLanguageList = false;
        const output = setup();
        const testComp = output.dive();
        testComp.setState({translationPage, languages, showLanguageList});
        expect(testComp.state('showLanguageList')).toBeFalsy();
        expect(testComp.state('translationPage')).toEqual('video');
        expect(testComp.state('languages')).toHaveLength(1);
        expect(testComp.containsMatchingElement(<TranslationVideo />)).toBe(true);
    });
    it('Should renders TranslationSeason Component', () => {
        const translationPage = constantText.translations.pages.season_text;
        const languages = ['hi'];
        const showLanguageList = false;
        const output = setup();
        const testComp = output.dive();
        testComp.setState({translationPage, languages, showLanguageList});
        expect(testComp.state('showLanguageList')).toBeFalsy();
        expect(testComp.state('translationPage')).toEqual('season');
        expect(testComp.state('languages')).toHaveLength(1);
        expect(testComp.containsMatchingElement(<TranslationSeason />)).toBe(true);
    });
    it('Should renders TranslationEpisode Component', () => {
        const translationPage = constantText.translations.pages.episode_text;
        const languages = ['hi'];
        const showLanguageList = false;
        const output = setup();
        const testComp = output.dive();
        testComp.setState({translationPage, languages, showLanguageList});
        expect(testComp.state('showLanguageList')).toBeFalsy();
        expect(testComp.state('translationPage')).toEqual('episode');
        expect(testComp.state('languages')).toHaveLength(1);
        expect(testComp.containsMatchingElement(<TranslationEpisode />)).toBe(true);
    });
});
