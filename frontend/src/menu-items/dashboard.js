// assets
import { IconDashboard } from '@tabler/icons';
import routes from 'routes/routeObject';

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: routes.dashboard.id,
  title: 'Dashboard',
  type: 'item',
  url: routes.dashboard.url,
  icon: IconDashboard,
  breadcrumbs: false
};

export default dashboard;
