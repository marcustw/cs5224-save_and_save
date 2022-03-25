import React from 'react';
import { mapItemResponseToUIData } from 'utils/data-mapper';

export const useProductStore = ({ fetchProduct, store_id }) => {
  const [productState, setProductState] = React.useState({
    totalCount: 0,
    productList: [],
    productMap: {},
    isInit: true
  });
  const hasMore = React.useRef(true);
  const loadingRef = React.useRef(false);
  const productListRef = React.useRef(productState.productList);
  productListRef.current = productState.productList;
  const productMapRef = React.useRef(productState.productMap);
  productMapRef.current = productState.productMap;
  const fetchProductRef = React.useRef(fetchProduct);
  fetchProductRef.current = fetchProduct;

  const searchKeywordRef = React.useRef('');

  // for virtualized list usage
  const { loadMoreRows, loadRows, onSearch, updateItemData, deleteItemData } = React.useMemo(() => {
    const loadRows = async () => {
      loadingRef.current = true;
      const response = await fetchProductRef.current({
        offset: 0,
        keyword: searchKeywordRef.current,
        store_id
      });
      if (response.status === 200) {
        const converted = response.data.products.map(mapItemResponseToUIData);
        const productList = converted.map((c) => {
          productMapRef.current[c.id] = c;
          return c.id;
        });
        loadingRef.current = false;
        setProductState({
          totalCount: response.data.count,
          productList: productList,
          productMap: productMapRef.current,
          isInit: false
        });
      }
      loadingRef.current = false;
    };

    return {
      loadMoreRows: async ({ startIndex }) => {
        if (!!productListRef.current[startIndex] || loadingRef.current || !hasMore.current) return;
        loadingRef.current = true;
        const response = await fetchProductRef.current({
          offset: startIndex,
          keyword: searchKeywordRef.current,
          store_id
        });

        if (response.status === 200) {
          hasMore.current = response.data.products.length > 0;
          const converted = response.data.products.map(mapItemResponseToUIData);
          const newProductList = converted.map((c) => {
            productMapRef.current[c.id] = c;
            return c.id;
          });
          const listCopy = [...productListRef.current, ...newProductList];
          setProductState((prevState) => ({
            ...prevState,
            isInit: false,
            productList: listCopy,
            productMap: productMapRef.current
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
          isInit: true,
          productMap: {}
        });
        loadRows();
      },
      updateItemData: (item) => {
        productMapRef.current[item.id] = item;
        setProductState((prevState) => ({
          ...prevState,
          productMap: { ...productMapRef.current }
        }));
      },
      deleteItemData: (item) => {
        delete productMapRef.current[item.id];
        const removedIndex = productListRef.current.findIndex((id) => id === item.id);
        let newList;
        if (removedIndex + 1 === productListRef.current.length) {
          productListRef.current.pop();
          newList = [...productListRef.current];
        } else if (removedIndex === 0) {
          productListRef.current.shift();
          newList = [...productListRef.current];
        } else {
          newList = [...productListRef.current.slice(0, removedIndex), ...productListRef.current.slice(removedIndex + 1)];
        }
        setProductState((prevState) => ({
          ...prevState,
          productList: newList
        }));
      }
    };
  }, [store_id]);

  return {
    isFirstFetch: productState.isInit,
    totalItems: productState.totalCount,
    productListRef,
    productMapRef,
    loadMoreRows,
    loadRows,
    onSearch,
    updateItemData,
    deleteItemData
  };
};
