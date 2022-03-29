import { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Grid, Box, Tabs, Typography } from '@mui/material';

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
import { useOrderStore } from 'hooks/useOrderStore';
import { UserContext } from 'Contexts/UserContext';
import { getOrdersByBuyer, getOrdersByStore } from 'axios/orderApi';

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
  const { user } = useContext(UserContext);
  const [isLoading, setLoading] = useState(true);
  const [selectedTab, setTab] = useState(0);
  const {
    loadRows: loadOrdersForSeller,
    updateOrderStatus: updateOrderStatusToCollect,
    orderListRef: sellerOrderListRef
  } = useOrderStore({
    fetchOrders: getOrdersByStore,
    userid: user.username,
    isSeller: true
  });

  const {
    loadRows: loadOrdersForBuyer,
    updateOrderStatus: updateOrderStatus,
    orderListRef: buyerOrderListRef
  } = useOrderStore({
    fetchOrders: getOrdersByBuyer,
    userid: user.username,
    isSeller: false
  });

  const handleOnConfirm = (data) => {
    // TODO update item status
    let updateFunction = data.type === ItemActionTypes.RECEIVED ? updateOrderStatus : updateOrderStatusToCollect;
    updateFunction({ orderId: data.item.orderId, storeId: data.item.storeId }, data.index);
  };
  const { dialogInfo, openDialog, closeDialog } = useDialogStore({
    onConfirm: handleOnConfirm
  });

  useEffect(() => {
    const loadData = async () => {
      const promises = [];
      promises.push(loadOrdersForSeller());
      promises.push(loadOrdersForBuyer());
      await Promise.all(promises);
      setLoading(false);
    };
    loadData();
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
            <Tab label="To Collect" notifyValue={buyerOrderListRef.current.length} />
            <Tab label="Pending For Collect" notifyValue={sellerOrderListRef.current.length} />
          </Tabs>
        </Box>
        <TabPanel value={selectedTab} index={0}>
          {buyerOrderListRef.current.length > 0 ? (
            <Table
              onRowClick={({ rowData, index }) => {
                openDialog({
                  extraData: {
                    index,
                    item: rowData,
                    type: ItemActionTypes.RECEIVED
                  },
                  title: 'Receive Confirmation',
                  description: `Are you confirmed that all items in INV${rowData.orderId} \n ===== Items ===== \n${stringifyPurchaseOrder(
                    rowData.products
                  )} \n =============== \n are received?`
                });
              }}
              columns={TABLE_COLUMNS.TO_COLLECT}
              rows={buyerOrderListRef.current}
            />
          ) : (
            <Typography variant="h5" sx={{ m: 4, textAlign: 'center' }}>
              No item pending for collection
            </Typography>
          )}
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          {sellerOrderListRef.current.length > 0 ? (
            <Table
              columns={TABLE_COLUMNS.PREPARE}
              rows={sellerOrderListRef.current}
              onRowClick={({ rowData, index }) => {
                openDialog({
                  extraData: {
                    index,
                    item: rowData,
                    type: ItemActionTypes.DELIVERED
                  },
                  title: 'Preparation Confirmation',
                  description: `Is the order all items in INV${rowData.orderId} \n ===== Items ===== \n${stringifyPurchaseOrder(
                    rowData.products
                  )} \n =============== \n ready to be collected?`
                });
              }}
            />
          ) : (
            <Typography variant="h5" sx={{ m: 4, textAlign: 'center' }}>
              No item pending for preparation
            </Typography>
          )}
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
