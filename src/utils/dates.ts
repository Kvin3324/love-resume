const monthFormatterCache = new Map<string, Intl.DateTimeFormat>();

const monthFormatter = (locale: string): Intl.DateTimeFormat => {
  const cached = monthFormatterCache.get(locale);
  if (cached) return cached;

  const formatter = new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' });
  monthFormatterCache.set(locale, formatter);
  return formatter;
};

export function formatMonth(value: string, locale = 'fr'): string {
  if (!value) return '';

  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return value;

  const date = new Date(Number(match[1]), Number(match[2]) - 1, 1);
  return monthFormatter(locale).format(date).replace('.', '');
}

export function formatDateRange(startDate: string, endDate: string, locale = 'fr'): string {
  const start = formatMonth(startDate, locale);
  const end = formatMonth(endDate, locale);

  if (start && end) return `${start} — ${end}`;
  return start || end;
}
