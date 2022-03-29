import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAtom } from 'jotai';

// material ui
import { Button, Grid, Typography, Box, Backdrop, CircularProgress } from '@mui/material';
import { useDialogStore } from 'hooks/useDialogStore';
import { ActionConfirmationDialog } from 'ui-component/ActionConfirmationDialog';

// project imports
import { OrderByStore } from './Components/OrderByStore';
import TotalAmount from './Components/TotalAmount';
import config from 'config';
import { MENU_OPEN } from 'store/actions';
import routes from 'routes/routeObject';
import { cartAtom } from 'atoms/cart';
import { makeOrder } from 'axios/orderApi';
import { UserContext } from 'Contexts/UserContext';

const CartPage = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const { user } = React.useContext(UserContext);
  const [loading, setLoading] = React.useState(false);
  const orderSuccessRef = React.useRef(false);
  const handleOnDialogClose = () => {
    if (orderSuccessRef.current) {
      setCart({});
    }
    navigate(config.basename + routes.dashboard.url);
    dispatch({ type: MENU_OPEN, id: routes.dashboard.id });
  };
  const { openDialog, closeDialog, dialogInfo } = useDialogStore({
    onConfirm: handleOnDialogClose
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const handleOnProceed = async () => {
    setLoading(true);
    const { status, data } = await makeOrder({
      cartItems: cart,
      userid: user.username,
      totalPrice: totalAmount
    });
    orderSuccessRef.current = status === 200;
    setLoading(false);
    if (orderSuccessRef.current) {
      openDialog({
        title: 'Purchase Succeed',
        description: `Your receipt is INV#${data.purchase_id}. You may check your purchase order in the dashboard.`
      });
    }
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
      {shopItems.map(({ store, items }) => (
        <OrderByStore key={store.id} store={store} items={items} />
      ))}
      <ActionConfirmationDialog
        handleClose={closeDialog}
        open={dialogInfo.open}
        title={dialogInfo.title}
        description={dialogInfo.description}
        confirmText="OK"
        data={dialogInfo.extraData}
        noDimiss={true}
      />
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default CartPage;
