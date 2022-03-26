import { deleteHandler, DOMAIN_TYPES, get, post, put } from './util';

/**
 * Account data
 * @typedef {Object} Account
 * @property {string} id
 * @property {number} authorized_to_sell
 * @property {string} username
 * @property {string} password
 * @property {string} name
 * @property {string} address
 * @property {string} contact_no
 * @property {string} mail_id
 * @property {string} first_name
 * @property {string} last_name
 */

/**
 *
 * @param {Account} data
 */
export function createUser(data) {
  return post({
    url: '/customer',
    type: DOMAIN_TYPES.ALL,
    data
  });
}

/**
 *
 * @param {Account} data
 */
export function getUser(id) {
  return get({
    url: '/customer',
    type: DOMAIN_TYPES.ALL,
    params: { id }
  });
}

export function deleteUser(id) {
  return deleteHandler({
    url: '/customer',
    type: DOMAIN_TYPES.ALL,
    data: { id }
  });
}

/**
 *
 * @param {Account} data
 */
export function updateUserInfo(data) {
  return put({
    url: '/customer',
    type: DOMAIN_TYPES.ALL,
    data: data
  });
}
