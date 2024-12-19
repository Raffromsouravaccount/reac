import Config from "../Config/config";
import { setLocalData } from '../_helpers/util';
import axios from "../_helpers/axiosInstance";
import { history } from "../_helpers/history";


export const userService = {
    login_service,
    logout
};

function login_service(userCode) {
    return axios.get(Config.LoginURL + userCode)
        .then(userData => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            setLocalData('token', userData.data.data.token);
            setLocalData('userData', userData.data.data);
            let lastPage = sessionStorage.getItem('lastPage');
            if(lastPage){
                history.push(lastPage);
                sessionStorage.removeItem('lastPage');
            }else
                return userData;
        });
}

function logout() {
   document.location.href = Config.LogoutURL;
}