import { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, InputAdornment, OutlinedInput } from '@mui/material';

import { shouldForwardProp } from '@mui/system';
import { IconSearch, IconX } from '@tabler/icons';

const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
  width: '100%',
  marginLeft: 16,
  paddingLeft: 16,
  paddingRight: 16,
  margin: '8px 4px',
  '& input': {
    background: 'transparent !important',
    paddingLeft: '4px !important'
  },
  [theme.breakpoints.down('lg')]: {},
  [theme.breakpoints.down('md')]: {
    background: '#fff'
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.secondary.dark
  }
}));

const HeaderAvatarStyle = styled(Avatar, { shouldForwardProp })(({ theme }) => ({
  ...theme.typography.commonAvatar,
  ...theme.typography.mediumAvatar,
  background: theme.palette.secondary.light,
  color: theme.palette.secondary.dark,
  '&:hover': {
    background: theme.palette.secondary.dark,
    color: theme.palette.secondary.light
  }
}));

// ==============================|| SEARCH INPUT ||============================== //

const SearchSection = ({ handleOnSearch = () => {} }) => {
  const theme = useTheme();
  const [value, setValue] = useState('');

  const handleOnEnter = (keyboardEvent) => {
    if (keyboardEvent.key === 'Enter') {
      handleOnSearch(value);
    }
  };

  return (
    <>
      <Box sx={{ display: { xs: 'block' } }}>
        <OutlineInputStyle
          onKeyPress={(e) => {
            handleOnEnter(e);
          }}
          id="input-search-header"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search"
          endAdornment={
            value && (
              <InputAdornment position="end">
                <Box sx={{ ml: 2 }}>
                  <ButtonBase
                    sx={{ borderRadius: '12px' }}
                    onClick={() => {
                      setValue('');
                    }}
                  >
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        marginRight: 1,
                        background: theme.palette.orange.light,
                        color: theme.palette.orange.dark,
                        '&:hover': {
                          background: theme.palette.orange.dark,
                          color: theme.palette.orange.light
                        }
                      }}
                    >
                      <IconX stroke={1.5} size="1.3rem" />
                    </Avatar>
                  </ButtonBase>
                </Box>
                <ButtonBase sx={{ borderRadius: '12px' }} onClick={() => handleOnSearch(value)}>
                  <HeaderAvatarStyle variant="rounded">
                    <IconSearch stroke={1.5} size="1.3rem" />
                  </HeaderAvatarStyle>
                </ButtonBase>
              </InputAdornment>
            )
          }
          aria-describedby="search-helper-text"
          inputProps={{ 'aria-label': 'weight' }}
        />
      </Box>
    </>
  );
};

export default SearchSection;

SearchSection.propTypes = {
  handleOnSearch: PropTypes.func.required
};
