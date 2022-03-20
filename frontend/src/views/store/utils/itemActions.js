import { deleteHandler, DOMAIN_TYPES } from 'axios/util';
import { ItemActionTypes } from 'constants/item';

export function handleOnItemAction(data) {
  switch (data.type) {
    case ItemActionTypes.DELETE: {
      // call api to delete the item
      const { item } = data;
      // deleteHandler({
      //   url: '/product',
      //   type: DOMAIN_TYPES.PRODUCT,
      //   params: { id: item.id }
      // });
      return;
    }
    case ItemActionTypes.UNLIST: {
      // call api to unlist the item
      const { item } = data;
      return;
    }
    case ItemActionTypes.LIST: {
      // call api to list the item
      const { item } = data;
      return;
    }
  }
}
