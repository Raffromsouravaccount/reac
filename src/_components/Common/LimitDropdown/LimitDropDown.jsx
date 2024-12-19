import React from 'react';
import NativeSelect from '@material-ui/core/NativeSelect';

const LimitDropDown = ({ className, name, data, value, disabled, onChange }) => (
    <NativeSelect className={className || ""} name={name} value={value} onChange={onChange} disabled={disabled}>
        {data.map((option, index) => (
            <option key={index} value={option}>{option}</option>
        ))}
    </NativeSelect>
);

export default LimitDropDown;
