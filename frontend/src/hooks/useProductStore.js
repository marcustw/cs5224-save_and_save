import React from 'react';
import { mapItemResponseToUIData } from 'utils/data-mapper';

const ItemData = {
  storeName: 'Hello Shop',
  itemName: 'milk',
  originalPrice: 14.9,
  discountPrice: 10.9,
  description: 'A breif desscription',
  discountReason: 'Expiring',
  expiredDate: '2022-3-4',
  stockCount: 5
};

export const useProductStore = ({ fetchProduct }) => {
  const [productState, setProductState] = React.useState({
    totalCount: 0,
    productList: [],
    isInit: true
  });
  const hasMore = React.useRef(true);
  const loadingRef = React.useRef(false);
  const productListRef = React.useRef(productState.productList);
  productListRef.current = productState.productList;

  const fetchProductRef = React.useRef(fetchProduct);
  fetchProductRef.current = fetchProduct;

  const searchKeywordRef = React.useRef('');

  // for virtualized list usage
  const { loadMoreRows, loadRows, onSearch } = React.useMemo(() => {
    const loadRows = async () => {
      loadingRef.current = true;
      const response = await fetchProduct({
        offset: 0,
        keyword: searchKeywordRef.current
      });
      if (response.status === 200) {
        setProductState({
          totalCount: response.data.count,
          productList: response.data.products.map(mapItemResponseToUIData),
          isInit: false
        });
      }
      loadingRef.current = false;
    };

    return {
      loadMoreRows: async ({ startIndex, stopIndex }) => {
        if (!!productListRef.current[startIndex] || loadingRef.current || !hasMore.current) return;
        loadingRef.current = true;
        const size = stopIndex - startIndex;
        const response = await fetchProduct({
          offset: startIndex,
          keyword: searchKeywordRef.current
        });

        if (response.status === 200) {
          hasMore.current = response.data.products.length > 0;
          const listCopy = [...productListRef.current, ...response.data.products.map(mapItemResponseToUIData)];
          setProductState((prevState) => ({
            ...prevState,
            isInit: false,
            productList: listCopy
          }));
        }

        loadingRef.current = false;
      },
      loadRows,
      onSearch: (keyword) => {
        searchKeywordRef.current = keyword;
        setProductState({
          totalCount: 0,
          productList: [],
          isInit: true
        });
        loadRows();
      }
    };
  }, []);

  return {
    isFirstFetch: productState.isInit,
    totalItems: productState.totalCount,
    productListRef,
    loadMoreRows,
    loadRows,
    onSearch
  };
};
