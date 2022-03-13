// assets
import { IconReportAnalytics } from '@tabler/icons';
import routes from 'routes/routeObject';

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const analytic = {
  id: routes.analytic.id,
  title: 'Analysis Report',
  type: 'item',
  url: routes.analytic.url,
  icon: IconReportAnalytics,
  breadcrumbs: false
};

export default analytic;
