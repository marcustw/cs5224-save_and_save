import React from 'react';
import { Stack, Button } from '@mui/material';
import { FormEditDialog } from './EditFormDialog';
import ProductForm from './ProductEditForm';
import { FileUploadDialog } from './FileUploadDialog';

export const AddItemActions = () => {
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [batchDialogOpen, setBatchDialogOpen] = React.useState(false);

  const handleOnAddItem = () => {
    setAddDialogOpen(true);
  };

  const handleOnAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handleOnOneItemSubmit = (itemData) => {
    handleOnAddDialogClose();
  };

  const handleAddByBatch = () => {
    setBatchDialogOpen(true);
  };

  const handleOnBatchDialogClose = () => {
    setBatchDialogOpen(false);
  };

  return (
    <>
      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        <Button variant="outlined" onClick={handleAddByBatch}>
          Add Items By Batch
        </Button>
        <Button variant="contained" onClick={handleOnAddItem}>
          Add Item
        </Button>
      </Stack>
      {/** edit product form dialog  */}
      <FormEditDialog open={addDialogOpen} onClose={handleOnAddDialogClose} title="Add Item">
        <ProductForm onSubmit={handleOnOneItemSubmit} />
      </FormEditDialog>
      <FileUploadDialog open={batchDialogOpen} onClose={handleOnBatchDialogClose} />
    </>
  );
};
