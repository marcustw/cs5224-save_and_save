import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import routes from 'routes/routeObject';
import config from 'config';
import { MENU_OPEN } from 'store/actions';

const FallbackRedirect = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  navigate(config.basename + routes.dashboard.url);
  dispatch({ type: MENU_OPEN, id: routes.dashboard.id });

  return null;
};

export default FallbackRedirect;
