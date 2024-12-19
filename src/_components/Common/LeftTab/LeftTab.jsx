import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

const LeftTab = ({
  className,
  name,
  options,
  formFilled,
  selectedTab,
  handleChange,
}) => (
  <Tabs
    className={className}
    orientation="vertical"
    variant="scrollable"
    value={selectedTab}
    onChange={(event, newValue) => handleChange(event, newValue)}
  >
    {options.map((option, index) => (
      <Tab
        key={index}
        className={option.status === true ? "completed" : ""}
        label={option.label}
        icon={
          option.status ? (
            <CheckCircleIcon />
          ) : selectedTab === 0 ? (
            <RadioButtonCheckedIcon />
          ) : (
            <RadioButtonUncheckedIcon />
          )
        }
      />
    ))}
  </Tabs>
);
export default LeftTab;
