/** Local YYYY-MM-DD — avoid UTC from toISOString() shifting the calendar day. */
export function localDateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(dateStr: string, days: number) {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return localDateKey(d);
}

/** Whole days remaining until the end of dateStr (local). Negative if already past. */
export function daysUntil(dateStr: string) {
  const end = new Date(`${dateStr}T23:59:59`);
  const now = new Date();
  return Math.ceil((end.getTime() - now.getTime()) / 86400000);
}

export function checkInHours(taskIds: string[]) {
  return taskIds.reduce((sum, id) => sum + (id === 'wk' ? 2 : 1), 0);
}
