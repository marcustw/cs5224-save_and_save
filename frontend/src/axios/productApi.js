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

export function searchProducts({ offset = 0, limit, keyword }) {
  return get({
    url: '/products',
    type: DOMAIN_TYPES.PRODUCT,
    params: {
      offset,
      // limit,
      keyword
    }
  });
}

export function deleteProductById({ id }) {
  return deleteHandler({
    url: '/product',
    type: DOMAIN_TYPES.PRODUCT,
    params: {
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
      'Content-Type': 'multipart/form-data',
      operation: 'upload_csv',
      user_id: userId
    },
    data: csvFile
  });
}
