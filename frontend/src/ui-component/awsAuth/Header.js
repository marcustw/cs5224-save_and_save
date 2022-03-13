import { useTheme } from '@aws-amplify/ui-react';
import { Typography } from '@mui/material';

export function Header() {
  const { tokens } = useTheme();

  return (
    <div style={{ padding: tokens.space.medium }}>
      <Typography variant="h3" textAlign="center" color="#e3f2fd">{`Save & Save`}</Typography>
    </div>
  );
}
