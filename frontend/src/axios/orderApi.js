import { DOMAIN_TYPES, get, post, put } from './util';

export function makeOrder({ cartItems, userid, totalPrice }) {
  const products = {};
  Object.values(cartItems).forEach((cartItem) => {
    const { item, count } = cartItem;
    const productId = item.id.toString();
    products[productId] = count;
  });
  const params = {
    customer_id: userid,
    total_price: totalPrice,
    products
  };
  return post({
    url: '/purchase',
    type: DOMAIN_TYPES.ALL,
    data: params
  });
}

export function getOrdersByStore({ store_id, limit }) {
  return get({
    url: '/purchase_products',
    type: DOMAIN_TYPES.ALL,
    params: {
      store_id,
      limit
    }
  });
}

export function getOrdersByBuyer({ customer_id, limit }) {
  return get({
    url: '/purchase_products',
    type: DOMAIN_TYPES.ALL,
    params: {
      customer_id,
      limit
    }
  });
}

export function updateOrderState({ orderId, storeId, status }) {
  return put({
    url: '/purchase_products',
    type: DOMAIN_TYPES.ALL,
    data: {
      purchase_id: orderId,
      store_id: storeId,
      status
    }
  });
}
