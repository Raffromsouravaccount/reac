import { userConstants } from "../_constants/user.constants";
import { alertActions } from "./alert.actions";
import { showSuccessErrorMsg } from "./alertMessages.action";
import { userService } from "../_services/user.service";
import { history } from "../_helpers/history";
import { deleteLocalData, getLocalData, setLocalData } from "../_helpers/util";

import Config from "../Config/config";

export const userActions = {
  createUser_action,
  fetchUserByIdKey_action,
  fetch_roles_action,
  fetch_countries_action,
  fetch_language_action,
  fetch_master_action,
  create_master_action,
  update_master_action,
  patch_master_action,
  delete_master_action,
  update_users_action,
  user_details_action,
};

function createUser_action(userInfo) {
  return (dispatch) => {
    dispatch(request());
    userService.create_users_service(userInfo).then(
      (data) => {
        showSuccessErrorMsg(data.message, null, "Success", false, "/users", null);
      },
      (error) => {
        showSuccessErrorMsg(error.response.data.message, null, "Error", true, null, "/user/create");
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function request() {
    return {
      type: userConstants.CREATE_USER_REQUEST,
    };
  }

  function success(data) {
    return {
      type: userConstants.CREATE_USER_SUCCESS,
      payload: data,
    };
  }

  function failure(error) {
    return {
      type: userConstants.CREATE_USER_FAILURE,
      error,
    };
  }
}

function fetchUserByIdKey_action(key) {
  return (dispatch) => {
    dispatch(request());
    userService.fetchUserByIdKey_service(key).then(
      (data) => {
        dispatch(success(data));
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function request() {
    return {
      type: userConstants.FETCH_USERS_REQUEST,
    };
  }

  function success(data) {
    return {
      type: userConstants.FETCH_USERS_SUCCESS,
      payload: data,
    };
  }

  function failure(error) {
    return {
      type: userConstants.FETCH_USERS_FAILURE,
      error,
    };
  }
}

function user_details_action(userId) {
  return (dispatch) => {
    dispatch(request());
    userService.user_details_service(userId).then(
      (data) => {
        dispatch(success(data));
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function request() {
    return {
      type: userConstants.USER_DETAILS_REQUEST,
    };
  }

  function success(data) {
    return {
      type: userConstants.USER_DETAILS_SUCCESS,
      payload: data,
    };
  }

  function failure(error) {
    return {
      type: userConstants.USER_DETAILS_FAILURE,
      error,
    };
  }
}

function update_users_action(id, updatedObj) {
  return (dispatch) => {
    dispatch(request());
    userService.update_users_service(id, updatedObj).then(
      async (data) => {
        if (id === JSON.parse(localStorage.userData).userID && updatedObj.status === "InActive" ) {
          await showSuccessErrorMsg(data.message, null, "Success", true, "/", Config.LogoutURL);
          window.location.href = Config.LogoutURL;
        } else {
          let userInfo = getLocalData("userData");
          if (id == userInfo.userID) {
            let { firstName, lastName, email } = updatedObj;
            if(email) {
              deleteLocalData();
              window.location.href = Config.LogoutURL;
            }
            userInfo.firstName = firstName || userInfo.firstName;
            userInfo.lastName = lastName || userInfo.lastName;            
            setLocalData("userData", userInfo);
          }
          showSuccessErrorMsg(data.message, null, "Success", false, `/users`, null);
        }
      },
      (error) => {
        showSuccessErrorMsg(error.response.data.message, null, "Error", true, null, `/user/edit/${id}`);
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function request() {
    return {
      type: userConstants.UPDATE_USERS_REQUEST,
    };
  }

  function success(data) {
    return {
      type: userConstants.UPDATE_USERS_SUCCESS,
      payload: data,
    };
  }

  function failure(error) {
    return {
      type: userConstants.UPDATE_USERS_FAILURE,
      error,
    };
  }
}

function fetch_roles_action(query) {
  return (dispatch) => {
    dispatch(request());
    userService.fetch_roles_service(query).then(
      (response) => {
        dispatch(success(response));
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function request() {
    return {
      type: userConstants.FETCH_ROLES_REQUEST,
    };
  }

  function success(data) {
    return {
      type: userConstants.FETCH_ROLES_SUCCESS,
      payload: data,
    };
  }

  function failure(error) {
    return {
      type: userConstants.FETCH_ROLES_FAILURE,
      error,
    };
  }
}

function fetch_countries_action() {
  return (dispatch) => {
    dispatch(request());
    userService.fetch_countries_service().then(
      (response) => {
        dispatch(success(response));
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function request() {
    return {
      type: userConstants.FETCH_COUNTRY_REQUEST,
    };
  }

  function success(data) {
    return {
      type: userConstants.FETCH_COUNTRY_SUCCESS,
      payload: data,
    };
  }

  function failure(error) {
    return {
      type: userConstants.FETCH_COUNTRY_FAILURE,
      error,
    };
  }
}

function fetch_language_action(query) {
  return (dispatch) => {
    dispatch(request());
    userService.fetch_language_service(query).then(
      (response) => {
        dispatch(success(response));
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function request() {
    return {
      type: userConstants.FETCH_LANGUAGE_REQUEST,
    };
  }

  function success(data) {
    return {
      type: userConstants.FETCH_LANGUAGE_SUCCESS,
      payload: data,
    };
  }

  function failure(error) {
    return {
      type: userConstants.FETCH_LANGUAGE_FAILURE,
      error,
    };
  }
}

function fetch_master_action(type) {
  return (dispatch) => {
    dispatch(request());
    userService.fetch_master_service(type).then(
      (response) => {
        dispatch(success(response?.data?.data));
      },
      (error) => {
        dispatch(failure());
        dispatch(alertActions.error(error.toString()));
      }
    );
  };
  function request() {
    return {
      type: userConstants.FETCH_MASTER_REQUEST,
      payload: [],
    };
  }
  function success(data) {
    return {
      type: userConstants.FETCH_MASTER_SUCCESS,
      payload: data,
    };
  }
  function failure() {
    return {
      type: userConstants.FETCH_MASTER_FAILURE,
      payload: [],
    };
  }
}

function create_master_action(data, sucessPath, errPath) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      userService.create_master_service(data).then(
        (response) => {
          if (response?.status == 201) {
            resolve(response);
            showSuccessErrorMsg(
              response?.data?.message,
              null,
              "Success",
              false,
              sucessPath,
              errPath
            );
          }
        },
        (error) => {
          reject(error.toString());
          showSuccessErrorMsg(
            error?.response?.data?.message,
            null,
            "Error",
            true,
            sucessPath,
            errPath
          );
        }
      );
    });
  };
}

function update_master_action(uuid, data, sucessPath, errPath) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      userService.update_master_service(uuid, data).then(
        (response) => {
          resolve(response);
          showSuccessErrorMsg(
            response.message,
            null,
            "Success",
            false,
            sucessPath,
            errPath
          );
        },
        (error) => {
          reject(error.toString());
          showSuccessErrorMsg(
            error?.response?.data?.message,
            null,
            "Error",
            true,
            sucessPath,
            errPath
          );
          dispatch(alertActions.error(error.toString()));
        }
      );
    });
  };
}
function patch_master_action(uuid, type, data, sucessPath, errPath) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      userService.patch_master_service(uuid, type, data).then(
        (response) => {
          resolve(response);
          showSuccessErrorMsg(
            response.message,
            null,
            "Success",
            false,
            sucessPath,
            errPath
          );
        },
        (error) => {
          reject(error.toString());
          showSuccessErrorMsg(
            error?.response?.data?.message,
            null,
            "Error",
            true,
            sucessPath,
            errPath
          );
          dispatch(alertActions.error(error.toString()));
        }
      );
    });
  };
}
function delete_master_action(uuid, type) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      userService.delete_master_service(uuid, type).then(
        (response) => {
          resolve(response);
          const { pathname, search } = history.location;
          showSuccessErrorMsg(
            response.message,
            null,
            "Success",
            false,
            `${pathname}${search}`,
            `${pathname}${search}`
          );
        },
        (error) => {
          const { pathname, search } = history.location;
          reject(error.toString());
          showSuccessErrorMsg(
            error?.response?.data?.message,
            null,
            "Error",
            true,
            `${pathname}${search}`,
            `${pathname}${search}`
          );
          dispatch(alertActions.error(error.toString()));
        }
      );
    });
  };
}
