import { tvShowsConstants } from '../_constants/tvShows.constants';

const initialState = {
   listMovie: [],
   createVideo: [],
   videoRecords: [],
   tvShowsList: {
      data: [],
      count: "",
      isRequestIntiate: true
   },
   linkList: {
      data: [],
      lastEvaluatedKey: ""
   },
   linkedTvShowList: [],
   licenseRecords: [],
   templateRecords: []
}

export function tvShows_reducer(state = initialState, action = {}) {
   switch (action.type) {
      case tvShowsConstants.FETCH_TVSHOWS_LIST_CLEAR_REQUEST:
         return {
            ...state,
            tvShowsList: {
               data: [],
               count: "",
               isRequestIntiate: false
            },
         }
      case tvShowsConstants.FETCH_TVSHOWS_LIST_REQUEST:
         return {
            ...state,
            tvShowsList: {
               data: [...state.tvShowsList?.data],
               count: state.tvShowsList?.count,
               isRequestIntiate: false
            },
         }
      case tvShowsConstants.FETCH_TVSHOWS_LIST_FAILURE:
         return {
            ...state,
            tvShowsList: {
               data: [...state.tvShowsList?.data],
               count: state.tvShowsList?.count,
               isRequestIntiate: true
            },
         }
      case tvShowsConstants.FETCH_TVSHOWS_LIST_SUCCESS:
         return {
            ...state,
            tvShowsList: {
               data: [...state.tvShowsList?.data, ...action?.payload?.rows || []],
               count: action.payload?.count || 0,
               isRequestIntiate: true
            },
         }

      case tvShowsConstants.FETCH_LINK_LIST_SUCCESS:
         return {
            ...state,
            linkList: {
               data: [...state.linkList.data, ...action?.payload?.items],
               lastEvaluatedKey: action.payload.LastEvaluatedKey
            },
         }

      case tvShowsConstants.FETCH_TVSHOWS_LINKED_LIST_REQUEST:
      case tvShowsConstants.FETCH_TVSHOWS_LINKED_LIST_FAILURE:
         return {
            ...state
         }
      case tvShowsConstants.FETCH_TVSHOWS_LINKED_LIST_SUCCESS:
         return {
            ...state,
            linkedTvShowList:  action?.payload,
         }
      case tvShowsConstants.GET_LICENSE_REQUEST:
      case tvShowsConstants.GET_LICENSE_SUCCESS:
         return {
            ...state,
            licenseRecords: action.payload
         };

      case tvShowsConstants.GET_LICENSE_FAILURE:
         return {
            ...state,
            message: action.error.message
         }

      case tvShowsConstants.FETCH_TEMPLATE_SUCCESS:
         return {
            ...state,
            templateRecords: action.payload
         };

      default:
         return state;
   }
}