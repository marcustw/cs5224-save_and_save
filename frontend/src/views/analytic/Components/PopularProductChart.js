import PropTypes from 'prop-types';
import { useEffect } from 'react';

import { CircularProgress, Grid, Paper, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

const barOptions = {
  chart: {
    id: 'popular-product',
    type: 'bar'
  },
  plotOptions: {
    bar: {
      barHeight: '100%',
      distributed: true,
      horizontal: true,
      dataLabels: {
        position: 'bottom'
      }
    }
  },
  colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e', '#f48024', '#69d2e7'],
  stroke: {
    width: 1,
    colors: ['#fff']
  },
  yaxis: {
    labels: {
      show: false
    }
  },
  xaxis: {
    categories: ['dummy']
  },
  tooltip: {
    theme: 'dark',
    x: {
      show: false
    },
    y: {
      title: {
        formatter: function () {
          return '';
        }
      }
    }
  }
};

const chartData = {
  height: 300,
  type: 'bar',
  options: {
    ...barOptions
  },
  series: []
};

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const PopularProductChart = ({ isLoading, data, subTitle, noSelection }) => {
  useEffect(() => {
    if (data.length === 0) return;
    const displayData = data.slice(0, 10);
    const seriesData = displayData.map((item) => item[1]);
    const seriesLabel = displayData.map((item) => item[0]);
    const minHeight = displayData.length <= 1 ? 100 : 0;

    const options = {
      ...barOptions,
      chart: {
        id: 'bar-chart',
        type: 'bar',
        height: displayData.length * 60 + minHeight
      },
      series: [
        {
          data: seriesData
        }
      ],
      dataLabels: {
        enabled: true,
        textAnchor: 'start',
        style: {
          colors: ['#fff']
        },
        formatter: function (val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val;
        },
        offsetX: 0,
        dropShadow: {
          enabled: true
        }
      },
      xaxis: {
        categories: seriesLabel
      },
      title: {
        text: `Top ${Math.min(data.length, 10)} products`,
        align: 'center',
        floating: true
      },
      subtitle: {
        text: subTitle,
        align: 'center'
      }
    };

    // do not load chart when loading
    if (!isLoading) {
      ApexCharts.exec(`popular-product`, 'updateOptions', options);
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
      return <Typography>No popular products analysis yet for selected date range</Typography>;
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

PopularProductChart.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  subTitle: PropTypes.string,
  noSelection: PropTypes.bool
};

export default PopularProductChart;
