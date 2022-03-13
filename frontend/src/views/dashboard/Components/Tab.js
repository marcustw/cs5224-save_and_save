import { Tab as MuiTab, Typography } from '@mui/material';

const TabNotify = ({ value, title }) => {
  return (
    <div style={{ flexDirection: 'row' }}>
      <Typography variant="h4" display="inline">
        {title}
      </Typography>
      <Typography ml={2} variant="caption" display="inline">
        ({value} items)
      </Typography>
    </div>
  );
};

export const Tab = ({ label, notifyValue, ...rest }) => {
  const node = <TabNotify value={notifyValue} title={label} />;
  return <MuiTab label={node} {...rest} />;
};

Tab.muiName = 'Tab';
