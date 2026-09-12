'use client';

export const fmtNumber = (n: number): string => {
  if (!Number.isFinite(n)) return '0';
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
};

export const fmtCurrency = (n: number): string => {
  if (!Number.isFinite(n)) return '$0';
  return `$${fmtNumber(n)}`;
};

/** Turns a `YYYY-MM` or `YYYY-MM-DD` series key into a compact axis label. */
export const fmtSeriesKey = (key: string): string => {
  if (!key) return '';
  const parts = key.split('-');
  if (parts.length === 2) {
    const month = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, 1)).toLocaleString(
      'en-US',
      {
        month: 'short',
      },
    );
    return `${month} '${parts[0].slice(2)}`;
  }
  return `${parts[1]}/${parts[2]}`;
};
