import React from "react";
import { shallow } from "enzyme";
import moxios from 'moxios';

import TvShow from "../../../_components/TvShow/TvShow/TvShow";
import { findByTestAttr } from "../../../Utils";
import { expect, it, jest } from "@jest/globals";

import axios from "../../../_helpers/axiosInstance";

const setup = (props = {}, state = {}) => {
  const wrapper = shallow(<TvShow {...props}/>);
  if (state) wrapper.setState(state);
  return wrapper;
};

const event = { target: { name: 'mock', value: 'test' } };

describe("TvShow", () => {
  let wrapper;
  let instance;
  const props = {
      match:{
          params:{
              id:"xyz"
          }
      }
  }
  beforeEach(() => {
    wrapper = setup({...props});
  });

  it("render component without error", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should test componentDidMount", () => {
    jest.spyOn(wrapper.instance(), "componentDidMount");
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().componentDidMount).toBeCalled();
  });

  it("should test getTvShowId", () => {
    jest.spyOn(wrapper.instance(), "getTvShowId");
    wrapper.instance().getTvShowId();
    expect(wrapper.instance().getTvShowId).toBeCalled();
  });

  it("should test setTvShowId", () => {
    const setTvShowId = "c79418d8-a8a8-4729-b139-6c2bac057e63"
    wrapper.setState({...setTvShowId});
    jest.spyOn(wrapper.instance(), "setTvShowId");
    wrapper.instance().setTvShowId(setTvShowId);
    expect(wrapper.instance().setTvShowId).toBeCalled();
  });

  it("should test getTvShowStatus", () => {
    jest.spyOn(wrapper.instance(), "getTvShowStatus");
    wrapper.instance().getTvShowStatus();
    expect(wrapper.instance().getTvShowStatus).toBeCalled();
  });


  it("should test handlePermission", () => {
    jest.spyOn(wrapper.instance(), "handlePermission");
    wrapper.instance().handlePermission();
    expect(wrapper.instance().handlePermission).toBeCalled();
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
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'markAsDone');
    instance.markAsDone();
    expect(instance.markAsDone).toBeCalled();
});

  it('should test unLockedSession', () => {
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'unLockedSession'); 
    instance.unLockedSession(0);
    expect(instance.unLockedSession).toHaveBeenCalledTimes(1);
  });

  it('should test markAsDoneNLockedAction', () => {
    const data = {
      isDone: true,
      sectionName: "video",
      videoId: "2c7b3b0a-f420-4e3f-9ae5-7d6a596e8891"
    }
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'markAsDoneNLockedAction'); 
    instance.markAsDoneNLockedAction(data);
    expect(instance.markAsDoneNLockedAction).toHaveBeenCalledTimes(1);
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
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'handleRoute'); 
    instance.handleRoute();
    expect(instance.handleRoute).toHaveBeenCalledTimes(1);
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

  it('should test openCreateLicenseForm', () => {
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'openCreateLicenseForm'); 
    instance.openCreateLicenseForm();
    expect(instance.openCreateLicenseForm).toHaveBeenCalledTimes(1);
  });

  it('should test openEditForm', () => {
    const data = {
      isDone: true,
      sectionName: "tvShow",
      tvShowId: "2c7b3b0a-f420-4e3f-9ae5-7d6a596e8891"
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
})

  it('should test setTitle', () => {
    const tvShowTitle = test;
    wrapper.setState({...tvShowTitle});
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'setTitle'); 
    instance.setTitle(tvShowTitle);
    expect(instance.setTitle).toHaveBeenCalledTimes(1);
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
})


  it('should test getExternalId', () => {
    const externalId = "0-0-2z51001853";
    wrapper.setState({...externalId});
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getExternalId'); 
    instance.getExternalId(externalId);
    expect(instance.getExternalId).toHaveBeenCalledTimes(1);
  });
  
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

  it('should test getOptions', () => {
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getOptions'); 
    instance.getOptions();
    expect(instance.getOptions).toHaveBeenCalledTimes(1);
  });

  it('should test getTvShowTabsComp', () => {
    wrapper.setProps({state: 'single-landing-page' })
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getTvShowTabsComp'); 
    instance.getTvShowTabsComp();
    expect(instance.getTvShowTabsComp).toHaveBeenCalledTimes(1);
  });

  it('should test getQuickFilingTabsComp', () => {
    wrapper.setProps({state: 'quick-filing' })
    wrapper.setState({createLicenseForm : true,tvShowId : "f79f7f5a-b070-4de1-803b-0dff21cd60d0"})
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getQuickFilingTabsComp'); 
    instance.getQuickFilingTabsComp();
    expect(instance.getQuickFilingTabsComp).toHaveBeenCalledTimes(1);
  });

  it('should test getSingleLandingTabsComp', () => {
    wrapper.setProps({state: 'quick-filing' })
    const instance = wrapper.instance(); 
    jest.spyOn(instance, 'getSingleLandingTabsComp'); 
    instance.getSingleLandingTabsComp();
    expect(instance.getSingleLandingTabsComp).toHaveBeenCalledTimes(1);
  });

  it('should check handleRoute onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleRoute');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'handleRoute');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  




});
