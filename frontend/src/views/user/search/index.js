import React from 'react';
// project imports
import { InfiniteProductLoader } from 'ui-component/InfiniteProductLoader';
import SearchSection from 'ui-component/SearchSection';

import { useProductStore } from 'hooks/useProductStore';
import { searchProducts } from 'axios/productApi';

import { useImmerAtom } from 'jotai/immer';
import { cartAtom } from 'atoms/cart';

const SearchPage = () => {
  const [, setCart] = useImmerAtom(cartAtom);

  const { fetchProductHandler } = React.useMemo(
    () => ({
      fetchProductHandler: ({ offset, limit, keyword }) => {
        return searchProducts({
          offset,
          limit,
          keyword: keyword ? keyword : undefined
        });
      }
    }),
    []
  );

  const { productMapRef, productListRef, loadMoreRows, onSearch, isFirstFetch, totalItems, loadRows } = useProductStore({
    fetchProduct: fetchProductHandler
  });

  const onAddToCart = (item, count) => {
    setCart((cart) => {
      const itemKey = item.id.toString();
      if (cart[itemKey]) {
        cart[itemKey].count = Math.min(cart[itemKey].count + count, item.stockCount);
      } else {
        cart[itemKey] = {
          count: Math.min(count, item.stockCount),
          item
        };
      }

      return cart;
    });
  };

  React.useEffect(() => {
    loadRows();
  }, [loadRows]);

  return (
    <div style={{ flex: 1, height: '100%' }}>
      <SearchSection handleOnSearch={onSearch} />
      <InfiniteProductLoader
        list={productListRef.current}
        listMap={productMapRef.current}
        onBuyerActionClick={onAddToCart}
        totalRowCounts={totalItems}
        loadMoreRows={loadMoreRows}
        isFirstFetch={isFirstFetch}
      />
    </div>
  );
};

export default SearchPage;
