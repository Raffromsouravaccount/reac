import React, { Component } from 'react';
import moment from 'moment';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';


//Helper files
import { apiCalls } from "../../_services/common.service";
import ButtonField from "../../_components/Common/ButtonField/ButtonField";
import Config from '../../Config/config';
import { userConstants } from './user.constants';
import { history } from '../../_helpers/history';
import { permissionObj } from '../../_helpers/permission';

//Icons
import CloseIcon from 'images/close-icon.svg';
import CheckCircleIcon from 'images/check-circle-icon.svg';
import AngleLeftArrow from 'images/angle-left-arrow.svg';

//Css
import './ViewUser.css';
import { constantText } from '../../_helpers/constants.text';

class ViewUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {}
    };
  }

  componentDidMount = async () => {
    let { match } = this.props;
    if (match?.params?.id) {
      let userId = match?.params?.id;
      let response = await apiCalls(`${Config.usersUrl}/${userId}`, 'GET', {});
      if (response) {
        this.setState(prevState => ({ currentUser: response }));
      }
    }
  }

  handleRoute = (route) => {
    history.push(route);
  }

  render() {
    let { currentUser } = this.state;
    let { canUpdate } = permissionObj?.user;
    return (
      <div className='d-wrap c-n'>
        <div className='user-mment'>
          <div className="profile-w">
            <div className="bread-crumb top-minus-20">
              <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                <Link color="inherit" data-test="handle-route-link" onClick={() => this.handleRoute("/users")}>{userConstants.header}</Link>
                <Typography color="textPrimary">{userConstants.viewUserTxt}</Typography>
              </Breadcrumbs>
            </div>

            <div className="profile-head flex align-items-center justify-content-between">
              <div className="back-user-btn">
                <span data-test="handle-view-user-route" onClick={() => this.handleRoute("/users")}><AngleLeftArrow /></span>
                <strong><span>{userConstants.viewUserTxt}</span></strong>
              </div>
              {canUpdate() &&
                <div className="edit-user-btn">
                  <ButtonField 
                    buttonText={userConstants.editUserTxt}
                    onClick={() => this.handleRoute(`/user/edit/${currentUser?.id}`)}>
                  </ButtonField>
                </div>
              }
            </div>

            <div className="p-detail-w">
              <div className="p-detail-head flex align-items-center justify-content-between">
                <div className="l-title">{userConstants.userDetailTxt}</div>
                <div className="r-text flex align-items-center">
                  <div className="last-login">
                    <span className="text">Last login</span>
                    <span className="val">
                      {currentUser.lastLogin ? moment(currentUser.lastLogin).format(constantText.date_format_time) : "NA"}
                    </span>
                  </div>
                  <div className="p-status">
                    <span className="text">Profile Status</span>
                    <span className={`val ${currentUser.userStatus == '1' ? '' : 'inactive'}`}>
                      {currentUser.userStatus == "1" ? <CheckCircleIcon /> : <CloseIcon />} &nbsp;
                      {currentUser.userStatus == "1" ? userConstants.active : userConstants.inActive}
                    </span>
                  </div>
                </div>
              </div>

              <div className="u-detail-info">
                <div className="row">
                  <div className="col-md-6 col-lg-6 col-xl-4">
                    <div className="field-row">
                      <span className="text">First Name</span>
                      <span className="val">{currentUser.firstName}</span>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6 col-xl-4">
                    <div className="field-row">
                      <span className="text">Last Name</span>
                      <span className="val">{currentUser.lastName}</span>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6 col-xl-4">
                    <div className="field-row">
                      <span className="text">Email</span>
                      <span className="val">{currentUser.email}</span>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6 col-xl-4">
                    <div className="field-row">
                      <span className="text">Phone Number</span>
                      <span className="val">{currentUser.phone}</span>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6 col-xl-4">
                    <div className="field-row">
                      <span className="text">Role</span>
                      <span className="val">{currentUser?.role?.name}</span>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6 col-xl-4">
                    <div className="field-row">
                      <span className="text">Translation Language</span>
                      <span className="val">{currentUser?.translationLanguages?.map(obj => obj?.title).join(', ')}</span>
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-6 col-xl-4">
                    <div className="field-row">
                      <span className="text">Country / Group</span>
                      <span className="val">{currentUser?.countries?.map(obj => obj?.title).join(', ')}</span>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6 col-xl-4">
                    <div className="field-row">
                      <span className="text">Comments</span>
                      <span className="val">{currentUser.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="u-detail-footer flex align-items-center">
                <div className="created-by">
                  <span className="text">Created By</span>
                  <span className="val">
                    {`${currentUser.created_by ?
                      `${currentUser.created_by?.first_name} ${currentUser.created_by?.last_name},` : ""}
                      ${currentUser?.createdOn ? moment.utc(currentUser.createdOn).format(constantText.date_format_for_created_uodated_by) : 'NA'}`
                    }
                  </span>
                </div>
                <div className="updated-by">
                  <span className="text">Updated By</span>
                  <span className="val">
                    {`${currentUser?.modified_by ?
                      `${currentUser.modified_by?.first_name} ${currentUser.modified_by?.last_name},` : ""}
                      ${currentUser?.modifiedOn ? moment.utc(currentUser.modifiedOn).format(constantText.date_format_for_created_uodated_by) : 'NA'}`
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ViewUser;