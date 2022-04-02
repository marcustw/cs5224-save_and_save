import PropTypes from 'prop-types';
import { useEffect } from 'react';

import { CircularProgress, Grid, Paper, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

const lineOptions = {
  chart: {
    height: 400,
    type: 'line',
    id: 'popular-timing'
  },
  stroke: {
    curve: 'stepline'
  },
  dataLabels: {
    enabled: true
  },
  grid: {
    padding: {
      right: 30,
      left: 20
    }
  },
  markers: {
    hover: {
      sizeOffset: 4
    }
  },
  title: {
    text: 'Popular Order Timing',
    align: 'center'
  },
  xaxis: {
    categories: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00']
  }
};

const chartData = {
  height: 300,
  type: 'line',
  options: {
    ...lineOptions
  },
  series: []
};

const PopularTimeChart = ({ isLoading, data, subTitle, noSelection }) => {
  useEffect(() => {
    if (data.length === 0) return;
    const timeCount = data.map((d) => {
      const timeRange = d[0].split(':');
      const startTime = Number(timeRange[0]);
      return {
        time: startTime,
        count: d[2]
      };
    });

    let i = 0;
    let time = 0;
    let seriesData = [];
    while (i < timeCount.length) {
      if (time < timeCount[i].time) {
        seriesData.push(0);
        time += 2;
      } else if (time === timeCount[i].time) {
        seriesData.push(timeCount[i].count);
        time += 2;
      } else {
        i++;
      }
    }
    seriesData.push(0);

    const options = {
      ...lineOptions,
      series: [
        {
          data: seriesData
        }
      ],
      dataLabels: {
        enabled: false
      },
      // xaxis: {
      //   categories: seriesLabel
      // },
      subtitle: {
        text: subTitle,
        align: 'center'
      }
    };

    // do not load chart when loading
    if (!isLoading) {
      ApexCharts.exec(`popular-timing`, 'updateOptions', options);
    }
  }, [isLoading, data, subTitle]);

  const renderContent = () => {
    if (isLoading) {
      return <CircularProgress />;
    }

    if (noSelection) {
      return <Typography>No date range is selected</Typography>;
    }

    if (data.length < 1) {
      return <Typography>No popular timing analysis yet for selected date range</Typography>;
    }

    return (
      <Paper sx={{ p: 2 }}>
        <Grid item xs={12}>
          <Chart {...chartData} />
        </Grid>
      </Paper>
    );
  };

  return renderContent();
};

PopularTimeChart.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  subTitle: PropTypes.string,
  noSelection: PropTypes.bool
};

export default PopularTimeChart;
