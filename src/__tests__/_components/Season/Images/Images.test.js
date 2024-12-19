import React from 'react';
import { shallow } from 'enzyme';
import moxios from "moxios";

import Images from '../../../../_components/Season/Images/Images';
import axios from "../../../../_helpers/axiosInstance";
import { storeFactory } from '../../../../Utils';
import AssignAssets from '../../../../_components/Common/AssignAssets/AssignAssets';

/**
 * Factory function to create a ShallowWrapper for the checklistcomp Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = {}) => {
    const wrapper = shallow(<Images {...props} />);
    if (state) wrapper.setState({ state });
    return wrapper;
}

describe('Images', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = setup();
        moxios.uninstall(axios);
    });
    afterEach(() => {
        moxios.uninstall(axios);
    });

    it('Should Render Images', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should test handleRoute', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleRoute');
        instance.handleRoute();
        expect(instance.handleRoute).toHaveBeenCalledTimes(1);
    })

    it('should check navToImageSet method', () => {
        const page = 1;
        const set = {
            default: false, imageSetId: "50a81e08-e905-42b2-839b-0b5c3b37e163",
            seasonId: "abfeafb9-a127-4815-bb6b-5577b2ef3f3b", setName: "test hsfj"
        }
        const instance = wrapper.instance();
        jest.spyOn(instance, 'navToImageSet');
        instance.navToImageSet(page, set, null);
        expect(instance.navToImageSet).toHaveBeenCalledTimes(1);
    })

    it('should check navToImageSet method for else', () => {
        const page = 1;
        const instance = wrapper.instance();
        jest.spyOn(instance, 'navToImageSet');
        instance.navToImageSet(page, null, null);
        expect(instance.navToImageSet).toHaveBeenCalledTimes(1);
    })
})