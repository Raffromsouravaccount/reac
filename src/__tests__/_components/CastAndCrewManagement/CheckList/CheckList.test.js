import React from 'react';
import { shallow } from 'enzyme';
import moxios from 'moxios';

import CheckListComp from '../../../../_components/CastAndCrewManagement/CheckList/CheckList';
import { findByTestAttr } from '../../../../Utils';
import BadgeBox from '../../../../_components/Common/BadgeBox/BadgeBox';
import { CommonModel } from '../../../../_components/Common/Model/CommonModel';
import OtherLangModel from '../../../../_components/Common/Model/OtherLangModel';
import axios from "../../../../_helpers/axiosInstance";

// Service

/**
 * Factory function to create a ShallowWrapper for the checklistcomp Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
  const wrapper = shallow(<CheckListComp {...props} />)
  if (state) wrapper.setState(state);
  return wrapper;
}

describe('<CheckListComp />', () => {
  let wrapper;
  const contentId = '3cea4d09-495c-43df-ad9b-b25a89c80c4a';
  beforeEach(() => {
    moxios.install(axios)
    wrapper = setup(null, {contentId});
  });

  afterEach(() => {
    moxios.uninstall(axios);
  });

  it('Should renders CheckListComp default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should test publishContent', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'publishContent');
    instance.publishContent();
    expect(instance.publishContent).toHaveBeenCalledTimes(1);
  })

  it('should test handleMultiSelect', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleMultiSelect');
    instance.handleMultiSelect();
    expect(instance.handleMultiSelect).toHaveBeenCalledTimes(1);
  })

  it('should test closeModel', () => {
    const model = {
      btn1: "Yes",
      btn2: "No",
      desc: "Are you sure you want to unpublish this profile?",
      detail: { type: "Published" },
      disableBackdropClick: false,
      open: true,
      showBtn1: true,
      showBtn2: true,
      title: "Unpublish"
    }
    const wrapper = setup(null, { model });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'closeModel');
    instance.closeModel();
    expect(instance.closeModel).toHaveBeenCalledTimes(1);
  })

  it('should test handleModel', () => {
    const modelAction = {
      btn1: "Yes",
      btn2: "No",
      desc: "Are you sure you want to unpublish this profile?",
      detail: { type: "Published" },
      disableBackdropClick: false,
      open: true,
      showBtn1: true,
      showBtn2: true,
      title: "Unpublished",
      detail: {
        type: "Unpublished"
      }
    }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleModel');
    instance.handleModel(true, modelAction);
    expect(instance.handleModel).toHaveBeenCalledTimes(1);
  })

  it('should test handleModel if condition', () => {
    const modelAction = {
      btn1: "Yes",
      btn2: "No",
      desc: "Are you sure you want to unpublish this profile?",
      detail: { type: "Published" },
      disableBackdropClick: false,
      open: true,
      showBtn1: true,
      showBtn2: true,
      title: "Unpublished",
      detail: {
        type: "Published"
      }
    }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleModel');
    instance.handleModel(true, modelAction);
    expect(instance.handleModel).toHaveBeenCalledTimes(1);
  })

  it('should test handleModel if condition contentPubUnpub ', () => {
    const modelAction = {
      btn1: "Yes",
      btn2: "No",
      desc: "Are you sure you want to unpublish this profile?",
      detail: { type: "Published" },
      disableBackdropClick: false,
      open: true,
      showBtn1: true,
      showBtn2: true,
      title: "Unpublished",
      detail: {
        contentPubUnpub: true
      }
    }
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleModel');
    instance.handleModel(true, modelAction);
    expect(instance.handleModel).toHaveBeenCalledTimes(1);
  })

  it('should test handleModel else condition', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'handleModel');
    instance.handleModel();
    expect(instance.handleModel).toHaveBeenCalledTimes(1);
  })

  it('should test showHideOtherLangModel', () => {
    const selectedLangArr = [{ value: 'test' }]
    const wrapper = setup(null, { selectedLangArr });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'showHideOtherLangModel');
    instance.showHideOtherLangModel(false);
    expect(instance.showHideOtherLangModel).toHaveBeenCalledTimes(1);
  })

  it('should test unPublishContent', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'unPublishContent');
    instance.unPublishContent();
    expect(instance.unPublishContent).toHaveBeenCalledTimes(1);
  })

  it('should test serverCallsAction', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'serverCallsAction');
    instance.serverCallsAction();
    expect(instance.serverCallsAction).toHaveBeenCalledTimes(1);
  })

  it('should test showProfileModelAlert', () => {
    const model = {
      btn1: "Yes",
      btn2: "No",
      desc: "",
      detail: "",
      disableBackdropClick: false,
      open: false,
      showBtn1: true,
      showBtn2: true,
    };
    const status = 'Unpublished';
    const wrapper = setup(null, { model, status })
    const instance = wrapper.instance();
    jest.spyOn(instance, 'showProfileModelAlert');
    instance.showProfileModelAlert();
    expect(instance.showProfileModelAlert).toHaveBeenCalledTimes(1);
  })

  it('should test showProfileModelAlert else condition', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'showProfileModelAlert');
    instance.showProfileModelAlert();
    expect(instance.showProfileModelAlert).toHaveBeenCalledTimes(1);
  })

  it('should test selectLanguage method', () => {
    const langObj = { id: "1007afb0-65ea-4978-bd51-21b0f3b05c20", code: "id", title: "Assamese" };
    const keyText = 'title';
    const selectedLangArr = [{ id: "e9068506-fed4-47cb-825a-b2b85a75a701", code: "as", title: "Assamese" }];
    const selectedLang = ["Assamese"];
    const wrapper = setup(null, { selectedLang, selectedLangArr });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'selectLanguage');
    instance.selectLanguage(langObj, keyText);
    expect(instance.selectLanguage).toHaveBeenCalledTimes(1);
  })

  it('should test selectLanguage method else condition', () => {
    const langObj = { id: "1007afb0-65ea-4978-bd51-21b0f3b05c20", code: "id", title: "Assamese" };
    const keyText = 'title';
    const selectedLangArr = [{ id: "e9068506-fed4-47cb-825a-b2b85a75a701", code: "as", title: "Assamese" }];
    const selectedLang = ["text"];
    const wrapper = setup(null, { selectedLang, selectedLangArr });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'selectLanguage');
    instance.selectLanguage(langObj, keyText);
    expect(instance.selectLanguage).toHaveBeenCalledTimes(1);
  })

  it('should test checkPublishUnpublishPermission', () => {
    const status = "Published";
    const isDisabled = true;
    const wrapper = setup(null, { status, isDisabled })
    const instance = wrapper.instance();
    jest.spyOn(instance, 'checkPublishUnpublishPermission');
    instance.checkPublishUnpublishPermission();
    expect(instance.checkPublishUnpublishPermission).toHaveBeenCalledTimes(1);
  })

  it('Should renders BadgeBox default', () => {
    expect(wrapper.containsMatchingElement(<BadgeBox />)).toEqual(true);
  })

  it('Should renders CommonModel default', () => {
    expect(wrapper.containsMatchingElement(<CommonModel />)).toEqual(true);
  })

  it('Should renders OtherLangModel default', () => {
    expect(wrapper.containsMatchingElement(<OtherLangModel />)).toEqual(true);
  })

  it('should check getCheckListData', () => {
    jest.spyOn(wrapper.instance(), 'getCheckListData');
    wrapper.instance().getCheckListData();
    expect(wrapper.instance().getCheckListData).toBeCalled();
  })

  it('should check getAllStatus', () => {
    jest.spyOn(wrapper.instance(), 'getAllStatus');
    wrapper.instance().getAllStatus();
    expect(wrapper.instance().getAllStatus).toBeCalled();
  })

  it('should check componentDidMount', () => {
    jest.spyOn(wrapper.instance(), 'componentDidMount');
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().componentDidMount).toBeCalled();
  })

  it('should check getCastTranslations', () => {
    jest.spyOn(wrapper.instance(), 'getCastTranslations');
    wrapper.instance().getCastTranslations();
    expect(wrapper.instance().getCastTranslations).toBeCalled();
  })
  
  it('should check getCastData', () => {
    jest.spyOn(wrapper.instance(), 'getCastData');
    wrapper.instance().getCastData();
    expect(wrapper.instance().getCastData).toBeCalled();
  })

  it('should check getButtonText', () => {
    wrapper.setState({status: 'Unpublished'})
    jest.spyOn(wrapper.instance(), 'getButtonText');
    wrapper.instance().getButtonText();
    expect(wrapper.instance().getButtonText).toBeCalled();
  })


});