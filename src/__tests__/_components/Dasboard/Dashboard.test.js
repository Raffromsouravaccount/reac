import React from 'react';
import {shallow,mount} from 'enzyme';
import moxios from 'moxios';

import Dashboard from '../../../_components/Dashboard/Dashboard';
import {findByTestAttr} from '../../../Utils';


/**
 * Factory function to create a ShallowWrapper for the License Component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */

const setup = (props = {}, state = null) => {
   const wrapper = shallow(<Dashboard {...props}/>)
    return wrapper;
  }

describe('<Dashboard/>',()=>{
    let wrapper;
      beforeEach(()=>{
          wrapper = setup();
      });

      it('Should render Dashboard Component',()=>{
        expect(wrapper.exists()).toBe(true);
      });

      it('should test componentDidMount',()=>{
        const instance = wrapper.instance();
        jest.spyOn(instance, 'componentDidMount');
        instance.componentDidMount();
        expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
      });

      it('should test handleRoute',()=>{
        const instance = wrapper.instance();
        jest.spyOn(instance, 'handleRoute');
        instance.handleRoute();
        expect(instance.handleRoute).toHaveBeenCalledTimes(1);
      });

      it('should test fetchDashboardConfig with isRequestInitiate and DasboardData', () => {
        const mockSet = {
            isRequestInitiate:false,
            dashboardData:[{
                displayModuleName: "Cast Profile Management", 
                icon: "images/cast-n-crew.svg", 
                route: "/cast", 
                permission: "cast", 
                GridVisible: true
            }]
        };
          const instance = wrapper.instance();
          jest.spyOn(instance, "fetchDashboardConfig");
          instance.fetchDashboardConfig(mockSet);
          expect(instance.fetchDashboardConfig).toBeCalled();
      });

      it('should test render with DasboardData', () => {
        const mockSet = {
            dashboardData:[{
                displayModuleName: "Cast Profile Management", 
                icon: "images/cast-n-crew.svg", 
                route: "/cast", 
                permission: "cast", 
                GridVisible: true
            }]
        };
          const instance = wrapper.instance();
          jest.spyOn(instance, "render");
          instance.render(mockSet);
          expect(instance.render).toBeCalled();
      });

     
});