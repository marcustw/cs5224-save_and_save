import React from 'react';

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
  const [productList, setProductList] = React.useState([ItemData]);
  const loadingRef = React.useRef(false);
  const productListRef = React.useRef(productList);
  productListRef.current = productList;

  const fetchProductRef = React.useRef(fetchProduct);
  fetchProductRef.current = fetchProduct;

  // for virtualized list usage
  const { loadMoreRows, loadRows } = React.useMemo(
    () => ({
      loadMoreRows: async ({ startIndex, stopIndex }) => {
        if (!!productListRef.current[startIndex] || loadingRef.current) return;
        loadingRef.current = true;
        const size = stopIndex - startIndex;
        const response = await fetchProduct({
          offset: startIndex - 1,
          limit: size
        });
        const listCopy = [...productListRef.current];
        for (let i = 0; i < size; i++) {
          listCopy.push(ItemData);
        }
        setProductList(listCopy);
        loadingRef.current = false;
      },
      loadRows: async () => {
        loadingRef.current = true;
        const response = await fetchProduct({
          offset: 0,
          limit: 20
        });
        loadingRef.current = false;
      }
    }),
    []
  );

  return {
    productListRef,
    loadMoreRows,
    loadRows
  };
};
