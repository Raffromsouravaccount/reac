import { masterConstants } from "../_constants/master.constants";

const initialState = {
  masterRecords: {},
  castTypeRecords: [],
  tagBadgeRecords: [],
  relationRecords: [],
  hlsSuffixRecords: [],
  dashSuffixRecords: [],
  countryGroupRecords: [],
  businessTypeRecords: [],
  billingTypeRecords: [],
  tvodTierRecords: [],
  audioLanguages: [],
  platformRecords: []
};
export function master_reducer(state = initialState, action) {
  switch (action.type) {
    case masterConstants.FETCH_MASTER_REQUEST:
      return {
        ...state,
        masterRecords: [],
      };
    case masterConstants.FETCH_MASTER_SUCCESS:
      return {
        ...state,
        masterRecords: action.payload,
      };
    case masterConstants.FETCH_MASTER_FAILURE:
      return {
        ...state,
        masterRecords: action.error,
      };
    case masterConstants.FETCH_CAST_TYPE_SUCCESS:
      return {
        ...state,
        castTypeRecords: action.payload,
      };
    case masterConstants.FETCH_TAGBADGE_SUCCESS:
      return {
        ...state,
        tagBadgeRecords: action.payload,
      };
    case masterConstants.FETCH_RELATION_SUCCESS:
      return {
        ...state,
        relationRecords: action.payload,
      };
    case masterConstants.FETCH_GENDER_SUCCESS:
      return {
        ...state,
        genderRecords: action.payload,
      };
    case masterConstants.FETCH_GENRE_SUCCESS:
      return {
        ...state,
        genreRecords: action.payload,
      };
    case masterConstants.FETCH_AGEGROUP_SUCCESS:
      return {
        ...state,
        ageGroupRecords: action.payload,
      };
    case masterConstants.FETCH_LANGUAGENAME_SUCCESS:
      return {
        ...state,
        languageNameRecords: action.payload,
      };
    case masterConstants.FETCH_VIDEO_HLS_SUFFIXES_SUCCESS:
      return {
        ...state,
        hlsSuffixRecords: action.payload
      };
    case masterConstants.FETCH_VIDEO_DASH_SUFFIXES_SUCCESS:
      return {
        ...state,
        dashSuffixRecords: action.payload
      }
    case masterConstants.FETCH_COUNTRY_GROUP_SUCCESS:
      return {
        ...state,
        countryGroupRecords: action.payload
      }
    case masterConstants.FETCH_BUSINESS_TYPE_SUCCESS:
      return {
        ...state,
        businessTypeRecords: action.payload
      }
    case masterConstants.FETCH_BILLING_TYPE_SUCCESS:
      return {
        ...state,
        billingTypeRecords: action.payload
      }
    case masterConstants.FETCH_TVOD_TIER_SUCCESS:
      return {
        ...state,
        tvodTierRecords: action.payload
      }
    case masterConstants.FETCH_AUDIOLANGUAGE_SUCCESS:
      return {
        ...state,
        audioLanguages: action.payload
      }
    case masterConstants.FETCH_PLATFORM_SUCCESS:
      return {
        ...state,
        platformRecords: action.payload
      }
    default:
      return {
        state,
      };
  }
}
