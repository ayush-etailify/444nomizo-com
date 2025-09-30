export function calculateDiscountPercentage(
  retailPrice: string,
  sellingPrice: string
): number {
  const retail = parseFloat(retailPrice);
  const selling = parseFloat(sellingPrice);

  if (isNaN(retail) || isNaN(selling) || retail <= 0) {
    throw new Error(
      "Invalid input: retailPrice must be greater than 0 and both must be valid numbers."
    );
  }

  const discount = ((retail - selling) / retail) * 100;

  return Math.floor(discount);
}
