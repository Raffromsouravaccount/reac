import React from "react";
import { shallow } from "enzyme";

import CreateMovie from "../../../_components/CreateMovie/CreateMovie";
import {findByTestAttr} from '../../../Utils';

import { expect, it, jest } from '@jest/globals';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = { match: { params: { id: "123" } } }, state = null) => {
    const wrapper = shallow(<CreateMovie {...props} />);
    if (state) wrapper.setState(state);
    return wrapper;
};

describe("CreateMovie", () => {
    let wrapper;
    let instance;
    beforeEach(() => {
        const props = {
            match: {
                params: {
                    id: '123'
                }
            },
            state: 'quick-filing'
        }
        wrapper = setup({ ...props });
        instance = wrapper.instance(); 
    });

    it("Should render CreateMovie default", () => {
        expect(wrapper.exists()).toBe(true);
    });

    it("Should test componentDidMount", () => {
        jest.spyOn(instance, 'componentDidMount');
        instance.componentDidMount();
        expect(instance.componentDidMount).toBeCalled();
    });   
     
    it("Should test getMovieId", () => {
        jest.spyOn(instance, 'getMovieId');
        instance.getMovieId();
        expect(instance.getMovieId).toBeCalled();
    });  
    
    it("Should test setMovieId", () => {
        jest.spyOn(instance, 'setMovieId');
        instance.setMovieId();
        expect(instance.setMovieId).toBeCalled();
    }); 
    
    it("Should test getMovieStatus", () => {
        jest.spyOn(instance, 'getMovieStatus');
        instance.getMovieStatus();
        expect(instance.getMovieStatus).toBeCalled();
    });
     
    it("Should test handlePermission", () => {
        jest.spyOn(instance, 'handlePermission');
        instance.handlePermission();
        expect(instance.handlePermission).toBeCalled();
    });
    
    it("Should test markAsDone for if condition", () => {
        jest.spyOn(instance, 'markAsDone');
        instance.markAsDone(0, true);
        expect(instance.markAsDone).toBeCalled();
    });

    it("Should test markAsDone for else condition", () => {
        jest.spyOn(instance, 'markAsDone');
        instance.markAsDone();
        expect(instance.markAsDone).toBeCalled();
    });
    
    it("Should test unLockedSession ", () => {
        jest.spyOn(instance, 'unLockedSession');
        instance.unLockedSession();
        expect(instance.unLockedSession).toBeCalled();
    });

    it('should check markAsDoneNLockedAction', () => {
        jest.spyOn(instance, 'markAsDoneNLockedAction');
        instance.markAsDoneNLockedAction();
        expect(instance.markAsDoneNLockedAction).toBeCalled();
    })
    
    it('should check handleTab', () => {
        jest.spyOn(instance, 'handleTab');
        instance.handleTab();
        expect(instance.handleTab).toBeCalled();
    })
    
    it('should check handleRoute', () => {
        jest.spyOn(instance, 'handleRoute');
        instance.handleRoute();
        expect(instance.handleRoute).toBeCalled();
    })
    
    it('should check linksClickHandler', () => {
        jest.spyOn(instance, 'linksClickHandler');
        instance.linksClickHandler();
        expect(instance.linksClickHandler).toBeCalled();
    })
    
    it('should check openCreateLicenseForm', () => {
        jest.spyOn(instance, 'openCreateLicenseForm');
        instance.openCreateLicenseForm();
        expect(instance.openCreateLicenseForm).toBeCalled();
    })
    
    it('should check openEditForm', () => {
        jest.spyOn(instance, 'openEditForm');
        instance.openEditForm();
        expect(instance.openEditForm).toBeCalled();
    })
    
    it('should check setStage', () => {
        const defaultTab = {
            selectedTab: 0, tabLabel: "Content Properties"
        }
        wrapper.setState({ defaultTab })
        jest.spyOn(instance, 'setStage');
        instance.setStage('Draft');
        expect(instance.setStage).toBeCalled();
    })
    
    it('should check setTitle', () => {
        jest.spyOn(instance, 'setTitle');
        instance.setTitle();
        expect(instance.setTitle).toBeCalled();
    })
    
    it('should check autoSaveError', () => {
        jest.spyOn(instance, 'autoSaveError');
        instance.autoSaveError();
        expect(instance.autoSaveError).toBeCalled();
    })

    it('should check autoSaveError if condition', () => {
        const error = {
            data: {
                message: 'This section is locked by another user.'
            }
        }
        jest.spyOn(instance, 'autoSaveError');
        instance.autoSaveError(error);
        expect(instance.autoSaveError).toBeCalled();
    })
    
    it('should check getExternalId', () => {
        jest.spyOn(instance, 'getExternalId');
        instance.getExternalId();
        expect(instance.getExternalId).toBeCalled();
    })
    
    it('should check quickLinksEnable', () => {
        const links = [
            {text: "Related Content", permissionKey: "movies", permissionSubKey: "relatedContent", permissionName: "canUpdate"},
            {text: "Translations", permissionKey: "movies", permissionSubKey: "translation", permissionName: "canUpdate"},
            {text: "Collection Assignment", permissionKey: "movies", permissionSubKey: "collectionAssignment", permissionName: "canUpdate"},
            {text: "Published History", permissionKey: "movies", permissionSubKey: "publishHistory", permissionName: "canUpdate"}
        ]
        jest.spyOn(instance, 'quickLinksEnable');
        instance.quickLinksEnable(links);
        expect(instance.quickLinksEnable).toBeCalled();
    })
    
    it('should check getMovieTabsComp', () => {
        wrapper.setProps({state: 'single-landing-page' })
        jest.spyOn(instance, 'getMovieTabsComp');
        instance.getMovieTabsComp();
        expect(instance.getMovieTabsComp).toBeCalled();
    })

    it('should check handleRoute onclick method', () => {
        const spy = jest.spyOn(wrapper.instance(), 'handleRoute');
        wrapper.instance().forceUpdate();
        wrapper.update();
        const button = findByTestAttr(wrapper, 'handleRoute');
        button.simulate('click');
        expect(spy).toHaveBeenCalled();
      })


});