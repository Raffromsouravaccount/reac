
import { tvShowsConstants } from "../_constants/tvShows.constants";
import { tvShowsService } from "../_services/tvShows.service";
import { alertActions } from "./alert.actions";
import { showSuccessErrorMsg } from "./alertMessages.action";
export const tvShowsActions = {
  list_linked_show_action,
  list_tvshows_action,
  create_licence_action,
  list_license_action,
  edit_licence_action,
  fetch_template_action
}

function list_linked_show_action(id) {
  return (dispatch) => {
    dispatch(list_linked_show_request());
    tvShowsService.get_all_linked_tvshows(id).then(
      (data) => {
        dispatch(list_linked_show_success(data));
      },
      (error) => {
        dispatch(list_linked_show_failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function list_linked_show_request() {
    return {
      type: tvShowsConstants.FETCH_TVSHOWS_LINKED_LIST_REQUEST,
    };
  }

  function list_linked_show_success(data) {
    return {
      type: tvShowsConstants.FETCH_TVSHOWS_LINKED_LIST_SUCCESS,
      payload: data,
    };
  }

  function list_linked_show_failure(error) {
    return {
      type: tvShowsConstants.FETCH_TVSHOWS_LINKED_LIST_FAILURE,
      error,
    };
  }
}

function list_tvshows_action(params, type) {
  return (dispatch) => {
    type ? dispatch(list_tvshows_clear_request()) : dispatch(list_tvshows_request());
    tvShowsService.get_all_tvShows(params).then((data) => {
      dispatch(list_tvshows_success(data));
    }, (error) => {
      dispatch(list_tvshows_failure(error.toString()));
      dispatch(alertActions.error(error.toString()));
    })
    function list_tvshows_request() { return { type: tvShowsConstants.FETCH_TVSHOWS_LIST_REQUEST } }
    function list_tvshows_clear_request() { return { type: tvShowsConstants.FETCH_TVSHOWS_LIST_CLEAR_REQUEST } }
    function list_tvshows_failure(error) { return { type: tvShowsConstants.FETCH_TVSHOWS_LIST_FAILURE, error } }
    function list_tvshows_success(data) {
      return {
        type: tvShowsConstants.FETCH_TVSHOWS_LIST_SUCCESS,
        payload: data
      }
    }
  }
}

function create_licence_action(params) {
  return (dispatch) => {
    dispatch(create_licence_request());
    tvShowsService.create_licence_service(params)
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
    tvShowsService.list_licence_service(params).then(
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
    tvShowsService.edit_licence_service(id, licenceData)
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
    tvShowsService.fetch_template_service(type)
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