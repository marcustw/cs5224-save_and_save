import React from 'react';

// project imports
import { InfiniteProductLoader } from 'ui-component/InfiniteProductLoader';
import SearchSection from 'ui-component/SearchSection';
import ProductForm from '../Components/ProductEditForm';
import { ActionConfirmationDialog } from 'ui-component/ActionConfirmationDialog';
import { useProductStore } from 'hooks/useProductStore';
import { useDialogStore } from 'hooks/useDialogStore';
import { FormEditDialog } from '../Components/EditFormDialog';
import { ItemActionTypes } from 'constants/item';
import { AddItemActions } from '../Components/AddItemActions';
import { mapItemUIToRequestData } from 'utils/data-mapper';
import { deleteProductById, searchProducts, updateProductById } from 'axios/productApi';

import { UserContext } from 'Contexts/UserContext';

const InventoryManagementPage = () => {
  const { user } = React.useContext(UserContext);
  const containerRef = React.useRef(null);
  const [editItem, setEditItem] = React.useState();

  const { fetchProductHandler, updateProductHandler } = React.useMemo(
    () => ({
      fetchProductHandler: ({ offset, limit, keyword }) => {
        return searchProducts({
          offset,
          limit,
          keyword: keyword || undefined,
          store_id: user.username
        });
      },
      updateProductHandler: ({ item }) => {
        return updateProductById({
          item: mapItemUIToRequestData(item)
        });
      }
    }),
    []
  );

  const { productMapRef, productListRef, loadMoreRows, loadRows, onSearch, isFirstFetch, totalItems, updateItemData, deleteItemData } =
    useProductStore({
      fetchProduct: fetchProductHandler,
      store_id: user.username
    });

  const handleOnItemAction = React.useCallback(
    async (data) => {
      switch (data.type) {
        case ItemActionTypes.DELETE: {
          // call api to delete the item
          const { item } = data;
          const res = await deleteProductById({ id: item.id });
          if (res.status === 200) {
            deleteItemData(item);
          }
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
    },
    [deleteItemData]
  );

  const { openDialog, closeDialog, dialogInfo } = useDialogStore({
    onConfirm: handleOnItemAction
  });

  const handleOnEditFormClosed = () => {
    setEditItem(undefined);
  };

  const handleOnEditSubmit = async (item) => {
    const response = await updateProductHandler({ item: item.updated });
    if (response.status === 200) {
      updateItemData(item.updated);
      setEditItem(undefined);
    }
    return response.status;
  };

  const onSellerActionClick = (type, item) => {
    switch (type) {
      case ItemActionTypes.DELETE: {
        openDialog({
          title: 'Delete Product',
          description: `Do you confirm to delete ${item.itemName}? Once deleted, you would not able to find it in your inventory management.`,
          extraData: {
            type,
            item
          }
        });
        return;
      }
      case ItemActionTypes.EDIT: {
        setEditItem(item);
        return;
      }
      case ItemActionTypes.UNLIST: {
        openDialog({
          title: 'Unlist Product',
          description: `Do you confirm to unlist ${item.itemName} from the sale? After unlist, buyers are not able to search the item.`,
          extraData: {
            type,
            item
          }
        });
        return;
      }
      case ItemActionTypes.LIST: {
        openDialog({
          title: 'List Product',
          description: `Do you confirm to list ${item.itemName} from the sale? After unlist, buyers are not able to search the item.`,
          extraData: {
            type,
            item
          }
        });
        return;
      }
    }
  };

  React.useEffect(() => {
    loadRows();
  }, [loadRows]);

  return (
    <div ref={containerRef} style={{ flex: 1, height: '100%' }}>
      <AddItemActions />
      <SearchSection handleOnSearch={onSearch} />
      <InfiniteProductLoader
        list={productListRef.current}
        listMap={productMapRef.current}
        onSellerActionClick={onSellerActionClick}
        totalRowCounts={totalItems}
        loadMoreRows={loadMoreRows}
        offset={80}
        isFirstFetch={isFirstFetch}
      />
      {/** edit product form dialog  */}
      <FormEditDialog open={!!editItem} onClose={handleOnEditFormClosed} title="Edit Item">
        <ProductForm itemData={editItem} onSubmit={handleOnEditSubmit} />
      </FormEditDialog>
      {/** confirmation dialog */}
      <ActionConfirmationDialog
        handleClose={closeDialog}
        open={dialogInfo.open}
        title={dialogInfo.title}
        description={dialogInfo.description}
        cancelText="cancel"
        confirmText="confirm"
        data={dialogInfo.extraData}
      />
    </div>
  );
};

export default InventoryManagementPage;
