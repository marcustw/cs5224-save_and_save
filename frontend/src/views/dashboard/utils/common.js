export function stringifyPurchaseOrder(purchaseOrder) {
  return purchaseOrder
    .map((r, index) => {
      return `(${index + 1}) ${r.product_name} x ${r.quantity}`;
    })
    .join('\n');
}
