import { Stack, Typography, Select, MenuItem } from '@mui/material';
import React from 'react';
import PopularProductSection from './PopularProductSection';
import PopularTimingSection from './PopularTimingSection';

const AnalysisOptions = [
  {
    value: 'time',
    label: 'Popular Timing'
  },
  {
    value: 'product',
    label: 'Popular Product'
  }
];

const AnalyticPage = () => {
  const [type, setType] = React.useState(AnalysisOptions[0].value);

  return (
    <Stack>
      <Typography variant="h3" sx={{ mb: 2 }}>
        Analysis Type
      </Typography>
      <Select
        name="Analysis-select"
        autoWidth={false}
        label="Type Of Analysis"
        id="analysis-select"
        value={type}
        onChange={(event) => {
          const newValue = event.target.value;
          if (newValue !== type) {
            setType(newValue);
          }
        }}
      >
        {AnalysisOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      <Typography variant="h3" sx={{ my: 2 }}>
        Analysis Report
      </Typography>
      {type === 'product' ? <PopularProductSection /> : <PopularTimingSection />}
    </Stack>
  );
};

export default AnalyticPage;
