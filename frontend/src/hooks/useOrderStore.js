import { updateOrderState } from 'axios/orderApi';
import React from 'react';
import { OrderStatus } from 'constants/item';

function getOrderString(status, isSeller) {
  if (isSeller) {
    return status === OrderStatus.PREPARE ? 'To Prepare' : 'Pending Collection';
  }
  return status === OrderStatus.PREPARE ? 'Pending Preparation' : 'To Collect';
}

export const useOrderStore = ({ fetchOrders, userid, isSeller }) => {
  const [orderState, setOrderState] = React.useState({
    totalCount: 0,
    orderList: [],
    orderMap: {},
    isInit: true
  });
  const hasMore = React.useRef(true);
  const loadingRef = React.useRef(false);
  const orderListRef = React.useRef(orderState.orderList);
  orderListRef.current = orderState.orderList;
  const orderMapRef = React.useRef(orderState.orderMap);
  orderMapRef.current = orderState.orderMap;
  const fetchOrdersRef = React.useRef(fetchOrders);
  fetchOrdersRef.current = fetchOrders;

  // for virtualized list usage
  const { loadMoreRows, loadRows, updateOrderStatus } = React.useMemo(() => {
    const loadRows = async () => {
      loadingRef.current = true;
      const response = await fetchOrdersRef.current({
        offset: 0,
        store_id: isSeller ? userid : undefined,
        customer_id: isSeller ? undefined : userid
      });
      if (response.status === 200) {
        const { payload } = response.data;
        const orderMap = {
          ...orderMapRef.current,
          ...payload
        };
        let orderList = Object.keys(orderMap).map((orderId) => {
          const status = orderMap[orderId].products[0].status;
          return {
            orderId,
            storeId: orderMap[orderId].products[0].store_id,
            status: getOrderString(status, isSeller),
            statusCode: status,
            products: orderMap[orderId].products,
            total_cost: parseFloat(orderMap[orderId].total_cost).toFixed(2)
          };
        });

        loadingRef.current = false;
        setOrderState({
          totalCount: response.data.count,
          orderList: orderList,
          orderMap,
          isInit: false
        });
      }
      loadingRef.current = false;
    };

    return {
      loadMoreRows: async ({ startIndex }) => {
        if (!!orderListRef.current[startIndex] || loadingRef.current || !hasMore.current) return;
        loadingRef.current = true;
        const response = await fetchOrdersRef.current({
          offset: startIndex,
          store_id: isSeller ? userid : undefined,
          customer_id: isSeller ? undefined : userid
        });

        if (response.status === 200) {
          const { payload } = response.data;
          const orderMap = {
            ...orderMapRef.current,
            ...payload
          };
          let orderList = Object.keys(orderMap).map((orderId) => {
            const status = orderMap[orderId].products[0].status;
            return {
              orderId,
              storeId: orderMap[orderId].products[0].store_id,
              status: getOrderString(status, isSeller),
              statusCode: status,
              products: orderMap[orderId].products,
              total_cost: parseFloat(orderMap[orderId].total_cost).toFixed(2)
            };
          });

          loadingRef.current = false;
          // const listCopy = [...orderListRef.current, ...orderList];
          hasMore.current = response.data.count > 0;
          setOrderState((prevState) => ({
            ...prevState,
            isInit: false,
            orderList,
            orderMap
          }));
        }

        loadingRef.current = false;
      },
      loadRows,
      updateOrderStatus: async ({ orderId, storeId }, index) => {
        const response = await updateOrderState({ orderId, storeId, status: isSeller ? OrderStatus.TO_COLLECT : OrderStatus.RECEIVED });
        if (response.status === 200) {
          delete orderMapRef.current[orderId];
          orderListRef.current.splice(index, 1);
          setOrderState((prevState) => ({
            ...prevState,
            orderList: [...orderListRef.current],
            orderMap: { ...orderMapRef.current }
          }));
          return true;
        }
        return false;
      }
    };
  }, [userid]);

  return {
    isFirstFetch: orderState.isInit,
    totalItems: orderState.totalCount,
    orderListRef,
    orderMapRef,
    loadMoreRows,
    loadRows,
    updateOrderStatus
  };
};
