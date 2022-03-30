import { get, deleteHandler, put, DOMAIN_TYPES, post } from './util';

export function getProductById({ id }) {
  return get({
    url: '/product',
    type: DOMAIN_TYPES.PRODUCT,
    params: {
      id
    }
  });
}

export function searchProducts({ offset = 0, limit = 20, keyword, store_id }) {
  return get({
    url: '/products',
    type: DOMAIN_TYPES.PRODUCT,
    params: {
      offset,
      limit,
      keyword,
      store_id
    }
  });
}

export function deleteProductById({ id }) {
  return deleteHandler({
    url: '/product',
    type: DOMAIN_TYPES.PRODUCT,
    data: {
      id
    }
  });
}

export function updateProductById({ item }) {
  return put({
    url: '/product',
    type: DOMAIN_TYPES.PRODUCT,
    data: item
  });
}

export function addProduct({ item }) {
  return put({
    url: '/product',
    type: DOMAIN_TYPES.PRODUCT,
    data: item
  });
}

export function addProductsByBatch({ csvFile, userId }) {
  return post({
    url: '/csv_handler',
    type: DOMAIN_TYPES.BATCH,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    params: { store_id: userId },
    data: csvFile
  });
}

export function getPopularProducts({ start_date, end_date, userId }) {
  return get({
    url: '/data-analytics-query',
    type: DOMAIN_TYPES.BATCH,
    params: { customer_id: userId, start_date, end_date }
  });
}
