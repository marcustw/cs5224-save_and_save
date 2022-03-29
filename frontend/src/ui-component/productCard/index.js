import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  CardActionArea,
  CardActions,
  TextField,
  Box,
  Stack,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Divider
} from '@mui/material';

import ProductPlaceholder from 'assets/images/milk-bottle-icon.png';
import { ItemActionTypes, ItemCategoryColor, ItemStatus } from 'constants/item';

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
      <CardActions sx={{ flexDirection: 'column', display: 'flex', justifyContent: 'space-around', padding: '0px 4px', width: 100 }}>
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
        {/* <Button
          size="small"
          onClick={() => {
            onSellerActionClick(listAction, itemData);
          }}
        >
          {listAction.toUpperCase()}
        </Button> */}
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
      <CardActions sx={{ flexDirection: 'column', display: 'flex', justifyContent: 'flex-end', padding: '0px 4px', width: 100 }}>
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
            onBuyerActionClick(itemData, itemCount);
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
    // itemStatus = ItemStatus.EXPIRING,
    storeId,
    itemName = 'milk',
    originalPrice = 14.9,
    discountPrice = 10.9,
    category: _category = 'Drinks',
    discountReason = 'Expiring',
    expiredDate,
    stockCount = 5,
    image
  } = itemData;
  const category = _category.trim();
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
    <Card sx={{ display: 'flex', padding: '16px', margin: '8px 0px', height: 164 }} ref={ref}>
      <Box sx={{ display: 'flex', flexDirection: 'row', flex: '1 0 auto' }}>
        <CardMedia sx={{ width: '132px', height: '132px' }} component="img" image={image || ProductPlaceholder} alt="product-image" />
        <CardContent sx={{ flex: '1 0 auto', padding: '0px', paddingBottom: '0px !important', marginLeft: '8px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <div style={{ flexDirection: 'column', maxWidth: 'calc(100% - 120px)' }}>
                <Typography component="div" variant="h3">
                  {itemName}
                </Typography>
                <Typography variant="caption">by {storeId}</Typography>
                <Box>
                  <Chip size="small" label={category} style={{ backgroundColor: ItemCategoryColor[category] }} color="primary" />
                </Box>
              </div>
              {/* <Chip label={itemStatus} color={getItemStatusColor(itemStatus)} /> */}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <Stack>
                <Typography component="div">{discountReason}</Typography>
                <Typography>
                  {expiredDate?.getFullYear
                    ? `Available till: ${expiredDate.getFullYear()}-${expiredDate.getMonth() + 1}-${expiredDate.getDate()}`
                    : ''}
                </Typography>
              </Stack>
              <Stack justifyContent="flex-end" alignItems="right">
                <div style={{ textDecoration: 'line-through', textAlign: 'right' }}>
                  <Typography color="text.secondary" variant="caption" align="right">
                    SGD {originalPrice.toFixed(2)}
                  </Typography>
                </div>
                <Typography align="right">SGD {discountPrice.toFixed(2)}</Typography>
                <Typography color="text.secondary" align="right">
                  In stock: {stockCount}
                </Typography>
              </Stack>
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
    // date object
    expiredDate: PropTypes.any,
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
