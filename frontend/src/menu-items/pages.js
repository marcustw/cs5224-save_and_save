// assets
import { IconKey } from '@tabler/icons';

import routes from 'routes/routeObject';

// constant
const icons = {
  IconKey
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: 'Pages',
  caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Authentication',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: routes.login.id,
          title: 'Login',
          type: 'item',
          url: routes.login.url,
          target: true
        },
        {
          id: routes.register.id,
          title: 'Register',
          type: 'item',
          url: routes.register.url,
          target: true
        }
      ]
    }
  ]
};

export default pages;
