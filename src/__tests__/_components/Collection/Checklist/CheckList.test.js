import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import CheckListComp from '../../../../_components/Collection/CreateCollection/CheckList/CheckList';
import { findByTestAttr } from '../../../../Utils';
import Adapter from 'enzyme-adapter-react-16';


/**
 * Factory function to create a ShallowWrapper for the License Component.
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

describe('CheckList', () => {
  Enzyme.configure({ adapter: new Adapter() });
  let wrapper;

  beforeEach(() => {
    wrapper = setup();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should renders CheckList default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should check showProfileModelAlert method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'showProfileModelAlert');
    instance.showProfileModelAlert();
    expect(instance.showProfileModelAlert).toBeCalled();
  })

  it('should check showConfirmModal method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'showConfirmModal');
    instance.showConfirmModal();
    expect(instance.showConfirmModal).toBeCalled();
  })

  it('should check serverCallsAction method', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'serverCallsAction');
    instance.serverCallsAction();
    expect(instance.serverCallsAction).toBeCalled();
  })
  
  it('should check selectLanguage method', () => {
    const langObj = { code: "id", id: "1007afb0-65ea-4978-bd51-21b0f3b05c20", title: "Bahasa (Indonesia)" }
    const keyText = 'title';
    const selectedLang = ["Assamese", "Bahasa (Indonesia)"];
    wrapper.setState({ selectedLang });
    const instance = wrapper.instance();
    jest.spyOn(instance, 'selectLanguage');
    instance.selectLanguage(langObj, keyText);
    expect(instance.selectLanguage).toBeCalled();
  })

  it('should check selectLanguage method else condition', () => {
    const langObj = { code: "id", id: "1007afb0-65ea-4978-bd51-21b0f3b05c20", title: "Bahasa (Indonesia)" }
    const keyText = 'title';
    const instance = wrapper.instance();
    jest.spyOn(instance, 'selectLanguage');
    instance.selectLanguage(langObj, keyText);
    expect(instance.selectLanguage).toBeCalled();
  })

  it('should check checkSubmitReviewPermission', () => {
    wrapper.setState({ status: 'Archived', translationDone: true })
    jest.spyOn(wrapper.instance(), 'checkSubmitReviewPermission');
    wrapper.instance().checkSubmitReviewPermission();
    expect(wrapper.instance().checkSubmitReviewPermission).toBeCalled();
  })

  it('should check getPublishedUI', () => {
    jest.spyOn(wrapper.instance(), 'getPublishedUI');
    wrapper.instance().getPublishedUI();
    expect(wrapper.instance().getPublishedUI).toBeCalled();
  })
  
  it('should check getPublishHistoryComp', () => {
    jest.spyOn(wrapper.instance(), 'getPublishHistoryComp');
    wrapper.instance().getPublishHistoryComp();
    expect(wrapper.instance().getPublishHistoryComp).toBeCalled();
  })
  
  it('should check getPublishComp', () => {
    const allCountries = [{title: 'allcountrye'}];
    wrapper.setState({ allCountries })
    jest.spyOn(wrapper.instance(), 'getPublishComp');
    wrapper.instance().getPublishComp();
    expect(wrapper.instance().getPublishComp).toBeCalled();
  })

  it('should check closeModel', () => {
    jest.spyOn(wrapper.instance(), 'closeModel');
    wrapper.instance().closeModel();
    expect(wrapper.instance().closeModel).toBeCalled();
  })

  it('should check handleModel else condition', () => {
    const modelAction = {
      detail: {
        type: 'Published'
      }
    }
    jest.spyOn(wrapper.instance(), 'handleModel');
    wrapper.instance().handleModel(true, modelAction);
    expect(wrapper.instance().handleModel).toBeCalled();
  })

  it('should check handleModel else condition for unpublished', () => {
    const unPublishedSelCountryData = [{name: 'test'}]
    const modelAction = {
      detail: {
        type: 'Unpublished'
      }
    }
    wrapper.setState({ unPublishedSelCountryData });
    jest.spyOn(wrapper.instance(), 'handleModel');
    wrapper.instance().handleModel(true, modelAction);
    expect(wrapper.instance().handleModel).toBeCalled();
  })

  it('should check handleModel', () => {
    const modelAction = {
      detail: {
        type: 'confirmed'
      }
    }
    jest.spyOn(wrapper.instance(), 'handleModel');
    wrapper.instance().handleModel(false, modelAction);
    expect(wrapper.instance().handleModel).toBeCalled();
  })

  it('should test UnPublishContent method', () => {
    jest.spyOn(wrapper.instance(), 'UnPublishContent');
    wrapper.instance().UnPublishContent();
    expect(wrapper.instance().UnPublishContent).toBeCalled();
  })
  
  it('should test UnPublishContent method else condition', () => {
    const unPublishedSelCountryData = []
    wrapper.setState({unPublishedSelCountryData});
    jest.spyOn(wrapper.instance(), 'UnPublishContent');
    wrapper.instance().UnPublishContent();
    expect(wrapper.instance().UnPublishContent).toBeCalled();
  })

  it('should test publishContent method', () => {
    jest.spyOn(wrapper.instance(), 'publishContent');
    wrapper.instance().publishContent();
    expect(wrapper.instance().publishContent).toBeCalled();
  })
  
  it('should test showHidePublishedModel method', () => {
    jest.spyOn(wrapper.instance(), 'showHidePublishedModel');
    wrapper.instance().showHidePublishedModel();
    expect(wrapper.instance().showHidePublishedModel).toBeCalled();
  })
  
  it('should test showHideUnPublishedModel method', () => {
    const data = [{title: 'show hide unpublish'}]
    jest.spyOn(wrapper.instance(), 'showHideUnPublishedModel');
    wrapper.instance().showHideUnPublishedModel(data);
    expect(wrapper.instance().showHideUnPublishedModel).toBeCalled();
  })
  
  it('should test showHideOtherLangModel method', () => {
    jest.spyOn(wrapper.instance(), 'showHideOtherLangModel');
    wrapper.instance().showHideOtherLangModel();
    expect(wrapper.instance().showHideOtherLangModel).toBeCalled();
  })
  
  it('should test handleMultiSelect method', () => {
    jest.spyOn(wrapper.instance(), 'handleMultiSelect');
    wrapper.instance().handleMultiSelect();
    expect(wrapper.instance().handleMultiSelect).toBeCalled();
  })
  
  it('should test getUnUsedCountry method', () => {
    jest.spyOn(wrapper.instance(), 'getUnUsedCountry');
    wrapper.instance().getUnUsedCountry();
    expect(wrapper.instance().getUnUsedCountry).toBeCalled();
  })

  it('should test getUnPublishHistoryComp method', () => {
    jest.spyOn(wrapper.instance(), 'getUnPublishHistoryComp');
    wrapper.instance().getUnPublishHistoryComp();
    expect(wrapper.instance().getUnPublishHistoryComp).toBeCalled();
  })

  it('should test getLanguageList method', () => {
    jest.spyOn(wrapper.instance(), 'getLanguageList');
    wrapper.instance().getLanguageList();
    expect(wrapper.instance().getLanguageList).toBeCalled();
  })
  
  it('should test getCollectionHistory method', () => {
    jest.spyOn(wrapper.instance(), 'getCollectionHistory');
    wrapper.instance().getCollectionHistory();
    expect(wrapper.instance().getCollectionHistory).toBeCalled();
  })

  it('should test getCollectionData method', () => {
    jest.spyOn(wrapper.instance(), 'getCollectionData');
    wrapper.instance().getCollectionData();
    expect(wrapper.instance().getCollectionData).toBeCalled();
  })

  it('should test getCheckListData method', () => {
    jest.spyOn(wrapper.instance(), 'getCheckListData');
    wrapper.instance().getCheckListData();
    expect(wrapper.instance().getCheckListData).toBeCalled();
  })
  
  it('should test getLicenseCountry method', () => {
    jest.spyOn(wrapper.instance(), 'getLicenseCountry');
    wrapper.instance().getLicenseCountry();
    expect(wrapper.instance().getLicenseCountry).toBeCalled();
  })

  it('should test getAllStatus method', () => {
    jest.spyOn(wrapper.instance(), 'getAllStatus');
    wrapper.instance().getAllStatus();
    expect(wrapper.instance().getAllStatus).toBeCalled();
  })

  it('should test componentDidMount method', () => {
    jest.spyOn(wrapper.instance(), 'componentDidMount');
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().componentDidMount).toBeCalled();
  })

});