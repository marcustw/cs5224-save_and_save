export const TABLE_COLUMNS = {
  PREPARE: [
    {
      width: 500,
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
      width: 300,
      label: 'Receipt No.',
      dataKey: 'orderId',
      prefix: 'INV '
    },
    {
      width: 400,
      label: 'Store',
      dataKey: 'storeId'
    },
    {
      width: 200,
      label: 'Amount',
      dataKey: 'total_cost',
      prefix: 'SGD ',
      numeric: true
    }
  ]
};
