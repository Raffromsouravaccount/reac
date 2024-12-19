import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Paper from '@material-ui/core/Paper';

//Common Components
import ButtonField from '../Common/ButtonField/ButtonField';
import { CommonModel } from '../Common/Model/CommonModel';
import LimitDropDown from "../Common/LimitDropdown/LimitDropDown";
import RadioButton from '../Common/RadioButton/RadioButton';
import { PaginationComp } from '../Common/Pagination/Pagination';

//Redux actions
import { userActions } from '../../_actions/user.action';

//Helper files
import { apiCalls } from "../../_services/common.service";
import { history } from '../../_helpers/history';
import { constantText } from '../../_helpers/constants.text';
import Config from '../../Config/config';
import { permissionObj } from '../../_helpers/permission';
import InlineLoader from "../Common/InlineLoader/InlineLoader";

//Icons
import CloseIcon from 'images/close-icon.svg';
import CheckCircleIcon from 'images/check-circle-icon.svg';
import SingleUserIcon from 'images/s-user-icon.svg';
import FilterIcon from 'images/filter-icon.svg';
import ActivateIcon from 'images/activate-icon.svg';
import DeactivateIcon from 'images/Deactivate-icon.svg';
import CloseSquareIcon from 'images/close-square-icon.svg';

import './RoleListing.css';

class RoleListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allRolesData: [], filteredData: [], filteredRolesData: [], currentRoleDetails: null,
      totalRecords: 0, page: 1, limit: constantText.records_per_page,
      filters: {
        searchVal: "", status: ""
      },
      showStatePopup: false, showFilterDrawer: false,
      searchMode: false,
      filterDataKey: false,
      isRequestInitiate: true
    }
  }

  componentDidMount() {
    this.getAllRolesData();
  }

  getAllRolesData = async () => {
    const url = Config.rolesUrl;
    this.setState({
      isRequestInitiate: false
    })
    const res = await apiCalls(url, 'GET', {}, "/roles",false);
    if(res){
      this.setState({
        allRolesData: res || [],
        totalRecords: res?.length || 0,
        isRequestInitiate: true
      }, () => this.filterData());
    }
  }
  filterData = () => {
    let { allRolesData, filters } = this.state;
    let { searchVal, status } = filters;
    let filteredData = allRolesData.filter(data => (data?.name?.toLowerCase().includes(searchVal.toLowerCase()) && data));
    filteredData = status ? filteredData.filter(data => (data?.status == status)) : filteredData;
    filteredData = filteredData.sort((obj1, obj2) => (new Date(obj2.modifiedOn) - new Date(obj1.modifiedOn)));
    this.setState(prevState => ({
      filteredData,
      totalRecords: filteredData.length, page: 1
    }), () => this.handlePagination());
  }

  handleFilter = event => {
    let { filters } = this.state;
    let { name, value } = event.target;
    this.setState({
      searchMode: true,
      filters: {
        ...filters,
        [name]: value
      }
    }, () => this.filterData());
  }

  handleStatus = event => {
    let { filters } = this.state;
    let { name, value } = event.target;
    this.setState({
      filters: {
        ...filters,
        [name]: value
      },
      filterDataKey: true,
    });
  }

  showHideStatePopup = currentRoleDetails => {
    let { showStatePopup } = this.state;
    this.setState({
      currentRoleDetails: currentRoleDetails || null,
      showStatePopup: !showStatePopup
    });
  }

  activateDeactivateRole = async () => {
    let { currentRoleDetails } = this.state;
    let { id, status } = currentRoleDetails;
    let data = { status: status == "1" ? "0" : "1" };
    this.setState({ showStatePopup: false });
    const response = await apiCalls(`${Config.rolesUrl}/${id}`, "PATCH", data);
    if (response) {
      this.getAllRolesData();
    }
  }

  showHideFilterDrawer = () => {
    let { showFilterDrawer } = this.state;
    this.setState({ showFilterDrawer: !showFilterDrawer });
  }

  clearFilter = () => {
    let { filters } = this.state;
    this.setState({
      filters: {
        ...filters,
        status: ""
      },
      filterDataKey: false
    }, () => this.filterData());
  }

  getFilterDrawerUI = () => {
    let { filters } = this.state;
    let { status } = filters;
    return (
      <div className="sidebarBox">
        <div className="top-w flex align-items-center justify-content-between">
          <div className="title">{constantText.filters_header_text}</div>
          <div className="side-close-btn" onClick={this.showHideFilterDrawer}><CloseSquareIcon /></div>
        </div>
        <Divider />
        <div className="middle-w">
          <div className="inner">
            <div className="status-s">
              <RadioButton labelText={constantText.status_text} className="zee-radio-field status-field align-items-center"
                name="status" areaLabel="status" value={status} data-test="role-change-status" onChange={(event) => this.handleStatus(event)} labelPlacement="end"
                data={constantText.role_status_Arr} />
            </div>
          </div>
        </div>
        <div className="bottom-w filter-btn">
          <ButtonField color="secondary" className="apply-btn" buttonText={constantText.apply_filter_text}
            disabled={!status}
            data-test="role-filter-data"
            onClick={() => {
              this.showHideFilterDrawer();
              this.filterData();
              this.setState({
                searchMode: false
              })
            }}
          />
          <ButtonField color="secondary" className="cancle-btn" buttonText={constantText.clear_text} data-test="role-clear-filter"
            onClick={() => {
              this.showHideFilterDrawer();
              this.clearFilter();
            }}
          />
        </div>
      </div>
    )
  }

  handlePagination = () => {
    let { filteredData, page, limit } = this.state;
    let skip = limit * (page - 1);
    let length = (skip + limit < filteredData.length) ? skip + limit : filteredData.length;
    let filteredRolesData = filteredData.slice(skip, length);
    this.setState({ filteredRolesData });
  }

  handlePage = (event, page) => {
    this.setState({ page }, () => this.handlePagination());
  }

  handleRoute = (route, state) => {
    history.push(route, state);
  }

  render() {
    let { filteredData, filteredRolesData, filters, showFilterDrawer, currentRoleDetails,
      totalRecords, page, limit, showStatePopup, searchMode, filterDataKey,isRequestInitiate } = this.state;
    let { searchVal } = filters;
    let { canCreate, canUpdate } = permissionObj?.["role"];
    return (
      <div className='d-wrap c-n'>
        <div className="role-mngmnt">
          <div className="role-listing">
            <div className="user-head flex justify-content-between align-items-center">
              <div className="text" data-test="role-title-text">{constantText.role_header_text}</div>
              <div className="s-form flex">
                <input type="text" className="auto-search" name="searchVal" autoComplete="off" placeholder={constantText.role_search_text} value={searchVal}
                  onChange={(event) => this.handleFilter(event)} />
                <div className='filter-w'>
                  <ButtonField color="secondary" className={filterDataKey ? 'filter-btn current-active-filter' : 'filter-btn'} data-test="filter-btn-text" Icon={FilterIcon}
                    buttonText={constantText.filter_button_text} data-test="role-filter-drawer" onClick={this.showHideFilterDrawer}
                  />
                  {canCreate() &&
                    <div className='btn-create-user auto-createRole' onClick={() => this.handleRoute('/role/create')}>
                      {constantText.create_role_button_text}
                    </div>
                  }
                </div>
              </div>
            </div>
            <div className="card-wrap">
              <Paper>
                <div className="row">
                  {(filteredRolesData.length > 0) ? filteredRolesData.map((role, index) => (
                    <div className="col-sm-6 col-md-6 col-lg-4 col-xl-3" key={index}>
                      <div className="c-box role-box">
                        <Paper className="card" >
                          <div className={`u-status u-${(role.status == "1") ?
                            'active' : 'inactive'}`}>{role.status == "1" ?
                              constantText.active_text : constantText.inActive_text}</div>
                          <div className="u-name">{role.name}</div>
                          <div className="u-date">{role.modifiedOn ?
                            moment.utc(role.modifiedOn).format(constantText.date_format_without_time) : "NA"}</div>

                          <div className="btn-w flex">
                            <ButtonField autoId={`${role?.id}`} Icon={SingleUserIcon}
                              buttonText={constantText.manage_role_text}
                              disabled={!canUpdate()}
                              onClick={() => this.handleRoute(`/role/edit/${role.id}`)}
                            />
                            <ButtonField autoId={`${role?.id}`} className={role.status == "1" ? 'inactive' : 'active'}
                              disabled={!canUpdate()}
                              Icon={role.status == "1" ? CloseIcon : CheckCircleIcon}
                              buttonText={role.status == "1" ?
                                constantText.inActive_text : constantText.active_text}
                              onClick={() => this.showHideStatePopup(role)}
                            />
                          </div>
                        </Paper>
                      </div>
                    </div>
                  )) :
                    <div className="col-12 p-b-20">{isRequestInitiate ? (searchMode ? constantText.no_result_text : <span><b>{constantText.no_result_filter}</b> {constantText.no_result_filter_text}</span>
                    ) : null}</div>
                  }
                </div>
                <InlineLoader className="p-b-10" show={(filteredRolesData.length === 0 && !isRequestInitiate)}/>

              </Paper>

              <div className="page-nav bor-top pad-b-0 flex align-items-center justify-content-between">

                {(filteredRolesData.length > 0) &&
                  <div className="page-dropdown flex align-items-center">
                    <LimitDropDown name="limit" value={limit} data={constantText.role_limit_arr} onChange={event => {
                      let { name, value } = event.target;
                      this.setState({ [name]: Number(value), page: 1 }, () => this.handlePagination());
                    }} />
                    <div className="page-info">{`Showing ${filteredRolesData.length > limit ? limit : filteredRolesData.length}
                      of ${filteredData.length} records`}</div>
                  </div>
                }

                {filteredData.length > limit &&
                  <PaginationComp count={Math.ceil(totalRecords / limit)} page={page}
                    showFirstButton={true} showLastButton={true} data-test="role-pagination" onChange={this.handlePage} />
                }
              </div>

            </div>
            <CommonModel className='popup-wrap status-popup' state={showStatePopup}
              showTitle={true} title={`${(currentRoleDetails?.status == "1") ?
                constantText.de_activate_heading : constantText.activate_heading}`}
              showIcon={true} icon={(currentRoleDetails?.status == "1") ?
                <DeactivateIcon /> : <ActivateIcon />}
              showDes={true} des={`${constantText.confirm_msg_text} ${(currentRoleDetails?.status == "1")
                ? constantText.de_activate_text : constantText.activate_text} ${constantText.the_text} ${constantText.role_text}?`}
              showBtn1={true} btn1Text={constantText.yes_text} btn1Action={this.activateDeactivateRole}
              showBtn2={true} btn2Text={constantText.no_text} btn2Action={this.showHideStatePopup}
              handleClose={this.showHideStatePopup}
            />
          </div>
          <div className="sidebarBox">
            <Drawer open={showFilterDrawer} anchor="right" onClose={this.showHideFilterDrawer}>
              {this.getFilterDrawerUI()}
            </Drawer>
          </div>
        </div>
      </div>
    )
  }
}

export const mapStateToProps = state => {
  let { rolesArr } = state.user_reducer;
  return {
    allRolesData: rolesArr
  }
}

const actionCreators = dispatch => {
  return {
    getAllRoles: query => dispatch(userActions.fetch_roles_action(query))
  }
}

export default connect(mapStateToProps, actionCreators)(RoleListing);
