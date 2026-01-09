export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function parseFormattedNumber(str: string): number {
  const multipliers: Record<string, number> = {
    K: 1000,
    M: 1000000,
  };

  const match = str.match(/^([\d.]+)([KM])?$/i);
  if (!match) return 0;

  const value = parseFloat(match[1]);
  const unit = match[2]?.toUpperCase();

  return unit ? value * multipliers[unit] : value;
}
