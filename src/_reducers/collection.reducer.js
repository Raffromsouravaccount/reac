import {
   collectionConstants
} from '../_constants/collection.constants';

const initialState = {
   collectionLicence: [],
   collectionList: {
      data: [],
      count: "",
      lastEvaluatedKey: ""
   },
   collectionLinkedList: {
      data: []
   }
};

export function collection_reducer(state = initialState, action) {
   switch (action.type) {
      case collectionConstants.COLLECTION_LIST_CLEAR_REQUEST:
         return { 
            ...state, 
            collectionList: { 
               data: [], 
               count: "", 
               isRequestIntiate: false 
            } 
         };
      case collectionConstants.COLLECTION_LIST_REQUEST:
         return { 
            ...state, 
            collectionList: { 
               data: [...state.collectionList?.data], 
               count: state.collectionList?.count, 
               isRequestIntiate: false 
            } 
         };
      case collectionConstants.COLLECTION_LIST_REQUEST_SUCCESS:
         return { 
            ...state, 
            collectionList: { 
               data: [...state.collectionList?.data, ...action?.payload?.rows || []], 
               count: action.payload?.count || 0, 
               isRequestIntiate: true 
            } 
         };
      
      case collectionConstants.COLLECTION_LIST_REQUEST_FAILURE:
         return { 
            ...state, 
            collectionList: { 
               data: [...state.collectionList?.data], 
               count: state.collectionList?.count, 
               isRequestIntiate: true 
            } 
         };

      case collectionConstants.COLLECTION_LINK_LIST_REQUEST:
         return {
            ...state
         }
      case collectionConstants.COLLECTION_LINK_LIST_REQUEST_FAILURE:
         return {
            ...state
         }
      case collectionConstants.COLLECTION_LINK_LIST_REQUEST_SUCCESS:
         return {
            ...state,
            collectionLinkedList: {
               data: action?.payload,
            },
         }

      case collectionConstants.COLLECTION_GET_LICENCE_REQUEST:
         return {
            ...state
         };
      case collectionConstants.COLLECTION_GET_LICENCE_SUCCESS:
         return {
            ...state,
            collectionLicence: action.payload
         };
      case collectionConstants.COLLECTION_GET_LICENCE_FAILURE:
         return {
            ...state
         }
      default:
         return state
   }
}