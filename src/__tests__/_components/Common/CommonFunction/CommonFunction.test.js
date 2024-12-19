import React from 'react';
import { shallow, mount } from 'enzyme';

import * as CommonFunction from '../../../../_components/Common/CommonFunction/CommonFuntion';
//Helper files
import Config from '../../../../Config/config';

const title_summary = [{id:"hsjdhff94", title: "title_summary"}]
describe('CommonFunction', () => {
    it('Should renders CommonFunction default', async () => {
        expect(await CommonFunction.addTag()).toEqual();
    })

    it('Should renders completeImagePath default', () => {
        const externalId = '1-1-1000171'; 
        const key= 'cover';
        const url= 'download-84930878-152f-4110-89fc-432425f94205.jpg'
        expect(CommonFunction.completeImagePath(externalId, key, url)).toEqual(`${Config.imageBaseUrl}${externalId}/${key}/${url}`);
    })

    it('Should renders manageDropDownValidation default', () => {
        expect(CommonFunction.manageDropDownValidation(title_summary, 'creativeTitle', '')).toEqual(title_summary);
    })

    it('Should renders manageDropDownValidation default', () => {
        expect(CommonFunction.manageDropDownValidation(title_summary, 'primaryGenre', [{id: "27569553-95ae-421c-9fd6-67e79001cb55", title: "Action"}])).toEqual(title_summary);
    })

    it('Should renders manageDropDownValidation default', () => {
        expect(CommonFunction.manageDropDownValidation(title_summary, 'isMultiAudio', [{id: "27569553-95ae-421c-9fd6-67e79001cb55", title: "Action"}])).toEqual(title_summary);
    })

    it('Should renders manageDropDownValidation default', () => {
        expect(CommonFunction.manageDropDownValidation(title_summary, 'dubbedLanguageTitle', [{id: "27569553-95ae-421c-9fd6-67e79001cb55", title: "Action"}])).toEqual(title_summary);
    })

    it('Should renders manageDropDownValidation default', () => {
        expect(CommonFunction.filterItemProperties([{mock: 'Mock'}], [{mock: 'Mock'}])).toEqual([{}]);
    })

    it('Should renders processLicenceCountries default', () => {
        expect(CommonFunction.processLicenceCountries()).toEqual();
    })
      
    it('Should renders getStageColour default', () => {
        expect(CommonFunction.getStageColour()).toEqual('orange');
    })  
    
    it('Should renders createQuery default', () => {
        const queryData = {
            filters: [], sort: [], paramQuery: {}, filterByDate:{}
        }
        expect(CommonFunction.createQuery(queryData)).toEqual("");
    })  
    
    it('Should renders removeEmptyKeys default', () => {
        const obj = {mockData: 'xyz', mockValue: 'abc'}
        expect(CommonFunction.removeEmptyKeys(obj)).toEqual(obj);
    })
    
    it('Should renders addCastRelation default', () => {
        expect(CommonFunction.addCastRelation()).toEqual();
    }) 
    
    it('Should renders removeAllDynamicAddfields default', () => {
        const params = [{sectionKey: 'relationShip', section: "test"}]
        expect(CommonFunction.removeAllDynamicAddfields(params)).toEqual("test");
    })

    it('Should renders removeCastRelation default', () => {
        const params = "test";
        expect(CommonFunction.removeCastRelation(params)).toEqual("test");
    })

})