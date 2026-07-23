export const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
export const formatDate = (d) => new Date(d).toLocaleDateString();
