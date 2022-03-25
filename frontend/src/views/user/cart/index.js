import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAtomValue } from 'jotai';

// material ui
import { Button, Grid, Typography, Box } from '@mui/material';
import { useDialogStore } from 'hooks/useDialogStore';
import { ActionConfirmationDialog } from 'ui-component/ActionConfirmationDialog';

// project imports
import { OrderByStore } from './Components/OrderByStore';
import TotalAmount from './Components/TotalAmount';
import config from 'config';
import { MENU_OPEN } from 'store/actions';
import routes from 'routes/routeObject';
import { cartAtom } from 'atoms/cart';

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
  const cart = useAtomValue(cartAtom);
  const handleOnDialogClose = () => {
    navigate(config.basename + routes.dashboard.url);
    dispatch({ type: MENU_OPEN, id: routes.dashboard.id });
  };
  const { openDialog, closeDialog, dialogInfo } = useDialogStore({
    onConfirm: handleOnDialogClose
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log(cart);

  const { shopItems, totalAmount } = React.useMemo(() => {
    const shopItems = {};
    let totalAmount = 0;
    Object.values(cart).forEach((cartItem) => {
      const { item, count } = cartItem;
      const storeKey = item.storeId.toString();
      totalAmount = totalAmount + item.discountPrice * count;
      if (shopItems[storeKey]) {
        shopItems[storeKey].items.push({ ...item, count });
      } else {
        shopItems[storeKey] = {
          items: [{ ...item, count }],
          store: {
            name: storeKey,
            id: storeKey
          }
        };
      }
    });
    return {
      shopItems: Object.keys(shopItems).map((shopKey) => shopItems[shopKey]),
      totalAmount
    };
  }, [cart]);

  const handleOnProceed = () => {
    console.log('Confirm Order');
    openDialog({
      title: 'Purchase Succeed',
      description: `Your receipt is ${'INV123455'}. You may check your purchase order in the dashboard.`
    });
  };

  if (shopItems.length === 0) {
    return (
      <Box display="flex" justifyContent="center" m={4}>
        <Typography variant="h3">No item in the cart</Typography>
      </Box>
    );
  }

  return (
    <div>
      <Grid container marginBottom={1} flexDirection="row-reverse">
        <Grid item justifyContent="flex-end">
          <Button onClick={handleOnProceed} variant="outlined">
            Proceed
          </Button>
        </Grid>
      </Grid>
      <TotalAmount amount={totalAmount} />
      {shopItems.map(({ store, items }, index) => (
        <OrderByStore key={store.id} store={store} items={items} />
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
