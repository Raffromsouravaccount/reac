import checkPropTypes from 'check-prop-types';
import { applyMiddleware, createStore } from 'redux';
import rootReducer from '../_reducers'
import thunkMiddleware from 'redux-thunk';

/**
 * Create a testing store with import reducer, middleware, and initial state
 * @param {object} component
 * @param {string} attr
 * @function findByTestAttr
 * @returns {wrapper}
 */
export const findByTestAttr = (component, attr) => {
  const wrapper = component.find(`[data-test='${attr}']`);
  return wrapper;
};

/**
 * Create a testing store with import reducer, middleware, and initial state
 * @param {object} component
 * @param {Object} expectedProps
 * @function checkProps
 * @returns {propsErr}
 */
export const checkProps = (component, expectedProps) => {
  const propsErr = checkPropTypes(component.propTypes, expectedProps, 'props', component.name);
  return propsErr;
};


/**
 * Create a testing store with import reducer, middleware, and initial state
 * globals: rootReducer
 * @param {object} initialState
 * @function storeFactory
 * @returns {Store} - Redux store
 */
export const storeFactory = (initialState) => {
  const middleWares = [thunkMiddleware];
  const createStoreWithMiddleware = applyMiddleware(...middleWares)(createStore)
  return createStoreWithMiddleware(rootReducer, initialState)
}
