import { videoMgmtConstants } from "../_constants/videoMgmt.constants";
import {
  fetch_template_service,
  list_license_service,
  create_licence_service,
  edit_licence_service,
} from "../_services/videoMgmt.service";
import { videoMgmtService } from "../_services/videoMgmt.service";
import { alertActions } from "./alert.actions";
import { showSuccessErrorMsg } from "./alertMessages.action";

export const videoMgmtActions = {
  list_linked_video_action,
  create_licence_action,
  list_license_action,
  edit_licence_action,
  fetch_template_action,
};

function list_linked_video_action(id) {
  return (dispatch) => {
    dispatch(list_linked_video_request());
    videoMgmtService.get_all_linked_videos(id).then(
      (data) => {
        dispatch(list_linked_video_success(data));
      },
      (error) => {
        dispatch(list_linked_video_failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function list_linked_video_request() {
    return {
      type: videoMgmtConstants.FETCH_VIDEO_LINKED_LIST_REQUEST,
    };
  }

  function list_linked_video_success(data) {
    return {
      type: videoMgmtConstants.FETCH_VIDEO_LINKED_LIST_SUCCESS,
      payload: data,
    };
  }

  function list_linked_video_failure(error) {
    return {
      type: videoMgmtConstants.FETCH_LINKED_VIDEO_LIST_FAILURE,
      error,
    };
  }
}

function create_licence_action(params) {
  return (dispatch) => {
    dispatch(create_licence_request());
    create_licence_service(params).than(
      (data) => {
        dispatch(create_licence_success(data));
      },
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
  function create_licence_request() {
    return {
      type: videoMgmtConstants.CREATE_LICENCE_REQUEST,
    };
  }

  function create_licence_success(data) {
    return {
      type: videoMgmtConstants.CREATE_LICENCE_SUCCESS,
      payload: data,
    };
  }
}

function list_license_action(params) {
  return (dispatch) => {
    dispatch(get_license_request());
    list_license_service(params).then(
      (licenseResponse) => {
        dispatch(get_license_success(licenseResponse));
      },
      (error) => {
        dispatch(get_license_failure(error));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function get_license_request() {
    return {
      type: videoMgmtConstants.GET_LICENSE_REQUEST,
    };
  }

  function get_license_success(licenseResponse) {
    return {
      type: videoMgmtConstants.GET_LICENSE_SUCCESS,
      payload: licenseResponse,
    };
  }

  function get_license_failure(error) {
    return {
      type: videoMgmtConstants.GET_LICENSE_FAILURE,
      error: error.response.data,
    };
  }
}

function edit_licence_action(id, licenceData) {
  return (dispatch) => {
    dispatch(edit_licence_request());
    edit_licence_service(id, licenceData).then(
      (data) => {
        dispatch(edit_licence_success(data));
      },
      (error) => {
        showSuccessErrorMsg(
          error.response.data.message,
          null,
          "Error",
          true,
          null
        );
        dispatch(alertActions.error(error.toString()));
        dispatch(edit_licence_failure(error));
      }
    );
  };

  function edit_licence_request() {
    return {
      type: videoMgmtConstants.EDIT_LICENCE_REQUEST,
    };
  }

  function edit_licence_success(data) {
    return {
      type: videoMgmtConstants.EDIT_LICENCE_SUCCESS,
      payload: data,
    };
  }

  function edit_licence_failure(error) {
    return {
      type: videoMgmtConstants.EDIT_LICENCE_FAILURE,
      error: error,
    };
  }
}

function fetch_template_action(type, masterType) {
  return (dispatch) => {
    dispatch(fetch_template_request());
    fetch_template_service(type).then(
      (data) => {
        dispatch(
          fetch_template_success(
            data
              ? data.map((item) => {
                  return {
                    DisplayName: item?.title ? item?.title : "N/A",
                    CurrentStatus: item?.status ? item?.status : "N/A",
                    uuid: item.id ? item?.id : "N/A",
                    template: item?.licenceTemplateDetails
                      ? item?.licenceTemplateDetails
                      : "N/A",
                  };
                })
              : [],
            masterType
          )
        );
      },
      (error) => {
        dispatch(fetch_template_failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function fetch_template_request() {
    return {
      type: videoMgmtConstants.FETCH_TEMPLATE_REQUEST,
    };
  }

  function fetch_template_success(data, masterType) {
    if (masterType === "TEMPLATE") {
      return {
        type: videoMgmtConstants.FETCH_TEMPLATE_SUCCESS,
        payload: data,
      };
    }
  }

  function fetch_template_failure(error) {
    return {
      type: videoMgmtConstants.FETCH_TEMPLATE_FAILURE,
      error: error,
    };
  }
}
