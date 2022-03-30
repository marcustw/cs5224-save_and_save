import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Box, CircularProgress } from '@mui/material';
import { InfiniteLoader, List, AutoSizer } from 'react-virtualized';
import ProductCard from './productCard';

export const InfiniteProductLoader = ({
  list,
  listMap,
  loadMoreRows,
  totalRowCounts,
  onBuyerActionClick,
  onSellerActionClick,
  offset = 40,
  isFirstFetch = true
}) => {
  const listRef = React.useRef(list);
  listRef.current = list;
  const { isRowLoaded, rowRenderer } = React.useMemo(
    () => ({
      isRowLoaded: ({ index }) => {
        return !!listRef.current[index];
      },
      rowRenderer: ({ key, index, style }) => {
        return (
          <div key={key} style={style}>
            <ProductCard
              itemData={listMap[listRef.current[index]]}
              onSellerActionClick={onSellerActionClick}
              onBuyerActionClick={onBuyerActionClick}
            />
          </div>
        );
      }
    }),
    [onSellerActionClick, onBuyerActionClick, listMap]
  );

  const emptyOrLoadingWrapper = (children) => {
    return (
      <Box display="flex" justifyContent="center" m={4}>
        {children}
      </Box>
    );
  };

  if (isFirstFetch) {
    return emptyOrLoadingWrapper(<CircularProgress />);
  }

  if (list.length === 0) {
    return emptyOrLoadingWrapper(<Typography variant="h3">No product found</Typography>);
  }

  return (
    <div style={{ height: 'calc(100% - 50px)' }}>
      <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={totalRowCounts}>
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height - offset}
                onRowsRendered={onRowsRendered}
                ref={registerChild}
                rowCount={totalRowCounts}
                rowHeight={180}
                rowRenderer={rowRenderer}
                width={width}
              />
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    </div>
  );
};

InfiniteProductLoader.propTypes = {
  list: PropTypes.arrayOf(PropTypes.number),
  // { current: { [itemid]: itemData } }
  /**
   * Item Data refer to mapItemResponseToUIData
   */
  listMap: PropTypes.any.isRequired,
  // ({ startIndex, stopIndex }) => Promise
  loadMoreRows: PropTypes.func,
  totalRowCounts: PropTypes.number,
  onSellerActionClick: PropTypes.func,
  onBuyerActionClick: PropTypes.func,
  isFirstFetch: PropTypes.bool,
  // offset in container when there is sibling on top of it
  offset: PropTypes.number.isRequired
};
