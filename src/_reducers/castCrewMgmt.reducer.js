import { castCrewMgmtConstants } from "../_constants/castCrewMgmt.constants";

const initialState = {
  createProfile: [],
  viewProfile: [],
  listCount: "",
  listProfile: [],
  allfaq: [],
  editProfile: [],
  castList: [],
  type: "",
  imageReorderStatus: false,
  markDone:false,
};

export function castCrewMgmt_reducer(state = initialState, action) {
  switch (action.type) {
    case castCrewMgmtConstants.CREATE_PROFILE_REQUEST:
      return {
        ...state,
        createProfile: action.payload,
        listProfile: [],
        editProfile:[]
      };
    case castCrewMgmtConstants.CREATE_PROFILE_SUCCESS:
      return {
        ...state,
        createProfile: action.payload,
      };
    case castCrewMgmtConstants.CREATE_PROFILE_FAILURE:
      return {
        ...state,
        createProfile: action.error,
      };
    case castCrewMgmtConstants.FETCH_LIST_PROFILE_REQUEST:
      return{
        ...state
      };

    case castCrewMgmtConstants.FETCH_LIST_PROFILE_SUCCESS:
      return {
        ...state,
        listProfile: [...state.listProfile, ...action.payload?.rows],
        listCount: action.payload?.count
      };
    case castCrewMgmtConstants.FETCH_LIST_PROFILE_FAILURE:
      return {
        ...state,
       // createProfile: action.payload,
      };
    case castCrewMgmtConstants.FETCH_VIEW_PROFILE_REQUEST:
      return {
        ...state,
        viewProfile: action.payload,
        listProfile: [],
        type:''

      };
    case castCrewMgmtConstants.FETCH_VIEW_PROFILE_SUCCESS:
      return {
        ...state,
        viewProfile: action.payload,
        editProfile: [],
        createProfile:[],
        type:'VIEW'
      };
    case castCrewMgmtConstants.FETCH_VIEW_PROFILE_FAILURE:
      return {
        ...state,
        viewProfile: action.payload,
      };

    case castCrewMgmtConstants.FETCH_FAQ_REQUEST:
      return {
        ...state,
        allfaq:[]
      };
    case castCrewMgmtConstants.FETCH_FAQ_SUCCESS:
      return {
        ...state,
        allfaq: action.payload,
      };
    case castCrewMgmtConstants.EDIT_PROFILE_REQUEST:
      return {
        ...state,
        editProfile: action.payload,
        listProfile: [],
        createProfile:[],
        viewProfile:[],
        type:'',
        markDone:false
      };
    case castCrewMgmtConstants.EDIT_PROFILE_SUCCESS:
      return {
        ...state,
        editProfile: action.payload,
        type:'EDIT',
      };
    case castCrewMgmtConstants.EDIT_PROFILE_FAILURE:
      return {
        ...state,
        editProfile: action.payload,
      };
    
    case castCrewMgmtConstants.IMAGE_MARKASDONE_REQUEST:
      return {
        ...state,
        payload: action.payload,
        markDone:false,
        createProfile:[],
      };
    case castCrewMgmtConstants.IMAGE_MARKASDONE_SUCCESS:
      return {
        ...state,
        payload: action.payload,
        markDone:true,
        createProfile:[],
        imageReorderStatus:false
      };
    case castCrewMgmtConstants.IMAGE_MARKASDONE_FAILURE:
      return {
        ...state,
        message: action.error.message,
      };
    case castCrewMgmtConstants.FETCH_CASTLIST_SUCCESS:
      return {
        ...state,
        castList: action.payload,
       // viewProfile: [],
        type:''
      }
    default:
      return state;
  }
}
