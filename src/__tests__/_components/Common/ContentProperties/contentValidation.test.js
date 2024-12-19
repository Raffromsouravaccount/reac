import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import { manageDropDownValidation, manageValidationForGenre, manageValidationForSpacialCat, checkEndTimeForOverlap,checkStartTimeForOverlap } from '../../../../_components/Common/ContentProperties/contentValidation';
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
    let wrapper;
    it('manageDropDownValidation method with name primaryGenre', () => {
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

    it('manageDropDownValidation method with name isMultiAudio', () => {
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
    
    it('manageDropDownValidation method with name dubbedLanguageTitle', () => {
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

    it('manageValidationForGenre method with name primaryGenre', () => {
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
    
    it('manageValidationForSpacialCat method with name specialCategoryFrom', () => {
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

    it('manageValidationForSpacialCat method with name specialCategoryTo', () => {
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
    });

    it('checkEndTimeForOverlap method ', () => {
        const mockSet = {
            skip_song : 
            [[
                {
                  col: "col-md-6 col-lg-6",
                  errorText: null,
                  isChanged: false,
                  label: "Skip Song Start Time",
                  name: "skipSongStartTime",
                  type: "time",
                  validation: { required: false },
                  value: "14:19:19",
                },
                {
                  col: "col-md-6 col-lg-6",
                  errorText: "Skip Song End Time can not be less than Intro Start Time",
                  isChanged: true,
                  label: "Skip Song End Time",
                  name: "skipSongEndTime",
                  type: "time",
                  validation: { required: false },
                  value: null,
                },
              ]],
            skipSongEndTime : "13:20:20",
            skipSongStartTime : "14:21:20"
            }
      
     expect(checkEndTimeForOverlap(mockSet.skipSongStartTime, mockSet.skipSongEndTime, mockSet.skip_song,0)).toBeTruthy();
    })

})


