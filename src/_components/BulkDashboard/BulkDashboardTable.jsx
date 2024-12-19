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
import { history } from "../../_helpers/history";
import { constantText } from '../../_helpers/constants.text';
import InlineLoader from '../Common/InlineLoader/InlineLoader';
//icon
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

export default function CustomizedTables({ loadingRecords = false,downloadJSON, HCell, rowData, rowKeys }) {
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
              {"Action"}
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
                  return (
                    <TableRow
                      className={row["isRefreshing"] ? "ingestion-loading" : ""}
                      key={index}
                    >
                      {rowKeys.map((key, cellindex) => {
                        return (
                          <TableCell
                            className={
                              key === "jobState"
                                ? row[key] === "Success"
                                  ? `green-col list-capitalize`
                                  : row[key] === "Failed"
                                  ? `darkred-col list-capitalize`
                                  : row[key] === "Pending"
                                  ? `orange-col list-capitalize`
                                  : "blue-col list-capitalize"
                                : "list-capitalize"
                            }
                            key={cellindex}
                          >
                            {row[key] ? row[key] : "NA"}
                          </TableCell>
                        );
                      })}
                      <TableCell key={`action-${index}`}>
                        <div className="actions-btn flex align-items-center">
                          <div
                            className="ref-link"
                            onClick={() =>
                              history.push(
                                `/bulkupdate/dashboard/${row["jobId"]}`
                              )
                            }
                          >
                            <IconButton>
                              <StatusView />
                            </IconButton>
                          </div>
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
