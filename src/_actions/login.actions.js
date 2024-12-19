import Config from "../Config/config";
import { userConstants } from '../_constants/user.constants';
import { userService } from '../_services/login.service';
import { alertActions } from './alert.actions';
import { showSuccessErrorMsg } from './alertMessages.action';
import { removeLocalData } from "../_helpers/util";
import {constantText} from "../_helpers/constants.text";
export const loginActions = {
    login_action,
    logout
};

function login_action(userCode) {
    return dispatch => {
        dispatch(request());

        userService.login_service(userCode)
            .then(
                userData => {
                    dispatch(success(userData));
                },
                async error => {
                    let alert = (error.response.status == 401) ? constantText.alert_text : constantText.error_text
                    await showSuccessErrorMsg(error.response.data.message, null, alert , true, '/', Config.LogoutURL);
                    window.location.href= Config.LogoutURL;
                    dispatch(failure(error));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: userConstants.LOGIN_REQUEST } }
    function success(userData) { return { type: userConstants.LOGIN_SUCCESS, payload: userData } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error: error.response.data } }
}

function logout() {
    userService.logout();
    removeLocalData();
    return { type: userConstants.LOGOUT };
}