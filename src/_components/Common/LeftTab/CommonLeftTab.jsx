import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

//Helper files
import { permissionObj } from "../../../_helpers/permission";

const LeftTab = ({ className, orientation, variant, options, selectedTab, showIcon,
  Icon1, Icon2, Icon3, handleChange, defaultPermission = false }) => (

    <Tabs className={className} orientation={orientation} variant={variant} value={selectedTab} onChange={handleChange}>
      {options.map((option, index) => {

        let { permissionKey, permissionSubKey, permissionName } = option;
        let ifHavePermission = defaultPermission ? defaultPermission : (permissionKey ? permissionSubKey ?
          permissionObj?.[permissionKey]?.[permissionSubKey]?.[permissionName]() :
          permissionObj?.[permissionKey]?.[permissionName]() : true);
        return (
          <Tab key={index} className={(option?.isDone) ?
            `completed  auto-leftTab-${option?.label ? option?.label.split(" ").join("") : ""}` :
            `auto-leftTab-${option?.label ? option?.label.split(" ").join("") : ""}`} disabled={!ifHavePermission}
            label={option.label} icon={showIcon ? (option.isDone) ?
              <Icon2 /> : ((selectedTab == index) ? <Icon1 /> : <Icon3 />) : null} />
        )
      })}
    </Tabs>
  );
export default LeftTab;