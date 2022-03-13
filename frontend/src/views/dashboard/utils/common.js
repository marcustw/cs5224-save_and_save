export function stringifyPurchaseOrder(purchaseOrder) {
  return purchaseOrder
    .map((r, index) => {
      return `(${index}) ${r.itemName} x ${r.purchase}`;
    })
    .join('\n');
}
