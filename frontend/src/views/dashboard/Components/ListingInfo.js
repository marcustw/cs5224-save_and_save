import PropTypes from 'prop-types';

// material-ui
import { Grid } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import SimpleCard from 'ui-component/statistics/SimpleCard';

export const ListingInfo = ({ onSaleCount, expiringCount, unlistedCount, isLoading }) => {
  return (
    <Grid item xs={12}>
      <Grid container spacing={gridSpacing}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item sm={4} xs={12} md={4} lg={4}>
              <SimpleCard isLoading={isLoading} title={onSaleCount} subTitle="On Sale Listings" />
            </Grid>
            <Grid item sm={4} xs={12} md={4} lg={4}>
              <SimpleCard isLoading={isLoading} title={expiringCount} subTitle="Expiring Listings" />
            </Grid>
            <Grid item sm={4} xs={12} md={4} lg={4}>
              <SimpleCard isLoading={isLoading} title={unlistedCount} subTitle="Unlisted items" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

ListingInfo.propTypes = {
  onSaleCount: PropTypes.number,
  expiringCount: PropTypes.number,
  unlistedCount: PropTypes.number,
  isLoading: PropTypes.bool
};
