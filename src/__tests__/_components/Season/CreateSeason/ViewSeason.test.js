import React from "react";
import { shallow } from "enzyme";

import ViewSeason from "../../../../_components/Season/CreateSeason/ViewSeason";
import { findByTestAttr } from '../../../../Utils';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
    const wrapper = shallow(<ViewSeason {...props} />);
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

    it("should test getSeasonStatus", () => {
        jest.spyOn(wrapper.instance(), "getSeasonStatus");
        wrapper.instance().getSeasonStatus();
        expect(wrapper.instance().getSeasonStatus).toBeCalled();
        });
    
      it("should test handlePermission", () => {
        jest.spyOn(wrapper.instance(), "handlePermission");
        wrapper.instance().handlePermission();
        expect(wrapper.instance().handlePermission).toBeCalled();
      });

      it('should check autoSaveError if condition', () => {
        const instance = wrapper.instance(); 
        const error = {
            data: {
                message: 'This section is locked by another user.'
            }
        }
        jest.spyOn(instance, 'autoSaveError');
        instance.autoSaveError(error);
        expect(instance.autoSaveError).toBeCalled();
    });

    it('should check autoSaveError if condition', () => {
      const instance = wrapper.instance(); 
      const error = {
          data: {
              message: 'This section is locked by another user.'
          }
      }
      jest.spyOn(instance, 'autoSaveError');
      instance.autoSaveError(error);
      expect(instance.autoSaveError).toBeCalled();
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
          sectionName: "season",
          videoId: "2c7b3b0a-f420-4e3f-9ae5-7d6a596e8891"
        }
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'linksClickHandler'); 
        instance.linksClickHandler(data);
        expect(instance.linksClickHandler).toHaveBeenCalledTimes(1);
      });

      it('should test openCreateLicenseForm', () => {
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'openCreateLicenseForm'); 
        instance.openCreateLicenseForm();
        expect(instance.openCreateLicenseForm).toHaveBeenCalledTimes(1);
      });

      it('should test openEditForm', () => {
        const data = {
          isDone: true,
          sectionName: "season",
          videoId: "2c7b3b0a-f420-4e3f-9ae5-7d6a596e8891"
        }
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'openEditForm'); 
        instance.openEditForm(data);
        expect(instance.openEditForm).toHaveBeenCalledTimes(1);
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

    it('should test handleRoute', () => {
      const selectedTab = 0;
      wrapper.setState({...selectedTab});
      const instance = wrapper.instance(); 
      jest.spyOn(instance, 'handleRoute'); 
      instance.handleRoute();
      expect(instance.handleRoute).toHaveBeenCalledTimes(1);
    });

    it('should test getSeasonComp', () => {
      const instance = wrapper.instance(); 
      jest.spyOn(instance, 'getSeasonComp'); 
      instance.getSeasonComp();
      expect(instance.getSeasonComp).toHaveBeenCalledTimes(1);
    });

    it('should test getQuickFilingSeasonComp', () => {
      const instance = wrapper.instance(); 
      jest.spyOn(instance, 'getQuickFilingSeasonComp'); 
      instance.getQuickFilingSeasonComp();
      expect(instance.getQuickFilingSeasonComp).toHaveBeenCalledTimes(1);
    });

    it('should test getSingleLandingSeasonComp', () => {
      const instance = wrapper.instance(); 
      jest.spyOn(instance, 'getSingleLandingSeasonComp'); 
      instance.getSingleLandingSeasonComp();
      expect(instance.getSingleLandingSeasonComp).toHaveBeenCalledTimes(1);
    });

    it('should test getExternalId', () => {
      const externalId = "0-0-2z51001853";
      wrapper.setState({...externalId});
      const instance = wrapper.instance(); 
      jest.spyOn(instance, 'getExternalId'); 
      instance.getExternalId(externalId);
      expect(instance.getExternalId).toHaveBeenCalledTimes(1);
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

    it('should test goToEditSeason', () => {
      const selectJourney ="3";
      wrapper.setState({...selectJourney});
      const instance = wrapper.instance(); 
      jest.spyOn(instance, 'goToEditSeason'); 
      instance.goToEditSeason();
      expect(instance.goToEditSeason).toHaveBeenCalledTimes(1);
    });

    it('should test goToSeason', () => {
      const mockSet = {
        route : "/tvshow/view/f79f7f5a-b070-4de1-803b-0dff21cd60d0/season",
        stateMode : "view"
      }
      wrapper.setState({...mockSet});
      const instance = wrapper.instance(); 
      jest.spyOn(instance, 'goToSeason'); 
      instance.goToSeason(mockSet.route);
      expect(instance.goToSeason).toHaveBeenCalledTimes(1);
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

    it('should check goToSeason onclick method', () => {
      const spy = jest.spyOn(wrapper.instance(), 'goToSeason');
      wrapper.instance().forceUpdate();
      wrapper.update();
      const button = findByTestAttr(wrapper, 'goToSeason');
      button.simulate('click');
      expect(spy).toHaveBeenCalled();
    })

    
    
});