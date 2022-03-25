import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Grid, Box, Tabs } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import Table from './Components/Table';
import { Tab } from './Components/Tab';
import { TABLE_COLUMNS } from './constants';

import { collectRows, forCollectRows, mockReceipt } from './mocks';
import { useDialogStore } from 'hooks/useDialogStore';
import { ActionConfirmationDialog } from 'ui-component/ActionConfirmationDialog';
import { ItemActionTypes } from 'constants/item';
import { stringifyPurchaseOrder } from './utils/common';
import { ListingInfo } from './Components/ListingInfo';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  value: PropTypes.any,
  index: PropTypes.number,
  children: PropTypes.any
};

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
      <ListingInfo isLoadng={isLoading} onSaleCount={213} expiringCount={10} unlistedCount={20} />
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
