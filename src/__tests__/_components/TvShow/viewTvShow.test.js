import React from "react";
import { shallow } from "enzyme";

import ViewTvShow from "../../../_components/TvShow/TvShow/ViewTvShow";
import { findByTestAttr } from '../../../Utils';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
    const wrapper = shallow(<ViewTvShow {...props} />);
    if (state) wrapper.setState(state);
    return wrapper;
};

const event = { target: { name: 'mock', value: 'test' } };

describe("ViewVideos", () => {
    let wrapper;
    let instance;
    const props = {
      match: {
        params: {
          id:"xyz",
          seasonId: "def"
        },
        location:{
          state:{
            selectedTab:"1"
          }
        }
      }
    }
    beforeEach(() => {
        wrapper = setup({...props});
      });
    it("Should render ViewTvShow default", () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should check componentDidMount', () => {
    jest.spyOn(wrapper.instance(), "componentDidMount");
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().componentDidMount).toBeCalled();
    })
    
    it("should test getTvShowStatus", () => {
    jest.spyOn(wrapper.instance(), "getTvShowStatus");
    wrapper.instance().getTvShowStatus();
    expect(wrapper.instance().getTvShowStatus).toBeCalled();
    });

    it("should test handlePermission", () => {
        wrapper.setProps({selectedTab : props.location?.state?.selectedTab})
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
    
      it('should test handleRoute', () => {
          const journeyType = "1";
          const route = "/tvshow/edit/c4d4d36e-faf4-4bb7-b357-3bba5285266a";
        wrapper.setState({...route});
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'handleRoute'); 
        instance.handleRoute(route);
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

    it('should test goToEditTvShow', () => {
        const mockSet = {
          showAskedPopup :"1",
          selectJourney: null,
          tvShowId:"123"
        }
    wrapper.setState({...mockSet});
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'goToEditTvShow'); 
    instance.goToEditTvShow();
    expect(instance.goToEditTvShow).toHaveBeenCalledTimes(1);
  });

  it('should test linksClickHandler', () => {
    const data = {
      isDone: true,
      sectionName: "tvShow",
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

  it('should test getTvShowTabsComp with selected Tab 1', () => {
    wrapper.setProps({state: 'single-landing-page' })
    wrapper.setState({selectedTab:"1",tvShowId:"xyz"});
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getTvShowTabsComp'); 
    instance.getTvShowTabsComp();
    expect(instance.getTvShowTabsComp).toHaveBeenCalledTimes(1);
  });

  it('should test getTvShowTabsComp with selected Tab 2', () => {
    wrapper.setProps({state: 'single-landing-page' })
    wrapper.setState({selectedTab:"2"});
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getTvShowTabsComp'); 
    instance.getTvShowTabsComp();
    expect(instance.getTvShowTabsComp).toHaveBeenCalledTimes(1);
  });

  it('should test getTvShowTabsComp with selected Tab 3', () => {
    wrapper.setProps({state: 'single-landing-page' })
    wrapper.setState({selectedTab:"3"});
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getTvShowTabsComp'); 
    instance.getTvShowTabsComp();
    expect(instance.getTvShowTabsComp).toHaveBeenCalledTimes(1);
  });

  it('should test getTvShowTabsComp with selected Tab 4', () => {
    wrapper.setProps({state: 'single-landing-page' })
    wrapper.setState({selectedTab:"4"});
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getTvShowTabsComp'); 
    instance.getTvShowTabsComp();
    expect(instance.getTvShowTabsComp).toHaveBeenCalledTimes(1);
  });

  it('should test getTvShowTabsComp with selected Tab 5', () => {
    wrapper.setProps({state: 'single-landing-page' })
    wrapper.setState({selectedTab:"5"});
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getTvShowTabsComp'); 
    instance.getTvShowTabsComp();
    expect(instance.getTvShowTabsComp).toHaveBeenCalledTimes(1);
  });

  it('should test getTvShowTabsComp with selected Tab 6', () => {
    wrapper.setProps({state: 'single-landing-page' })
    wrapper.setState({selectedTab:"6"});
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getTvShowTabsComp'); 
    instance.getTvShowTabsComp();
    expect(instance.getTvShowTabsComp).toHaveBeenCalledTimes(1);
  });

  it('should test getQuickFilingTabsComp with selectedTab 2', () => {
    wrapper.setProps({state: 'quick-filing' });
    wrapper.setState({selectedTab:"2"});
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getQuickFilingTabsComp'); 
    instance.getQuickFilingTabsComp();
    expect(instance.getQuickFilingTabsComp).toHaveBeenCalledTimes(1);
  });

  it('should test getQuickFilingTabsComp with selectedTab 3', () => {
    wrapper.setProps({state: 'quick-filing' });
    wrapper.setState({selectedTab:"3"});
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getQuickFilingTabsComp'); 
    instance.getQuickFilingTabsComp();
    expect(instance.getQuickFilingTabsComp).toHaveBeenCalledTimes(1);
  });

  it('should test getQuickFilingTabsComp with selectedTab 4', () => {
    wrapper.setProps({state: 'quick-filing' });
    wrapper.setState({selectedTab:"4"});
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getQuickFilingTabsComp'); 
    instance.getQuickFilingTabsComp();
    expect(instance.getQuickFilingTabsComp).toHaveBeenCalledTimes(1);
  });

  it('should test getQuickFilingTabsComp with selectedTab 5', () => {
    wrapper.setProps({state: 'quick-filing' });
    wrapper.setState({selectedTab:"5"});
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getQuickFilingTabsComp'); 
    instance.getQuickFilingTabsComp();
    expect(instance.getQuickFilingTabsComp).toHaveBeenCalledTimes(1);
  });

  it('should test getQuickFilingTabsComp with selectedTab 1', () => {
    wrapper.setProps({state: 'quick-filing' });
    wrapper.setState({selectedTab:"1"});
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getQuickFilingTabsComp'); 
    instance.getQuickFilingTabsComp();
    expect(instance.getQuickFilingTabsComp).toHaveBeenCalledTimes(1);
  });

  it('should test getSinglePageLandingTabsComp with selectedTab 1', () => {
    wrapper.setProps({state: 'quick-filing' });
    wrapper.setState({selectedTab:"1"});
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getSinglePageLandingTabsComp'); 
    instance.getSinglePageLandingTabsComp();
    expect(instance.getSinglePageLandingTabsComp).toHaveBeenCalledTimes(1);
  });

  it('should test getSinglePageLandingTabsComp with selectedTab 2', () => {
    wrapper.setProps({state: 'quick-filing' });
    wrapper.setState({selectedTab:"2"});
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getSinglePageLandingTabsComp'); 
    instance.getSinglePageLandingTabsComp();
    expect(instance.getSinglePageLandingTabsComp).toHaveBeenCalledTimes(1);
  });

  it('should test getSinglePageLandingTabsComp with selectedTab 3', () => {
    wrapper.setProps({state: 'quick-filing' });
    wrapper.setState({selectedTab:"3"});
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getSinglePageLandingTabsComp'); 
    instance.getSinglePageLandingTabsComp();
    expect(instance.getSinglePageLandingTabsComp).toHaveBeenCalledTimes(1);
  });

  it('should test getSinglePageLandingTabsComp with selectedTab 4', () => {
    wrapper.setProps({state: 'quick-filing' });
    wrapper.setState({selectedTab:"4"});
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getSinglePageLandingTabsComp'); 
    instance.getSinglePageLandingTabsComp();
    expect(instance.getSinglePageLandingTabsComp).toHaveBeenCalledTimes(1);
  });

  it('should test getSinglePageLandingTabsComp with selectedTab 5', () => {
    wrapper.setProps({state: 'quick-filing' });
    wrapper.setState({selectedTab:"5"});
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getSinglePageLandingTabsComp'); 
    instance.getSinglePageLandingTabsComp();
    expect(instance.getSinglePageLandingTabsComp).toHaveBeenCalledTimes(1);
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

  it('should test goToTvShow', () => {
    const route = "/tvshow/edit/c4d4d36e-faf4-4bb7-b357-3bba5285266a";
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'goToTvShow'); 
    instance.goToTvShow(route);
    expect(instance.goToTvShow).toHaveBeenCalledTimes(1);
  });

  it('should test render', () => {
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'render'); 
    instance.render();
    expect(instance.render).toHaveBeenCalledTimes(1);
  });

  it('should test getOptions if condition', () => {
    const tvShowState = "quickFiling";
    wrapper.setState({...tvShowState});
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getOptions'); 
    instance.getOptions();
    expect(instance.getOptions).toHaveBeenCalledTimes(1);
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

  it('should check goToTvShow onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'goToTvShow');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'goToTvShow');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })
    
    
});