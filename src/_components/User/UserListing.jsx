import React, { Component } from 'react';
import moment from 'moment';
import Paper from '@material-ui/core/Paper';
import Drawer from '@material-ui/core/Drawer';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';

//Common Components
import { CommonModel } from '../Common/Model/CommonModel';
import { PaginationComp } from '../Common/Pagination/Pagination';
import LimitDropDown from "../Common/LimitDropdown/LimitDropDown";
import RadioButton from '../Common/RadioButton/RadioButton';
import ButtonField from '../Common/ButtonField/ButtonField';
import InlineLoader from "../Common/InlineLoader/InlineLoader";

//Helper files
import Config from '../../Config/config';
import { history } from '../../_helpers/history';
import { userConstants } from './user.constants';
import { constantText } from '../../_helpers/constants.text';
import FormRender from '../Common/FormHelper/FormRender';
import { getLocalData, getSelectedGroup, formatCountryGroup } from '../../_helpers/util';
import { permissionObj } from '../../_helpers/permission';

//Server calls
import { apiCalls } from "../../_services/common.service";

//Icons
import MessageSquareIcon from 'images/message-square-icon.svg';
import CloseIcon from 'images/close-icon.svg';
import CheckCircleIcon from 'images/check-circle-icon.svg';
import SingleUserIcon from 'images/s-user-icon.svg';
import FilterIcon from 'images/filter-icon.svg';
import SortIcon from 'images/sort-icon.svg';
import ActivateIcon from 'images/activate-icon.svg';
import DeactivateIcon from 'images/Deactivate-icon.svg';
import CloseSquareIcon from 'images/close-square-icon.svg';
//JSON
import { sideSelectFilters } from "./Schema/SideFilter.json";
//Css
import './User.css';

class UserListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: getLocalData('userData'),
      isRequestInitiate: true,
      allUsers: [], filteredData: [], filteredUsers: [],
      currentUser: null,
      totalRecords: 0, page: 1, limit: constantText.records_per_page,
      rolesArr: [], languageArr: [], countriesArr: [],
      filters: {
        searchVal: "", sort: "descending",
        fields: JSON.parse(JSON.stringify(sideSelectFilters)),
      },
      showFilterDrawer: false, openSortDrawer: false,
      showStatePopup: false,
      searchMode: false,
      sortHighLight: true,
      filterHighLight: false
    }
  }

  componentDidMount() {
    this.getAllUsers();
  }

  getAllUsers = async () => {
      const url = `${Config.usersUrl}?type=Others`;
      this.setState({
        isRequestInitiate: false
      })
      const res = await apiCalls(url, 'GET', {}, "/users",false);
      if(res){
        this.setState({
          allUsers: res || [],
          totalRecords: res?.length || 0,
          isRequestInitiate: true
        }, () => this.filterData());
      }
  }

  setSelectDataArr = (res, index) => {
    const { filters } = this.state;
    const copyFilters = JSON.parse(JSON.stringify(filters));
    index == 1 ? res = formatCountryGroup(res) : "";
    copyFilters.fields[index].data = res;
    this.setState({ filters: copyFilters });
  };

  selectGroup = (event, group) => {
    const { filters } = this.state;
    const copyFormFieldsJson = JSON.parse(JSON.stringify(filters));
    const copyElement = { ...copyFormFieldsJson.fields[1] };
    const copyOptions = [...copyElement.data];

    if (event?.target?.checked) {
      const filterOptions = copyOptions.filter((item) => item.group === group);
      copyElement.value = copyElement.value
        ? [...copyElement.value, ...filterOptions]
        : filterOptions;
    } else {
      const copyValues = [...copyElement.value];
      const filterValues = copyValues.filter((item) => item.group !== group);
      copyElement.value = filterValues;
    }
    copyFormFieldsJson.fields[1] = copyElement;
    this.setState({ filters: copyFormFieldsJson });
  };

  filterData = (type) => {
    let { allUsers, filters, filterHighLight, sortHighLight } = this.state;
    const { searchVal, fields } = filters;
    const role = fields[0].value || [],
          group = fields[1].value || [],
          language = fields[2].value || [],
          userStatus = fields[3].value || null;
    let filteredData = (allUsers.length > 0) ? allUsers?.filter(user =>
    ((`${user?.firstName} ${user?.lastName}`.toLowerCase().includes(searchVal.toLowerCase()) ||
      user.email.toLowerCase().includes(searchVal.toLowerCase())) && user)) : [];
    filteredData = filteredData?.filter(user => userStatus ? (user.userStatus == userStatus) : user);

    filteredData = filteredData?.filter(user => role.length > 0 ?
      (role.map(obj => obj.name)).includes(user?.role?.name) : user);

    filteredData = filteredData?.filter(user => group.length > 0 ?
      (this.checkIfSubArrayExist(user?.countries?.map(obj => obj?.title), group.map(obj => obj?.title)) && user) :
      user);

    filteredData = filteredData?.filter(user => language.length > 0 ?
      (this.checkIfSubArrayExist(user?.translationLanguages?.map(obj => obj?.title), language.map(obj => obj?.title)) && user) :
      user);

    filteredData = this.sortData(filteredData || []);
    if (this.state.filterHighLight === true && type === 'sort') {
      this.setState({
        sortHighLight: true
      })
    } else if (this.state.sortHighLight === true && type === 'filter') {
      this.setState({
        filterHighLight: true
      })
    } else if (type !== undefined) {
      this.setState({
        filterHighLight: (type === 'filter'),
        sortHighLight: (type === 'sort')
      })
    }
    this.setState(prevState => ({
      filteredData,
      totalRecords: filteredData?.length, page: 1
    }), () => this.handlePagination());
  }

  sortData = users => {
    let { filters } = this.state;
    let { sort } = filters;
    let sortedData = users?.sort((obj1, obj2) => {
      if (sort == "ascending") {
        return new Date(obj1.modifiedOn) - new Date(obj2.modifiedOn);
      }
      else {
        return new Date(obj2.modifiedOn) - new Date(obj1.modifiedOn);
      }
    });

    return sortedData;
  }

  checkIfSubArrayExist = (master, sub) => {
    return (sub?.length > 0) ? sub?.some(item => master?.includes(item)) : master;
  }

  clearSort = () => {
    let { filters } = this.state;
    this.setState({
      filters: {
        ...filters,
        sort: null,
      },
      sortHighLight: false,
      page: 1,
      openSortDrawer: false
    }, () => this.getAllUsers())
  }

  handlePagination = () => {
    let { filteredData, page, limit } = this.state;
    let skip = limit * (page - 1);
    let length = (skip + limit < filteredData.length) ? skip + limit : filteredData.length;
    let filteredUsers = filteredData.slice(skip, length);
    this.setState({ filteredUsers });
  }

  handleChange = event => {
    let { name, value } = event.target;
    let { filters } = this.state;
    this.setState({
      searchMode: true,
      filters: {
        ...filters,
        [name]: value
      }
    }, () => {
      if (name == "searchVal") {
        this.filterData();
      }
    });
  }

  handleMultiSelect = (ev, index) => {
    let { filters } = this.state;
    const { value } = ev.target;

    filters.fields[index].value = value;
    this.setState({
      filters: { ...filters }
    });
  }

  showHideStatePopup = currentUser => {
    let { showStatePopup } = this.state;
    this.setState({
      currentUser: currentUser || null,
      showStatePopup: !showStatePopup
    });
  }

  activateDeactivateUser = () => {
    let { currentUser } = this.state;
    this.setState({
      showStatePopup: false
    }, async () => {
      let { id, userStatus } = currentUser;
      let data = {
        userStatus: (userStatus == "1") ? "2" : "1"
      };
      let response = await apiCalls(`${Config.usersUrl}/${id}`, "PATCH", data);
      if (response) {
        this.getAllUsers();
      }
    });
  }

  clearFilter = () => {
    let { filters } = this.state;
    filters.fields.forEach(item => {
      item.value = item.multiple ? [] : null;
    })
    this.setState({
      filterHighLight: false,
      filters: {
        ...filters
      },
      searchMode: false, page: 1,
      showFilterDrawer: false
    }, () => this.filterData());
  }

  showHideFilterDrawer = () => {
    let { showFilterDrawer } = this.state;
    this.setState({ showFilterDrawer: !showFilterDrawer });
  }

  getFilterDrawerUI = () => {
    let { filters } = this.state;
    const disabled = (
      filters.fields[0].value?.length == 0
      && filters.fields[1].value?.length == 0
      && filters.fields[2].value?.length == 0
      && filters.fields[3].value == null) ? true : false;
    return (
      <div className="sidebarBox">
        <div className="top-w flex align-items-center justify-content-between">
          <div className="title">{userConstants.filters_text}</div>
          <div className="side-close-btn" onClick={this.showHideFilterDrawer}><CloseSquareIcon /></div>
        </div>
        <Divider />
        <div className="middle-w">
          <div className="inner">
            <div className="f-filter">
              <FormRender
                form={filters.fields}
                setSelectDataArr={this.setSelectDataArr}
                onChange={this.handleMultiSelect}
                selectGroup={this.selectGroup}
              />
            </div>
          </div>
        </div>
        <div className="bottom-w filter-btn">
          <ButtonField color="secondary" className="apply-btn" buttonText={userConstants.apply_filter_text}
            disabled={disabled}
            onClick={() => {
              this.showHideFilterDrawer();
              this.filterData('filter');
              this.setState({
                searchMode: false
              })
            }}
          />
          <ButtonField color="secondary" className="cancle-btn" buttonText={userConstants.clear_text}
            onClick={() => this.clearFilter('filter')}
          />
        </div>
      </div>
    )
  }

  showHideSortDrawer = () => {
    let { openSortDrawer } = this.state;
    this.setState({ openSortDrawer: !openSortDrawer });
  }

  getSortDrawer = () => {
    let { filters } = this.state;
    let { sort } = filters;
    return (
      <div className="sidebarBox">
        <div className="top-w flex align-items-center justify-content-between">
          <div className="title">{userConstants.sort_text}</div>
          <div className="side-close-btn" onClick={this.showHideSortDrawer}><CloseSquareIcon /></div>
        </div>
        <Divider />
        <div className="middle-w">
          <div className="inner">
            <div className="status-s">

              <RadioButton  className="zee-radio-field status-field align-items-center"
                name="sort" areaLabel="sort" value={sort} onChange={(event) => this.handleChange(event)} labelPlacement="end"
                data={userConstants.sortByArr} />

            </div>
          </div>
        </div>
        <div className="bottom-w filter-btn">
          <ButtonField color="secondary" className="apply-btn" buttonText={userConstants.apply_sort_text}
            disabled={!sort ? true : false}
            onClick={() => {
              this.showHideSortDrawer();
              this.filterData('sort');
            }}
          />
          <ButtonField color="primary" className="cancle-btn" buttonText={userConstants.clear_text}
            data-test="user-clear-sort" onClick={this.clearSort}
          />
        </div>
      </div>
    )
  }

  handlePage = (event, page) => {
    this.setState({ page }, () => this.handlePagination());
  }

  handleRoute = route => {
    history.push(route);
  }

  render() {
    let { filteredData, isRequestInitiate, filteredUsers, filters, openSortDrawer, page, totalRecords, limit,
      showStatePopup, showFilterDrawer, currentUser, searchMode, sortHighLight, filterHighLight } = this.state;
    let { searchVal } = filters;
    let { canCreate, canUpdate } = permissionObj?.user;
    return (
      <div>
        <div className='d-wrap c-n'>
          <div className='user-mment'>
            <div className="user-listing">
              <div className="user-head flex justify-content-between align-items-center">
                <div className="text" data-test="user-title-text">{userConstants.header}</div>
                <div className="s-form flex">
                  <input type="text" className="auto-search" name="searchVal" autoComplete="off" placeholder={userConstants.searchPlaceHolderText} value={searchVal}
                    onChange={(event) => this.handleChange(event)} />
                  <div className='filter-w'>
                    <ButtonField color="secondary" className={sortHighLight ? 'short-btn current-active-filter' : 'short-btn'} Icon={SortIcon}
                      buttonText={'Sort'} data-test="user-sort-drawer" onClick={this.showHideSortDrawer}
                    />
                    <ButtonField color="secondary" className={filterHighLight ? 'filter-btn current-active-filter' : 'filter-btn'} Icon={FilterIcon}
                      buttonText={'Filters'} data-test="user-filter-drawer" onClick={this.showHideFilterDrawer}
                    />
                    {canCreate() &&
                      <div className="btn-create-user auto-button-create-user " data-test="create-user-button" onClick={() => this.handleRoute('/user/create')}>Create User</div>
                    }

                  </div>
                </div>
              </div>
              <div className="card-wrap">
                <Paper>
                  <div className="row">
                    {(filteredUsers.length > 0) ? filteredUsers.map((user, index) => (
                      <div className="col-sm-6 col-md-6 col-lg-4 col-xl-3" key={index}>
                        <div className="c-box">
                          <Paper className="card" >
                            <div className={`u-status u-${(user.userStatus == "1") ? 'active' : 'inactive'}`}>
                              {user.userStatus == "1" ? userConstants.active : userConstants.inActive}
                            </div>
                            <Avatar className="c-blue">{`${user.firstName?.slice(0, 1)}${user.lastName?.slice(0, 1)}`}</Avatar>
                            <div className="u-name">{`${user.firstName} ${user.lastName}`}</div>
                            <div className="u-profile">{user?.role?.name}</div>
                            <div className="u-date">{user.lastLogin ?
                              moment(user.lastLogin).format(constantText.date_format_with_time) : "NA"}
                            </div>
                            <div className="u-mail"><MessageSquareIcon />{`${user.email || 'NA'}`}</div>
                            <div className="btn-w flex">

                              <ButtonField autoId={`${user?.id}`} Icon={SingleUserIcon}
                                buttonText={userConstants.viewProfile}
                                data-test="user-handle-route"
                                onClick={() => this.handleRoute(`/user/view/${user?.id}`)}
                              />
                              <ButtonField autoId={`${user?.id}`} className={user.userStatus == "1" ? 'inactive' : 'active'}
                                Icon={user.userStatus == "1" ? CloseIcon : CheckCircleIcon}
                                buttonText={user.userStatus == "1" ? userConstants.inactivate : userConstants.activate}
                                disabled={!canUpdate()}
                                onClick={() => this.showHideStatePopup(user)}
                              />
                            </div>
                          </Paper>
                        </div>
                      </div>
                    )) : <div className="col-12 p-b-20">{searchMode ? userConstants.no_data_found : filterHighLight ? <span><b>{userConstants.no_data_filter}</b>{userConstants.no_data_filter_text}</span>: null}</div>
                    }
                  </div>
                  <InlineLoader className="p-b-10" show={(filteredUsers.length === 0 && !isRequestInitiate)}/>

                </Paper>

                <div className="page-nav bor-top pad-b-0 flex align-items-center justify-content-between">

                  {(filteredUsers.length > 0) &&
                    <div className="page-dropdown flex align-items-center">
                      <LimitDropDown data-test="handle-pagination" name="limit" value={limit} data={userConstants.limit_arr} onChange={event => {
                        let { name, value } = event.target;
                        this.setState({ [name]: Number(value), page: 1 }, () => this.handlePagination());
                      }} />
                      <div className="page-info">{`Showing ${filteredUsers.length > limit ? limit : filteredUsers.length}
                      of ${filteredData.length} records`}</div>
                    </div>
                  }

                  {filteredData.length > limit &&
                    <PaginationComp count={Math.ceil(totalRecords / limit)} page={page}
                      showFirstButton={true} showLastButton={true} onChange={this.handlePage} />
                  }
                </div>

              </div>
              <CommonModel className='popup-wrap status-popup' state={showStatePopup}
                showTitle={true} title={`${(currentUser?.userStatus == "1") ? 'Deactivate' : 'Activate'} User`}
                showIcon={true} icon={(currentUser?.userStatus == "1") ? <DeactivateIcon /> : <ActivateIcon />}
                showDes={true} des={`Do you want to ${(currentUser?.userStatus == "1") ? 'deactivate' : 'activate'} the user?`}
                showBtn1={true} btn1Text={'Yes'} btn1Action={this.activateDeactivateUser}
                showBtn2={true} btn2Text={'No'} btn2Action={this.showHideStatePopup}
                handleClose={this.showHideStatePopup}
              />
            </div>
            <div className="sidebarBox">
              <Drawer anchor="right" open={openSortDrawer} onClose={this.showHideSortDrawer}>{this.getSortDrawer()}</Drawer>
              <Drawer open={showFilterDrawer} anchor="right" onClose={this.showHideFilterDrawer}>
                {this.getFilterDrawerUI()}
              </Drawer>
            </div>

          </div>
        </div>
      </div>
    )
  }

}

export default UserListing;
