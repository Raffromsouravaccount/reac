import { collectionConstants } from '../_constants/collection.constants';
import { alertActions } from './alert.actions';
import { collectionService } from '../_services/collection.service';

function collection_list_action(params, type) {
  return (dispatch) => {
    if(type) {
      dispatch(collection_list_clear_request());
    } else {
      dispatch(collection_list_request());
    }
    collectionService.get_all_collections(params).then(
      (data) => {
        dispatch(collection_list_success(data));
      },
      (error) => {
        dispatch(collection_list_failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function collection_list_clear_request() {
    return {
      type: collectionConstants.COLLECTION_LIST_CLEAR_REQUEST,
    };
  }

  function collection_list_request() {
    return {
      type: collectionConstants.COLLECTION_LIST_REQUEST,
    };
  }

  function collection_list_success(data) {
    return {
      type: collectionConstants.COLLECTION_LIST_REQUEST_SUCCESS,
      payload: data,
    };
  }

  function collection_list_failure(error) {
    return {
      type: collectionConstants.COLLECTION_LIST_REQUEST_FAILURE,
      error,
    };
  }
}

function collection_get_license(params) {
  return (dispatch) => {
    dispatch(collection_get_license_request());
    collectionService.collection_get_license_service(params).then(
      (licenceResponse) => {
        dispatch(collection_get_license_success(licenceResponse));
      }, (error) => {
        dispatch(collection_get_license_failure());
        dispatch(alertActions.error(error.toString()));
      }
    )
  }

  function collection_get_license_request() {
    return {
      type: collectionConstants.COLLECTION_GET_LICENCE_REQUEST
    }
  }

  function collection_get_license_success(licenceResponse) {
    return {
      type: collectionConstants.COLLECTION_GET_LICENCE_SUCCESS,
      payload: licenceResponse
    }
  }

  function collection_get_license_failure(error) {
    return {
      type: collectionConstants.COLLECTION_GET_LICENCE_FAILURE,
      error: error.response.data
    }
  }
}

function collection_linked_list_action(params, type) {
  return (dispatch) => {
    dispatch(list_linked_collection_request());
    collectionService.get_all_linked_collection(params).then(
      (data) => {
        dispatch(list_linked_collection_success(data));
      },
      (error) => {
        dispatch(list_linked_collection_failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function list_linked_collection_request() {
    return {
      type: collectionConstants.COLLECTION_LINK_LIST_REQUEST,
    };
  }

  function list_linked_collection_success(data) {
    return {
      type: collectionConstants.COLLECTION_LINK_LIST_REQUEST_SUCCESS,
      payload: data,
    };
  }

  function list_linked_collection_failure(error) {
    return {
      type: collectionConstants.COLLECTION_LINK_LIST_REQUEST_FAILURE,
      error,
    };
  }
}

export const collectionActions = {
  collection_list_action,
  collection_get_license,
  collection_linked_list_action
};
