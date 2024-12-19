import React from 'react';
import { shallow } from 'enzyme';

import CreateEditRole from '../../../../_components/RoleManagement/CreateRole/CreateEditRole';
import { findByTestAttr, storeFactory } from '../../../../Utils';
import ButtonField from '../../../../_components/Common/ButtonField/ButtonField';
import SelectWithSearch from '../../../../_components/Common/SelectWithSearch/SelectWithSearch';

import InputField from '../../../../_components/Common/InputField/InputField';
import DropDown from '../../../../_components/Common/DropDown/DropDown';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (initialState = {}, props = {}, state = {}) => {
  const store = storeFactory(initialState);
  const wrapper = shallow(<CreateEditRole store={store} {...props} />).dive();
  return wrapper;
}


describe('CreateEditRole', () => {
  let wrapper;
  const props = {
    match: {
      isExact: true, params: { id: "9a96d773-719d-4f0d-b7a0-e8e2348096c7" },
      path: "/role/create/:id", url: "/role/view/9a96d773-719d-4f0d-b7a0-e8e2348096c7"
    }
  }
  const allPermission = [
    {
      ParentModule: "Content Management",
      ModulePermission: [{
        Module: "Movie", "SubModule": {
          "Properties": { "DisplayName": "Properties", "CreateEdit": 0, "View": 1 },
          Video: { "DisplayName": "Video", "CreateEdit": 0, "View": 1 },
          Images: { "DisplayName": "Images", "CreateEdit": 0, "View": 1 },
          CastAndCrew: { "DisplayName": "Cast And Crew", "CreateEdit": 0, "View": 1 },
          RelatedContent: { "DisplayName": "Related Content", "CreateEdit": 0, "View": 1 },
          Publish: { "DisplayName": "Publish", "CreateEdit": 0, "View": 1 },
          Review: { "DisplayName": "Review", "CreateEdit": 0, "View": 1 },
          CloneContent: { "DisplayName": "Clone Content", "CreateEdit": 0, "View": 1 },
          SEOSection: { "DisplayName": "SEO Meta Data", "CreateEdit": 0, "View": 1 },
          LicensingModule: { "DisplayName": "Licensing Module", "CreateEdit": 0, "View": 1 },
          ContentTranslations: { "DisplayName": "Content Translations", "CreateEdit": 0, "View": 1 },
          CollectionAssignment: { "DisplayName": "Collection Assignment", "CreateEdit": 0, "View": 1 },
          MapContent: { "DisplayName": "Map Content", "CreateEdit": 0, "View": 1 }
        }
      },
      {
        Module: "Shows", "SubModule": {
          Properties: { "DisplayName": "Properties", "CreateEdit": 0, "View": 1 },
          Video: { "DisplayName": "Video", "CreateEdit": 0, "View": 1 },
          Images: { "DisplayName": "Images", "CreateEdit": 0, "View": 1 },
          RelatedContent: { "DisplayName": "Related Content", "CreateEdit": 0, "View": 1 },
          CastAndCrew: { "DisplayName": "Cast And Crew", "CreateEdit": 0, "View": 1 },
          Publish: { "DisplayName": "Publish", "CreateEdit": 0, "View": 1 },
          Review: { "DisplayName": "Review", "CreateEdit": 0, "View": 1 },
          CloneContent: { "DisplayName": "Clone Content", "CreateEdit": 0, "View": 1 },
          SEOSection: { "DisplayName": "SEO Meta Data", "CreateEdit": 0, "View": 1 },
          LicensingModule: { "DisplayName": "Licensing Module", "CreateEdit": 0, "View": 1 },
          ContentTranslations: { "DisplayName": "Content Translations", "CreateEdit": 0, "View": 1 },
          CollectionAssignment: { "DisplayName": "Collection Assignment", "CreateEdit": 0, "View": 1 },
          MapContent: { "DisplayName": "Map Content", "CreateEdit": 0, "View": 1 }
        }
      }]
    }]
  const role_details = { description: "this is description", id: "9a96d773-719d-4f0d-b7a0-e8e2348096c7", name: "Translator" };
  beforeEach(() => {
    wrapper = setup();
    wrapper.setState({ allPermission, Permission: allPermission });
    wrapper.setProps({ ...props });
  });

  it('Should renders Create Role default', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should check the selectwithsearch component', () => {
    expect(wrapper.containsMatchingElement(<SelectWithSearch />)).toEqual(true);
  });

  it('should check the buttonfield component', () => {
    expect(wrapper.containsMatchingElement(<ButtonField />)).toEqual(true);
  });

  it('should check the InputField component', () => {
    expect(wrapper.containsMatchingElement(<InputField />)).toEqual(true);
  })

  it('should check createUpdateRole onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'createUpdateRole');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'create-update-role');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should check onChange method of name inputfield', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleChange');
    const event = { target: { name: 'name', value: 'test' } };
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'role-name-input');
    button.simulate('change', event);
    expect(spy).toHaveBeenCalled();
  })

  it('should check onChange method of description inputfield', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleChange');
    const event = { target: { name: 'description', value: 'test' } };
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'role-description-input');
    button.simulate('change', event);
    expect(spy).toHaveBeenCalled();
  })

  it('should check handle module select', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleModuleSelect');
    const event = { target: { name: 'selectedContentType', value: 'test' } };
    const value = [{
      ModulePermission: [{ Module: "Movie", SubModule: {}, selectAll: false }],
      ParentModule: "Content Management"
    }]
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'role-module-select');
    button.simulate('change', event, '', '', value);
    expect(spy).toHaveBeenCalled();
  })


  it('should check handleContentSelect', () => {
    const contentTypeArr = ['test', 'test1'];
    wrapper.setState({ contentTypeArr })
    const spy = jest.spyOn(wrapper.instance(), 'handleContentSelect');
    const event = { target: { name: 'selectedContentType', value: 'test' } };
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'role-content-select');
    button.simulate('change', event);
    expect(spy).toHaveBeenCalled();
  })

  it('should check text', () => {
    const edit = true;
    wrapper.setState({ edit });
    const titleText = findByTestAttr(wrapper, 'create-u-form-text');
    expect(titleText.text()).toMatch('Change Status');
  })

  it('should check Dropdown', () => {
    const edit = true;
    wrapper.setState({ edit });
    expect(wrapper.containsMatchingElement(<DropDown />)).toEqual(false);
  })

  it('should check formatPermissionData', () => {
    jest.spyOn(wrapper.instance(), 'formatPermissionData');
    wrapper.instance().formatPermissionData();
    expect(wrapper.instance().formatPermissionData).toBeCalled();
  })

  it('should check selectCheckBox', () => {
    jest.spyOn(wrapper.instance(), 'selectCheckBox');
    wrapper.instance().selectCheckBox(null, 'Content Management', 'Shows', 'Properties');
    expect(wrapper.instance().selectCheckBox).toBeCalled();
  })

  it('should check selectCheckBox with submoudle', () => {
    jest.spyOn(wrapper.instance(), 'selectCheckBox');
    wrapper.instance().selectCheckBox(null, 'Content Management', 'Shows');
    expect(wrapper.instance().selectCheckBox).toBeCalled();
  })

  it('should check checkSelectAll', () => {
    jest.spyOn(wrapper.instance(), 'checkSelectAll');
    wrapper.instance().checkSelectAll(allPermission);
    expect(wrapper.instance().checkSelectAll).toBeCalled();
  })

  it('should check updatePermission', () => {
    jest.spyOn(wrapper.instance(), 'updatePermission');
    wrapper.instance().updatePermission();
    expect(wrapper.instance().updatePermission).toBeCalled();
  })

  it('should check getModuleContentType', () => {
    jest.spyOn(wrapper.instance(), 'getModuleContentType');
    wrapper.instance().getModuleContentType();
    expect(wrapper.instance().getModuleContentType).toBeCalled();
  })

  it('should check removeSelectAllKey', () => {
    jest.spyOn(wrapper.instance(), 'removeSelectAllKey');
    wrapper.instance().removeSelectAllKey(allPermission);
    expect(wrapper.instance().removeSelectAllKey).toBeCalled();
  })

  it('should check createUpdateRole', () => {
    wrapper.setState({ role_details })
    jest.spyOn(wrapper.instance(), 'createUpdateRole');
    wrapper.instance().createUpdateRole();
    expect(wrapper.instance().createUpdateRole).toBeCalled();
  })

  it('should check activateDeactivateRole', () => {
    wrapper.setState({ role_details })
    jest.spyOn(wrapper.instance(), 'activateDeactivateRole');
    wrapper.instance().activateDeactivateRole();
    expect(wrapper.instance().activateDeactivateRole).toBeCalled();
  })

  it('should check handleOpenCloseStatusDropDown', () => {
    jest.spyOn(wrapper.instance(), 'handleOpenCloseStatusDropDown');
    wrapper.instance().handleOpenCloseStatusDropDown();
    expect(wrapper.instance().handleOpenCloseStatusDropDown).toBeCalled();
  })

  it('should check handleCloseStatusDropdown', () => {
    jest.spyOn(wrapper.instance(), 'handleCloseStatusDropdown');
    wrapper.instance().handleCloseStatusDropdown();
    expect(wrapper.instance().handleCloseStatusDropdown).toBeCalled();
  })

  it('should check handleRoute', () => {
    jest.spyOn(wrapper.instance(), 'handleRoute');
    wrapper.instance().handleRoute();
    expect(wrapper.instance().handleRoute).toBeCalled();
  })

  it('should check handleRoute onclick method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'handleRoute');
    wrapper.instance().forceUpdate();
    wrapper.update();
    const button = findByTestAttr(wrapper, 'angleleftarrow-route');
    button.simulate('click');
    expect(spy).toHaveBeenCalled();
  })

  it('should check openCloseAccordian method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'openCloseAccordian');
    wrapper.instance().openCloseAccordian();
    expect(wrapper.instance().openCloseAccordian).toHaveBeenCalled();
  })
  
  it('should check componentDidMount method', async () => {
    const spy = jest.spyOn(wrapper.instance(), 'componentDidMount');
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().componentDidMount).toHaveBeenCalled();
  })

  it('should check getAllPermission method', () => {
    const spy = jest.spyOn(wrapper.instance(), 'getAllPermission');
    wrapper.instance().getAllPermission();
    expect(wrapper.instance().getAllPermission).toHaveBeenCalled();
  })
  
  it('should check setManageRoleState method', () => {
    const currentRoleDetails = {
      id: '9a96d773-719d-4f0d-b7a0-e8e2348096c7', permission: [],
      name: 'mock', status: 'Active', description: 'test'
    }
    const spy = jest.spyOn(wrapper.instance(), 'setManageRoleState');
    wrapper.instance().setManageRoleState(currentRoleDetails);
    expect(wrapper.instance().setManageRoleState).toHaveBeenCalled();
  })
})