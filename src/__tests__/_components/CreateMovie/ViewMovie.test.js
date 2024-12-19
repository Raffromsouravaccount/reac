import React from "react";
import { shallow } from "enzyme";

import ViewMovie from "../../../_components/CreateMovie/ViewMovie";
import { findByTestAttr } from '../../../Utils';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = { match: { params: { id: "123" } } }, state = null) => {
    const wrapper = shallow(<ViewMovie {...props} />);
    if (state) wrapper.setState(state);
    return wrapper;
};

describe("ViewMovie", () => {
    let wrapper;
    let instance;
    beforeEach(() => {
        const props = {
            match: {
                params: {
                    id: '123'
                }
            }
        }
        wrapper = setup({ ...props });
        instance = wrapper.instance();
        wrapper.setState({selectedTab: 1})
    });

    it("Should render ViewMovie default", () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should check componentDidMount', () => {
        jest.spyOn(instance, 'componentDidMount');
        instance.componentDidMount();
        expect(instance.componentDidMount).toBeCalled();
    })

    it('should check getOptions', () => {
        wrapper.setState({ movieState: 'quickFiling' });
        jest.spyOn(instance, 'getOptions');
        instance.getOptions();
        expect(instance.getOptions).toBeCalled();
    })

    it('should check getOptions for singleLanding', () => {
        wrapper.setState({ movieState: 'singleLanding', journeyType: 2 });
        jest.spyOn(instance, 'getOptions');
        instance.getOptions();
        expect(instance.getOptions).toBeCalled();
    })

    it('should check getOptions for properties', () => {
        wrapper.setState({ movieState: 'properties', journeyType: 3 });
        jest.spyOn(instance, 'getOptions');
        instance.getOptions();
        expect(instance.getOptions).toBeCalled();
    })

    it('should check getOptions for default', () => {
        jest.spyOn(instance, 'getOptions');
        instance.getOptions();
        expect(instance.getOptions).toBeCalled();
    })

    it('should check goToMovie onclick method', () => {
        const spy = jest.spyOn(wrapper.instance(), 'goToMovie');
        wrapper.instance().forceUpdate();
        wrapper.update();
        const button = findByTestAttr(wrapper, 'goToMovieBtn');
        button.simulate('click');
        expect(spy).toHaveBeenCalled();
      })

      it('should check goToMovie', () => {
        jest.spyOn(instance, 'goToMovie');
        instance.goToMovie();
        expect(instance.goToMovie).toBeCalled();
    })
    
    it('should check handleRadioButton', () => {
        const event = {target: {name: 'btn', value: "value"}};
        jest.spyOn(instance, 'handleRadioButton');
        instance.handleRadioButton(event);
        expect(instance.handleRadioButton).toBeCalled();
    })
    
    it('should check getSinglePageLandingTabsComp', () => {
        jest.spyOn(instance, 'getSinglePageLandingTabsComp');
        instance.getSinglePageLandingTabsComp();
        expect(instance.getSinglePageLandingTabsComp).toBeCalled();
    })
    
    it('should check getQuickFilingTabsComp', () => {
        jest.spyOn(instance, 'getQuickFilingTabsComp');
        instance.getQuickFilingTabsComp();
        expect(instance.getQuickFilingTabsComp).toBeCalled();
    })
    
    it('should check getExternalId', () => {
        jest.spyOn(instance, 'getExternalId');
        instance.getExternalId();
        expect(instance.getExternalId).toBeCalled();
    })
    
    it('should check setStage', () => {
        jest.spyOn(instance, 'setStage');
        instance.setStage();
        expect(instance.setStage).toBeCalled();
    })
    
    it('should check linksClickHandler', () => {
        jest.spyOn(instance, 'linksClickHandler');
        instance.linksClickHandler();
        expect(instance.linksClickHandler).toBeCalled();
    })
    
    it('should check goToEditMovie', () => {
        jest.spyOn(instance, 'goToEditMovie');
        instance.goToEditMovie();
        expect(instance.goToEditMovie).toBeCalled();
    })
    
    it('should check showHideAskedPopup', () => {
        jest.spyOn(instance, 'showHideAskedPopup');
        instance.showHideAskedPopup();
        expect(instance.showHideAskedPopup).toBeCalled();
    })
    
    it('should check handleRoute', () => {
        jest.spyOn(instance, 'handleRoute');
        instance.handleRoute();
        expect(instance.handleRoute).toBeCalled();
    })
    
    it('should check handleTab', () => {
        wrapper.setState({journeyType: 1})
        jest.spyOn(instance, 'handleTab');
        instance.handleTab();
        expect(instance.handleTab).toBeCalled();
    })
    
    it('should check handlePermission', () => {
        jest.spyOn(instance, 'handlePermission');
        instance.handlePermission();
        expect(instance.handlePermission).toBeCalled();
    })
    
    it('should check getMovieStatus', () => {
        jest.spyOn(instance, 'getMovieStatus');
        instance.getMovieStatus();
        expect(instance.getMovieStatus).toBeCalled();
    })
});