import { ItemActionTypes } from 'constants/item';

export function handleOnItemAction(data) {
  switch (data.type) {
    case ItemActionTypes.DELETE: {
      // call api to delete the item
      const { item } = data;
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
