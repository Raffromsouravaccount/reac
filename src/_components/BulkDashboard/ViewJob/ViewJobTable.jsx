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
import { constantText } from '../../../_helpers/constants.text';
import InlineLoader from '../../Common/InlineLoader/InlineLoader';
//icon
import StatusView from "images/eye.svg";

const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
});

export default function CustomizedTables({ loadingRecords = false, filteredCount, HCell, rowData, rowKeys }) {
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
                       <TableRow key={index}>
                        {rowKeys.map((key, cellindex) => (
                        <TableCell className={key === "status" ? row[key] === "Success" ? `green-col` : row[key] === "Failed" ? `darkred-col` : `orange-col` : ''} key={cellindex}>
                            {row[key] ? row[key] : "NA"}
                          </TableCell>
                        ))}                 
                      </TableRow>
                      );
                      })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
