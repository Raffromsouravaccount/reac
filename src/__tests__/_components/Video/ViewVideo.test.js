import React from "react";
import { shallow } from "enzyme";

import ViewVideos from "../../../_components/Video/ViewVideos";
import { findByTestAttr } from '../../../Utils';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
    const wrapper = shallow(<ViewVideos {...props} />);
    if (state) wrapper.setState(state);
    return wrapper;
};

const event = { target: { name: 'mock', value: 'test' } };

describe("ViewVideos", () => {
    let wrapper;
    let instance;
    beforeEach(() => {
        wrapper = setup();
      });
    it("Should render ViewVideo default", () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should check componentDidMount', () => {
    jest.spyOn(wrapper.instance(), "componentDidMount");
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().componentDidMount).toBeCalled();
    })

    it("should test getJsonData", () => {
        const mockSet = {
            state : "quick-filing"
        }
        wrapper.setState({...mockSet});
        jest.spyOn(wrapper.instance(), "getJsonData");
        wrapper.instance().getJsonData();
        expect(wrapper.instance().getJsonData).toBeCalled();
      });

    it("should test getVideoStatus", () => {
    jest.spyOn(wrapper.instance(), "getVideoStatus");
    wrapper.instance().getVideoStatus();
    expect(wrapper.instance().getVideoStatus).toBeCalled();
    });

    it("should test handlePermission", () => {
        jest.spyOn(wrapper.instance(), "handlePermission");
        wrapper.instance().handlePermission();
        expect(wrapper.instance().handlePermission).toBeCalled();
      });

    it("should test getVideoStatus", () => {
    jest.spyOn(wrapper.instance(), "getVideoStatus");
    wrapper.instance().getVideoStatus();
    expect(wrapper.instance().getVideoStatus).toBeCalled();
    });

    it('should test handleTab', () => {
        const selectedTab = 0;
        wrapper.setState({...selectedTab});
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'handleTab'); 
        instance.handleTab(event,selectedTab);
        expect(instance.handleTab).toHaveBeenCalledTimes(1);
      });
    
      it('should test handleRoute', () => {
          const journeyType = "1";
        wrapper.setState({...journeyType});
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'handleRoute'); 
        instance.handleRoute();
        expect(instance.handleRoute).toHaveBeenCalledTimes(1);
      });

      it('should test showHideAskedPopup', () => {
          const mockSet = {
            showAskedPopup :"1",
            selectJourney: null
          }
      wrapper.setState({...mockSet});
      const instance = wrapper.instance(); 
      jest.spyOn(instance, 'showHideAskedPopup'); 
      instance.showHideAskedPopup();
      expect(instance.showHideAskedPopup).toHaveBeenCalledTimes(1);
    });

    it('should test goToEditVideo', () => {
        const mockSet = {
          showAskedPopup :"1",
          selectJourney: null,
          videoId:"123"
        }
    wrapper.setState({...mockSet});
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'goToEditVideo'); 
    instance.goToEditVideo();
    expect(instance.goToEditVideo).toHaveBeenCalledTimes(1);
  });

  it('should test linksClickHandler', () => {
    const data = {
      isDone: true,
      sectionName: "video",
      videoId: "2c7b3b0a-f420-4e3f-9ae5-7d6a596e8891"
    }
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'linksClickHandler'); 
    instance.linksClickHandler(data);
    expect(instance.linksClickHandler).toHaveBeenCalledTimes(1);
  });

  it('should check setStage', () => {
    const instance = wrapper.instance(); 
    const defaultTab = {
        selectedTab: 0, tabLabel: "Content Properties"
    }
    wrapper.setState({ defaultTab })
    jest.spyOn(instance, 'setStage');
    instance.setStage('Draft');
    expect(instance.setStage).toBeCalled();
});

it('should test getExternalId', () => {
    const externalId = "0-0-2z51001853";
    wrapper.setState({...externalId});
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getExternalId'); 
    instance.getExternalId(externalId);
    expect(instance.getExternalId).toHaveBeenCalledTimes(1);
  });

  it('should test getVideoTabsComp', () => {
    wrapper.setProps({state: 'single-landing-page' })
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getVideoTabsComp'); 
    instance.getVideoTabsComp();
    expect(instance.getVideoTabsComp).toHaveBeenCalledTimes(1);
  });

  it('should test getQuickFilingTabsComp', () => {
    wrapper.setProps({state: 'quick-filing' })
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getQuickFilingTabsComp'); 
    instance.getQuickFilingTabsComp();
    expect(instance.getQuickFilingTabsComp).toHaveBeenCalledTimes(1);
  });
  
  it('should test handleRadioButton', () => {
  const instance = wrapper.instance(); 
  jest.spyOn(instance, 'handleRadioButton'); 
  instance.handleRadioButton(event);
  expect(instance.handleRadioButton).toHaveBeenCalledTimes(1);
});

it('should test getAskedEditUI', () => {
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getAskedEditUI'); 
    instance.getAskedEditUI();
    expect(instance.getAskedEditUI).toHaveBeenCalledTimes(1);
  });

  it('should test goToMovie', () => {
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'goToMovie'); 
    instance.goToMovie();
    expect(instance.goToMovie).toHaveBeenCalledTimes(1);
  });

  it('should test render', () => {
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'render'); 
    instance.render();
    expect(instance.render).toHaveBeenCalledTimes(1);
  });
    
    
    
});