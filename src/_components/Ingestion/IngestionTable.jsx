import React, { Fragment } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

//Helper files
import { constantText } from '../../_helpers/constants.text';
import InlineLoader from '../Common/InlineLoader/InlineLoader';
//icon
import StatusWarning from "images/status_warning.svg";
import StatusFailed from "images/status_failed.svg";
import StatusView from "images/eye.svg";

const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
});
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function CustomizedTables({ loadingRecords = false, refreshHandler,downloadJSON, handleWarningIcon, handleStatus, HCell, rowData, rowKeys }) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            {HCell.map((item, index) => (
              <TableCell key={index}>
                  {item}
              </TableCell>
            ))}
            <TableCell key={`action-head`} className={"table-action"}>
              {"Content Status"}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Loading  */}
          {rowData?.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={rowKeys?.length ? rowKeys?.length : 5}
                className={"p-l-20 p-r-20 p-t-20 p-b-20"}
              >
                {loadingRecords ? (
                  <InlineLoader show={loadingRecords} />
                ) : (
                  constantText.no_record_found
                )}
              </TableCell>
            </TableRow>
          )}
          {rowData?.map(
              (row, index) => {
                const { warnings } = { warnings: null }; //row;
                let warningData;
                let warnMode = null;
                if(warnings){
                  if(warnings?.metaResponse?.errorMessage){
                    warningData = warnings?.metaResponse?.errorMessage;
                    warnMode = 'Error';
                  }
                  else if(warnings?.getResponse_3?.warnings?.length){
                    warningData = warnings?.getResponse_3?.warnings;
                    warnMode = 'Warning';
                  }
                  else if(warnings?.getResponse_2?.warnings?.length){
                    warningData = warnings?.getResponse_2?.warnings;
                    warnMode = 'Warning';
                  }
                  else if(warnings?.getResponse_1?.warnings?.length){
                    warningData = warnings?.getResponse_1?.warnings;
                    warnMode = 'Warning';
                  }
                }

                  return (
                       <TableRow className={row["isRefreshing"] ? 'ingestion-loading' : ''} key={index}>
                        {rowKeys.map((key, cellindex) => (
                          key==='ingestionJsonUpload' ? <TableCell key={`download-${index}`}>
                             {row[key] ? row[key] : "NA"}
                          <div className="actions-btn flex align-items-center">
                          <Fragment>
                              <div className="ref-link" onClick={() => downloadJSON(row.externalId)} >
                                 {"Download"}
                              </div>
                              </Fragment>
                            </div>
                      </TableCell> :<TableCell key={cellindex}>
                            {row[key] ? row[key] : "NA"}
                          </TableCell>
                        ))}
                      <TableCell key={`action-${index}`}>
                        <div className="actions-btn flex align-items-center">

                          {row["isRefreshing"] ? (
                            <InlineLoader show={row["isRefreshing"] || false} />
                          ) : (
                          <Fragment>
                            {/* <div className="ref-link" onClick={() => refreshHandler(row)} >
                               {"Refresh"} */}
                            <div className="ref-link" onClick={() => row?.sqsContentStatus?.length ? handleStatus(row) : null} >
                              <IconButton className={row?.sqsContentStatus?.length ? "" : "disabled"}>
                                <StatusView />
                              </IconButton>
                            </div>
                            {(warnings && 
                             (warnings?.metaResponse?.errorMessage || 
                             (warnings?.getResponse_3?.warnings?.length || warnings?.getResponse_2?.warnings?.length || warnings?.getResponse_1?.warnings?.length))) 
                             ? <div 
                              onClick={() => handleWarningIcon(warnMode, warningData)}
                              className="st-icon"
                            >
                              {warnings?.metaResponse?.errorMessage ? <StatusFailed /> : <StatusWarning />}
                            </div> : null}
                          </Fragment>
                          )}
                        </div>
                      </TableCell>                  
                      </TableRow>
                      );
                      })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
