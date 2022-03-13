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

export const useProductStore = () => {
  const [productList, setProductList] = React.useState([ItemData]);
  const productListRef = React.useRef(productList);
  productListRef.current = productList;

  // for virtualized list usage
  const { loadMoreRows } = React.useMemo(
    () => ({
      loadMoreRows: ({ startIndex, stopIndex }) => {
        if (!!productListRef.current[startIndex]) return;
        const size = stopIndex - startIndex;
        const listCopy = [...productListRef.current];
        for (let i = 0; i < size; i++) {
          listCopy.push(ItemData);
        }
        setProductList(listCopy);
      }
    }),
    []
  );

  return {
    productListRef,
    loadMoreRows
  };
};
