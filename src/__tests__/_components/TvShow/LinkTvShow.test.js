import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import moxios from 'moxios';
import LinkedShows from '../../../_components/TvShow/LinkedShows/LinkedShows';
//Helpers
import { findByTestAttr, storeFactory } from '../../../Utils';
/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */




const setup = (initialState = {}, props = {}) => {
  const store = storeFactory(initialState);
  const wrapper = shallow(<LinkedShows store={store} {...props} />).dive();
  return wrapper;
}

describe('<LinkedShows />', () => {
  let wrapper;
  const initialStore = {
    user_reducer: {}
  };
  const event = { target: { name: 'xyz', value: '123',files: [{
    lastModified: 1602582862128,
    lastModifiedDate: 'Tue Oct 13 2020 15:24:22 GMT+0530 (India Standard Time)',
    name: "pjimage-5-1589546097.jpg",
    path: "pjimage-5-1589546097.jpg",
    size: 14626,
    type: "image/jpeg",
    webkitRelativePath: ""
  }] }, preventDefault: jest.fn() }

  const props = {
    match:{
        params:{
            id:"xyz"
        }
    }
}

  beforeEach(() => {
    wrapper = setup(initialStore, {...props}, null).dive();
  });

  it('Should renders Linked Shows default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should test ComponentDidMount',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentDidMount');
    instance.componentDidMount();
    expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
  }); 

  it('should test getAllLanguage',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getAllLanguage');
    instance.getAllLanguage();
    expect(instance.getAllLanguage).toHaveBeenCalledTimes(1);
  }); 

  it('should test setShowsData',()=>{
    const mockSet = {
      showsList : [{
        TvShowImages: [],
        TvShowMapContents: [],
        audioLanguages: null,
        contentState: "3bb64421-f15f-4dda-adec-03c324c140a3",
        contentState_populated: {title: "Draft"},
        countries: "",
        createdBy_populated: {firstName: "Sandeep", lastName: "Kumar"},
        dateZee5Published: null,
        externalId: "0-6-4z51001761",
        journeyType: "1",
        lastModifiedOn: "2021-03-18T19:17:55.375Z",
        licenceExpDays: [],
        modifiedBy_populated: {firstName: "Sandeep", lastName: "Kumar"},
        note: null,
        originCountry: null,
        showDetails: false,
        subtype: null,
        subtype_populated: null,
        title: "No Title",
        tvShowId: "e5fb27f9-7a0c-4a4d-a833-27141c03e395",
        tvShowLicenses: []
      }],
      item :{
        tvShowLicenses: [
          {title:"active"}
      ]
      },
      licenceItem:{
        validUntil: true
      }
    }
    wrapper.setState({...mockSet});
    const instance = wrapper.instance();
    jest.spyOn(instance, 'setShowsData');
    instance.setShowsData(mockSet.showsList);
    expect(instance.setShowsData).toHaveBeenCalledTimes(1);
  }); 

  it('should test getShows',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'getShows');
    instance.getShows();
    expect(instance.getShows).toHaveBeenCalledTimes(1);
  }); 

  it('should test handleRoute',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleRoute');
    instance.handleRoute();
    expect(instance.handleRoute).toHaveBeenCalledTimes(1);
  }); 

  it('should check handleRoute onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleRoute');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'handle-route');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should test viewShowHandler',()=>{
    const mockSet = {
      show: {
        TvShowImages: [],
        TvShowMapContents: [],
        audioLanguages: null,
        contentState: "3bb64421-f15f-4dda-adec-03c324c140a3",
        contentState_populated: {title: "Draft"},
        countries: "",
        createdBy_populated: {firstName: "Sandeep", lastName: "Kumar"},
        dateZee5Published: null,
        externalId: "0-6-4z51001761",
        journeyType: "1",
        lastModifiedOn: "2021-03-18T19:17:55.375Z",
        licenceExpDays: [],
        modifiedBy_populated: {firstName: "Sandeep", lastName: "Kumar"},
        note: null,
        originCountry: null,
        showDetails: false,
        subtype: null,
        subtype_populated: null,
        title: "No Title",
        tvShowId: "e5fb27f9-7a0c-4a4d-a833-27141c03e395",
        tvShowLicenses: []
      },
      tvShowId: "e5fb27f9-7a0c-4a4d-a833-27141c03e395",
      journeyType: "single-landing"
    }
    wrapper.setState({...mockSet});
    const instance = wrapper.instance();
    jest.spyOn(instance, 'viewShowHandler');
    instance.viewShowHandler(mockSet.show);
    expect(instance.viewShowHandler).toHaveBeenCalledTimes(1);
  }); 

  it('should test cloneContent',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'cloneContent');
    instance.cloneContent();
    expect(instance.cloneContent).toHaveBeenCalledTimes(1);
  }); 

  it('should test showHideClonePopup',()=>{
    const mockSet = {
      currentShow : "e5fb27f9-7a0c-4a4d-a833-27141c03e395",
      journeyType : 1
    }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'showHideClonePopup');
    instance.showHideClonePopup(mockSet.currentShow , mockSet.journeyType);
    expect(instance.showHideClonePopup).toHaveBeenCalledTimes(1);
  }); 

  it('should test showHideCountriesPopup',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'showHideCountriesPopup');
    instance.showHideCountriesPopup();
    expect(instance.showHideCountriesPopup).toHaveBeenCalledTimes(1);
  }); 

  it('should test toggleMorePopup',()=>{
    const mockSet = {
      countryArr : [],
      forCountry : true
    }
    wrapper.setState({...mockSet});
    const instance = wrapper.instance();
    jest.spyOn(instance, 'toggleMorePopup');
    instance.toggleMorePopup(mockSet.countryArr, mockSet.forCountry);
    expect(instance.toggleMorePopup).toHaveBeenCalledTimes(1);
  }); 

  it('should test handleRouteExpiredLink',()=>{
    const mockSet = {
      show: {
        TvShowImages: [],
        TvShowMapContents: [],
        audioLanguages: null,
        contentState: "3bb64421-f15f-4dda-adec-03c324c140a3",
        contentState_populated: {title: "Draft"},
        countries: "",
        createdBy_populated: {firstName: "Sandeep", lastName: "Kumar"},
        dateZee5Published: null,
        externalId: "0-6-4z51001761",
        journeyType: "1",
        lastModifiedOn: "2021-03-18T19:17:55.375Z",
        licenceExpDays: [],
        modifiedBy_populated: {firstName: "Sandeep", lastName: "Kumar"},
        note: null,
        originCountry: null,
        showDetails: false,
        subtype: null,
        subtype_populated: null,
        title: "No Title",
        tvShowId: "e5fb27f9-7a0c-4a4d-a833-27141c03e395",
        tvShowLicenses: []
      },
      tvShowId: "e5fb27f9-7a0c-4a4d-a833-27141c03e395",
      journeyType: "single-landing"
    }
    wrapper.setState({...mockSet});
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleRouteExpiredLink');
    instance.handleRouteExpiredLink(mockSet.show);
    expect(instance.handleRouteExpiredLink).toHaveBeenCalledTimes(1);
  }); 

  it('should test render',()=>{
    const instance = wrapper.instance();
    jest.spyOn(instance, 'render');
    instance.render();
    expect(instance.render).toHaveBeenCalledTimes(1);
  }); 

  it('should check btn2Action with an id common-model', () => {
    const myFakeCallback = () => {};
    wrapper.find('#common-model').first().prop('btn2Action')(myFakeCallback);
  });

  it('should check handleClose with an id common-model', () => {
    const myFakeCallback = () => {};
    wrapper.find('#common-model').first().prop('handleClose')(myFakeCallback);
  });

  it('should check btn2Action with an id common-model-2nd', () => {
    const myFakeCallback = () => {};
    wrapper.find('#common-model-2nd').first().prop('btn2Action')(myFakeCallback);
  });

  it('should check handleClose with an id common-model-2nd', () => {
    const myFakeCallback = () => {};
    wrapper.find('#common-model-2nd').first().prop('handleClose')(myFakeCallback);
  });

});