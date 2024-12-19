import { tvShowsConstants } from "../_constants/tvShows.constants";
import { tvSeasonService } from "../_services/tvSeason.service";
import { alertActions } from "./alert.actions";
import { showSuccessErrorMsg } from "./alertMessages.action";
export const tvSeasonActions = {
  create_licence_action,
  list_license_action,
  edit_licence_action,
  fetch_template_action
}

function create_licence_action(params) {
  return (dispatch) => {
    dispatch(create_licence_request());
    tvSeasonService.create_licence_service(params)
      .than(
        (data) => {
          dispatch(create_licence_success(data))
        }, (error) => {
          showSuccessErrorMsg(
            error.response.data.message,
            null, "Error", true, null,
          );
          dispatch(create_licence_failure(error));
          dispatch(alertActions.error(error.toString()));
        }
      )
  };
  function create_licence_request() {
    return {
      type: tvShowsConstants.CREATE_LICENCE_REQUEST
    };
  }

  function create_licence_success(data) {
    return {
      type: tvShowsConstants.CREATE_LICENCE_SUCCESS,
      payload: data
    }
  }

  function create_licence_failure(error) {
    return {
      type: tvShowsConstants.CREATE_LICENCE_FAILURE,
      error: error,
    }
  }

}

function list_license_action(params) {
  return (dispatch) => {
    dispatch(get_license_request());
    tvSeasonService.list_licence_service(params).then(
      (licenseResponse) => {
        dispatch(get_license_success(licenseResponse));
      }, (error) => {
        dispatch(get_license_failure(error));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function get_license_request() {
    return {
      type: tvShowsConstants.GET_LICENSE_REQUEST
    }
  }

  function get_license_success(licenseResponse) {
    return {
      type: tvShowsConstants.GET_LICENSE_SUCCESS,
      payload: licenseResponse
    }
  }

  function get_license_failure(error) {
    return {
      type: tvShowsConstants.GET_LICENSE_FAILURE,
      error: error.response.data
    }
  }

}

function edit_licence_action(id, licenceData) {
  return (dispatch) => {
    dispatch(edit_licence_request());
    tvSeasonService.edit_licence_service(id, licenceData)
      .then(
        (data) => {
          dispatch(edit_licence_success(data))
        }, (error) => {
          showSuccessErrorMsg(
            error.response.data.message,
            null,
            "Error",
            true, null
          );
          dispatch(edit_licence_failure(error));
          dispatch(alertActions.error(error.toString()));
        }
      )
  };

  function edit_licence_request() {
    return {
      type: tvShowsConstants.EDIT_LICENCE_REQUEST
    };
  }

  function edit_licence_success(data) {
    return {
      type: tvShowsConstants.EDIT_LICENCE_SUCCESS,
      payload: data
    }
  }

  function edit_licence_failure(error) {
    return {
      type: tvShowsConstants.EDIT_LICENCE_FAILURE,
      error: error
    }
  }
}

function fetch_template_action(type, masterType) {

  return dispatch => {
    dispatch(fetch_template_request());
    tvSeasonService.fetch_template_service(type)
      .then(data => {
        dispatch(fetch_template_success(data ? data.map((item) => {
          return {
            'DisplayName': item?.title ? item?.title : 'N/A',
            'CurrentStatus': item?.status ? item?.status : 'N/A',
            'uuid': item.id ? item?.id : 'N/A',
            'template': item?.licenceTemplateDetails ? item?.licenceTemplateDetails : 'N/A'
            

          }
        }) : [], masterType))
      },
        error => {
          dispatch(fetch_template_failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        }
      )
  };

  function fetch_template_request() {
    return {
      type: tvShowsConstants.FETCH_TEMPLATE_REQUEST
    };
  }

  function fetch_template_success(data, typeArg) {
    if (typeArg === 'TEMPLATE') {
      return {
        type: tvShowsConstants.FETCH_TEMPLATE_SUCCESS,
        payload: data
      }
    }
  }

  function fetch_template_failure(error) {
    return {
      type: tvShowsConstants.FETCH_TEMPLATE_FAILURE,
      error: error
    }
  }

}