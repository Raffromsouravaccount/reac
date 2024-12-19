import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import { manageDropDownValidation, manageValidationForTime, manageValidationForDuration, manageValidationForSkipSong } from '../../../../_components/Collection/CreateCollection/ContentProperties/contentValidation';
import Adapter from 'enzyme-adapter-react-16';
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

    test('manageValidationForSkipSong method', () => {
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
        expect(manageValidationForSkipSong(rootArr, 'Thu Jan 27 2011 02:05:17 GMT+0100', 'Skip Song Start Time', 'Thu Jan 27 2011 02:05:17 GMT+0100')).toBeTruthy();
    })

    test('manageValidationForSkipSong method with date and time', () => {
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
        expect(manageValidationForSkipSong(rootArr, '', 'Skip Song Start Time', 'Thu Jan 27 2011 02:05:17 GMT+0100')).toBeTruthy();
    })

    test('manageValidationForDuration method', () => {
        const player = [{
            name: "primaryGenre",
            name: "dropdownAsync",
            name: "col-md-6 col-lg-6",
            value: [],
            value: true,
            label: "End Credit Start Time",
            keyText: "title",
            path: "/master/MoviePrimaryGenre",
            data: [{DisplayName: 'test'}],
            errorText: "",
            errorText: {
                required: true
            }
        }]
        expect(manageValidationForDuration(false, player, 'End Credit Start Time', 'Thu Jan 27 2011 02:05:17 GMT+0100')).toBeTruthy();
    })


    test('manageValidationForDuration method  else condition', () => {
        const player = [{
            name: "primaryGenre",
            name: "dropdownAsync",
            name: "col-md-6 col-lg-6",
            value: [],
            value: true,
            label: "End Credit Start Time",
            keyText: "title",
            path: "/master/MoviePrimaryGenre",
            data: [{DisplayName: 'test'}],
            errorText: "",
            errorText: {
                required: true
            }
        }]
        expect(manageValidationForDuration(true, player, 'End Credit Start Time', 'Thu Jan 27 2011 02:05:17 GMT+0100')).toBeTruthy();
    })
    
    test('manageValidationForTime method', () => {
        const stepNameArr = [{
            name: "primaryGenre",
            name: "dropdownAsync",
            name: "col-md-6 col-lg-6",
            value: [],
            value: false,
            label: "Intro Start Time",
            keyText: "title",
            path: "/master/MoviePrimaryGenre",
            data: [{DisplayName: 'test'}],
            errorText: "",
            errorText: {
                required: true
            }
        }]
        expect(manageValidationForTime(stepNameArr, 'Intro Start Time', 'Thu Jan 27 2011 02:05:17 GMT+0100')).toBeTruthy();
    })

    test('manageValidationForTime method else condition', () => {
        const stepNameArr = [{
            name: "primaryGenre",
            name: "dropdownAsync",
            name: "col-md-6 col-lg-6",
            value: [],
            value: false,
            label: "Intro End Time",
            keyText: "title",
            path: "/master/MoviePrimaryGenre",
            data: [{DisplayName: 'test'}],
            errorText: "",
            errorText: {
                required: true
            }
        }]
        expect(manageValidationForTime(stepNameArr, 'Intro End Time', 'Thu Jan 27 2011 02:05:17 GMT+0100')).toBeTruthy();
    })
})

