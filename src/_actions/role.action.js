import { roleConstants } from '../_constants/role.constants';
import { alertActions } from './alert.actions';
import { roleService } from '../_services/role.service';
import { showSuccessErrorMsg } from './alertMessages.action';

export const roleActions = {
  create_role_action,
  update_roles_action
};

function create_role_action(roleData) {
  return dispatch => {
    dispatch(request());
    roleService.create_role_service(roleData)
      .then(data => {
          showSuccessErrorMsg(data.message, null, 'Success', false, '/roles', null);
        },
        error => {
          showSuccessErrorMsg(error.response.data.message, null, 'Error', true, null, '/role/create');
          dispatch(alertActions.error(error.toString()));
        }
      );
  };

  function request() { return { type: roleConstants.UPDATE_ROLES_REQUEST }
  }
}

function update_roles_action(id, updatedObj) {
  return dispatch => {
    dispatch(request());
    roleService.update_role_service(id, updatedObj)
      .then(data => {
          showSuccessErrorMsg(data.message, null, 'Success', false, '/roles', null);
        },
        error => {
          showSuccessErrorMsg(error.response.data.message, null, 'Error', true, null, '/roles');
          dispatch(alertActions.error(error.toString()));
        }
      );
  };

  function request() { return { type: roleConstants.UPDATE_ROLES_REQUEST }
  }
}
