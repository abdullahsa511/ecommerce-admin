/**
 * Formats a numeric amount as a currency string
 * @param amount - The amount to format (string or number)
 * @param currencyCode - The ISO 4217 currency code (default: 'USD')
 * @returns A formatted currency string, or an empty string if amount is invalid
 */
export declare function formatCurrency(amount: string | number | null | undefined, currencyCode?: string): string;

