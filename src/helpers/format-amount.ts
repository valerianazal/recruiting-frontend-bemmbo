/**
 * Format amount to USD with 2 decimal places
 * @param amount - The amount to format
 * @param currency - The currency (optional, default USD)
 * @returns The formatted amount as string
 */
export const formatAmount = (amount: number, currency: string): string => {
  const [integerPart, decimalPart] = amount.toString().split('.');
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  if (currency === 'USD' && !decimalPart) {
    return `${formattedInteger},00`;
  }
  
  if (decimalPart) {
    return `${formattedInteger},${decimalPart}`;
  }
  
  return formattedInteger;
};
