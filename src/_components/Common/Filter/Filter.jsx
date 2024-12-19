import React, { Component } from "react";
import { Divider, Drawer } from "@material-ui/core";
import moment from "moment";

//Helper files
import config from "../../../Config/config";
import FormRender from "../FormHelper/FormRender";
import DatePicker from "../DatePicker/DatePicker";
import ButtonField from "../ButtonField/ButtonField";
import { getSelectedGroup } from "../../../_helpers/util";
import { constantText } from "../../../_helpers/constants.text";
import checkValidity from "../FormHelper/FieldValidator";
//service
import { apiCalls } from "../../../_services/common.service";
//Icon
import CloseSquareIcon from "images/close-square-icon.svg";


const formValidityCheck = (jsonform) => {
    let formIsValid = true;
    let elementValid = true;
    let form = jsonform;
    form.forEach((element) => {
        if (element?.display !== false) {
            let { isValid } = checkValidity(element.value, element.validation);
            elementValid = isValid;
            formIsValid = elementValid && formIsValid;
        }
    });
    return { formValidity: formIsValid };
};

class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filters: {
                formValidity: false,
                filterByStatus: [],
                filterByDate: [],
                selectFilters: []
            },
            contentState: ""
        };
    }

    componentDidMount = () => {
        const { filters } = this.state;
        let shallowFilters = JSON.parse(JSON.stringify(filters));
        // shallowFilters.formValidity = JSON.parse(JSON.stringify(this.props.formValidity));
        shallowFilters.filterByStatus = JSON.parse(JSON.stringify(this.props.filterByStatus || []));
        shallowFilters.filterByDate = JSON.parse(JSON.stringify(this.props.filterByDate || []));
        shallowFilters.selectFilters = JSON.parse(JSON.stringify(this.props.selectFilters || []));
        let contentState = ""
        if (shallowFilters.filterByStatus && shallowFilters.filterByStatus.length) {
            const seletedStatus = shallowFilters.filterByStatus.findIndex(item => item.active);
            contentState = shallowFilters.filterByStatus[seletedStatus].label;
        }
        shallowFilters.formValidity = this.verifyFormValidity(shallowFilters);
        this.setState({ filters: shallowFilters, contentState })
    }

    verifyFormValidity = (filters) => {
        const { filterByStatus, filterByDate, selectFilters } = filters;
        let valid = false;
        if (filterByDate && filterByDate.length && !valid) {
            valid = filterByDate.find(item => item.date.startDate && item.date.endDate);
        }
        if (selectFilters && selectFilters.length && !valid) {
            valid = selectFilters.find(item => item.value && item.value.length);
        }
        if (filterByStatus && filterByStatus.length) {
            valid = filterByStatus.find(item => item.active);
        }
        return !!valid;
    }

    handleFilterStatusSelection = (event, selectedTab) => {
        let { filters } = this.state;
        let shallowFilters = JSON.parse(JSON.stringify(filters));
        shallowFilters.filterByStatus.forEach((item, index) => {
            item['active'] = index == selectedTab ? true : false;
        })
        const contentState = shallowFilters.filterByStatus[selectedTab]?.label;

        shallowFilters.formValidity = this.verifyFormValidity(shallowFilters);
        this.setState({ filters: shallowFilters, contentState });
    }

    handleDateChange = (type, dateItem, index, event) => {
        let { value } = event?.target;
        const { filters } = this.state;
        const { filterByDate } = filters;
        filterByDate.map((fDItem, i) => {
            if (index !== i) {
                fDItem.date.startDate = "";
                fDItem.date.endDate = "";
            }
        });
        let startDate = filterByDate[index].date.startDate;
        let endDate = filterByDate[index].date.endDate;
        //Date Validation
        if (type === "startDate") {
            if (endDate) {
                if (moment(value).isSameOrBefore(endDate) || value === "") {
                filterByDate[index].date.startDate = value;
                }
            } else {
                filterByDate[index].date.startDate = value;
            }
            startDate = value;
        } else {
            if (startDate) {
                if (moment(value).isSameOrAfter(startDate) || value === "") {
                filterByDate[index].date.endDate = value;
                }
            } else {
                filterByDate[index].date.endDate = value;
            }
            endDate = value;
        }
        //Date Validation end
        const checkDate = filterByDate.find(
            (item) => item.date.startDate && item.date.endDate
        );
        this.setState({
            filters: {
                ...filters,
                formValidity: this.verifyFormValidity(filters)
                ? startDate === "" && endDate === ""
                  ? this.verifyFormValidity(filters)
                  : checkDate && this.verifyFormValidity(filters)
                : checkDate,
                filterByDate: filterByDate,
            },
        });
    };

    selectFiltersChange = (event, elemIndex) => {
        let { filters } = this.state;
        let { selectFilters } = filters;
        const copyJSON = [...this.state.filters.selectFilters];
        const updatedElement = copyJSON[elemIndex];
        updatedElement.value = event?.target?.value;

        const showStatusField = (selectFiltersArr, flag) => {
            selectFilters = selectFiltersArr.map((item) => {
                if (item.name === "status" || item.name === "translationStatus") {
                    if (flag) {
                        item.display = flag;
                        item.data = constantText.translationStatus;
                    } else {
                        item.display = flag;
                        item.value = [];
                    }
                }
            });
        };

        if (
            updatedElement.name === "translationLanguage" &&
            updatedElement.value.length
        ) {
            showStatusField(selectFilters, true);
        }
        if (
            updatedElement.name === "translationLanguage" &&
            updatedElement.value.length === 0
        ) {
            showStatusField(selectFilters, false);
        }

        const { isValid, errorText } = checkValidity(
            updatedElement.value,
            updatedElement.validation
        );
        updatedElement.valid = isValid;
        updatedElement.errorText = errorText;
        updatedElement.touched = 1;

        const { formValidity } = formValidityCheck(copyJSON);
        this.setState({
            filters: {
                ...filters,
                formValidity: !formValidity ? formValidity : this.verifyFormValidity(filters),
                selectFilters: copyJSON,
            },
        });
    };

    setSelectDataArr = (res, index) => {
        const { filters } = this.state;
        const copyFilters = { ...filters };
        const copySelect = [...copyFilters?.selectFilters];
        copySelect[index].data = res;
        copyFilters.formValidity = this.verifyFormValidity(copyFilters);
        if (copySelect[index]?.name === "licenseGroupCountries" && copySelect[index]?.groupBy?.length) {
            const GroupName = [];
            res.forEach((group) => {
                group?.countries.forEach((item) => {
                    const obj = { ...item };
                    obj.group = group?.title;
                    GroupName.push(obj);
                });
            });
            copySelect[index].data = GroupName;
        }
        else {
            copySelect[index].data = res;
        }
        this.setState({ filters: copyFilters });
    };

    onClose = () => {

    }

    applyFilter = () => {
        this?.props?.applyFilter(this.state.filters);
    }

    clearFilter = () => {
        const { filters } = this.state;
        const { selectFilters, filterByStatus, filterByDate } = filters;
        if (selectFilters && selectFilters.length) {
            selectFilters.map((filter) => {
                filter.value = filter && filter.path ? (filter.multiple ? [] : null) : "";
            });
        }
        if (filterByStatus && filterByStatus.length) {
            filterByStatus.forEach(item => item.active = false);
            filterByStatus[0].active = true;
        }
        if (filterByDate && filterByDate.length) {
            filterByDate.forEach(item => {
                item.date.startDate = "";
                item.date.endDate = ""
            });
        }
        this.setState({
            filters: {
                ...filters,
                selectFilters: selectFilters,
                filterByStatus: filterByStatus
            }
        });
        this?.props?.clearFilter(filters);
    };


    selectCountryGroup = (event, group) => {
        const { filters } = this.state;
        const { filterByDate, selectFilters } = filters;
        const copyFilters = { ...filters };
        const copySelect = [...copyFilters?.selectFilters];
        const findIndex = copySelect.findIndex(e => (e.name === "licenseGroupCountries" && e.groupBy?.length));
        const copyElement = copySelect[findIndex];
        const options = [...copyElement.data];
        copyElement.value = getSelectedGroup(event, group, options, copyElement.value);

        const { formValidity } = formValidityCheck([...selectFilters]);
        const checkDate = filterByDate.find(
            (item) => item.date.startDate && item.date.endDate
        );
        this.setState({
            filters: {
                ...copyFilters,
                formValidity: checkDate ? checkDate : formValidity,
            }
        });
    };

    handleSearchableInput = async (value, index) => {
        let { filters } = this.state;
        let {selectFilters}= filters;
        let url = "";
        if (selectFilters[index].name == "tags") {
            url = config.masterTags + '?title=';
        } else if (selectFilters[index].name == "actor") {
            url = config.castnamesUrl + '?castName=';
        } else {
            return;
        }
        let response = await apiCalls(`${url}${value}`, "GET", {}, null, false) || [];
        selectFilters[index]["data"] = response
        this.setState(prevState => ({
          filters: {
            ...filters,
            selectFilters
          }
        }));
    }

    render() {
        let { filters, contentState } = this.state;
        let { formValidity, filterByStatus, filterByDate, selectFilters } = filters;

        let allStatusFilters = null;
        if (filterByStatus && filterByStatus.length) {
            allStatusFilters = filterByStatus.map((status, index) => (
                <div className="bystatus-col" key={"status_" + index}>
                    <div className={`bystatus-f-cta flex align-items-center justify-content-center${status.active ? ' s-active' : ''}`}
                        onClick={(e) => this.handleFilterStatusSelection(e, index)}>{status.displayName}
                    </div>
                </div>
            ))
        }
        let allDateFilters = null;
        if (filterByDate && filterByDate.length) {
            allDateFilters = filterByDate.map((filterDate, i) => {
                if (contentState === filterDate.for) {
                    filterDate.display = true;
                } else {
                    filterDate.display = false;
                }
                let minDateValue, maxDateValue;
                if (this.props?.meta?.name !== 'collections') {
                    minDateValue = filterDate.date.endDate ? moment(filterDate.date.endDate).subtract(constantText.filterDateRangeMonthCount, 'months') : undefined;
                    maxDateValue = filterDate.date.startDate ? moment(filterDate.date.startDate).add(constantText.filterDateRangeMonthCount, 'months') : undefined;
                }
                return filterDate.display ? (
                    <div key={i} className="dateFilterBox">
                        <h5 className="sidebar-s-title">{filterDate?.label || ""}</h5>
                        <div className="row">
                            <div className="col-sm-6">
                                <DatePicker
                                    type="date"
                                    placeholder={filterDate.date.startPlaceholder}
                                    value={filterDate.date.startDate}
                                    minDateValue={minDateValue}
                                    onChange={(e) =>
                                        this.handleDateChange("startDate", filterDate, i, e)
                                    }
                                    className="zee-input-field auto-startDate filter-drower-custom"
                                />
                            </div>
                            <div className="col-sm-6">
                                <DatePicker
                                    type="date"
                                    placeholder={filterDate.date.endPlaceholder}
                                    value={filterDate.date.endDate}
                                    maxDateValue={maxDateValue}
                                    onChange={(e) =>
                                        this.handleDateChange("endDate", filterDate, i, e)
                                    }
                                    className="zee-input-field auto-endDate filter-drower-custom"
                                />
                            </div>
                        </div>
                        <div className="date-info-msg">{constantText?.max_3_months_date}</div>
                    </div>
                ) : (
                        ""
                    );
            });
        }
        return (
            <div className="sidebarBox">
                <Drawer open={true} anchor="right" onClose={this.onClose} >
                    <div className="sidebarBox">
                        <div className="top-w flex align-items-center justify-content-between">
                            <div className="title">{constantText.filters_header_text}</div>
                            <div className="side-close-btn auto-close-btn" onClick={this.props.closeFilter}>
                                <CloseSquareIcon />
                            </div>
                        </div>
                        <Divider />
                        <div className="middle-w">
                            <div className="inner">
                                <div className="f-filter">
                                    {allStatusFilters &&
                                        <span>
                                            <h5 className="sidebar-s-title">Select Status</h5>
                                            <div className="bystatus-filter flex">
                                                {allStatusFilters}
                                            </div>
                                        </span>
                                    }

                                    <div className="bydate-filter">
                                        {allDateFilters}
                                    </div>
                                    <Divider className="date-divider" />

                                    <FormRender
                                        form={selectFilters}
                                        handleFocus={this.setmultyData}
                                        setSelectDataArr={this.setSelectDataArr}
                                        selectGroup={this.selectCountryGroup}
                                        handleAutoCreateInput={this.handleSearchableInput}
                                        onChange={this.selectFiltersChange}
                                        handleAutoCreateInput={this.handleSearchableInput}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="bottom-w filter-btn">
                            <ButtonField
                                color="secondary"
                                className="apply-btn"
                                disabled={!formValidity}
                                buttonText={constantText.apply_filter_text}
                                onClick={() => this.applyFilter()}
                            />
                            <ButtonField
                                color="secondary"
                                className="cancle-btn"
                                buttonText={constantText.clear_text}
                                onClick={this.clearFilter}
                            />
                        </div>
                    </div>
                </Drawer>
            </div>
        );
    }
}
export default Filter;
