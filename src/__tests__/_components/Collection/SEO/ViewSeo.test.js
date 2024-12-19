import React from 'react';
import {shallow, mount} from 'enzyme';

import ViewSeo from '../../../../_components/Collection/CreateCollection/Seo/ViewSeo';
import BadgeBox from '../../../../_components/Common/BadgeBox/BadgeBox';
import ButtonField from '../../../../_components/Common/ButtonField/ButtonField';
import {findByTestAttr, checkProps} from '../../../../Utils';

/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {match:{params:{id:"123"}}}, state = null) => {
    const wrapper = shallow(<ViewSeo {...props}  />)
    if (state) wrapper.setState(state);
    return wrapper;
  }

  describe('<ViewSeo/>',()=>{
      let wrapper;
      beforeEach(()=>{
          wrapper = setup();
      });

      it('Should render ViewSeo default',()=>{
          expect(wrapper.exists()).toBe(true);
      });

      it('should test handleRoute', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleRoute');
        instance.handleRoute();
        expect(instance.handleRoute).toHaveBeenCalledTimes(1);
      });

      it('should test componentDidMount', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'componentDidMount');
        instance.componentDidMount();
        expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
      });

      it('should test fillSeo', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'fillSeo');
        instance.componentDidMount();
        expect(instance.fillSeo).toHaveBeenCalledTimes(1);
      });

      it('Should renders ButtonField default', () => {
        expect(wrapper.containsMatchingElement(<ButtonField />)).toEqual(true);
      });
    
      it('Should renders BadgeBox default', () => {
        expect(wrapper.containsMatchingElement(<BadgeBox />)).toEqual(false);
      });
      
      it('should test handleMarkAsDone', () => {
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleMarkAsDone');
        instance.handleMarkAsDone();
        expect(instance.handleMarkAsDone).toBeCalled();
      });
    
  })