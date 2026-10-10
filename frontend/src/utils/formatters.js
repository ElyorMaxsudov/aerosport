/**
 * Format currency in Uzbek so'm (UZS)
 * e.g. 45000 -> "45 000 so'm"
 * 0 -> "Bepul" (or customizable fallback)
 */
export const formatSom = (amount, freeText = "Bepul") => {
  if (amount === undefined || amount === null) return freeText;
  const num = Number(amount);
  if (num === 0) return freeText;
  
  // Backward compatibility: if an old seed amount <= 500 is encountered, scale to thousands
  const finalAmount = num <= 500 ? num * 1000 : num;
  return `${Math.round(finalAmount).toLocaleString('uz-UZ').replace(/,/g, ' ')} so'm`;
};

/**
 * Format general number with spaces
 */
export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  return Number(num).toLocaleString('uz-UZ').replace(/,/g, ' ');
};
