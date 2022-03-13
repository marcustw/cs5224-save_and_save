import { Flex, useTheme } from '@aws-amplify/ui-react';
import { Typography } from '@mui/material';

export function Footer() {
  const { tokens } = useTheme();

  return (
    <Flex justifyContent="center" padding={tokens.space.medium}>
      <Typography color="#e3f2fd">&copy; All Rights Reserved</Typography>
    </Flex>
  );
}
