import { green, brown, blue, blueGrey, purple, pink, indigo, teal } from '@mui/material/colors';

export const ItemActionTypes = {
  DELETE: 'delete',
  UNLIST: 'unlist',
  LIST: 'list',
  EDIT: 'edit',
  RECEIVED: 'received',
  DELIVERED: 'delivered'
};

export const ItemStatus = {
  EXPIRING: 'Expiring',
  ON_SALE: 'On-Sale',
  UNLISTED: 'Unlisted'
};

export const ItemCondition = {
  EXPIRING: 'EXPIRING SOON',
  SEASONAL: 'SEASONAL OFFER',
  DISCOUNT: 'NORMAL DISCOUNT'
};

export const ItemCategory = {
  INGREDIENT: 'Noodles & Cooking Ingredients',
  FOOD_CUPBOARD: 'Food Cupboard',
  CHILLED_EGGS: 'Chilled & Eggs',
  MEAT_SEAFOOD: 'Meat & Seafood',
  FROZEN: 'Frozen',
  FRUIT_VEG: 'Fruit & Vegetables',
  ALCOHOL: 'Wine & Spirits',
  DRINKS: 'Drinks'
};

export const ItemCategoryColor = {
  [ItemCategory.INGREDIENT]: brown[300],
  [ItemCategory.FOOD_CUPBOARD]: blue[500],
  [ItemCategory.CHILLED_EGGS]: pink[300],
  [ItemCategory.MEAT_SEAFOOD]: purple[300],
  [ItemCategory.FROZEN]: blueGrey[400],
  [ItemCategory.FRUIT_VEG]: green[600],
  [ItemCategory.ALCOHOL]: indigo[300],
  [ItemCategory.DRINKS]: teal[300]
};
