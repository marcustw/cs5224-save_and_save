import React from 'react';
import PropTypes from 'prop-types';
import { InfiniteLoader, List, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
import ProductCard from './productCard';

export const InfiniteProductLoader = ({ list, loadMoreRows, totalRowCounts, onBuyerActionClick, onSellerActionClick }) => {
  const listRef = React.useRef(list);
  listRef.current = list;
  const { isRowLoaded, rowRenderer } = React.useMemo(() => ({
    isRowLoaded: ({ index }) => {
      return !!listRef.current[index];
    },
    rowRenderer: ({ key, index, style }) => {
      return (
        <div key={key} style={style}>
          <ProductCard
            itemData={listRef.current[index]}
            onSellerActionClick={onSellerActionClick}
            onBuyerActionClick={onBuyerActionClick}
          />
        </div>
      );
    }
  }));
  return (
    <div style={{ height: 'calc(100% - 50px)' }}>
      <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={totalRowCounts}>
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height - 40}
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
  list: PropTypes.arrayOf(
    PropTypes.shape({
      itemName: PropTypes.string,
      originalPrice: PropTypes.number,
      discountPrice: PropTypes.number,
      // refer to enum ItemCondition
      discountReason: PropTypes.string,
      stockCount: PropTypes.number,
      // yyyy-mm-dd
      expiredDate: PropTypes.string,
      description: PropTypes.string,
      stockCount: PropTypes.nunber,
      // refer to enum ItemStatus
      itemStatus: PropTypes.string,
      storeName: PropTypes.string
    })
  ),
  // ({ startIndex, stopIndex }) => Promise
  loadMoreRows: PropTypes.string,
  totalRowCounts: PropTypes.number,
  onSellerActionClick: PropTypes.func,
  onBuyerActionClick: PropTypes.func
};
