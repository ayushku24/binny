export function formatINR(amount: number): string {
  if (!isFinite(amount)) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
}


