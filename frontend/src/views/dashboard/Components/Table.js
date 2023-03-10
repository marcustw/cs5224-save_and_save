import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@mui/styles';
import { createTheme } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';
import { AutoSizer, Column, Table, InfiniteLoader } from 'react-virtualized';

const styles = (theme) => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box'
  },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    '& .ReactVirtualized__Table__headerRow': {
      ...(theme.direction === 'rtl' && {
        paddingLeft: '0 !important'
      }),
      ...(theme.direction !== 'rtl' && {
        paddingRight: undefined
      })
    }
  },
  tableRow: {
    cursor: 'pointer'
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200]
    }
  },
  tableCell: {
    flex: 1
  },
  noClick: {
    cursor: 'initial'
  }
});

class MuiVirtualizedTable extends React.PureComponent {
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48
  };

  getRowClassName = ({ index }) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null
    });
  };

  cellRenderer = ({ cellData, columnIndex }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props;
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
      >
        {columns[columnIndex].prefix}
        {cellData}
      </TableCell>
    );
  };

  headerRenderer = ({ label, columnIndex }) => {
    const { headerHeight, columns, classes } = this.props;

    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? 'right' : 'left'}
      >
        <span>{label}</span>
      </TableCell>
    );
  };

  emptyOrLoadingWrapper = (children) => {
    return (
      <Box display="flex" justifyContent="center" m={4} height="100%" alignItems="center">
        {children}
      </Box>
    );
  };

  render() {
    const {
      classes,
      columns,
      rowHeight,
      headerHeight,
      fixedWidth,
      isRowLoaded,
      loadMoreRows,
      totalRowCounts,
      isFirstFetch,
      rowCount,
      ...tableProps
    } = this.props;

    if (isFirstFetch) {
      return this.emptyOrLoadingWrapper(<CircularProgress />);
    }

    if (rowCount < 1) {
      return this.emptyOrLoadingWrapper(<Typography variant="h3">No order found</Typography>);
    }

    return (
      <div style={{ height: 'calc(100% - 50px)' }}>
        <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={totalRowCounts}>
          {({ onRowsRendered, registerChild }) => (
            <AutoSizer>
              {({ height, width }) => (
                <Table
                  rowCount={rowCount}
                  height={height}
                  width={fixedWidth || width}
                  rowHeight={rowHeight}
                  gridStyle={{
                    direction: 'inherit'
                  }}
                  headerHeight={headerHeight}
                  className={classes.table}
                  onRowsRendered={onRowsRendered}
                  ref={registerChild}
                  {...tableProps}
                  rowClassName={this.getRowClassName}
                >
                  {columns.map(({ dataKey, ...other }, index) => {
                    return (
                      <Column
                        key={dataKey}
                        headerRenderer={(headerProps) =>
                          this.headerRenderer({
                            ...headerProps,
                            columnIndex: index
                          })
                        }
                        className={classes.flexContainer}
                        cellRenderer={this.cellRenderer}
                        dataKey={dataKey}
                        {...other}
                      />
                    );
                  })}
                </Table>
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
      </div>
    );
  }
}

MuiVirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      width: PropTypes.number.isRequired
    })
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowHeight: PropTypes.number,
  fixedWidth: PropTypes.number,
  totalRowCounts: PropTypes.number,
  loadMoreRows: PropTypes.func
};

const defaultTheme = createTheme();
const VirtualizedTable = withStyles(styles, { defaultTheme })(MuiVirtualizedTable);

export default function ReactVirtualizedTable({ isFirstFetch, columns, rows, onRowClick, totalRowCounts, loadMoreRows }) {
  const isRowLoaded = React.useCallback(
    ({ index }) => {
      return !!rows[index];
    },
    [rows]
  );
  return (
    <Paper style={{ height: '60vh', margin: '8px', maxWidth: 900 }}>
      <VirtualizedTable
        isFirstFetch={isFirstFetch}
        totalRowCounts={totalRowCounts}
        loadMoreRows={loadMoreRows}
        rowCount={rows.length}
        rowGetter={({ index }) => rows[index]}
        columns={columns}
        onRowClick={onRowClick}
        isRowLoaded={isRowLoaded}
      />
    </Paper>
  );
}

ReactVirtualizedTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      width: PropTypes.number.isRequired
    })
  ).isRequired,
  rows: PropTypes.array.isRequired,
  onRowClick: PropTypes.func.isRequired
};
