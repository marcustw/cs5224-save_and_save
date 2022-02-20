// assets
import { IconBuildingStore } from '@tabler/icons';
import routes from 'routes/routeObject';

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const inventory = {
  id: routes.inventory.id,
  title: 'Inventory Management',
  type: 'item',
  url: routes.inventory.url,
  icon: IconBuildingStore,
  breadcrumbs: false
};

export default inventory;
