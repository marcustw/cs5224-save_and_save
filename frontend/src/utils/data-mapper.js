export function mapItemResponseToUIData(item) {
  // item data struct
  return {
    id: item.id,
    storeId: item.store_id,
    itemName: item.name,
    stockCount: item.quantity,
    discountPrice: item.discounted_price,
    originalPrice: item.actual_price,
    discountReason: item.discounted_reason?.trim(),
    expiredDate: new Date(item.available_date * 1000),
    image: item.image_link,
    category: item.category
  };
}

export function mapItemUIToRequestData(item) {
  return {
    id: item.id,
    store_id: item.storeId,
    name: item.itemName,
    quantity: item.stockCount,
    discounted_price: item.discountPrice,
    actual_price: item.originalPrice,
    discounted_reason: item.discountReason,
    available_date: item.expiredDate.getTime() / 1000,
    image_link: item.image,
    category: item.category
  };
}
