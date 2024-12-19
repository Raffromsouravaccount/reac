import {
  userConstants
} from '../_constants/user.constants';

const initialState = {
  allUsers: [],
  rolesArr: [],
  languageArr: [],
  countriesArr: [],
  masterArr: [],
  masterLoading: false,
};

export function user_reducer(state = initialState, action = {}) {
  switch (action?.type) {
    case userConstants.FETCH_USERS_SUCCESS:
      return {
        ...state,
        allUsers: action.payload
      };
    case userConstants.FETCH_ROLES_SUCCESS:
      return {
        ...state,
        rolesArr: action.payload
      };
    case userConstants.FETCH_COUNTRY_SUCCESS:
      return {
        ...state,
        countriesArr: action.payload
      };
    case userConstants.FETCH_LANGUAGE_SUCCESS:
      return {
        ...state,
        languageArr: action.payload
      };
    case userConstants.FETCH_MASTER_REQUEST:
    return {
        ...state,
        masterLoading: true,
        masterArr: action.payload
    };
    case userConstants.FETCH_MASTER_SUCCESS:
    case userConstants.FETCH_MASTER_FAILURE:
      return {
        ...state,
        masterLoading: false,
        masterArr: action.payload
      };
    case userConstants.USER_DETAILS_REQUEST:
    case userConstants.USER_DETAILS_SUCCESS:
    case userConstants.USER_DETAILS_FAILURE:
        return {
          ...state,
          userdetails: action.payload,
        };
      default:
      return state
  }
}