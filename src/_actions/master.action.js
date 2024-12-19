import { masterConstants } from '../_constants/master.constants';
import { alertActions } from './alert.actions';
import { masterService } from '../_services/master.service';
import { constantText } from '../_helpers/constants.text';

export const masterActions = {
  fetch_master_action,
}

function fetch_master_action(type, masterType, fullResponce = false) {
  return dispatch => {
    dispatch(fetch_master_request());
    masterService.fetch_master_service(type)
      .then(data => {
          if (fullResponce) {
            dispatch(fetch_master_success(data && data.length ? data : [], masterType))
          } else {
            dispatch(fetch_master_success(data ? data : [], masterType))
          }
        },
        error => {
          dispatch(fetch_master_failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }

      )

  };


  function fetch_master_request() {
    return {
      type: masterConstants.FETCH_MASTER_REQUEST
    }

  }

  function fetch_master_success(data, masterType) {
    if (masterType === "CASTTYPE") {
      return {
        type: masterConstants.FETCH_CAST_TYPE_SUCCESS,
        payload: data
      }
    } else if (masterType === "TAGBADGE") {
      return {
        type: masterConstants.FETCH_TAGBADGE_SUCCESS,
        payload: data
      }

    } else if (masterType === "RELATION") {
      return {
        type: masterConstants.FETCH_RELATION_SUCCESS,
        payload: data
      }
    } else if (masterType === "GENDER") {
      return {
        type: masterConstants.FETCH_GENDER_SUCCESS,
        payload: data
      }

    } else if (masterType === "GENRE") {
      return {
        type: masterConstants.FETCH_GENRE_SUCCESS,
        payload: data
      }

    } else if (masterType === "AGEGROUP") {
      return {
        type: masterConstants.FETCH_AGEGROUP_SUCCESS,
        payload: data
      }

    } else if (masterType === "LANGUAGENAME") {
      return {
        type: masterConstants.FETCH_LANGUAGENAME_SUCCESS,
        payload: data
      }

    } 
    else if (masterType === "AUDIOLANGUAGE") {
      return {
        type: masterConstants.FETCH_AUDIOLANGUAGE_SUCCESS,
        payload: data
      }

    } else if (masterType === constantText.video_hls_suffixes) {
      return {
        type: masterConstants.FETCH_VIDEO_HLS_SUFFIXES_SUCCESS,
        payload: data
      }
    } else if (masterType === constantText.video_dash_suffixes) {
      return {
        type: masterConstants.FETCH_VIDEO_DASH_SUFFIXES_SUCCESS,
        payload: data
      }
    } else if (masterType === "LICENCE_COUNTRY") {
      return {
        type: masterConstants.FETCH_COUNTRY_GROUP_SUCCESS,
        payload: data
      }
    } else if (masterType === "BUSINESS_TYPE") {
      return {
        type: masterConstants.FETCH_BUSINESS_TYPE_SUCCESS,
        payload: data
      }
    } else if (masterType === "BILLING_TYPE") {
      return {
        type: masterConstants.FETCH_BILLING_TYPE_SUCCESS,
        payload: data
      }
    } else if (masterType === 'TVOD_TIER') {
      return {
        type: masterConstants.FETCH_TVOD_TIER_SUCCESS,
        payload: data
      }
    } else if (masterType === 'PLATFORM') {
      return {
        type: masterConstants.FETCH_PLATFORM_SUCCESS,
        payload: data
      }
    }
  }

  function fetch_master_failure(error) {
    return {
      type: masterConstants.FETCH_MASTER_FAILURE,
      error
    }

  }
}