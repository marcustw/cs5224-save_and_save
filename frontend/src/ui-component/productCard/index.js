import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { Button, CardActionArea, CardActions, TextField } from '@mui/material';
import { Divider } from '@mui/material';

import ProductPlaceholder from 'assets/images/milk-bottle-icon.png';
import { ItemActionTypes, ItemStatus } from 'constants/item';

function getItemStatusColor(status) {
  switch (status) {
    case ItemStatus.EXPIRING:
      return 'warning';
    case ItemStatus.ON_SALE:
      return 'primary';
    case ItemStatus.UNLISTED:
      return 'default';
  }
  return undefined;
}

const SellerActions = ({ itemData, onSellerActionClick }) => {
  const listAction = itemData.itemStatus === ItemStatus.UNLISTED ? ItemActionTypes.LIST : ItemActionTypes.UNLIST;
  return (
    <>
      <Divider orientation="vertical" sx={{ marginLeft: '16px', height: '120px' }} />
      <CardActions sx={{ flexDirection: 'column', display: 'flex', justifyContent: 'space-between', padding: '0px 4px' }}>
        <Button
          size="small"
          color="warning"
          onClick={() => {
            onSellerActionClick(ItemActionTypes.DELETE, itemData);
          }}
        >
          DELETE
        </Button>
        <Button
          size="small"
          onClick={() => {
            onSellerActionClick(ItemActionTypes.EDIT, itemData);
          }}
        >
          EDIT
        </Button>
        <Button
          size="small"
          onClick={() => {
            onSellerActionClick(listAction, itemData);
          }}
        >
          {listAction.toUpperCase()}
        </Button>
      </CardActions>
    </>
  );
};

SellerActions.propTypes = {
  itemData: PropTypes.shape({
    // refer to enum ItemStatus
    itemStatus: PropTypes.string
  }).isRequired,
  onSellerActionClick: PropTypes.func
};

const BuyerActions = ({ itemData = {}, onBuyerActionClick }) => {
  const { stockCount = 0 } = itemData;
  const [itemCount, setItemCount] = React.useState(1);
  const disabled = stockCount === 0;
  return (
    <>
      <Divider orientation="vertical" sx={{ marginLeft: '16px', height: '120px' }} />
      <CardActions sx={{ flexDirection: 'column', display: 'flex', justifyContent: 'flex-end', padding: '0px 4px' }}>
        <TextField
          name="addToCartCount"
          label="Unit"
          value={itemCount}
          disabled={disabled}
          onChange={(event) => {
            const value = event.target.value;
            if (value) {
              const numValue = Number(value);
              if (numValue > 0) {
                setItemCount(Math.min(numValue, stockCount));
              } else {
                setItemCount(1);
              }
              return;
            } else {
              setItemCount(undefined);
            }
          }}
          inputProps={{
            style: {
              textAlign: 'right',
              width: 78
            }
          }}
          type="number"
          size="small"
          variant="standard"
        />
        <Button
          size="small"
          onClick={() => {
            onBuyerActionClick(itemData, stockCount);
          }}
          disabled={disabled}
        >
          ADD TO CART
        </Button>
      </CardActions>
    </>
  );
};

BuyerActions.propTypes = {
  itemData: PropTypes.shape({
    stockCount: PropTypes.number
  }).isRequired,
  onBuyerActionClick: PropTypes.func
};

const ProductCard = React.forwardRef(({ itemData = {}, onCardClick, onSellerActionClick, onBuyerActionClick }, ref) => {
  const {
    itemStatus = ItemStatus.EXPIRING,
    storeName = 'Hello Shop',
    itemName = 'milk',
    originalPrice = 14.9,
    discountPrice = 10.9,
    description = 'A breif desscription',
    discountReason = 'Expiring',
    expiredDate = '2022-03-04',
    stockCount = 5
  } = itemData;
  const withCardAreaActions = (children) => {
    if (onSellerActionClick || !onCardClick) return children;
    return (
      <CardActionArea
        action={() => {
          onCardClick(itemData);
        }}
      >
        {children}
      </CardActionArea>
    );
  };

  return withCardAreaActions(
    <Card sx={{ display: 'flex', padding: '16px', margin: '8px 0px' }} ref={ref}>
      <Box sx={{ display: 'flex', flexDirection: 'row', flex: '1 0 auto' }}>
        <CardMedia sx={{ width: '132px', height: '132px' }} component="img" image={ProductPlaceholder} alt="product-image" />
        <CardContent sx={{ flex: '1 0 auto', padding: '0px', paddingBottom: '0px !important', marginLeft: '8px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '45px' }}>
              <div style={{ flexDirection: 'column' }}>
                <Typography component="div" variant="h3">
                  {itemName}
                </Typography>
                <Typography variant="caption">by {storeName}</Typography>
              </div>
              <Chip label={itemStatus} color={getItemStatusColor(itemStatus)} />
            </Box>
            <Typography component="div">Reason: {discountReason}</Typography>
            <br />
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: '50px' }}>
              <Typography component="div" alignSelf="flex-start">
                {description}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'right' }}>
                <div style={{ textDecoration: 'line-through', textAlign: 'right' }}>
                  <Typography color="text.secondary" variant="caption" align="right">
                    SGD {originalPrice.toFixed(2)}
                  </Typography>
                </div>
                <Typography align="right">SGD {discountPrice.toFixed(2)}</Typography>
                <Typography color="text.secondary" align="right">
                  In stock: {stockCount}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Box>
      {!!onSellerActionClick && <SellerActions onSellerActionClick={onSellerActionClick} itemData={itemData} />}
      {!!onBuyerActionClick && <BuyerActions onBuyerActionClick={onBuyerActionClick} itemData={itemData} />}
    </Card>
  );
});

ProductCard.propTypes = {
  itemData: PropTypes.shape({
    itemName: PropTypes.string,
    originalPrice: PropTypes.number,
    discountPrice: PropTypes.number,
    // refer to enum ItemCondition
    discountReason: PropTypes.string,
    stockCount: PropTypes.number,
    // yyyy-mm-dd
    expiredDate: PropTypes.string,
    description: PropTypes.string,
    stockCount: PropTypes.nunber,
    // refer to enum ItemStatus
    itemStatus: PropTypes.string,
    storeName: PropTypes.string
  }).isRequired,
  onCardClick: PropTypes.func,
  onSellerActionClick: PropTypes.func,
  onBuyerActionClick: PropTypes.func
};

export default ProductCard;
