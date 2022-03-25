import { Divider, Grid, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

export const OrderByStore = ({ store, items }) => {
  const { name: storeName } = store;
  const totalAmount = items
    .map((item) => item.discountPrice * item.count)
    .reduce((total, curVal) => {
      return total + curVal;
    }, 0);
  return (
    <MainCard title={`${storeName} (${items.length} item${items.length > 1 ? 's' : ''})`} sx={{ marginTop: 2 }}>
      {items.map((item) => {
        return (
          <Grid container textAlign="right">
            {/** first line */}
            <Grid item xs={4} textAlign="left">
              {item.itemName}
            </Grid>
            <Grid item xs={4} textAlign="right">
              {item.count} unit
            </Grid>
            <Grid item xs={4}>
              {item.discountPrice.toFixed(2)}
            </Grid>
            {/** second line */}
            <Grid item xs={10} md={10}>
              SGD
            </Grid>
            <Grid item xs={2} md={2} alignSelf="flex-end">
              <Typography textAlign="right" variant="h5">
                {(item.discountPrice * item.count).toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        );
      })}
      <Divider />
      <Typography textAlign="right" variant="h4" marginTop={1}>
        SGD {totalAmount.toFixed(2)}
      </Typography>
    </MainCard>
  );
};
