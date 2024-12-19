import { castCrewMgmtConstants } from "../_constants/castCrewMgmt.constants";
import { castCrewMgmtService } from "../_services/castCrewMgmt.service";
import { alertActions } from "./alert.actions";
import { showSuccessErrorMsg } from "./alertMessages.action";

export const castCrewMgmtActions = {
  create_faq_action,
  fetch_all_faq_action,
  view_profile_action,
  image_markasdone_action,
  get_castList_action
};

function create_faq_action(validateObj) {
  return (dispatch) => {
    dispatch(create_faq_request());
    castCrewMgmtService.create_faq_service(validateObj).then(
      (data) => {},
      (error) => {
        showSuccessErrorMsg(
          error.response.data.message,
          null,
          "Error",
          true,
          null
        );
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function create_faq_request() {
    return {
      type: castCrewMgmtConstants.CREATE_FAQ_REQUEST,
    };
  }
}

function fetch_all_faq_action(id) {
  return (dispatch) => {
    dispatch(fetch_all_faq_request());
    castCrewMgmtService.fetch_all_faq_service(id).then(
      (response) => {
        dispatch(fetch_all_faq_success(response));
      },
      (error) => {
        dispatch(fetch_all_faq_failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function fetch_all_faq_request() {
    return {
      type: castCrewMgmtConstants.FETCH_FAQ_REQUEST,
    };
  }

  function fetch_all_faq_success(data) {
    return {
      type: castCrewMgmtConstants.FETCH_FAQ_SUCCESS,
      payload: data,
    };
  }

  function fetch_all_faq_failure(error) {
    return {
      type: castCrewMgmtConstants.FETCH_FAQ_FAILURE,
      error,
    };
  }
}

function view_profile_action(id) {
  return (dispatch) => {
    dispatch(view_profile_request());
    castCrewMgmtService.view_profile_service(id).then((data) => {
      dispatch(view_profile_success(data));
    },
      (error) => {
        dispatch(view_profile_failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
      );
  };

  function view_profile_request() {
    return {
      type: castCrewMgmtConstants.FETCH_VIEW_PROFILE_REQUEST,
    };
  }
  function view_profile_success(data) {
    return {
      type: castCrewMgmtConstants.FETCH_VIEW_PROFILE_SUCCESS,
      payload: data,
    };
  }
  function view_profile_failure(data) {
    return {
      type: castCrewMgmtConstants.FETCH_VIEW_PROFILE_FAILURE,
      payload: data,
    };
  }
}

function image_markasdone_action(contentId) {
  return (dispatch) => {
    dispatch(image_markasdone_request());

    castCrewMgmtService.image_markasdone_service(contentId).then(
      (markasdoneResponse) => {
        showSuccessErrorMsg(
          markasdoneResponse.response &&
          markasdoneResponse.response.data &&
          markasdoneResponse.response.data.message,
          null,
          "Success",
          false,
          null
        );
        dispatch(image_markasdone_success(markasdoneResponse));
      },
      (error) => {
        showSuccessErrorMsg(
          error.response.data.message,
          null,
          "Error",
          true,
          null
        );
        dispatch(image_markasdone_failure(error));
      }
    );
  };
  function image_markasdone_request() {
    return { type: castCrewMgmtConstants.IMAGE_MARKASDONE_REQUEST };
  }
  function image_markasdone_success(markasdoneResponse) {
    return {
      type: castCrewMgmtConstants.IMAGE_MARKASDONE_SUCCESS,
      payload: markasdoneResponse,
    };
  }
  function image_markasdone_failure(error) {
    return {
      type: castCrewMgmtConstants.IMAGE_MARKASDONE_FAILURE,
      error: error && error.response && error.response.data,
    };
  }
}

function get_castList_action(queryParams) {
  return (dispatch) => {
    castCrewMgmtService.get_castList_service(queryParams).then(
      (data) => {
        dispatch(get_castList_success(data));
      },
      (error) => {
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function get_castList_success(data) {
    return {
      type: castCrewMgmtConstants.FETCH_CASTLIST_SUCCESS,
      payload: data.items
    };
  }
}

