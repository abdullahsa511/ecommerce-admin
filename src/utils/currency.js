export const formatCurrency = (amount, currencyCode = 'USD') => {
    if (amount === null || amount === undefined || amount === '') return '';
    
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return '';
    
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode
    }).format(numAmount);
};

