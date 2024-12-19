import { videoMgmtConstants } from '../_constants/videoMgmt.constants';

const initialState = {
   listMovie: [],
   createVideo: [],
   videoRecords: [],
   videoList: {
      data: [],
      count: "",
      isRequestIntiate: true
   },
   linkList: {
      data: [],
      lastEvaluatedKey: ""
   },
   linkedVideoList: {
      data: []
   },
   licenseRecords: [],
   templateRecords: []
}

export function videoMgmt_reducer(state = initialState, action) {
   switch (action.type) {
      case videoMgmtConstants.FETCH_VIDEO_LIST_CLEAR_REQUEST:
         return {
            ...state,
            videoList: {
               data: [],
               count: "",
               isRequestIntiate: false
            },
         }
      case videoMgmtConstants.FETCH_VIDEO_LIST_REQUEST:
         return {
            ...state,
            videoList: {
               data: [...state.videoList?.data],
               count: state.videoList?.count,
               isRequestIntiate: false
            },
         }
      case videoMgmtConstants.FETCH_VIDEO_LIST_FAILURE:
         return {
            ...state,
            videoList: {
               data: [...state.videoList?.data],
               count: state.videoList?.count,
               isRequestIntiate: true
            },
         }
      case videoMgmtConstants.FETCH_VIDEO_LIST_SUCCESS:
         return {
            ...state,
            videoList: {
               data: [...state.videoList?.data, ...action?.payload?.rows || []],
               count: action.payload?.count || 0,
               isRequestIntiate: true
            },
         }

      case videoMgmtConstants.FETCH_LINK_LIST_SUCCESS:
         return {
            ...state,
            linkList: {
               data: [...state.linkList.data, ...action?.payload?.items],
               lastEvaluatedKey: action.payload.LastEvaluatedKey
            },
         }

      case videoMgmtConstants.FETCH_VIDEO_LINKED_LIST_REQUEST:
      case videoMgmtConstants.FETCH_LINKED_VIDEO_LIST_FAILURE:
         return {
            ...state
         }
      case videoMgmtConstants.FETCH_VIDEO_LINKED_LIST_SUCCESS:
         return {
            ...state,
            linkedVideoList: {
               data: action?.payload,
            },
         }

      case videoMgmtConstants.CREATE_VIDEO_REQUEST:
         return {
            ...state,
            createVideo: action.payload,
         };
      case videoMgmtConstants.CREATE_VIDEO_SUCCESS:
         return {
            ...state,
            createVideo: action.payload,
         };
      case videoMgmtConstants.CREATE_VIDEO_FAILURE:
         return {
            ...state,
            createVideo: action.payload,
         };

      case videoMgmtConstants.GET_VIDEO_REQUEST:
         return {
            ...state,
            videoRecords: action.payload,
         };
      case videoMgmtConstants.GET_VIDEO_SUCCESS:
         return {
            ...state,
            videoRecords: action.payload,
         };
      case videoMgmtConstants.GET_VIDEO_FAILURE:
         return {
            ...state,
            message: action.error.message,
         };

      case videoMgmtConstants.GET_LICENSE_REQUEST:
         return {
            ...state,
            licenseRecords: action.payload
         };

      case videoMgmtConstants.GET_LICENSE_SUCCESS:
         return {
            ...state,
            licenseRecords: action.payload
         };

      case videoMgmtConstants.GET_LICENSE_FAILURE:
         return {
            ...state,
            message: action.error.message
         }

      case videoMgmtConstants.FETCH_TEMPLATE_SUCCESS:
         return {
            ...state,
            templateRecords: action.payload
         };

      default:
         return state;
   }
}