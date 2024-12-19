import React from "react";
import { shallow } from "enzyme";
import {findByTestAttr} from '../../../../Utils';

import CreateEpisode from "../../../../_components/Episode/CreateEpisode/CreateEpisode";

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
    const wrapper = shallow(<CreateEpisode {...props} />);
    if (state) wrapper.setState(state);
    return wrapper;
};

const event = { target: { name: 'mock', value: 'test' } };

describe("CreateEpisode", () => {
    let wrapper;
    let instance;
    beforeEach(() => {
        const props = {
            match: {
                params: {
                    id: '123',
                    seasonId: '1234',
                    episodeId: '12345'
                }
            },
            state: 'quick-filing',
            location:{
              pathname:"episode/quick"
            }
        }
        wrapper = setup({ ...props });
        instance = wrapper.instance(); 
    });

    it("Should render CreateSeason default", () => {
        expect(wrapper.exists()).toBe(true);
    });

    it("Should test componentDidMount", () => {
        jest.spyOn(instance, 'componentDidMount');
        instance.componentDidMount();
        expect(instance.componentDidMount).toBeCalled();
    });   

    it("Should test componentDidMount else part", () => {
      const props = {}
      wrapper.setProps({...props});
      jest.spyOn(instance, 'componentDidMount');
      instance.componentDidMount();
      expect(instance.componentDidMount).toBeCalled();
  }); 

    it("Should test getJourneyType if condn", () => {

      jest.spyOn(instance, 'getJourneyType');
      instance.getJourneyType();
      expect(instance.getJourneyType).toBeCalled();
    }); 
    
    it("Should test getJourneyType else condn", () => {
      const props = {
        match: {
            params: {
                id: '123',
                seasonId: '1234',
                episodeId: '12345'
            }
        },
        state: 'quick-filing',
        location:{
          pathname:"episode/single"
        }
    }
      wrapper.setProps({...props})
      jest.spyOn(instance, 'getJourneyType');
      instance.getJourneyType();
      expect(instance.getJourneyType).toBeCalled();
    }); 

      it("Should test getEpisodeStage", () => {
        jest.spyOn(instance, 'getEpisodeStage');
        instance.getEpisodeStage();
        expect(instance.getEpisodeStage).toBeCalled();
    });   
       
    it("Should test getEpisodeId", () => {
        const episodeId = "affe119e-6c0d-4004-80ba-c27a50d84acf";
        wrapper.setState({...episodeId});
        jest.spyOn(instance, 'getEpisodeId');
        instance.getEpisodeId();
        expect(instance.getEpisodeId).toBeCalled();
    });  
    
    it("Should test setEpisodeId", () => {
        const mockSet = {
            seasonId : "8067e5a0-14eb-4b61-8645-d544cdddfd28",
            episodeId : "8067e5a0-14eb-4b61-8645-d544cdddfd29",
            tvshowId : "8067e5a0-14eb-4b61-8645-d544cdddfd29",
            journeyType : '3'
        }
        wrapper.setState({...mockSet});
        jest.spyOn(instance, 'setEpisodeId');
        instance.setEpisodeId(mockSet.seasonId, mockSet.tvshowId);
        expect(instance.setEpisodeId).toBeCalled();
    }); 

    it("Should test getEpisodeStatus if condition", () => {
        const checkIsDone = true;
        wrapper.setState({...checkIsDone});
        jest.spyOn(instance, 'getEpisodeStatus');
        instance.getEpisodeStatus();
        expect(instance.getEpisodeStatus).toBeCalled();
    });

    it("Should test getEpisodeStatus else condition", () => {
      const mockSet = {
        leftTab : {
          isDone: false,
          isLocked: false,
          label: "Episode Properties",
          lockedBy: "",
          main: true,
          permissionKey: "episodes",
          permissionName: "canUpdate",
          permissionSubKey: "contentPropertiesModule",
          quickFiling: true,
          sectionName: "properties",
          singleLanding: true
        },
        response:[]
      }
      
      wrapper.setState({...mockSet});
      jest.spyOn(instance, 'getEpisodeStatus');
      instance.getEpisodeStatus();
      expect(instance.getEpisodeStatus).toBeCalled();
  });

      it('should test markAsDone', () => {
        const isDone = true;
        wrapper.setState({...isDone});
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'markAsDone'); 
        instance.markAsDone(1, true);
        expect(instance.markAsDone).toHaveBeenCalledTimes(1);
      });

    it("Should test markAsDone for else condition", () => {
        jest.spyOn(instance, 'markAsDone');
        instance.markAsDone();
        expect(instance.markAsDone).toBeCalled();
    });

    it("Should test handlePermission", () => {
        jest.spyOn(instance, 'handlePermission');
        instance.handlePermission();
        expect(instance.handlePermission).toBeCalled();
    });

    it("Should test unLockedSession ", () => {
        jest.spyOn(instance, 'unLockedSession');
        instance.unLockedSession();
        expect(instance.unLockedSession).toBeCalled();
    });

    it('should test markAsDoneNLockedAction', () => {
        const data = {
          isDone: true,
          sectionName: "season",
          videoId: "2c7b3b0a-f420-4e3f-9ae5-7d6a596e8891"
        }
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'markAsDoneNLockedAction'); 
        instance.markAsDoneNLockedAction(data);
        expect(instance.markAsDoneNLockedAction).toHaveBeenCalledTimes(1);
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
          sectionName: "episode",
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

    it('should check autoSaveError', () => {
        jest.spyOn(instance, 'autoSaveError');
        instance.autoSaveError();
        expect(instance.autoSaveError).toBeCalled();
    });

    it('should check getEpisodeComp with selected tab 0', () => {
        const mockSet = {
          selectedTab : 0,
          tvShowId:'123',
          seasonId: '1234',
          episodeId: '2343'
        }
        wrapper.setState({...mockSet});
        wrapper.setProps({state: 'single-landing-page' })
        jest.spyOn(instance, 'getEpisodeComp');
        instance.getEpisodeComp();
        expect(instance.getEpisodeComp).toBeCalled();
    })

    it('should check handleRoute onclick method', () => {
        const spy = jest.spyOn(wrapper.instance(), 'handleRoute');
        wrapper.instance().forceUpdate();
        wrapper.update();
        const button = findByTestAttr(wrapper, 'handleRoute');
        button.simulate('click');
        expect(spy).toHaveBeenCalled();
      })

      it('should check getQuickFilingEpisodeComp', () => {
        wrapper.setProps({state: 'single-landing-page' })
        jest.spyOn(instance, 'getQuickFilingEpisodeComp');
        instance.getQuickFilingEpisodeComp();
        expect(instance.getQuickFilingEpisodeComp).toBeCalled();
    })

  
    it('should check getSingleLandingEpisodeComp', () => {
        wrapper.setProps({state: 'single-landing-page' })
        jest.spyOn(instance, 'getSingleLandingEpisodeComp');
        instance.getSingleLandingEpisodeComp();
        expect(instance.getSingleLandingEpisodeComp).toBeCalled();
    })
    
      it('should test quickLinksEnable', () => {
        const links = [ { text: 'Related Content',
        permissionKey: 'videos',
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

      it('should test render', () => {
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'render'); 
        instance.render();
        expect(instance.render).toHaveBeenCalledTimes(1);
      });
      
      it('should test getOptions with season state quickFiling', () => {
        const seasonState = "quickFiling";
        wrapper.setState({...seasonState});
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'getOptions'); 
        instance.getOptions();
        expect(instance.getOptions).toHaveBeenCalledTimes(1);
      });

      it('should test getOptions with season state singleLanding', () => {
        const seasonState = "singleLanding";
        wrapper.setState({...seasonState});
        const instance = wrapper.instance(); 
        jest.spyOn(instance, 'getOptions'); 
        instance.getOptions();
        expect(instance.getOptions).toHaveBeenCalledTimes(1);
      });

      it('should check handleTab', () => {
        jest.spyOn(instance, 'handleTab');
        instance.handleTab();
        expect(instance.handleTab).toBeCalled();
    })
      
    
    

  
     
});