export const TABLE_COLUMNS = {
  PREPARE: [
    {
      width: 200,
      label: 'Status',
      dataKey: 'status'
    },
    {
      width: 300,
      label: 'Receipt No.',
      dataKey: 'orderId',
      prefix: 'INV '
    },
    {
      width: 400,
      label: 'Amount',
      dataKey: 'total_cost',
      prefix: 'SGD ',
      numeric: true
    }
  ],
  TO_COLLECT: [
    {
      width: 200,
      label: 'Status',
      dataKey: 'status'
    },
    {
      width: 200,
      label: 'Receipt No.',
      dataKey: 'orderId',
      prefix: 'INV '
    },
    {
      width: 350,
      label: 'Store',
      dataKey: 'storeId'
    },
    {
      width: 150,
      label: 'Amount',
      dataKey: 'total_cost',
      prefix: 'SGD ',
      numeric: true
    }
  ]
};
