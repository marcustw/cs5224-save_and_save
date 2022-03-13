const sample = [
  ['INV12345', '2022-02-03', '7-11 Jurong East Branch', 'SGD 14.90'],
  ['INV22315', '2022-02-04', 'Fair Price', 'SGD 14.90'],
  ['INV248593', '2022-02-03', 'Mart', 'SGD 14.90'],
  ['INV223123', '2022-02-03', '7-11 Jurong East Branch', 'SGD 14.90'],
  ['INV258902', '2022-02-03', 'Sheng Shiong', 'SGD 14.90']
];

function createCollectData(id, receipt_id, collection_date, store, amount) {
  return { id, receipt_id, collection_date, store, amount };
}

export const collectRows = [];

for (let i = 0; i < 200; i += 1) {
  const randomSelection = sample[Math.floor(Math.random() * sample.length)];
  collectRows.push(createCollectData(i, ...randomSelection));
}

const forSample = [
  ['INV12345', '2022-02-03', 'John', 'SGD 14.90'],
  ['INV22315', '2022-02-04', 'Mark', 'SGD 14.90'],
  ['INV248593', '2022-02-03', 'Benedict', 'SGD 14.90'],
  ['INV223123', '2022-02-03', 'Omg', 'SGD 14.90'],
  ['INV258902', '2022-02-03', 'Shiro', 'SGD 14.90']
];
function createForCollectData(id, receipt_id, collection_date, recipient, amount) {
  return { id, receipt_id, collection_date, recipient, amount };
}

export const forCollectRows = [];

for (let i = 0; i < 200; i += 1) {
  const randomSelection = forSample[Math.floor(Math.random() * sample.length)];
  forCollectRows.push(createForCollectData(i, ...randomSelection));
}
