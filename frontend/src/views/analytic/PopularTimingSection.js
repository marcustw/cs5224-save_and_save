import { LocalizationProvider, DateRangePicker } from '@mui/lab';
import { Stack, TextField, Box } from '@mui/material';
import React from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { getPopularProducts } from 'axios/productApi';
import { UserContext } from 'Contexts/UserContext';
import { format } from 'date-fns';
import PopularTimeChart from './Components/PopularTimeChart';

const PopularTimingSection = () => {
  const { user } = React.useContext(UserContext);
  const [value, setValue] = React.useState([null, null]);

  const [data, setData] = React.useState([]);
  const [isLoading, setLoading] = React.useState(false);

  const noSelection = !value[0] || !value[1];
  const dateString = !noSelection ? `From ${format(value[0], 'yyyy/MM/dd')} to ${format(value[1], 'yyyy/MM/dd')}` : '';

  React.useEffect(() => {
    if (!value[0] || !value[1]) {
      return;
    }
    setLoading(true);
    const loadData = async () => {
      const response = await getPopularProducts({
        userId: user.username,
        start_date: value[0].getTime() / 1000,
        end_date: value[1].getTime() / 1000 + 86400,
        type: 'time'
      });

      if (response.status === 200) {
        setData(response.data.products);
      }
      setLoading(false);
    };
    loadData();
  }, [value]);

  return (
    <Stack>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateRangePicker
          disableFuture={true}
          disabled={isLoading}
          startText="Start Date"
          endText="End Date"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(startProps, endProps) => (
            <>
              <TextField {...startProps} />
              <Box sx={{ mx: 2 }}> to </Box>
              <TextField {...endProps} />
            </>
          )}
        />
      </LocalizationProvider>
      <Box sx={{ my: 2 }}>
        <PopularTimeChart isLoading={isLoading} data={data} subTitle={dateString} noSelection={noSelection} />
      </Box>
    </Stack>
  );
};

export default PopularTimingSection;
