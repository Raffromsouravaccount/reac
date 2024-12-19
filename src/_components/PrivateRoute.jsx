import React from 'react';
import { Route, Redirect } from 'react-router-dom';

//Common Component
import Header from '../_components/Common/Header/Header';
import TabsComp from '../_components/Common/Tabs/Tabs';

//Helper files
import axiosInstance from '../_helpers/axiosInstance';
import { isAuthenticated, getLocalData } from '../_helpers/util';
import { permissionObj } from '../_helpers/permission';

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    isAuthenticated()
      ? <div>
        <Header {...props} />
        <Component {...props} />
      </div>
      : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
  )} />
)

export const PrivateRouteWithHeaderAndTabs = ({ component: Component, activeTab, permission, subPermission,
  permissionKey, ...rest }) => {

  if (isAuthenticated()) {
    axiosInstance.defaults.headers.Authorization = `Bearer ${getLocalData('token')}`;
  }
  let isPermission = (subPermission? permissionObj?.[permission]?.[subPermission]?.[permissionKey]:
    permissionObj?.[permission]?.[permissionKey]) || (() => false);
  return (
    <Route {...rest} render={props => (
      isAuthenticated() ?
        isPermission() ?
          <div>
            <Header {...props} />
            <TabsComp activeTab={activeTab} {...props} />
            <Component {...props} {...rest} />
          </div> :
          <Redirect to={{ pathname: '/permission', state: { from: props.location } }} /> :
        <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
  )
}
