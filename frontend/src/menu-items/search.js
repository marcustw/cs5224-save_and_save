// assets
import { IconSearch } from '@tabler/icons';
import routes from 'routes/routeObject';

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const inventory = {
  id: routes.search.id,
  title: 'Product Searching',
  type: 'item',
  url: routes.search.url,
  icon: IconSearch,
  breadcrumbs: false
};

export default inventory;
