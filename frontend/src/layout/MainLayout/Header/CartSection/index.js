import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAtomValue } from 'jotai';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Badge } from '@mui/material';

// assets
import { IconShoppingCart } from '@tabler/icons';
import config from 'config';
import { MENU_OPEN } from 'store/actions';
import routes from 'routes/routeObject';
import { cartCountAtom } from 'atoms/cart';

const CartSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onClick = () => {
    navigate(config.basename + routes.cart.url);
    dispatch({ type: MENU_OPEN, id: routes.cart.id });
  };

  const count = useAtomValue(cartCountAtom);

  return (
    <>
      <Box
        sx={{
          mr: 3,
          [theme.breakpoints.down('md')]: {
            mr: 2
          }
        }}
      >
        <Badge badgeContent={count > 99 ? '99+' : count} color="primary">
          <ButtonBase sx={{ borderRadius: '12px' }}>
            <Avatar
              variant="rounded"
              sx={{
                ...theme.typography.commonAvatar,
                ...theme.typography.mediumAvatar,
                transition: 'all .2s ease-in-out',
                background: theme.palette.secondary.light,
                color: theme.palette.secondary.dark,
                '&[aria-controls="menu-list-grow"],&:hover': {
                  background: theme.palette.secondary.dark,
                  color: theme.palette.secondary.light
                }
              }}
              aria-haspopup="true"
              onClick={onClick}
              color="inherit"
            >
              <IconShoppingCart stroke={1.5} size="1.3rem" />
            </Avatar>
          </ButtonBase>
        </Badge>
      </Box>
    </>
  );
};

export default CartSection;
