export function mapItemResponseToUIData(item) {
  return {
    id: item.product_id,
    itemName: item.name,
    stockCount: item.remaining_stock,
    discountPrice: item.new_unit_price,
    originalPrice: item.actual_price,
    discountReason: item.reason_discount,
    expiredDate: item.available_till,
    image: item.image_url
  };
}

export function mapItemUIToRequestData(item) {
  return {
    product_id: item.id,
    name: item.itemName,
    remaining_stock: item.stockCount,
    new_unit_price: item.discountPrice,
    actual_price: item.originalPrice,
    reason_discount: item.discountReason,
    available_till: item.expiredDate,
    image_url: item.image
  };
}
