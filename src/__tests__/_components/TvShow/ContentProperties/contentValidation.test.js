import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import { manageDropDownValidation, manageValidationForGenre, manageValidationForSpacialCat, manageValidationForLanguage } from '../../../../_components/TvShow/ContentProperties/contentValidation';
import { expect, it, jest } from '@jest/globals';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<CollectionImages {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('validation', () => {
    test('manageDropDownValidation method with name primaryGenre', () => {
        const stepName = [{
            name: "primaryGenre",
            name: "dropdownAsync",
            name: "col-md-6 col-lg-6",
            value: [],
            value: true,
            label: "Primary Genre",
            keyText: "title",
            path: "/master/MoviePrimaryGenre",
            data: [{DisplayName: 'test'}],
            errorText: "",
            errorText: {
                required: true
            }
        }]
        const value = [{DisplayName: 'test'}]
        expect(manageDropDownValidation(stepName, 'primaryGenre', value)).toBeTruthy();
    })

    test('manageDropDownValidation method with name isMultiAudio', () => {
        const stepName = [{
            name: "primaryGenre",
            name: "dropdownAsync",
            name: "col-md-6 col-lg-6",
            value: [],
            value: true,
            label: "Primary Genre",
            keyText: "title",
            path: "/master/MoviePrimaryGenre",
            data: [{DisplayName: 'test'}],
            errorText: "",
            errorText: {
                required: true
            }
        }]
        const value = [{DisplayName: 'test'}]
        expect(manageDropDownValidation(stepName, 'isMultiAudio', value)).toBeTruthy();
    })
    
    test('manageDropDownValidation method with name dubbedLanguageTitle', () => {
        const stepName = [{
            name: "primaryGenre",
            name: "dropdownAsync",
            name: "col-md-6 col-lg-6",
            value: [],
            value: true,
            label: "Primary Genre",
            keyText: "title",
            path: "/master/MoviePrimaryGenre",
            data: [{DisplayName: 'test'}],
            errorText: "",
            errorText: {
                required: true
            }
        }]
        const value = [{DisplayName: 'test'}]
        expect(manageDropDownValidation(stepName, 'dubbedLanguageTitle', value)).toBeTruthy();
    })

    test('manageValidationForGenre method with name primaryGenre', () => {
        const rootArr = [{
            name: "primaryGenre",
            name: "dropdownAsync",
            name: "col-md-6 col-lg-6",
            value: [],
            value: true,
            label: "Skip Song Start Time",
            keyText: "title",
            path: "/master/MoviePrimaryGenre",
            data: [{DisplayName: 'test'}],
            errorText: "",
            errorText: {
                required: true
            }
        }]
        const value = [{DisplayName: 'test'}]
        expect(manageValidationForGenre(rootArr)).toBeTruthy();
    })
    
    test('manageValidationForSpacialCat method with name specialCategoryFrom', () => {
        const rootArr = [{
            name: "specialCategoryFrom",
            name: "dropdownAsync",
            name: "col-md-6 col-lg-6",
            value: [],
            value: true,
            label: "Skip Song Start Time",
            keyText: "title",
            path: "/master/MoviePrimaryGenre",
            data: [{DisplayName: 'test'}],
            errorText: "",
            errorText: {
                required: true
            }
        }]
        const value = [{DisplayName: 'test'}]
        expect(manageValidationForSpacialCat(rootArr, 'specialCategoryFrom', null)).toBeTruthy();
    })

    test('manageValidationForSpacialCat method with name specialCategoryTo', () => {
        const rootArr = [{
            name: "specialCategoryTo",
            name: "dropdownAsync",
            name: "col-md-6 col-lg-6",
            value: [],
            value: true,
            label: "Skip Song Start Time",
            keyText: "title",
            path: "/master/MoviePrimaryGenre",
            data: [{DisplayName: 'test'}],
            errorText: "",
            errorText: {
                required: true
            }
        }]
        const value = [{DisplayName: 'test'}]
        expect(manageValidationForSpacialCat(rootArr, 'specialCategoryTo', null)).toBeTruthy();
    })

    test('manageValidationForLanguage method', () => {
        const rootArr = [{
            name: "primaryLanguage",
            name: "dropdownAsync",
            name: "col-md-6 col-lg-6",
            value: [],
            value: true,
            label: "Skip Song Start Time",
            keyText: "title",
            path: "/master/MoviePrimaryGenre",
            data: [{DisplayName: 'test'}],
            errorText: "",
            errorText: {
                required: true
            }
        }]
        const value = [{DisplayName: 'test'}]
        expect(manageValidationForLanguage(rootArr)).toBeTruthy();
    })
    test('manageValidationForLanguage method fr dubbedLanguageTitle', () => {
        const rootArr = [{
            name: "dubbedLanguageTitle",
            name: "dropdownAsync",
            name: "col-md-6 col-lg-6",
            value: [],
            value: true,
            label: "Skip Song Start Time",
            keyText: "title",
            path: "/master/MoviePrimaryGenre",
            data: [{DisplayName: 'test'}],
            errorText: "",
            errorText: {
                required: true
            }
        }]
        const value = [{DisplayName: 'test'}]
        expect(manageValidationForLanguage(rootArr)).toBeTruthy();
    })
})


