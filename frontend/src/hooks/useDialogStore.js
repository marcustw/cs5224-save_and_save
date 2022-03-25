import React from 'react';

export const useDialogStore = ({ onConfirm }) => {
  const [dialogInfo, setDialogInfo] = React.useState({
    open: false
  });
  const onConfirmRef = React.useRef(onConfirm);
  onConfirmRef.current = onConfirm;

  const { openDialog, closeDialog } = React.useMemo(
    () => ({
      openDialog: ({ title, description, extraData }) => {
        setDialogInfo({
          title,
          description,
          extraData,
          open: true
        });
      },
      closeDialog: (action, data) => {
        if (action === 'confirm') {
          onConfirmRef.current && onConfirmRef.current(data);
        }
        setDialogInfo((prevState) => ({
          ...prevState,
          open: false
        }));
      }
    }),
    []
  );

  return {
    openDialog,
    closeDialog,
    dialogInfo
  };
};
