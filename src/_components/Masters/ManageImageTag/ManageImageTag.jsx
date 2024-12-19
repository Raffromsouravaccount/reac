import React, { Component } from "react";
import { connect } from "react-redux";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import MenuItem from "@material-ui/core/MenuItem";
import DropDown from "../../Common/DropDown/DropDown";
import ButtonField from "../../Common/ButtonField/ButtonField";
import { masterConstants } from "../master.constant";
import { userActions } from "../../../_actions/user.action";
import { history } from "../../../_helpers/history";
import AngleLeftArrow from "images/angle-left-arrow.svg";
import { getLocalData } from "../../../_helpers/util";
import "./ManageGroup.css";

const CustomDropdown = ({ statusChanger, status }) => {
    const [open, setOpen] = React.useState(false);
    return (
        <DropDown open={open} buttonText={status} handleClose={() => setOpen(!open)} handleOpenClose={() => setOpen(!open)}>
            <MenuItem onClick={() => { setOpen(!open); statusChanger(status == "Active" ? "InActive" : "Active"); }}>{status == "Active" ? "Inactive" : "Active"}</MenuItem>
        </DropDown>
    );
}

class ManageImageTag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            countriesArr: [],
            availableSearch: "",
            assignedSearch: "",
            selectedCountries: [],
            GroupName: "",
            Description: "",
            error: false,
            mode: null,
            isDisabled: true,
        };
    }

    componentDidMount() {
        const paramsString = this.props.location.search;
        const params = new URLSearchParams(paramsString);
        const mode = params.get("mode");
        const { location } = this.props;
        if (location.state && ["Create", "View", "Edit"].some((e) => e === mode)) {
            const selected = mode === "Edit" ? location.state[mode]?.Country || [] : [];
            const groupName = mode === "Edit" ? location.state[mode]?.DisplayName || "" : "";
            const description = mode === "Edit" ? location.state[mode]?.Description || "" : "";
            this.setState({
                mode: mode,
                data: location.state[mode],
                selectedCountries: selected,
                Description: description,
                GroupName: groupName,
                isDisabled: mode !== "Edit",
            });
        } else {
            history.push("/manage-masters?module=Genre");
        }
        this.props.fetchCountries();
    }

    componentWillReceiveProps = (nextProps) => {
        let { countriesArr } = nextProps;
        const { mode, data } = this.state;
        if (mode === "View") {
            this.setState({
                countriesArr: data?.Country || [],
            });
        } else {
            this.setState({
                countriesArr: countriesArr || [],
            });
        }
    };

    handleChange = (event) => {
        let { name, value } = event.target;
        this.setState({
            [name]: value,
        });
    };
    handleCreateEditGroup = async () => {
        const { createMaster, updateMaster } = this.props;
        const apiKey = "GroupName";
        const redirectPath = "manage-masters?module=Genre";
        const postObj = {};
        postObj.data = [];
        const postData = {};
        const { selectedCountries, GroupName, Description, mode, data } = this.state;
        const { userID } = getLocalData('userData');
        if (selectedCountries.length !== 0 && GroupName !== '') {
            postData.DisplayName = GroupName;
            postData.Description = Description;
            postData.Country = selectedCountries;
            if (mode === "Create") {
                postData.CreatedBy = userID;
                postData.ModifyBy = userID;
                postData.CurrentStatus = "Active";
                postObj.data.push(postData);
                createMaster(apiKey, postObj, redirectPath);
            }
            else {
                postObj.type = apiKey;
                postData.ModifyBy = userID;
                postData.CurrentStatus = data.CurrentStatus;
                postObj.data.push(postData);
                const res = await updateMaster(
                    data.uuid,
                    postObj,
                    redirectPath
                );
            }
        }

    };
    handleRoute = (route) => {
        history.push(route);
    };
    handleRowSelectAll = (event) => {
        const { countriesArr, mode } = this.state;
        if (event.target.checked) {
            this.setState({ selectedCountries: countriesArr });
        } else {
            this.setState({ selectedCountries: [] });
        }
    };
    handleRowSelect = (row) => {
        const selectedCopy = [...this.state.selectedCountries];
        const isExist = selectedCopy.some((e) => e.DisplayName === row.DisplayName);
        if (isExist) {
            const rowIndex = selectedCopy.findIndex(
                (e) => e.DisplayName === row.DisplayName
            );
            selectedCopy.splice(rowIndex, 1);
        } else {
            selectedCopy.push(row);
        }
        this.setState({ selectedCountries: selectedCopy });
    };
    handleEditStatus = (status) => {
        const copyData = { ...this.state.data };
        copyData.CurrentStatus = status;
        this.setState({ data: copyData });
    }
    handleRemoveAssigned = (DisplayName) => {
        const copySelected = [...this.state.selectedCountries];
        const findIndex = copySelected.findIndex(e => e.DisplayName === DisplayName);
        copySelected.splice(findIndex, 1);
        this.setState({ selectedCountries: copySelected });
    }
    render() {
        let {
            mode,
            data,
        } = this.state;

        return (
            <div>
                <div className="countrygroup d-wrap c-n">
                    <div className="bread-crumb top-minus-20">
                        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                            <Link
                                color="inherit"
                                onClick={() => this.handleRoute("/masters")}
                            >
                                {masterConstants.masterHeader}
                            </Link>
                            <Link
                                color="inherit"
                                onClick={() =>
                                    this.handleRoute("/manage-masters?module=Genre")
                                }
                            >
                                {masterConstants.imageTagging}
                            </Link>
                            <Typography color="textPrimary">{`${mode} Group`}</Typography>
                        </Breadcrumbs>
                    </div>
                    <div className="profile-head flex align-items-center justify-content-between">
                        <div className="back-user-btn auto-back-btn">
                            <span
                                onClick={() =>
                                    this.handleRoute("/manage-masters?module=Genre")
                                }
                            >
                                <AngleLeftArrow />
                            </span>
                            <strong>
                                <span>{`${mode} Group`}</span>
                            </strong>
                        </div>
                    </div>

                    <div className="create-u-form">
                        <div className="create-u-head flex align-items-center justify-content-between">
                            <div className="l-title">{"Group Details"}</div>
                            {mode === "Edit" && <div className="l-title flex justify-content-between">
                                {"Change Status"}
                                <div className={data?.CurrentStatus == "InActive" ? "ml-10 status-dropdown val inactive" : "ml-10 status-dropdown val"}>
                                    <CustomDropdown status={data?.CurrentStatus} statusChanger={this.handleEditStatus} />
                                </div>
                            </div>}

                        </div>
                        <div className="countrybox">
                            <div className="row input-space-35">
                                <div className="col-md-6 col-lg-4">
                                </div>
                            </div>
                            <div className="pt-20 row">
                                <div className="col-md-6 col-lg-4 form-save-btn">
                                    <ButtonField
                                        className="zee-btn-field zee-full"
                                        variant="contained"
                                        color="primary"
                                        // disabled={
                                        //   GroupName === "" || selectedCountries.length === 0
                                        // }
                                        onClick={this.handleCreateEditGroup}
                                        buttonText={"Save"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    let { countriesArr } = state.user_reducer;
    return {
        countriesArr,
    };
};

const actionCreators = {
    fetchCountries: userActions.fetch_countries_action,
    createMaster: userActions.create_master_action,
    updateMaster: userActions.update_master_action,
};

export default connect(mapStateToProps, actionCreators)(ManageImageTag);
