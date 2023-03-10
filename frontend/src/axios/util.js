import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
  timeout: 10000
});

export const DOMAIN_TYPES = {
  ALL: 'all',
  PRODUCT: 'product',
  BATCH: 'batch'
};

const DOMAINS = {
  [DOMAIN_TYPES.ALL]: 'https://szlsapqode.execute-api.us-east-1.amazonaws.com/v4',
  [DOMAIN_TYPES.PRODUCT]: 'https://szlsapqode.execute-api.us-east-1.amazonaws.com/v4',
  [DOMAIN_TYPES.BATCH]: 'https://szlsapqode.execute-api.us-east-1.amazonaws.com/v4'
};

function serialize(obj) {
  var str = [];
  for (let p in obj)
    if (obj.hasOwnProperty(p) && obj[p] !== undefined) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  return str.join('&');
}

function responseHandler(response) {
  return {
    status: response.status,
    data: response.data
  };
}

function formatUrl(type, url) {
  return DOMAINS[type] + url;
}

export async function get({ url, params, type }) {
  try {
    const response = await axiosInstance({
      method: 'get',
      url: formatUrl(type, url + (params ? '?' + serialize(params) : ''))
    });
    return responseHandler(response);
  } catch (error) {
    return responseHandler(error.toJSON());
  }
}

export async function post({ url, data, type, headers, params }) {
  try {
    const response = await axiosInstance({
      method: 'post',
      url: formatUrl(type, url + (params ? '?' + serialize(params) : '')),
      headers,
      data
    });
    return responseHandler(response);
  } catch (error) {
    return responseHandler(error.toJSON());
  }
}

export async function deleteHandler({ url, data, params, type }) {
  try {
    const response = await axiosInstance({
      method: 'delete',
      url: formatUrl(type, url + (params ? '?' + serialize(params) : '')),
      data
    });
    return responseHandler(response);
  } catch (error) {
    console.log(error);
    return responseHandler(error.toJSON());
  }
}

export async function put({ url, params, data, type }) {
  try {
    const response = await axiosInstance({
      method: 'put',
      url: formatUrl(type, url + (params ? '?' + serialize(params) : '')),
      data
    });
    return responseHandler(response);
  } catch (error) {
    return responseHandler(error.toJSON());
  }
}
