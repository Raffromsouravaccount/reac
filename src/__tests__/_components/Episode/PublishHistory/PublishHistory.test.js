import React from 'react';
import {shallow,mount} from 'enzyme';

import PublishHistory from '../../../../_components/Episode/PublishedHistory/PublishedHistory';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {findByTestAttr, checkProps} from '../../../../Utils';
import ReactTestUtils from 'react-dom/test-utils';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
   const wrapper = shallow(<PublishHistory {...props}/>)
    return wrapper;
  }

describe('<PublishHistory/>',()=>{
    let wrapper;
      beforeEach(()=>{
          wrapper = setup();
      });

      it('Should render Publish History Episode default',()=>{
        expect(wrapper.exists()).toBe(true);
      });

      it('should test componentDidMount',()=>{
        const instance = wrapper.instance();
        jest.spyOn(instance, 'componentDidMount');
        instance.componentDidMount();
        expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
      });

      it('should test fetchContentData',()=>{
        const instance = wrapper.instance();
        jest.spyOn(instance, 'fetchContentData');
        instance.fetchContentData();
        expect(instance.fetchContentData).toHaveBeenCalledTimes(1);
      });

      it('should test fetchLicenseData',()=>{
        const instance = wrapper.instance();
        jest.spyOn(instance, 'fetchLicenseData');
        instance.fetchLicenseData();
        expect(instance.fetchLicenseData).toHaveBeenCalledTimes(1);
      });

      it('should test generateLicenseArray',()=>{
        const mockSet = {
          licenseArr : {
            count: 1,
            licenceList:[{
              activatedBy: {first_name: "Shrishti", last_name: "Sahu"},
              activatedOn: "2021-04-19T11:00:00.728Z",
              countries:[{id: "66e3f511-73f1-4731-9a0a-c070558698aa", title: "Angola"}],
              createdBy: {first_name: "Shrishti", last_name: "Sahu"},
              createdOn: "2021-04-19T11:00:00.728Z",
              expiredBy: {first_name: "Shrishti", last_name: "Sahu"},
              expiredOn: "2021-04-23T00:00:00.000Z",
              inActivatedBy: {first_name: "Shrishti", last_name: "Sahu"},
              inActivatedOn: "2021-04-19T11:00:00.728Z",
              modifiedBy: {first_name: "Shrishti", last_name: "Sahu"},
              setName: "Set1",
              status: "Created"
            }]
          }
        }
        wrapper.setState({...mockSet})
        const instance = wrapper.instance();
        jest.spyOn(instance, 'generateLicenseArray');
        instance.generateLicenseArray(mockSet.licenseArr);
        expect(instance.generateLicenseArray).toHaveBeenCalledTimes(1);
      });
      

     

      it('should test handlePublishHistoryRoute with state quick-filing',()=>{
        const mockSet = {
          state : "quick-filing"
        }
        wrapper.setProps({...mockSet});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handlePublishHistoryRoute');
        instance.handlePublishHistoryRoute();
        expect(instance.handlePublishHistoryRoute).toHaveBeenCalledTimes(1);
      });

      it('should test handlePublishHistoryRoute with state single-landing-page',()=>{
        const mockSet = {
          state : "single-landing-page"
        }
        wrapper.setProps({...mockSet});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handlePublishHistoryRoute');
        instance.handlePublishHistoryRoute();
        expect(instance.handlePublishHistoryRoute).toHaveBeenCalledTimes(1);
      });

      it('should test handlePublishHistoryRoute',()=>{
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handlePublishHistoryRoute');
        instance.handlePublishHistoryRoute();
        expect(instance.handlePublishHistoryRoute).toHaveBeenCalledTimes(1);
      });

      it('should test toggleCountryPopup',()=>{
        const countryArr = ["Angola", "Congo", "Equatorial Guinea", "Gabon", "Botswana", "Lesotho", "Swaziland", "South Africa", "Namibia"];
        const instance = wrapper.instance();
        jest.spyOn(instance, 'toggleCountryPopup');
        instance.toggleCountryPopup(countryArr);
        expect(instance.toggleCountryPopup).toHaveBeenCalledTimes(1);
      });

      it('should test goBack',()=>{
        const instance = wrapper.instance();
        jest.spyOn(instance, 'goBack');
        instance.goBack();
        expect(instance.goBack).toHaveBeenCalledTimes(1);
      });

      it('should test nextCall',()=>{
        const page = "2"
        const instance = wrapper.instance();
        jest.spyOn(instance, 'nextCall');
        instance.nextCall(page);
        expect(instance.nextCall).toHaveBeenCalledTimes(1);
      });

      it('should test showHideCountriesPopup',()=>{
        const mockSet = {
          showModelForCountries : true
        }
        wrapper.setState({...mockSet});
        const instance = wrapper.instance();
        jest.spyOn(instance, 'showHideCountriesPopup');
        instance.showHideCountriesPopup();
        expect(instance.showHideCountriesPopup).toHaveBeenCalledTimes(1);
      });

      it('Should renders NavigateNextIcon default', () => {
        expect(wrapper.containsMatchingElement(<NavigateNextIcon />)).toEqual(false);
      });


      it('should test checkCurrentStatus',()=>{
        const instance = wrapper.instance();
        jest.spyOn(instance, 'checkCurrentStatus');
        instance.checkCurrentStatus();
        expect(instance.checkCurrentStatus).toHaveBeenCalledTimes(1);
      });

      it('should test render',()=>{
        const instance = wrapper.instance();
        jest.spyOn(instance, 'render');
        instance.render();
        expect(instance.render).toHaveBeenCalledTimes(1);
      });

      it('should check btn2Action', () => {
        const myFakeCallback = () => {};
        wrapper.find('#common-model').first().prop('btn2Action')(myFakeCallback);
      })
      
      it('should check handleClose', () => {
        const myFakeCallback = () => {};
        wrapper.find('#common-model').first().prop('handleClose')(myFakeCallback);
      })

      it('should check goBack onclick method', () => {
        const spy = jest.spyOn(wrapper.instance(), 'goBack');
        wrapper.instance().forceUpdate();
        wrapper.update();
        const button = findByTestAttr(wrapper, 'go-back');
        button.simulate('click');
        expect(spy).toHaveBeenCalledTimes(0);
      })
});