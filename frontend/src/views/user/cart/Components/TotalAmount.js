import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// material-ui
import { Paper, Grid, Typography } from '@mui/material';

const TotalAmount = forwardRef(({ amount }, ref) => {
  return (
    <Paper ref={ref} sx={{ padding: 3 }}>
      <Grid container justifyContent="center">
        <Grid item xs={9}>
          <Typography variant="h2">Total Amount</Typography>
        </Grid>
        <Grid item xs={3} textAlign="right">
          <Typography variant="h2">SGD {amount.toFixed(2)}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
});

TotalAmount.propTypes = {
  amount: PropTypes.number.isRequired
};

export default TotalAmount;
