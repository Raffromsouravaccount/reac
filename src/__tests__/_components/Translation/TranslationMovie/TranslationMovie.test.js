import React from 'react';
import { shallow, mount } from 'enzyme';
import moxios from "moxios";
import axios from "../../../../_helpers/axiosInstance";
import TranslationMovie from './../../../../_components/Translation/TranslationMovie/TranslationMovie';
import TranslationInfo from './../../../../_components/Translation/Layout/TranslationInfo';
import { constantText } from '../../../../_helpers/constants.text';
import { CommonModel } from './../../../../_components/Common/Model/CommonModel';
import { apiCalls } from '../../../../_services/common.service';
import Config from "../../../../Config/config";
import { translationService } from '../../../../_services/translation.service';
import MovieCastNCrewJson from "../../../../_components/Translation/Schema/Movie/CastNCrew.json";

const setup = (props = {}, state = null) => {
    const wrapper = shallow(<TranslationMovie {...props} />)
    if (state) wrapper.setState(state);
    return wrapper;
}
const initialState = {
    params:{
        movieId: "5753e295-66e8-4a42-9f90-af14c3edadab"
    },
    showNavToAssignedLang: false,
    language: {
        code: 'hi'
    }
}

describe('<TranslationMovie />', () => {
    let wrapper;
    const userData = {
        userID: "d2fa1282-5f91-4231-a2b4-f308caf5afc6"
    };
    beforeEach(() => {
        moxios.install(axios);
        wrapper = setup({}, {...initialState});
    });
    afterEach(() => {
        moxios.uninstall(axios);
        jest.clearAllMocks();
    });
    it('Should renders Translation Movie default', () => {
        expect(wrapper.exists()).toBe(true);
    });
    it('Should get userID from localStorage', () => {
        Storage.prototype.getItem = jest.fn(() => userData.userID);
        const result = localStorage.getItem();
        expect(result).toEqual(userData.userID);
    });
    it('Sholud test componentDidMount', () => {
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'componentDidMount');
        instance.componentDidMount();
        expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
    });
    it('Sholud test componentWillReceiveProps', () => {
        const nextProps = {language: {code: 'gr'}, showNavToAssignedLang: true};
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'componentWillReceiveProps');
        instance.componentWillReceiveProps(nextProps);
        expect(instance.componentWillReceiveProps).toHaveBeenCalledTimes(1);
        expect(String(wrapper.state('language')?.code)).toBe(String(nextProps?.language?.code));
    });
    it('should test fetchContentData with defaultData', async () => {
        const response = {"status":200,"message":"Movie translation data has been successfully fetched.","data":[{"primaryGenre":null,"secondaryGenre":null,"thematicGenre":null,"settingGenre":null,"subtype":null,"contentVersion":null,"audioLanguages":null,"primaryLanguage":null,"dubbedLanguageTitle":null,"originalLanguage":null,"subtitleLanguages":null,"categories":null,"certification":null,"contentGrade":null,"contentLanguage":null,"rcsCategory":null}],"error":null}
        const wrapper = setup({}, {...initialState});
        const movieId = initialState.params.movieId;
        const sections = constantText.translations.movie_sections;
        const isDefaultData = true;
        const lang = isDefaultData ? String(Config.defaultLanguageCode) : String('hi');
        const mock = jest.fn().mockReturnValue(response);
        translationService.get_movie_details = mock;
        const result = await translationService.get_movie_details(movieId, lang, sections[wrapper.state('selectedSecTab')].url);
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'fetchContentData'); 
        instance.fetchContentData(true);
        expect(instance.fetchContentData).toHaveBeenCalledWith(true);
        expect(result).toBe(response);
    });
    it('should test fetchContentData with defaultData for castAndCrew', async () => {
        const response = {"status":200,"message":"Movie translation data has been successfully fetched.","data":[{"primaryGenre":null,"secondaryGenre":null,"thematicGenre":null,"settingGenre":null,"subtype":null,"contentVersion":null,"audioLanguages":null,"primaryLanguage":null,"dubbedLanguageTitle":null,"originalLanguage":null,"subtitleLanguages":null,"categories":null,"certification":null,"contentGrade":null,"contentLanguage":null,"rcsCategory":null}],"error":null};
        const mappedDataObj = {
            "actors":[
                [{ "id": "fbfac2d7-53de-44ff-9d06-d6ea798a9678", "isEditing": false, "keyText": "castName","label": "Actor","maxTextLength": 250,"name": "actor","numeric": false,"required": false,"text": false,"type": "text","value": "Akshay Kumar"},
                {"isEditing": true,"label": "Character","maxTextLength": 250,"name": "character","numeric": false,"required": false,"text": false,"type": "text","value": ""}]
            ]
        };
        const wrapper = setup({}, {...initialState, selectedSecTab: 1, fields: JSON.parse(JSON.stringify(MovieCastNCrewJson))});
        const movieId = initialState.params.movieId;
        const sections = constantText.translations.movie_sections;
        const isDefaultData = true;
        const lang = isDefaultData ? String(Config.defaultLanguageCode) : String('hi');
        const mock = jest.fn().mockReturnValue(response);
        translationService.get_movie_details = mock;
        const result = await translationService.get_movie_details(movieId, lang, sections[wrapper.state('selectedSecTab')].url);
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'fetchContentData'); 
        instance.fetchContentData(true);
        const mockActor = jest.fn().mockReturnValue(mappedDataObj);
        translationService.mapCastAndCrewValues = mockActor;
        const resultActor = translationService.mapCastAndCrewValues(response, wrapper.state('fields'));
        expect(instance.fetchContentData).toHaveBeenCalledWith(true);
        expect(sections[wrapper.state('selectedSecTab')].url).toBe('castAndCrew');
        expect(result).toBe(response);
        expect(resultActor).toBe(mappedDataObj);
    });
    it('should test fetchContentData when translation not started yet', async () => {
        const response = {"anchormans":[{"id":"3cea4d09-495c-43df-ad9b-b25a89c80c4a","castName":"testt"}],"singers":[{"id":"b3848066-859b-45bd-bba1-95379d841511","castName":"Ranveer Singh"}],"judges":[{"id":"cd4aa0be-215a-448f-bb8a-fd1e8b4d00d9","castName":"Salman Khan"},{"id":"2a668010-e5a1-4b55-a5a0-fe72983672f3","castName":"Testting"},{"id":"3cea4d09-495c-43df-ad9b-b25a89c80c4a","castName":"testt"}],"actors":[[{"name":"actor","type":"text","maxTextLength":250,"value":"Akshay Kumar","label":"Actor","required":false,"keyText":"castName","text":false,"numeric":false,"isEditing":false,"isEditDisabled":false,"id":"e199cd8b-33f5-426f-bce0-06f7e21b7afa"},{"name":"character","value":"hero","type":"text","maxTextLength":250,"label":"Character","required":false,"text":false,"numeric":false,"isEditing":false,"isEditDisabled":false}],[{"name":"actor","type":"text","maxTextLength":250,"value":"New Actor","label":"Actor","required":false,"keyText":"castName","text":false,"numeric":false,"isEditing":false,"isEditDisabled":false,"id":null},{"name":"character","value":"new","type":"text","maxTextLength":250,"label":"Character","required":false,"text":false,"numeric":false,"isEditing":false,"isEditDisabled":false}]]};
        const res = null;
        const movieId = initialState.params.movieId;
        const sections = constantText.translations.movie_sections;
        const wrapper = setup({}, {...initialState, defaultData: response, selectedSecTab: 1, fields: JSON.parse(JSON.stringify(MovieCastNCrewJson))});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'fetchContentData'); 
        instance.fetchContentData(false);
        const mock = jest.fn().mockReturnValue(res);
        translationService.get_movie_details = mock;
        const result = await translationService.get_movie_details(movieId, 'en', sections[wrapper.state('selectedSecTab')].url);
        expect(instance.fetchContentData).toHaveBeenCalledWith(false);
        expect(result).toBe(res);
    });
    it('should test updateValues', () => {
        const resData = [{'title': "cc"}];
        const isDefaultData = false;
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'updateValues');
        instance.updateValues(resData);
        expect(isDefaultData).toBeFalsy();
        expect(instance.updateValues).toHaveBeenCalledTimes(1);
    });
    it('should test updateValues for castNcrew', () => {
        const response = {"actor":[{"id":"fbfac2d7-53de-44ff-9d06-d6ea798a9678","castName":"Akshay Kumar","character":null}],"42c1e2b7-0578-4e5f-b805-c2601fddee28":[{"id":"76b29a7b-b865-4033-85cf-04b29bb3d667","castName":"Priyeshwar"}],"72dab561-6c03-4634-ab6f-f5268f716211":[{"id":"859790c5-2cb0-4b19-ab03-72c348648b0f","castName":"aviis"}]};
        const mappedDataObj = {
            "actors":[
                [{ "id": "fbfac2d7-53de-44ff-9d06-d6ea798a9678", "isEditing": false, "keyText": "castName","label": "Actor","maxTextLength": 250,"name": "actor","numeric": false,"required": false,"text": false,"type": "text","value": "Akshay Kumar"},
                {"isEditing": true,"label": "Character","maxTextLength": 250,"name": "character","numeric": false,"required": false,"text": false,"type": "text","value": ""}]
            ]
        };
        const isDefaultData = false;
        const wrapper = setup({}, {...initialState, selectedSecTab: 1, fields: JSON.parse(JSON.stringify(MovieCastNCrewJson))});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'updateValues');
        instance.updateValues(response);
        const mockActor = jest.fn().mockReturnValue(mappedDataObj);
        translationService.mapCastAndCrewValues = mockActor;
        const resultActor = translationService.mapCastAndCrewValues(response, wrapper.state('fields'));
        expect(isDefaultData).toBeFalsy();
        expect(instance.updateValues).toHaveBeenCalledTimes(1);
        expect(resultActor).toBe(mappedDataObj);
        expect(resultActor?.actors.length).toEqual(1);
    });
    it('should test getMasterDataForSelect', () => {
        let url = '/castLists';
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'getMasterDataForSelect');
        instance.getMasterDataForSelect(url);
        expect(instance.getMasterDataForSelect).toHaveBeenCalledTimes(1);
    });
    it('should test getMasterData', () => {
        let url = '/castLists';
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'getMasterData');
        instance.getMasterData(url);
        expect(instance.getMasterData).toHaveBeenCalledTimes(1);
    });
    it('should test updatePropertiesValue', () => {
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'updatePropertiesValue');
        instance.updatePropertiesValue();
        expect(instance.updatePropertiesValue).toHaveBeenCalledTimes(1);
    });
    it('should test getPropertiesData', () => {
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'getPropertiesData');
        instance.getPropertiesData();
        expect(instance.getPropertiesData).toHaveBeenCalledTimes(1);
    });
    it('should test validateMarkAsDone', () => {
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        const fields = wrapper.state('fields');
        jest.spyOn(instance, 'validateMarkAsDone');
        instance.validateMarkAsDone(fields);
        expect(instance.validateMarkAsDone).toHaveBeenCalledTimes(1);
    });
    it('should test validateMarkAsDone for actors', () => {
        const wrapper = setup({}, {...initialState, selectedSecTab: 1, fields: JSON.parse(JSON.stringify(MovieCastNCrewJson))});
        const instance = wrapper.instance();
        const fields = wrapper.state('fields');
        jest.spyOn(instance, 'validateMarkAsDone');
        instance.validateMarkAsDone(fields);
        expect(instance.validateMarkAsDone).toHaveBeenCalledTimes(1);
    });
    it('should test validateMarkAsDoneMovieAction', () => {
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'validateMarkAsDoneMovieAction');
        instance.validateMarkAsDoneMovieAction();
        expect(instance.validateMarkAsDoneMovieAction).toHaveBeenCalledTimes(1);
    });
    it('should test manageCondition', () => {
        const stepName = 'title_summary';
        const name = 'Primary Gener';
        const value = 'Hindi title';
        const wrapper = setup({}, {...initialState});
        const fields = wrapper.state('fields');
        const instance = wrapper.instance();
        jest.spyOn(instance, 'manageCondition');
        instance.manageCondition(fields[stepName], name, value);
        expect(instance.manageCondition).toHaveBeenCalledTimes(1);
    });
    it('should test validateError', () => {
        const text = true;
        const numeric = true;
        const maxTextLength = 250;
        const value = 'ff';
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'validateError');
        instance.validateError(text, numeric, maxTextLength, value);
        expect(instance.validateError).toHaveBeenCalledTimes(1);
    });
    it('should test handleValueChange', () => {
        const stepName = 'title_summary';
        const index = null;
        const rootIndex = 0;
        const value = 'ff';
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleValueChange');
        instance.handleValueChange(stepName, index, rootIndex, value);
        expect(instance.handleValueChange).toHaveBeenCalledTimes(1);
    });
    it('should test handleValueChange for Actors', () => {
        const stepName = 'actors';
        const index = 1;
        const rootIndex = 0;
        const value = 'ff';
        const wrapper = setup({}, {...initialState, selectedSecTab: 1, fields: JSON.parse(JSON.stringify(MovieCastNCrewJson))});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleValueChange');
        instance.handleValueChange(stepName, index, rootIndex, value);
        expect(instance.handleValueChange).toHaveBeenCalledTimes(1);
    });
    it('should render TranslationInfo', () => {
        const permissionAddEdit = true;
        const permissionViewOnly = false;
        const wrapper = setup({permissionAddEdit, permissionViewOnly}, {...initialState});
        expect(permissionAddEdit).toBeTruthy();
        expect(permissionViewOnly).toBeFalsy();
        expect(wrapper.containsMatchingElement(<TranslationInfo />)).toBe(true);
    });
    it('should test toggleModel', () => {
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'toggleModel');
        instance.toggleModel();
        expect(instance.toggleModel).toHaveBeenCalledTimes(1);
    });
    it('should test lockUnlockTranslation', () => {
        const wrapper = setup({}, {params: initialState.params });
        const instance = wrapper.instance();
        jest.spyOn(instance, 'lockUnlockTranslation');
        instance.lockUnlockTranslation();
        expect(instance.lockUnlockTranslation).toHaveBeenCalledTimes(1);
    });
    it('should test lockSections', () => {
        const wrapper = setup({}, {params: initialState.params });
        const instance = wrapper.instance();
        jest.spyOn(instance, 'lockSections');
        const params = wrapper.state('params');
        instance.lockSections(params?.movieId);
        expect(instance.lockSections).toHaveBeenCalledWith(params?.movieId);
        expect(instance.lockSections).toHaveBeenCalledTimes(1);
    });
    it('should test autoSave', async (done) => {
        const response = {
            response: {
              status: 200,
              data: {"id":"6925b3b2-af5c-4d90-ba35-3c210a546025","title":"dd","status":"1","translationStatus":"1","createdBy":"e792e5ea-258e-4305-99ff-6b9dd8371405","modifiedBy":"e792e5ea-258e-4305-99ff-6b9dd8371405","movieId":"a317ef15-ead5-4f0c-92f5-27364e6f6807","langCode":"hi","_modified_on":"2021-02-16T06:54:52.570Z","_created_on":"2021-02-16T06:54:52.570Z","upcomingPageText":null,"trivia":null,"sponsor":null,"actorCharacter":null,"shortDescription":null,"webDescription":null,"appDescription":null,"tvDescription":null,"creativeTitle":null,"alternativeTitle":null,"pageTitle":null,"pageDescription":null,"socialShareTitle":null,"socialShareDescription":null}
            }
        };
        const updatedFields = {
            "name": "title",
            "value": "dd",
            "originalValue": "",
            "type": "text",
            "label": "Title",
            "maxTextLength": 250,
            "required": false,
            "text": false,
            "numeric": false,
            "isEditing": true
        };
        const wrapper = setup({updateMarkAsDoneAction: jest.fn()}, {...initialState, updatedFields});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'autoSave');
        instance.autoSave();
        expect(instance.autoSave).toHaveBeenCalledTimes(1);
        moxios.wait(function () {
            const request = moxios.requests.mostRecent();
            request.respondWith(response).then((res) => {
              done();
            });
        });
    });
    it('should test checkIfMarkAsDone', () => {
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'checkIfMarkAsDone');
        instance.checkIfMarkAsDone();
        expect(instance.checkIfMarkAsDone).toHaveBeenCalledTimes(1);
    });
    it('should test handleMarkAsDone', () => {
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleMarkAsDone');
        instance.handleMarkAsDone();
        expect(instance.handleMarkAsDone).toHaveBeenCalledTimes(1);
    });
    it('should test markAsDoneNLockedAction', () => {
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'markAsDoneNLockedAction');
        instance.markAsDoneNLockedAction();
        expect(instance.markAsDoneNLockedAction).toHaveBeenCalledTimes(1);
    });
    it('should test autoSaveError', () => {
        const error = {
            data: {
                message: 'This section is locked by another user.'
            }
        }
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'autoSaveError');
        instance.autoSaveError(error);
        expect(instance.autoSaveError).toHaveBeenCalledTimes(1);
        expect(error?.data?.message).toEqual(constantText.locked_by_another_text);
    });
    it('should test getMovieStatus', (done) => {
        const response = {
            response: {
              status: 201,
              data: [{"id":"5f8d94d0-4910-4772-b56b-32a4f52dfd48","movieId":"33b0a153-f57c-4298-8fb1-6cbd2e928917","sectionName":"contentPropertiesModule","isLocked":true,"lockedBy":"ce7859b7-b9d5-4603-bde2-2fe416d790ec","lockedOn":"2021-01-29T12:29:17.061Z","isDone":false,"doneBy":null,"doneOn":null,"createdBy":"ce7859b7-b9d5-4603-bde2-2fe416d790ec","modifiedBy":"ce7859b7-b9d5-4603-bde2-2fe416d790ec","status":"1","_created_on":"2021-01-29T10:43:24.642Z","_modified_on":"2021-01-29T12:29:17.063Z","lockedByUser":{"id":"ce7859b7-b9d5-4603-bde2-2fe416d790ec","firstName":"Shivam","lastName":"Sharma"}},{"id":"68ca6fb1-33c5-482f-8f2d-007e2bb7ee3b","movieId":"33b0a153-f57c-4298-8fb1-6cbd2e928917","sectionName":"hi_properties","isLocked":true,"lockedBy":"e792e5ea-258e-4305-99ff-6b9dd8371405","lockedOn":"2021-01-30T14:19:46.054Z","isDone":true,"doneBy":"e792e5ea-258e-4305-99ff-6b9dd8371405","doneOn":"2021-01-30T14:19:48.575Z","createdBy":"e792e5ea-258e-4305-99ff-6b9dd8371405","modifiedBy":"e792e5ea-258e-4305-99ff-6b9dd8371405","status":"1","_created_on":"2021-01-30T14:19:46.053Z","_modified_on":"2021-01-30T14:19:48.577Z","lockedByUser":{"id":"e792e5ea-258e-4305-99ff-6b9dd8371405","firstName":"Test","lastName":"Translator"}}]
            }
        };
        const wrapper = setup({}, { ...initialState });
        const instance = wrapper.instance();
        jest.spyOn(instance, 'getMovieStatus');
        instance.getMovieStatus();
        expect(instance.getMovieStatus).toHaveBeenCalledTimes(1);
        moxios.wait(function () {
            const request = moxios.requests.mostRecent();
            request.respondWith(response).then((res) => {
                done();
            });
        });
    });
    it('should test handleSecTab', () => {
        const selectedSecTab = 0;
        const wrapper = setup({}, {...initialState, selectedSecTab: 1});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleSecTab');
        instance.handleSecTab('e', selectedSecTab);
        expect(instance.handleSecTab).toHaveBeenCalledTimes(1);
        expect(wrapper.state('selectedSecTab')).not.toEqual(1);
    });
    it('should test setSelectDataArr', () => {
        const key = 'title_summary';
        const index = 1;
        const data = [{'title': 'hii'}];
        const wrapper = setup({}, {...initialState});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'setSelectDataArr');
        instance.setSelectDataArr(key, index, data);
        expect(instance.setSelectDataArr).toHaveBeenCalledTimes(1);
    });
    it('Sholud render Common Model', () => {
        const wrapper = setup({}, {...initialState});
        expect(wrapper.containsMatchingElement(<CommonModel />)).toBe(true);
    });
});