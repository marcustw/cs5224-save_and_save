export function mapItemResponseToUIData(item) {
  return {
    id: item.id,
    storeId: item.store_id,
    itemName: item.name,
    stockCount: item.quantity,
    discountPrice: item.discounted_price,
    originalPrice: item.actual_price,
    discountReason: item.discounted_reason,
    expiredDate: item.available_date,
    image: item.image_link,
    category: item.category
  };
}

export function mapItemUIToRequestData(item) {
  return {
    id: item.id,
    name: item.itemName,
    remaining_stock: item.stockCount,
    new_unit_price: item.discountPrice,
    actual_price: item.originalPrice,
    reason_discount: item.discountReason,
    available_till: item.expiredDate,
    image_url: item.image
  };
}
