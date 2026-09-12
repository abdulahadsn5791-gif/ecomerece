/**
 * ISO-8601 week number (Monday-start, week containing the year's first Thursday).
 * Returned as "YYYY-Www", e.g. "2026-W37".
 */
export function getISOWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

export interface TimeWindows {
  date: string; // YYYY-MM-DD
  hour: string; // 00-23
  week: string; // YYYY-Www
  month: string; // YYYY-MM
}

/** Derives every time-based dimension the module needs from a single timestamp, in UTC. */
export function getTimeWindows(ts: Date): TimeWindows {
  const date = ts.toISOString().split('T')[0];
  const hour = String(ts.getUTCHours()).padStart(2, '0');
  const month = date.slice(0, 7);
  const week = getISOWeek(ts);
  return { date, hour, week, month };
}
