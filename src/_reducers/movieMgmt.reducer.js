import { movieMgmtConstants } from '../_constants/movieMgmt.constants';

const initialState = {
   listMovie: [],
   createVideo: [],
   videoRecords: [],
   moviesList: {
      data: [],
      count: "",
      isRequestIntiate: true
   },
   linkList: {
      data: [],
      count: "",
      isRequestIntiate: true
   },
   linkedMovieList: {
      data: []
   },
   licenseRecords: [],
   templateRecords: []
}

export function movieMgmt_reducer(state = initialState, action = {}) {
   switch (action.type) {
      case movieMgmtConstants.FETCH_MOVIE_LIST_CLEAR_REQUEST:
         return {
            ...state,
            moviesList: {
               data: [],
               count: "",
               isRequestIntiate: false
            },
         }
      case movieMgmtConstants.FETCH_MOVIE_LIST_REQUEST:
         return {
            ...state,
            moviesList: {
               data: [...state.moviesList?.data],
               count: state.moviesList?.count,
               isRequestIntiate: false
            },
         }
      case movieMgmtConstants.FETCH_MOVIE_LIST_FAILURE:
         return {
            ...state,
            moviesList: {
               data: [...state.moviesList?.data],
               count: state.moviesList?.count,
               isRequestIntiate: true
            },
         }
      case movieMgmtConstants.FETCH_MOVIE_LIST_SUCCESS:
         return {
            ...state,
            moviesList: {
               data: [...state.moviesList?.data, ...action?.payload?.rows || []],
               count: action.payload?.count || 0,
               isRequestIntiate: true
            },
         }
      case movieMgmtConstants.FETCH_MOVIE_LINK_LIST_CLEAR_REQUEST:
         return {
            linkList: {
               data: [],
               count: "",
               isRequestIntiate: false
            }
         }
      case movieMgmtConstants.FETCH_MOVIE_LINK_LIST_REQUEST:
         return {
            linkList: {
               data: [...state.linkList?.data],
               count: state.linkList?.count,
               isRequestIntiate: false
            }
         }
      case movieMgmtConstants.FETCH_MOVIE_LINK_LIST_SUCCESS:
         return {
            linkList: {
               data: [...state.linkList?.data, ...action?.payload?.rows || []],
               count: action.payload?.count || 0,
               isRequestIntiate: true
            }
         }

      case movieMgmtConstants.FETCH_MOVIE_LINK_LIST_FAILURE:
         return {
            linkList: {
               data: [...state.linkList?.data],
               count: state.linkList?.count,
               isRequestIntiate: true
            }
         }

      case movieMgmtConstants.FETCH_MOVIE_LINKED_LIST_REQUEST:
      case movieMgmtConstants.FETCH_MOVIE_LINKED_LIST_FAILURE:
         return {
            ...state
         }
      case movieMgmtConstants.FETCH_MOVIE_LINKED_LIST_SUCCESS:
         return {
            ...state,
            linkedMovieList: {
               data: action?.payload,
            },
         }

      case movieMgmtConstants.CREATE_VIDEO_REQUEST:
      case movieMgmtConstants.CREATE_VIDEO_SUCCESS:
      case movieMgmtConstants.CREATE_VIDEO_FAILURE:
         return {
            ...state,
            createVideo: action.payload,
         };

      case movieMgmtConstants.GET_VIDEO_REQUEST:
      case movieMgmtConstants.GET_VIDEO_SUCCESS:
         return {
            ...state,
            videoRecords: action.payload,
         };
      case movieMgmtConstants.GET_VIDEO_FAILURE:
         return {
            ...state,
            message: action.error.message,
         };

      case movieMgmtConstants.GET_LICENSE_REQUEST:
      case movieMgmtConstants.GET_LICENSE_SUCCESS:
         return {
            ...state,
            licenseRecords: action.payload
         };
      case movieMgmtConstants.GET_LICENSE_FAILURE:
         return {
            ...state,
            message: action.error.message
         }

      case movieMgmtConstants.FETCH_TEMPLATE_SUCCESS:
         return {
            ...state,
            templateRecords: action.payload
         };

      default:
         return state;
   }
}