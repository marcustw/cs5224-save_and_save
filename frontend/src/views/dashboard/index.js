import { useEffect, useState } from 'react';

// material-ui
import { Grid, Box, Tabs } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import SimpleCard from 'ui-component/statistics/SimpleCard';
import Table from './Components/Table';
import { Tab } from './Components/Tab';
import { TABLE_COLUMNS } from './constants';

import { collectRows, forCollectRows } from './mocks';
import { useDialogStore } from 'hooks/useDialogStore';
import { ActionConfirmationDialog } from 'ui-component/ActionConfirmationDialog';
import { ItemActionTypes } from 'constants/item';
import { stringifyPurchaseOrder } from './utils/common';

const mockReceipt = [
  {
    itemName: 'Milk',
    purchase: 2
  },
  {
    itemName: 'bread',
    purchase: 2
  },
  {
    itemName: 'canned drink',
    purchase: 3
  },
  {
    itemName: 'canned drink',
    purchase: 3
  },
  {
    itemName: 'canned drink',
    purchase: 3
  },
  {
    itemName: 'canned drink',
    purchase: 3
  },
  {
    itemName: 'bread',
    purchase: 2
  },
  {
    itemName: 'canned drink',
    purchase: 3
  },
  {
    itemName: 'canned drink',
    purchase: 3
  },
  {
    itemName: 'canned drink',
    purchase: 3
  },
  {
    itemName: 'canned drink',
    purchase: 3
  },
  {
    itemName: 'canned drink',
    purchase: 3
  },
  {
    itemName: 'canned drink',
    purchase: 3
  },
  {
    itemName: 'canned drink',
    purchase: 3
  },
  {
    itemName: 'bread',
    purchase: 2
  },
  {
    itemName: 'canned drink',
    purchase: 3
  },
  {
    itemName: 'canned drink',
    purchase: 3
  },
  {
    itemName: 'canned drink',
    purchase: 3
  }
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}

const DashboardPage = () => {
  const [isLoading, setLoading] = useState(true);
  const [selectedTab, setTab] = useState(0);
  const handleOnConfirm = () => {
    // TODO update item status
  };
  const { dialogInfo, openDialog, closeDialog } = useDialogStore({
    onConfirm: handleOnConfirm
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={4} xs={12} md={4} lg={4}>
                <SimpleCard isLoading={isLoading} title={203} subTitle="On Sale Listings" />
              </Grid>
              <Grid item sm={4} xs={12} md={4} lg={4}>
                <SimpleCard isLoading={isLoading} title={203} subTitle="Expiring Listings" />
              </Grid>
              <Grid item sm={4} xs={12} md={4} lg={4}>
                <SimpleCard isLoading={isLoading} title={203} subTitle="Expired Listings" />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid xs={12} item>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedTab}
            onChange={(_event, value) => {
              setTab(value);
            }}
            aria-label="dashboard-tabs"
          >
            <Tab label="To Collect" notifyValue={1} />
            <Tab label="Pending For Collect" notifyValue={2} />
          </Tabs>
        </Box>
        <TabPanel value={selectedTab} index={0}>
          <Table
            onRowClick={({ rowData }) => {
              openDialog({
                extraData: {
                  item: rowData,
                  type: ItemActionTypes.RECEIVED
                },
                title: 'Receive Confirmation',
                description: `Are you confirmed that all items in ${rowData.receipt_id} \n ======= \n${stringifyPurchaseOrder(
                  mockReceipt
                )} \n ====== \n are received?`
              });
            }}
            columns={TABLE_COLUMNS.TO_COLLECT}
            rows={collectRows}
          />
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <Table
            columns={TABLE_COLUMNS.FOR_COLLECT}
            rows={forCollectRows}
            onRowClick={({ rowData }) => {
              openDialog({
                extraData: {
                  item: rowData,
                  type: ItemActionTypes.DELIVERED
                },
                title: 'Preparation Confirmation',
                description: `Is the order all items in ${rowData.receipt_id} \n ======= \n${stringifyPurchaseOrder(
                  mockReceipt
                )} \n ====== \n ready to be collected?`
              });
            }}
          />
        </TabPanel>
      </Grid>
      <ActionConfirmationDialog
        open={dialogInfo.open}
        handleClose={closeDialog}
        title={dialogInfo.title}
        description={dialogInfo.description}
        data={dialogInfo.extraData}
        cancelText="Cancel"
        confirmText="OK"
      />
    </Grid>
  );
};

export default DashboardPage;
