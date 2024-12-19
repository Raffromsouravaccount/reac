import { MenuItem } from '@material-ui/core';
import React from 'react';
import { useState } from 'react';
import { constantText } from '../../../_helpers/constants.text';
import { getLocalData } from '../../../_helpers/util';

import DropDown from '../DropDown/DropDown';


export const LeftTabListing = ({
    welcomeMsg,
    selectedTab = 0,
    options = [],
    onChange,
    openDropDown,
    handleOpenClose,
    handleClose,
    disableTabs = false,
    dropdownOptions = [],
    handleDropDownItem }) => {

    const { RoleName } = getLocalData("userData") || {};
    const [selected, setSeletedTab] = useState(selectedTab),
        changeTab = (option, index) => { setSeletedTab(index); onChange(option, index) };

    if(selected != selectedTab) {
        setSeletedTab(selectedTab);
    }

    return (
        <div className="whitebox left-tab">
            <div className="tab-header flex">
                <div className="left-text">
                    <strong>{welcomeMsg || constantText.welcome_txt}</strong>
                    <span>{RoleName}</span>
                </div>
                <div className="image">
                    <img src="images/welcome-back-admin.svg" alt="welcome back" />
                </div>
            </div>
            {  dropdownOptions.length > 0 &&
                <div className="filling-dropdown">
                    <DropDown
                        className="dropdown-btn dropdown-bg"
                        buttonText={"Quick Filing"}
                        open={openDropDown}
                        handleOpenClose={handleOpenClose}
                        handleClose={handleClose}
                    >
                        {dropdownOptions.map((option, index) => (
                            <MenuItem id="handleDropDownBtn" disabled={option.disabled} key={index} onClick={(e) => handleDropDownItem(option, index)}>
                                {option?.displayName}
                                <span className="leftTab-align"> {option?.count ? option?.count : ""}</span>
                            </MenuItem>
                        ))
                        }
                    </DropDown>
                </div>
            }
            <div className="l-tab-list scrollBar scroll-X">
                <ul className={disableTabs ? 'loading' : ''}>
                    {options.map((option, index) => (
                        <li key={index}
                            className={selected == index ? `auto-leftTab-${option?.displayName ? option?.displayName.split(" ").join(""): ""} active` : `auto-leftTab-${option?.displayName ? option?.displayName.split(" ").join(""): ""}`}
                            onClick={(ev) => selected != index ? (disableTabs ? null : changeTab(option, index)) : ''}>
                            <strong>{option?.displayName}</strong>
                            <span>{option?.count}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}