// assets
import { IconDashboard } from '@tabler/icons';
import routes from 'routes/routeObject';

// constant
const icons = { IconDashboard };

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
