import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// material ui
import { Button, Grid } from '@mui/material';
import { useDialogStore } from 'hooks/useDialogStore';
import { ActionConfirmationDialog } from 'ui-component/ActionConfirmationDialog';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { OrderByStore } from './Components/OrderByStore';
import TotalAmount from './Components/TotalAmount';
import config from 'config';
import { MENU_OPEN } from 'store/actions';
import routes from 'routes/routeObject';

const MockStore = {
  name: '7-11'
};

const items = [
  {
    itemName: 'Milk',
    count: 2,
    discountPrice: 4.99
  },
  {
    itemName: 'Bread',
    count: 1,
    discountPrice: 2.99
  },
  {
    itemName: 'Fruit',
    count: 5,
    discountPrice: 0.99
  }
];

const CartPage = () => {
  const handleOnDialogClose = () => {
    navigate(config.basename + routes.dashboard.url);
    dispatch({ type: MENU_OPEN, id: routes.dashboard.id });
  };
  const { openDialog, closeDialog, dialogInfo } = useDialogStore({
    onConfirm: handleOnDialogClose
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const repeat = new Array(10).fill(null);

  const handleOnProceed = () => {
    console.log('Confirm Order');
    openDialog({
      title: 'Purchase Succeed',
      description: `Your receipt is ${'INV123455'}. You may check your purchase order in the dashboard.`
    });
  };
  return (
    <div>
      <Grid container marginBottom={1} flexDirection="row-reverse">
        <Grid item justifyContent="flex-end">
          <Button onClick={handleOnProceed} variant="outlined">
            Proceed
          </Button>
        </Grid>
      </Grid>
      <TotalAmount amount={200} />
      {repeat.map((r, index) => (
        <OrderByStore key={index} store={MockStore} items={items} />
      ))}
      <ActionConfirmationDialog
        handleClose={closeDialog}
        open={dialogInfo.open}
        title={dialogInfo.title}
        description={dialogInfo.description}
        confirmText="OK"
        data={dialogInfo.extraData}
      />
    </div>
  );
};

export default CartPage;
