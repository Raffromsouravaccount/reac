import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';

//Helper files
import { permissionObj } from "../../../_helpers/permission";

const RadioButton = ({ className, areaLabel, labelText, labelPlacement, name, value, data, onChange, id }) => (

  <div className="radio-box">
    <FormLabel>{labelText}</FormLabel>
    <RadioGroup aria-label={areaLabel} name={name} value={value} onChange={onChange} className={className} id={id}>
      {data?.map((obj, index) => {
        let { permissionKey, permissionSubKey, permissionName } = obj;
        let ifHavePermission = permissionKey ? permissionSubKey ?
          permissionObj?.[permissionKey]?.[permissionSubKey]?.[permissionName]() :
          permissionObj?.[permissionKey]?.[permissionName]() : true;
        return (
          <FormControlLabel key={index} value={obj.value} control={<Radio />} label={obj.label}
            labelPlacement={labelPlacement} disabled={!ifHavePermission} />
        )
      })}
    </RadioGroup>
  </div>
);

export default RadioButton
