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

export default function CustomizedTables({ showHideDrawer, loadingRecords = false, HCell, rowData, rowKeys }) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            {HCell.map((item, index) => (
              <TableCell key={index} className={
             (
              item === "Axinom Status" ||
              item === "Middleware Status" ||
              item === "SQStracker Status") ? 'bg-color' : item === "OTT Status" ? 'bg-color border-l' : ''}>
                  {item}
              </TableCell>
            ))}
            <TableCell key={`view-head`} className={"table-view ing-view-btn border-r"}>
              {"View"}
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
                      {rowKeys.map((key, cellindex) => (
                        <TableCell
                          key={cellindex}
                          className={
                            key === "axinomStatus" ||
                            key === "sqsContentStatus" ||
                            key === "middlewareStatus"
                              ? "bg-color"
                              : key === "ottStatus"
                              ? "bg-color border-l"
                              : ""
                          }
                        >
                          { key === "axinomStatus" ||
                            key === "sqsContentStatus" ||
                            key === "middlewareStatus" ||
                            key === "ottStatus" ?
                            row[key] ? <pre>{row[key]}</pre> : "NA"
                            :
                            row[key] ? row[key] : "NA"
                          }
                        </TableCell>
                      ))}
                      <TableCell
                        key={`view-${index}`}
                        className={"bg-color border-r"}
                      >
                        <div
                          className="ref-link"
                          onClick={(e) => showHideDrawer(e, index)}
                        >
                          <IconButton>
                            <StatusView />
                          </IconButton>
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
