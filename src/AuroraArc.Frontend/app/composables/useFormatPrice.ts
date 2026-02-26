export function useFormatPrice() {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  function formatPrice(price: number): string {
    return formatter.format(price)
  }

  return { formatPrice }
}
