import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
//icon
import CloseIcon from "images/close-icon.svg";

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

const headCells = [
  { id: "code", label: "Country Code" },
  { id: "title", label: "Country Name" },
];

function EnhancedTableHead(props) {
  const {
    classes,
    selectMode,
    actionRemove,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {selectMode && (
          <TableCell padding="checkbox" className="auto-all-checkBox">
            <Checkbox
              className="zee-checkbox-field"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              disabled={rowCount === 0}
              inputProps={{ "aria-label": "select all desserts" }}
            />
          </TableCell>
        )}
        {headCells.map((headCell) => (
          <TableCell
            className={`auto-header-${headCell?.label ? headCell?.label.split(" ").join("") : ""}`}
            key={headCell.id}
            align={"left"}
            padding={"default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        {actionRemove && (
          <TableCell className={"table-g-coun-action"} align={"left"} padding={"default"}>
            Action
          </TableCell>
        )}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = (theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    boxShadow: "none",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: "auto",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
});

class GroupTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: "asc",
      orderBy: "Code",
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.order !== this.state.order ||
      nextState.orderBy !== this.state.orderBy ||
      nextProps.selectMode !== this.props.selectMode ||
      nextProps.rows.length !== this.props.rows.length ||
      nextProps.selectedArr.length !== this.props.selectedArr.length
    );
  }
  render() {
    const {
      rows,
      classes,
      selectMode,
      actionRemove = false,
      removeHandler = () => {},
      selectedArr = [],
      handleSelect,
      handleSelectAll = () => {},
    } = this.props;
    const { order, orderBy } = this.state;

    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === "asc";
      this.setState({ order: isAsc ? "desc" : "asc", orderBy: property });
    };

    const isSelected = (name) => {
      const val = selectedArr.some((e) => e.title === name);
      return val;
    };
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <TableContainer>
            <div className="country-table-list scrollBar scroll-Y">
              <Table
                stickyHeader
                className={classes.table}
                aria-labelledby="tableTitle"
                size={"medium"}
                aria-label="enhanced table"
                style={{ tableLayout: "fixed" }}
              >
                <EnhancedTableHead
                  classes={classes}
                  numSelected={selectedArr.length}
                  order={order}
                  orderBy={orderBy}
                  selectMode={selectMode}
                  actionRemove={actionRemove}
                  onSelectAllClick={handleSelectAll}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={selectMode ? "3" : "2"}>
                        {"No Results"}
                      </TableCell>
                    </TableRow>
                  )}
                  {stableSort(rows, getComparator(order, orderBy)).map(
                    (row, index) => {
                      const isItemSelected = isSelected(row.title);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <TableRow
                          hover
                          onClick={(e) =>
                            selectMode ? handleSelect(row) : null
                          }
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={index}
                          selected={isItemSelected}
                        >
                          {selectMode && (
                            <TableCell padding="checkbox">
                              <Checkbox
                                className={`zee-checkbox-field auto-select-${index}`}
                                checked={isItemSelected}
                                inputProps={{ "aria-labelledby": labelId }}
                              />
                            </TableCell>
                          )}
                          <TableCell className={`auto-${index}`} id={labelId}>{row?.code}</TableCell>
                          <TableCell>{row?.title}</TableCell>
                          {actionRemove && (
                            <TableCell>
                              <div
                                className={`delete-con-btn flex align-items-center auto-delete-${index}`}
                                onClick={() => removeHandler(row?.title)}
                              >
                                <CloseIcon /> Remove
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </div>
          </TableContainer>
        </Paper>
      </div>
    );
  }
}
export default withStyles(useStyles)(GroupTable);
