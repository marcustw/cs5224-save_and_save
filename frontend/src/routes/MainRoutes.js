import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

import routes from 'routes/routeObject';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));
const Analyticpage = Loadable(lazy(() => import('views/analytic')));
const InventoryManagementPage = Loadable(lazy(() => import('views/store/inventoryManagement')));
const SearchPage = Loadable(lazy(() => import('views/user/search')));
const AccountPage = Loadable(lazy(() => import('views/user/account')));
const CartPage = Loadable(lazy(() => import('views/user/cart')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: routes.dashboard.url,
      element: <DashboardDefault />
    },
    {
      path: routes.search.url,
      element: <SearchPage />
    },
    {
      path: routes.inventory.url,
      element: <InventoryManagementPage />
    },
    {
      path: routes.account.url,
      element: <AccountPage />
    },
    {
      path: routes.analytic.url,
      element: <Analyticpage />
    },
    {
      path: routes.cart.url,
      element: <CartPage />
    }
    // {
    //     path: '/utils/util-typography',
    //     element: <UtilsTypography />
    // },
    // {
    //     path: '/utils/util-color',
    //     element: <UtilsColor />
    // },
    // {
    //     path: '/utils/util-shadow',
    //     element: <UtilsShadow />
    // },
    // {
    //     path: '/icons/tabler-icons',
    //     element: <UtilsTablerIcons />
    // },
    // {
    //     path: '/icons/material-icons',
    //     element: <UtilsMaterialIcons />
    // }
  ]
};

export default MainRoutes;
