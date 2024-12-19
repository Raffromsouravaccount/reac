import React from 'react';
import { shallow } from 'enzyme';

import AddContent from '../../../../../_components/TvShow/MapContent/AddContent/AddContent';
import { expect, it, jest } from '@jest/globals';

const setup = (props = {}) => {
    const wrapper = shallow(<AddContent {...props} />);
    return wrapper;
}

describe('AddContent', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
    });

    it('render component without error', () => {
        expect(wrapper.exists()).toBe(true);
    })

    it('should test nextCall', () => {
        jest.spyOn(wrapper.instance(), 'nextCall');
        wrapper.instance().nextCall();
        expect(wrapper.instance().nextCall).toBeCalled();
    })

    it('should test componentWillUnmount', () => {
      const instance = wrapper.instance();
      jest.spyOn(instance, 'componentWillUnmount');
      instance.componentWillUnmount();
      expect(instance.componentWillUnmount).toHaveBeenCalledTimes(1);
    })

    it('should test applyFilter', () => {
        jest.spyOn(wrapper.instance(), 'applyFilter');
        wrapper.instance().applyFilter();
        expect(wrapper.instance().applyFilter).toBeCalled();
    })

    it('should test showHideFilterDrawer', () => {
        jest.spyOn(wrapper.instance(), 'showHideFilterDrawer');
        wrapper.instance().showHideFilterDrawer();
        expect(wrapper.instance().showHideFilterDrawer).toBeCalled();
    })

    it('should test checkBoxHandler', () => {
        const item = {
            tvShowId: '01130765-3f43-45a7-b3aa-a83d103b9fd6'
        }
        const event = { target: { value: 'test' } }
        const contentList = [{
            TvShowImages: [], TvShowLicenses: [], TvShowMapContent: null, contentState: "3bb64421-f15f-4dda-adec-03c324c140a3",
            contentState_populated: { title: "Draft" }, countries: "", createdOn: "2021-01-29T10:01:05.866Z", dateZee5Published: null,
            duration: null, externalId: "1-2-1000249", isChecked: true, journeyType: "1", lastModifiedBy_populated: {
                first_name: "Amrit",
                last_name: "Gupta"
            }, lastModifiedOn: "2021-01-29T10:01:05.866Z", licenceExpDays: [], modifiedOn: "2021-01-29T10:01:05.866Z",
            movieCountry: [], originCountry: null, subtype: null, subtype_populated: null, title: "No Title", tvShowId: "01130765-3f43-45a7-b3aa-a83d103b9fd6"
        }, {
            TvShowImages: [], TvShowLicenses: [], TvShowMapContent: null, contentState: "3bb64421-f15f-4dda-adec-03c324c140a3", contentState_populated: { title: "Draft" },
            countries: "", createdOn: "2021-01-29T13:17:55.406Z", dateZee5Published: null, duration: null, externalId: "1-2-1000005",
            journeyType: "1", lastModifiedBy_populated: { first_name: "Akshit", last_name: "Khajuria" }, lastModifiedOn: "2021-02-01T08:47:50.133Z",
            licenceExpDays: [], modifiedOn: "2021-02-01T08:47:50.133Z", movieCountry: [], originCountry: null, subtype: null,
            subtype_populated: null, title: "No Title", tvShowId: "85b3c599-cb1c-40b4-8a54-571466cde3b4"
        }]
        const newContents = [{
            TvShowImages: [], TvShowLicenses: [], TvShowMapContent: null, contentState: "3bb64421-f15f-4dda-adec-03c324c140a3",
            contentState_populated: { title: "Draft" }, countries: "", createdOn: "2021-01-28T17:56:16.432Z", dateZee5Published: null,
            duration: null, externalId: "1-2-1000214", isChecked: true, journeyType: "1", lastModifiedBy_populated: { first_name: "Sandeep", last_name: "Kumar" },
            lastModifiedOn: "2021-01-29T07:26:04.899Z", licenceExpDays: [], modifiedOn: "2021-01-29T07:26:04.899Z", movieCountry: [],
            originCountry: null, subtype: null, subtype_populated: null, title: "No Title", tvShowId: "7b97f27a-b3ee-4433-bc88-0874188437bc"
        }]
        wrapper.setState({ contentList, newContents });
        jest.spyOn(wrapper.instance(), 'checkBoxHandler');
        wrapper.instance().checkBoxHandler(event, item);
        expect(wrapper.instance().checkBoxHandler).toBeCalled();
    })

    it('should test handleKeyUp', () => {
        const queryData = {
            contentState: "", limit: 10, page: 1, searchString: "test test"
        }
        wrapper.setState({ queryData });
        jest.spyOn(wrapper.instance(), 'handleKeyUp');
        wrapper.instance().handleKeyUp();
        expect(wrapper.instance().handleKeyUp).toBeCalled();
    })

    it('should test handleKeyPress', () => {
        jest.spyOn(wrapper.instance(), 'handleKeyPress');
        wrapper.instance().handleKeyPress();
        expect(wrapper.instance().handleKeyPress).toBeCalled();
    })

    it('should test searchHandleChange', () => {
        const event = { target: { name: "xyz", value: '123' } }
        jest.spyOn(wrapper.instance(), 'searchHandleChange');
        wrapper.instance().searchHandleChange(event);
        expect(wrapper.instance().searchHandleChange).toBeCalled();
    })

    it('should test addContentHandler', () => {
        const baseProps = {
            added: jest.fn(),
            closeAddContent: jest.fn()
        }
        wrapper.setProps({ ...baseProps });
        jest.spyOn(wrapper.instance(), 'addContentHandler');
        wrapper.instance().addContentHandler();
        expect(wrapper.instance().addContentHandler).toBeCalled();
    })

    it('should test assignContentHandler', () => {
        const baseProps = {
            added: jest.fn(),
            closeAddContent: jest.fn()
        }
        wrapper.setProps({ ...baseProps });
        jest.spyOn(wrapper.instance(), 'assignContentHandler');
        wrapper.instance().assignContentHandler();
        expect(wrapper.instance().assignContentHandler).toBeCalled();
    })

    it('should test processContentList', () => {
        jest.spyOn(wrapper.instance(), 'processContentList');
        wrapper.instance().processContentList();
        expect(wrapper.instance().processContentList).toBeCalled();
    })

    it('should test getContents', () => {
        jest.spyOn(wrapper.instance(), 'getContents');
        wrapper.instance().getContents();
        expect(wrapper.instance().getContents).toBeCalled();
    })

    it('should test setQueryData', () => {
        jest.spyOn(wrapper.instance(), 'setQueryData');
        wrapper.instance().setQueryData();
        expect(wrapper.instance().setQueryData).toBeCalled();
    })

    it('should test setQueryData', () => {
        jest.spyOn(wrapper.instance(), 'setQueryData');
        wrapper.instance().setQueryData();
        expect(wrapper.instance().setQueryData).toBeCalled();
    })

    it('should test componentDidMount', () => {
        jest.spyOn(wrapper.instance(), 'componentDidMount');
        wrapper.instance().componentDidMount();
        expect(wrapper.instance().componentDidMount).toBeCalled();
    })
    
    it('should test render', () => {
      const instance = wrapper.instance();
      jest.spyOn(instance, 'render');
      instance.render();
      expect(instance.render).toHaveBeenCalledTimes(1);
    })
})