import { userConstants } from '../_constants/user.constants';

let user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { loggedIn: true, user } : {};

export function login_reducer(state = initialState, action = {}) {
  switch (action?.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.payload,

      };
    case userConstants.LOGIN_FAILURE:
      return {
        message: action.error.message ? action.error.message : "USER NOT FOUND",
      };
    case userConstants.LOGOUT:
      return {};
    default:
      return state
  }
}