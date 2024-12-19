import React, { Component } from "react";
import { connect } from "react-redux";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

//Common Components
import FormRender from "../Common/FormHelper/FormRender";
import { CommonModel } from "../Common/Model/CommonModel";
import { PaginationComp } from "../Common/Pagination/Pagination";
import LimitDropDown from "../Common/LimitDropdown/LimitDropDown";
import checkValidity from "../Common/FormHelper/FieldValidator";
import { isValidatedForm } from "../Common/FormHelper/FormValidSetter";

//Helper Files
import { userActions } from "../../_actions/user.action";
import { history } from "../../_helpers/history";
import { getLocalData } from "../../_helpers/util";
import { titleCase } from "../../_helpers/util";
import { permissionObj } from "../../_helpers/permission";
import MasterTable from "./MasterTable/MasterTable";
import { masterConstants } from "./master.constant";
import { constantText } from '../../_helpers/constants.text';
//Icon
import AngleLeftArrow from "images/angle-left-arrow.svg";
//CSS
import "./ManageMasters.css";

const DEFAULT_JSON = (json) => {
  if (json && json.length) {
    return json.map((item) => {
      (item.value =
        item.type === "checkbox"
          ? false
          : item.type === "dropdown"
            ? null
            : ""),
      item.touched = 0;
      item.errorText = "";
      item.valid = true;
      return item;
    });
  }
};

class ManageMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      UUID: null,
      isCustom: false,
      customPath: "",
      apiKey: null,
      popupMode: "add",
      masterArr: [],
      masterLoading: false,
      searchVal: "",
      searchKey: "",
      formData: [],
      formIsValid: false,
      showStatePopup: false,
      showStatusModel: false,
      selectedStatus: "",
      MODULE: {},
      isAdmin: false,
      isType: false,
      countField: null,
      thData: [],
      filteredData: [],
      filteredRows: [],
      totalRecords: 0,
      page: 1,
      limit: masterConstants.records_per_page,
    };
  }

  componentDidMount() {
    const { location } = this.props;
    const paramsString = location?.search;
    const params = new URLSearchParams(paramsString);
    const module = params.get("module");
    const CONFIG = getLocalData("masterModules");
    const { RoleName } = getLocalData("userData") || {};
    const isAdmin = RoleName?.toLowerCase() === 'system admin';
    const isType = module?.toLowerCase() === 'channel' || module?.toLowerCase() === 'tvshowsubtype';

    if (CONFIG && CONFIG[module]) {
      //fetchMaster
      this.props.fetchMaster(CONFIG[module]?.apiKey);
      const THeader = CONFIG[module]["tableConfig"] || [];
      const rowKeys = this.getRowsKey(CONFIG[module]);
      const jsonForm = DEFAULT_JSON(CONFIG[module]?.formConfig);
      this.setState({
        MODULE: CONFIG[module],
        thData: THeader,
        rowKeys: rowKeys,
        isType,
        isAdmin,
        countField: CONFIG[module]?.countField || null,
        isCustom: CONFIG[module]?.isCustomAction || false,
        customPath: CONFIG[module]?.CustomPath,
        apiKey: CONFIG[module]?.apiKey || null,
        formData: jsonForm,
        statusKey: CONFIG[module]?.Status,
        searchKey: CONFIG[module]?.searchKey,
        isView: CONFIG[module]?.isView || false,
        isEdit: isType ? (CONFIG[module]?.isEdit && isAdmin) : CONFIG[module]?.isEdit,
        isDelete: isType ? (CONFIG[module]?.isDelete && isAdmin) : CONFIG[module]?.isDelete,
      });
    } else {
      this.props?.history?.push("/masters");
    }
  }
  componentWillReceiveProps = (nextProps) => {
    let { masterArr, masterLoading } = nextProps;
    this.setState(
      {
        masterArr: masterArr || [],
        masterLoading : masterLoading || false,
      },
      () => this.filterData()
    );
  };
  getRowsKey = (module) => {
    if(module){
      const tableConfig = module["tableConfig"] || [];
      const rowKeys = tableConfig.map((item) => item.key);
      return rowKeys;
    }
  };

  handleSearch = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: [value] }, () => this.filterData());
  };
  handleRoute = (route) => {
    history.push(route);
  };
  showHideFormDialog = (mode) => {
    const { formData } = this.state;
    const RESETFORM = DEFAULT_JSON(formData);

    this.setState((prevState) => {
      return {
        showStatePopup: !prevState.showStatePopup,
        popupMode: mode,
        formData: RESETFORM,
      };
    });
  };
  showEditPopup = (row) => {
    const copyFormData = [...this.state.formData];
    const updatedData = copyFormData.map((item) => {
      item.value = row[item?.name];
      return item;
    });
    this.setState((prevState) => {
      return {
        showStatePopup: !prevState.showStatePopup,
        formData: updatedData,
        popupMode: "edit",
        selectedStatus: row?.status,
        UUID: row?.id,
      };
    });
  };
  showHideStatus = (status, id) => {
    let { showStatusModel } = this.state;
    if (status) {
      this.setState({
        showStatusModel: !showStatusModel,
        selectedStatus: status,
        UUID: id,
      });
    } else {
      this.setState({
        showStatusModel: !showStatusModel,
      });
    }
  };
  activateDeactivateStatus = async () => {
    const { UUID, selectedStatus, apiKey, statusKey } = this.state;
    const { patchMaster, fetchMaster, location } = this.props;
    const { pathname, search } = location;
    const redirectPath = pathname + search;
    const postObj = {};
    postObj[statusKey] = selectedStatus == "1" ? "0" : "1";
    this.showHideStatus("");
    const res = await patchMaster(UUID, apiKey, postObj, redirectPath, redirectPath);
    if (res) {
      fetchMaster(apiKey);
    }
  };
  InputChanger = (event, elemIndex) => {
    const copyJSON = [...this.state.formData];
    const updatedElement = copyJSON[elemIndex];
    if (updatedElement.type === "file") {
      updatedElement.value = event.target.value;
      updatedElement.file = event.target.files[0];
    } else {
      updatedElement.value =
        updatedElement.type === "checkbox"
          ? event.target.checked
          : (event.target.value.trim() ? event.target.value : event.target.value.trim());
    }
    //check validity
    const { isValid, errorText } = checkValidity(
      updatedElement.value,
      updatedElement.validation
    );
    updatedElement.valid = isValid;
    updatedElement.errorText = errorText;
    //updated element's touched property
    updatedElement.touched = 1;
    this.setState({ formData: copyJSON });
  };
  saveHandler = async (mode) => {
    const { apiKey, formData, selectedStatus } = this.state;
    const { createMaster, updateMaster, fetchMaster, location } = this.props;
    const { pathname, search } = location;
    const redirectPath = pathname + search;
    const postObj = {};
    const { formValidity, validatedForm } = isValidatedForm(formData);
    this.setState({ formData: validatedForm });
    if (formValidity) {
      formData.forEach((item) => {
        postObj[item?.name] = item?.value;
      });
      if (mode === "add") {
        postObj.type = apiKey;
        this.showHideFormDialog("add");
        const res = await createMaster(postObj, redirectPath, redirectPath);
        if (res) {
          fetchMaster(apiKey);
        }
      } else {
        postObj.type = apiKey;
        this.showHideFormDialog("edit");
        const res = await updateMaster(
          this.state.UUID,
          postObj,
          redirectPath,
          redirectPath
        );
        if (res) {
          fetchMaster(apiKey);
        }
      }
    }
  };
  deleteHandler = async () => {
    const { UUID, apiKey, statusKey } = this.state;
    const { patchMaster, fetchMaster, location } = this.props;
    const { pathname, search } = location;
    const redirectPath = pathname + search;
    const postObj = {};
    postObj[statusKey] = "2";
    this.showHideStatus("");
    const res = await patchMaster(UUID, apiKey, postObj, redirectPath, redirectPath);
    if (res) {
      fetchMaster(apiKey);
    }
  };
  handleCustomPath = (row, mode) => {
    const { customPath, MODULE, formData } = this.state;
    history.push(`${customPath}?mode=${mode}`, {
      data: row,
      moduleName: MODULE?.displayModuleName,
      buttonText: MODULE?.buttonText,
      apiKey: MODULE?.apiKey,
      formData: formData,
      selectedStatus: row?.status,
      UUID: row?.id
    });
  };
  handlePagination = () => {
    let { filteredData, page, limit } = this.state;
    let skip = limit * (page - 1);
    let length =
      skip + limit < filteredData.length ? skip + limit : filteredData.length;
    let filteredRows = filteredData.slice(skip, length);
    this.setState({ filteredRows });
  };
  handlePage = (event, page) => {
    this.setState({ page }, () => this.handlePagination());
  };
  filterData = () => {
    let { masterArr, searchVal, searchKey } = this.state;
    const filteredData = masterArr.filter((item) => {
      let searchItem = "";
      searchKey.forEach((key) => {
        searchItem += `${item[key]} `;
      });
      return searchItem
        .toLowerCase()
        .includes(searchVal.toString().trim().toLowerCase());
    });
    this.setState(
      (prevState) => ({
        filteredData,
        totalRecords: filteredData.length,
        page: 1,
      }),
      () => this.handlePagination()
    );
  };
  render() {
    const { isType, isAdmin, popupMode, countField, isCustom, customPath, isView, isEdit, isDelete, thData, rowKeys, MODULE,
      statusKey, showStatusModel, showStatePopup, selectedStatus, filteredRows, filteredData, formData,
      totalRecords, limit, page, masterLoading } = this.state;

    const { canCreate } = permissionObj?.masters;
    const isCheckValid = isType ? (canCreate() && isAdmin) : canCreate();

    return (
      <div className="d-wrap c-n">
        <CommonModel
          className="popup-wrap status-popup"
          state={showStatePopup}
          showTitle={true}
          showIcon={false}
          title={(popupMode == "add" ? "Add " : "Edit ") + MODULE?.buttonText}
          showBtn1={true}
          btn1Text={popupMode === "edit" ? "Update" : "Add"}
          btn1Action={() => this.saveHandler(popupMode)}
          showBtn2={true}
          btn2Text={"Cancel"}
          btn2Action={() => this.showHideFormDialog("add")}
          handleClose={() => this.showHideFormDialog("add")}
          Form={<FormRender form={formData} onChange={this.InputChanger} />}
        />
        <div className="bread-crumb top-minus-20">
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Link 
            data-test="masterManagment"
            className={`auto-breadCrum-masterManagment`}
            color="inherit" onClick={() => this.handleRoute("/masters")}>
              {masterConstants.masterHeader}
            </Link>
            <Typography color="textPrimary">
              {MODULE?.displayModuleName}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="profile-head flex align-items-center justify-content-between">
          <div className="back-user-btn auto-back-btn">
            <span 
            data-test="masters"
            onClick={() => this.handleRoute("/masters")}>
              <AngleLeftArrow />
            </span>
            <span>{MODULE?.displayModuleName}</span>
          </div>

          <div className="master-form flex">
            <input
              className="auto-search"
              type="text"
              autoComplete="off"
              name="searchVal"
              onChange={this.handleSearch}
              placeholder={MODULE?.searchText}
              value={this.state.searchVal}
            />
            { isCheckValid &&
              <div
                className={`btn-add-master auto-${MODULE?.displayModuleName ? MODULE?.displayModuleName.split(" ").join(""): ""}`}
                onClick={() =>
                  isCustom
                    ? history.push(`${customPath}?mode=Create`, {
                      data: null,
                      moduleName: MODULE?.displayModuleName,
                      buttonText: MODULE?.buttonText,
                      apiKey: MODULE?.apiKey,
                      formData: formData
                    })
                    : this.showHideFormDialog("add")
                }
              >
                {(isCustom ? "Create " : "Add ") + MODULE?.buttonText}
              </div>
            }
          </div>
        </div>

        <div className="master-table-block">
          {filteredData && (
            <MasterTable
              HCell={thData}
              rowData={filteredRows}
              loadingRecords={masterLoading}
              statusKey={statusKey}
              rowKeys={rowKeys}
              countField={countField}
              statusChanger={(status, uuid) =>
                this.showHideStatus(status, uuid)
              }
              showEditPopup={this.showEditPopup}
              isCustom={isCustom}
              customHandler={this.handleCustomPath}
              isView={isView}
              isEdit={isEdit}
              isDelete={isDelete}
            />
          )}
          <div className="page-nav bor-top p-l-20 p-r-20 flex align-items-center justify-content-between">
            {filteredData.length > 0 && (
              <div className="page-dropdown flex align-items-center">
                <LimitDropDown
                  name="limit"
                  value={limit}
                  data={masterConstants.limit_arr}
                  onChange={(event) => {
                    let { name, value } = event.target;
                    this.setState({ [name]: Number(value), page: 1 }, () =>
                      this.handlePagination()
                    );
                  }}
                />
                <div className="page-info">{`Showing ${filteredRows.length > limit ? limit : filteredRows.length
                  }
                    of ${filteredData.length} records`}</div>
              </div>
            )}
            {filteredData.length > limit && (
              <PaginationComp
                count={Math.ceil(totalRecords / limit)}
                page={page}
                showFirstButton={true}
                showLastButton={true}
                onChange={this.handlePage}
              />
            )}
          </div>
        </div>
        <CommonModel
          className="popup-wrap status-popup"
          state={showStatusModel}
          showIcon={false}
          showTitle={true}
          title={`${selectedStatus == "1"
              ? `Deactivate ${MODULE?.modalTitle || MODULE?.buttonText}`
              : selectedStatus == "Delete"
                ? `Delete ${MODULE?.modalTitle || MODULE?.buttonText}`
                : `Activate ${MODULE?.modalTitle || MODULE?.buttonText}`
            }`}
          showDes={true}
          des={MODULE?.apiKey==='CountryGroup' ? (selectedStatus == "1" ? constantText.deactivateCountryGroup : (selectedStatus == "Delete" ? constantText.deleteCountryGroup : `Activate ${MODULE?.modalText || MODULE?.buttonText}`) ) :`Do you want to ${selectedStatus == "1"
              ? `Deactivate ${MODULE?.modalText || MODULE?.buttonText}`
              : selectedStatus == "Delete"
                ? `Delete ${MODULE?.modalText || MODULE?.buttonText}`
                : `Activate ${MODULE?.modalText || MODULE?.buttonText}`
            }?`}
          showBtn1={true}
          btn1Text={"Yes"}
          btn1Action={
            selectedStatus == "Delete"
              ? this.deleteHandler
              : this.activateDeactivateStatus
          }
          showBtn2={true}
          btn2Text={"No"}
          btn2Action={() => this.showHideStatus("")}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let { masterArr, masterLoading } = state.user_reducer;
  return {
    masterLoading,
    masterArr,
  };
};

const actionCreators = {
  fetchMaster: userActions.fetch_master_action,
  createMaster: userActions.create_master_action,
  updateMaster: userActions.update_master_action,
  patchMaster: userActions.patch_master_action,
  deleteMaster: userActions.delete_master_action,
};

export default connect(mapStateToProps, actionCreators)(ManageMaster);
