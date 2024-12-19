import React from "react";
import { shallow } from "enzyme";

import ViewEpisode from "../../../../_components/Episode/CreateEpisode/ViewEpisode";
import { findByTestAttr } from '../../../../Utils';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
    const wrapper = shallow(<ViewEpisode {...props} />);
    if (state) wrapper.setState(state);
    return wrapper;
};

const event = { target: { name: 'mock', value: 'test' } };

describe("ViewEpisode", () => {
    let wrapper;
    let instance;

    const props = {
      match: {
        params: {
          id:"xyz",
          seasonId: "def",
          episodeId: "efh"
        }
      }
    }
    beforeEach(() => {
        wrapper = setup({...props});
      });
    it("Should render ViewSeason default", () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should check componentDidMount', () => {
    jest.spyOn(wrapper.instance(), "componentDidMount");
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().componentDidMount).toBeCalled();
    });

    it('should check componentDidMount else Part', () => {
      const url = "/tvshow/view/d2bb96f4-43f3-4d4b-aee3-4d0bed0cf612/season/view/52f2e7bb-b9b6-4dfa-939e-4401660077c3/episode/view/925cff08-94ef-46b6-bd87-c1022049a72f";
      wrapper.setProps({props : url})
      jest.spyOn(wrapper.instance(), "componentDidMount");
      wrapper.instance().componentDidMount();
      expect(wrapper.instance().componentDidMount).toBeCalled();
      });
  

    it('should check getEpisodeStage', () => {
      jest.spyOn(wrapper.instance(), "getEpisodeStage");
      wrapper.instance().getEpisodeStage();
      expect(wrapper.instance().getEpisodeStage).toBeCalled();
      });

      it("should test handlePermission", () => {
        jest.spyOn(wrapper.instance(), "handlePermission");
        wrapper.instance().handlePermission();
        expect(wrapper.instance().handlePermission).toBeCalled();
      });

     
    it('should test handleTab', () => {
        const selectedTab = 0;
        wrapper.setState({...selectedTab});
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'handleTab'); 
        instance.handleTab(event,selectedTab);
        expect(instance.handleTab).toHaveBeenCalledTimes(1);
      }); 
      
      it('should test linksClickHandler', () => {
        const data = {
          isDone: true,
          sectionName: "episode",
          videoId: "2c7b3b0a-f420-4e3f-9ae5-7d6a596e8891"
        }
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'linksClickHandler'); 
        instance.linksClickHandler(data);
        expect(instance.linksClickHandler).toHaveBeenCalledTimes(1);
      });

    it('should test getEpisodeComp', () => {
      const instance = wrapper.instance(); 
      jest.spyOn(instance, 'getEpisodeComp'); 
      instance.getEpisodeComp();
      expect(instance.getEpisodeComp).toHaveBeenCalledTimes(1);
    });

    it('should test getQuickFilingEpisodeComp', () => {
      const instance = wrapper.instance(); 
      jest.spyOn(instance, 'getQuickFilingEpisodeComp'); 
      instance.getQuickFilingEpisodeComp();
      expect(instance.getQuickFilingEpisodeComp).toHaveBeenCalledTimes(1);
    });

    it('should test getSingleLandingEpisodeComp', () => {
      const instance = wrapper.instance(); 
      jest.spyOn(instance, 'getSingleLandingEpisodeComp'); 
      instance.getSingleLandingEpisodeComp();
      expect(instance.getSingleLandingEpisodeComp).toHaveBeenCalledTimes(1);
    });

    it('should test showHideAskedPopup', () => {
      const mockSet = {
        showAskedPopup: true
      }
      wrapper.setState({...mockSet});
      const instance = wrapper.instance(); 
      jest.spyOn(instance, 'showHideAskedPopup'); 
      instance.showHideAskedPopup();
      expect(instance.showHideAskedPopup).toHaveBeenCalledTimes(1);
    });

    it('should test handleRoute', () => {
      const mockSet = {
        journeyType: "1"
      }
      wrapper.setState({...mockSet});
      const instance = wrapper.instance(); 
      jest.spyOn(instance, 'handleRoute'); 
      instance.handleRoute();
      expect(instance.handleRoute).toHaveBeenCalledTimes(1);
    });

    it('should test goToEditEpisode', () => {
      const selectJourney ="quick-filing";
      wrapper.setState({...selectJourney});
      const instance = wrapper.instance(); 
      jest.spyOn(instance, 'goToEditEpisode'); 
      instance.goToEditEpisode();
      expect(instance.goToEditEpisode).toHaveBeenCalledTimes(1);
    });

   

    it('should test handleRadioButton', () => {
      const instance = wrapper.instance(); 
      jest.spyOn(instance, 'handleRadioButton'); 
      instance.handleRadioButton(event);
      expect(instance.handleRadioButton).toHaveBeenCalledTimes(1);
    });

    it('should test quickLinksEnable', () => {
      const links = [ { text: 'Related Content',
      permissionKey: 'seasons',
      permissionSubKey: 'relatedContent',
      permissionName: 'canUpdate',
      icon: 'test-file-stub',
      path: '/related-content',
      key: 'relatedContent',
      enable: false,
      visible: true }];
  
      wrapper.setState({...links});
      const instance = wrapper.instance(); 
      jest.spyOn(instance, 'quickLinksEnable'); 
      instance.quickLinksEnable(links);
      expect(instance.quickLinksEnable).toHaveBeenCalledTimes(1);
    });


    it('should test getAskedEditUI', () => {
      const instance = wrapper.instance(); 
      jest.spyOn(instance, 'getAskedEditUI'); 
      instance.getAskedEditUI();
      expect(instance.getAskedEditUI).toHaveBeenCalledTimes(1);
    });

    it('should test getOptions', () => {
      const instance = wrapper.instance(); 
      jest.spyOn(instance, 'getOptions'); 
      instance.getOptions();
      expect(instance.getOptions).toHaveBeenCalledTimes(1);
    });

   
});