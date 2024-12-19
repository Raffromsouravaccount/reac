import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import MenuItem from "@material-ui/core/MenuItem";
import DropDown from "../../Common/DropDown/DropDown";
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';

//Helper files
import { permissionObj } from "../../../_helpers/permission";
import { constantText } from '../../../_helpers/constants.text';
import InlineLoader from '../../Common/InlineLoader/InlineLoader';
//Icons
import View from "images/eye.svg";
import Edit from "images/edit.svg";
import Delete from "images/delete.svg";

//Css
import './MasterTable.css';

const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
});

const { canView, canUpdate } = permissionObj?.masters;

const CustomDropdown = ({ statusChanger, status }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <DropDown open={open} buttonText={status == "1" ? "Active" : "Inactive"} handleClose={() => setOpen(!open)}
      handleOpenClose={() => canUpdate() ? setOpen(!open) : null} className={canUpdate() ? "" : "disabled"}>
      <MenuItem onClick={() => { setOpen(!open); statusChanger(); }}>{status == "1" ? "Inactive" : "Active"}</MenuItem>
    </DropDown>
  );
}

export default function CustomizedTables({ isCustom = false, loadingRecords, countField, HCell, showEditPopup, rowData, rowKeys, statusKey, isView, isEdit, isDelete, customHandler, statusChanger }) {
  const classes = useStyles();
  const joinName = (obj) => {
    if (obj?.first_name && obj?.last_name) {
      return `${obj?.first_name} ${obj?.last_name}`;
    }
    else {
      return '';
    }
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            {HCell.map((item, index) =>
              <TableCell className={(countField === item?.key) ? 'table-nu-count' : ''} key={index} >{item?.name}</TableCell>
            )}
            <TableCell className={"table-status"} key={"status"}>{"Status"}</TableCell>
            {(isDelete || isEdit) && <TableCell className={"table-action"} key={"action"}>{"Actions"}</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Loading  */}
          {rowData?.length === 0 && <TableRow>
            <TableCell colSpan={rowKeys?.length ? (rowKeys?.length + 2)  : 5} className={"p-l-20 p-r-20 p-t-20 p-b-20"} >{ loadingRecords ? <InlineLoader show={loadingRecords} />:constantText.no_record_found}</TableCell>
          </TableRow>}

          {rowData && rowData.map((row, index) => (
            <TableRow key={index}>
              {rowKeys.map((key, cellindex) => (
                <TableCell key={cellindex}>
                  {(countField === key) ? row[key]?.length : ((key === "created_by" || key === "modified_by") ? joinName(row[key]) : row[key])}
                </TableCell>
              ))}
              <TableCell >
                <div className={row[statusKey] == "1" ? "status-dropdown val" : "status-dropdown val inactive"}>
                  <CustomDropdown statusChanger={() => statusChanger(row[statusKey], row?.id)} status={row[statusKey]} />
                </div>
              </TableCell>
              {(isEdit || isDelete || isView) && <TableCell >
                <div className="actions-btn flex">
                  {(isView && isCustom) && <div className={`view tooltip-sec auto-view-${index}`} onClick={() => canView()? customHandler(row, 'View'): null} >
                    <IconButton className={canView() ? "" : "disabled"}>
                      <View />
                    </IconButton>
                    <div className="tooltip-box">{canView() ? constantText.tool_tip_view : constantText.tool_tip_noPermission} </div>
                  </div>
                  }

                  {isEdit &&
                    <div className={`edit tooltip-sec auto-edit-${index}`} onClick={() => canUpdate()? isCustom ? customHandler(row, 'Edit') : showEditPopup(row): null}>
                      <IconButton
                        disabled={!canUpdate()} className={canUpdate() ? "" : "disabled"}>
                        <Edit />
                      </IconButton>
                      <div className="tooltip-box">{canUpdate() ? constantText.tool_tip_edit : constantText.tool_tip_noPermission} </div>
                    </div>
                  }

                  {isDelete &&
                    <div className={`delete tooltip-sec auto-delete-${index}`} onClick={() => canUpdate()? statusChanger('Delete', row?.id): null}>
                      <IconButton
                        className={canUpdate() ? "" : "disabled"} disabled={!canUpdate()} >
                        <Delete />
                      </IconButton>
                      <div className="tooltip-box">{canUpdate() ? constantText.tool_tip_delete : constantText.tool_tip_noPermission} </div>
                    </div>
                  }
                </div>
              </TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
