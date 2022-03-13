import React from 'react';

// project imports
import { InfiniteProductLoader } from 'ui-component/InfiniteProductLoader';
import SearchSection from 'ui-component/SearchSection';
import ProductForm from '../Components/ProductEditForm';
import { ActionConfirmationDialog } from 'ui-component/ActionConfirmationDialog';
import { useProductStore } from 'hooks/useProductStore';
import { useDialogStore } from 'hooks/useDialogStore';
import { FormEditDialog } from '../Components/EditFormDialog';
import { handleOnItemAction } from '../utils/itemActions';
import { ItemActionTypes } from 'constants/item';

const InventoryManagementPage = () => {
  const containerRef = React.useRef(null);
  const [editItem, setEditItem] = React.useState();
  const { productListRef, loadMoreRows } = useProductStore();
  const { openDialog, closeDialog, dialogInfo } = useDialogStore({
    onConfirm: handleOnItemAction
  });

  const handleOnSearch = (value) => {
    console.log('search value', value);
  };

  const handleOnEditFormClosed = () => {
    setEditItem(undefined);
  };

  const handleOnEditSubmit = (item) => {
    setEditItem(undefined);
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

  return (
    <div ref={containerRef} style={{ flex: 1, height: '100%' }}>
      <SearchSection handleOnSearch={handleOnSearch} />
      <InfiniteProductLoader
        list={productListRef.current}
        onSellerActionClick={onSellerActionClick}
        totalRowCounts={100}
        loadMoreRows={loadMoreRows}
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
