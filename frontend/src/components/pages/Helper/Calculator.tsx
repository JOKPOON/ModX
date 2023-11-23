//For formatting price with comma
export const formatPrice = (price: number) => {
  const priceString = price.toString();
  const formatPriced = priceString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return formatPriced;
};
